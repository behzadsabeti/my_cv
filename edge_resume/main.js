import { pipeline, env } from '@xenova/transformers';
import * as webllm from '@mlc-ai/web-llm';
import { resumeData, searchChunks } from './resume_data.js';

// Configure transformers.js to load models from HuggingFace CDN instead of local server
env.allowLocalModels = false;

// Global state
let embeddingPipeline = null;
let resumeEmbeddings = null; // Map of chunkId -> embedding vector
let llmEngine = null;
let chatHistory = [];
let currentModelId = 'SmolLM2-360M-Instruct-q4f16_1-MLC';

// Initialize the app on load
window.addEventListener('DOMContentLoaded', async () => {
  renderResume();
  checkWebGPUSupport();
  initSearchEngine();
  setupEventListeners();
});

// Render the resume data dynamically into HTML
function renderResume() {
  // 1. Render Experience
  const expList = document.getElementById('experience-list');
  expList.innerHTML = resumeData.experiences.map((exp, idx) => `
    <div class="timeline-item" id="item-exp-${idx + 1}">
      <div class="item-header">
        <h3 class="item-title">${exp.role}</h3>
        <span class="item-date">${exp.period}</span>
      </div>
      <div class="item-subtitle">${exp.organization}</div>
      <p class="item-details">${exp.details}</p>
    </div>
  `).join('');

  // 2. Render Projects
  const projList = document.getElementById('project-list');
  projList.innerHTML = resumeData.projects.map((proj, idx) => `
    <div class="project-item" id="item-proj-${idx + 1}">
      <div class="project-title-row">
        <h3 class="item-title">${proj.title}</h3>
        <span class="project-tech">${proj.tech}</span>
      </div>
      <p class="item-details" style="margin-bottom: 0.5rem;">${proj.details}</p>
      ${proj.github ? `
        <a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="project-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16" style="vertical-align: text-bottom; margin-right: 4px;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg>
          View Source Repository
        </a>
      ` : ''}
    </div>
  `).join('');

  // 3. Render Education
  const eduList = document.getElementById('education-list');
  eduList.innerHTML = resumeData.education.map((edu, idx) => `
    <div class="timeline-item" id="item-edu-${idx + 1}" style="padding-bottom: 1rem;">
      <div class="item-header">
        <h3 class="item-title">${edu.degree}</h3>
        <span class="item-date">${edu.period}</span>
      </div>
      <div class="item-subtitle" style="font-size: 0.9rem; color: var(--text-muted);">${edu.institution}</div>
      <p class="item-details">${edu.details}</p>
    </div>
  `).join('');

  // 4. Render Skills
  const skillsList = document.getElementById('skills-list');
  skillsList.innerHTML = resumeData.skills.map((skill, idx) => `
    <div class="skill-group" id="item-skill-${idx + 1}">
      <span class="skill-category">${skill.category}</span>
      <div class="skill-tags">
        ${skill.items.map(s => `<span class="skill-tag">${s}</span>`).join('')}
      </div>
    </div>
  `).join('');

  // 5. Render Certifications
  const certsList = document.getElementById('certifications-list');
  certsList.innerHTML = resumeData.certifications.map((cert, idx) => `
    <div class="cert-item" id="item-cert-${idx + 1}">
      <div class="cert-header">
        <span class="cert-name">${cert.name}</span>
        ${cert.link ? `<a href="${cert.link}" target="_blank" rel="noopener noreferrer" class="project-link" style="font-size: 0.75rem;">Verify</a>` : ''}
      </div>
      <div class="cert-provider">${cert.provider}</div>
      <p class="cert-details">${cert.details}</p>
    </div>
  `).join('');
}

// Check WebGPU capabilities and update diagnostics UI
async function checkWebGPUSupport() {
  const webgpuEl = document.getElementById('diag-webgpu');
  const modeEl = document.getElementById('diag-mode');
  
  if (navigator.gpu) {
    try {
      const adapter = await navigator.gpu.requestAdapter();
      if (adapter) {
        webgpuEl.textContent = 'Available';
        webgpuEl.style.color = '#34d399';
        modeEl.textContent = 'WebGPU (Hardware Accelerated)';
        modeEl.style.color = '#34d399';
        return;
      }
    } catch (e) {
      console.warn("Error checking WebGPU adapter: ", e);
    }
  }
  
  webgpuEl.textContent = 'Unavailable';
  webgpuEl.style.color = '#ff007f';
  modeEl.textContent = 'CPU (Fallback WebAssembly)';
  modeEl.style.color = '#ea580c';
}

// Setup Event Listeners for Chat, Collapse, Search, and Model Load
function setupEventListeners() {
  // Floating Chat expand/collapse toggle
  const chatWidget = document.getElementById('chat-widget');
  const chatHeader = document.getElementById('chat-header');
  const chatToggle = document.getElementById('chat-toggle-btn');
  
  chatHeader.addEventListener('click', (e) => {
    // If user clicked the button or header itself, toggle collapse
    if (chatWidget.classList.contains('collapsed')) {
      chatWidget.classList.remove('collapsed');
    } else if (e.target.closest('#chat-toggle-btn') || e.target === chatHeader || e.target.closest('.chat-title-info')) {
      chatWidget.classList.add('collapsed');
    }
  });

  // Model Selection handler
  const modelSelect = document.getElementById('llm-select');
  const targetDiag = document.getElementById('diag-llm-target');
  
  modelSelect.addEventListener('change', (e) => {
    currentModelId = e.target.value;
    const text = e.target.options[e.target.selectedIndex].text;
    targetDiag.textContent = text.split(' ')[0];
  });

  // Load Model Button click
  const loadBtn = document.getElementById('load-model-btn');
  loadBtn.addEventListener('click', loadLocalLLM);

  // Send Message
  const sendBtn = document.getElementById('chat-send-btn');
  const chatInput = document.getElementById('chat-input');
  
  sendBtn.addEventListener('click', handleSendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });
}

/* ==========================================================================
   SEMANTIC SEARCH ENGINE LOGIC
   ========================================================================== */

async function initSearchEngine() {
  const statusEl = document.getElementById('embedding-status');
  const searchInput = document.getElementById('search-input');
  
  statusEl.textContent = 'Loading search engine...';
  statusEl.classList.add('loading');
  
  try {
    // Load Xenova's lightweight embedding pipeline
    embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    statusEl.textContent = 'Indexing resume...';
    
    // Check if embeddings are already cached in localStorage
    const cached = localStorage.getItem('behzad_cv_embeddings');
    if (cached) {
      resumeEmbeddings = JSON.parse(cached);
    } else {
      // Calculate embeddings client-side on first load
      resumeEmbeddings = {};
      for (const chunk of searchChunks) {
        const tensor = await embeddingPipeline(chunk.text, { pooling: 'mean', normalize: true });
        resumeEmbeddings[chunk.id] = Array.from(tensor.data);
      }
      localStorage.setItem('behzad_cv_embeddings', JSON.stringify(resumeEmbeddings));
    }
    
    statusEl.textContent = 'Offline Engine Ready';
    statusEl.className = 'status-badge ready';
    searchInput.disabled = false;
    searchInput.placeholder = 'Search my skills, projects, or thesis (e.g. fastapi, graph)...';
    
    // Add real-time input search listener
    searchInput.addEventListener('input', debounce(runSemanticSearch, 300));
  } catch (error) {
    console.error("Embedding engine failed: ", error);
    statusEl.textContent = 'Error Loading Search';
    statusEl.style.color = '#ff007f';
  }
}

// Compute cosine similarity between two numeric vectors
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Debounce helper to prevent overloading search on every keystroke
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

// Search algorithm
async function runSemanticSearch() {
  const query = document.getElementById('search-input').value.trim();
  const latencyEl = document.getElementById('search-latency');
  
  if (!query) {
    clearHighlights();
    latencyEl.textContent = 'Search Latency: -- ms';
    return;
  }
  
  const startTime = performance.now();
  
  try {
    // Generate vector embedding of the search query
    const tensor = await embeddingPipeline(query, { pooling: 'mean', normalize: true });
    const queryVector = Array.from(tensor.data);
    
    // Calculate similarities against all resume chunks
    const scores = searchChunks.map(chunk => {
      const chunkVector = resumeEmbeddings[chunk.id];
      const similarity = cosineSimilarity(queryVector, chunkVector);
      return { id: chunk.id, similarity };
    });
    
    // Sort and filter results
    scores.sort((a, b) => b.similarity - a.similarity);
    
    const latency = (performance.now() - startTime).toFixed(1);
    latencyEl.textContent = `Search Latency: ${latency} ms`;
    
    // Define a matching threshold. Chunks matching better than this are highlighted.
    const threshold = 0.35;
    const matches = scores.filter(s => s.similarity >= threshold);
    
    if (matches.length > 0) {
      applyHighlights(matches.map(m => m.id));
    } else {
      clearHighlights();
    }
  } catch (err) {
    console.error("Semantic search failed: ", err);
  }
}

// Highlight matching resume cards and fade out non-matching ones
function applyHighlights(matchingChunkIds) {
  // Gather all items from the page that have matching IDs
  const allCards = document.querySelectorAll('.timeline-item, .project-item, .skill-group, .cert-item');
  
  // Create a map of DOM IDs to target
  // e.g. mapping search chunk id 'edu-1' to DOM ID 'item-edu-1'
  const matchedDomIds = matchingChunkIds.map(chunkId => `item-${chunkId}`);
  
  allCards.forEach(card => {
    if (matchedDomIds.includes(card.id)) {
      card.classList.add('highlight-match');
      card.classList.remove('opacity-fade');
    } else {
      card.classList.remove('highlight-match');
      card.classList.add('opacity-fade');
    }
  });
}

function clearHighlights() {
  const allCards = document.querySelectorAll('.timeline-item, .project-item, .skill-group, .cert-item');
  allCards.forEach(card => {
    card.classList.remove('highlight-match');
    card.classList.remove('opacity-fade');
  });
}

/* ==========================================================================
   LOCAL LLM (WEBGPU) OFFLINE CHAT BOT LOGIC
   ========================================================================== */

async function loadLocalLLM() {
  const loadBtn = document.getElementById('load-model-btn');
  const progressContainer = document.getElementById('progress-container');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const progressLabel = document.getElementById('progress-label');
  const progressPercentage = document.getElementById('progress-percentage');
  const consoleLog = document.getElementById('download-console');
  const chatStatus = document.getElementById('chat-model-status');
  
  loadBtn.disabled = true;
  loadBtn.textContent = 'Initializing Engine...';
  progressContainer.classList.remove('hidden');
  chatStatus.textContent = 'Loading...';
  
  consoleLog.textContent = 'Detecting WebGPU device...\n';
  
  const initProgressCallback = (report) => {
    // WebLLM returns progress updates here
    console.log(report);
    const progress = Math.round(report.progress * 100);
    progressBarFill.style.width = `${progress}%`;
    progressPercentage.textContent = `${progress}%`;
    progressLabel.textContent = report.text.replace(/Downloading/g, 'Downloading shard');
    
    // Stream output into the debug console widget
    consoleLog.textContent += `${report.text}\n`;
    consoleLog.scrollTop = consoleLog.scrollHeight;
  };
  
  try {
    llmEngine = await webllm.CreateMLCEngine(currentModelId, {
      initProgressCallback: initProgressCallback
    });
    
    // Model loaded successfully
    consoleLog.textContent += '\nModel successfully loaded in VRAM/RAM!\nInjecting resume context...';
    consoleLog.scrollTop = consoleLog.scrollHeight;
    
    // Build context system prompt from resumeData
    const resumeContext = JSON.stringify(resumeData);
    chatHistory = [
      {
        role: "system",
        content: `You are Behzad Sabeti's personal AI hiring assistant running completely offline on the user's computer via WebGPU. Behzad Sabeti's complete resume context is:
        ${resumeContext}
        
        Answer user questions about Behzad's credentials, experience, projects, and skills.
        Guidelines:
        1. Base your answers only on the provided resume context.
        2. Be professional, concise, and helpful.
        3. Do not make up facts or certifications. If information is not in the resume, politely explain that it's not documented in Behzad's CV.
        4. State that you are running locally inside the user's browser with zero API costs.`
      }
    ];
    
    // Update Chat UI
    chatStatus.textContent = 'Online (Local)';
    chatStatus.style.color = '#34d399';
    document.getElementById('model-control-panel').classList.add('hidden');
    document.getElementById('chat-input').disabled = false;
    document.getElementById('chat-input').placeholder = 'Ask me anything about Behzad (e.g. tell me about his thesis)...';
    document.getElementById('chat-send-btn').disabled = false;
    
    document.getElementById('diag-vram').textContent = currentModelId.includes('360M') ? '~220 MB' : currentModelId.includes('0.5B') ? '~450 MB' : (currentModelId.includes('1.5B') || currentModelId.includes('1B')) ? '~950 MB' : '~2.1 GB';
    
    appendSystemMessage('Model loaded! You are now speaking with Behzad Sabeti\'s local AI agent.');
    
  } catch (error) {
    console.error("Local LLM compilation failed: ", error);
    chatStatus.textContent = 'Error Loading';
    chatStatus.style.color = '#ff007f';
    loadBtn.disabled = false;
    loadBtn.textContent = 'Retry Loading';
    consoleLog.textContent += `\nError during loading: ${error.message}\n`;
    consoleLog.scrollTop = consoleLog.scrollHeight;
  }
}

// Add system notifications inside the chat body
function appendSystemMessage(text) {
  const container = document.getElementById('messages-container');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message system';
  msgDiv.innerHTML = `<p>${text}</p>`;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

// Append chat dialogue message UI
function appendChatMessage(role, text) {
  const container = document.getElementById('messages-container');
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${role}`;
  msgDiv.innerHTML = `<p>${text}</p>`;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  return msgDiv;
}

// Handle sending user input to Local LLM
async function handleSendMessage() {
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const speedEl = document.getElementById('diag-speed');
  
  const text = inputEl.value.trim();
  if (!text || !llmEngine) return;
  
  // Clear input
  inputEl.value = '';
  inputEl.disabled = true;
  sendBtn.disabled = true;
  
  // Append User message
  appendChatMessage('user', text);
  chatHistory.push({ role: 'user', content: text });
  
  // Prepare Assistant placeholder message
  const assistantMsgEl = appendChatMessage('assistant', 'Thinking...');
  const textEl = assistantMsgEl.querySelector('p');
  
  try {
    const startTime = performance.now();
    let tokenCount = 0;
    
    // Call completions in stream mode
    const reply = await llmEngine.chat.completions.create({
      messages: chatHistory,
      stream: true
    });
    
    let answerText = '';
    textEl.innerHTML = ''; // Clear the "Thinking..." text
    
    for await (const chunk of reply) {
      const content = chunk.choices[0]?.delta?.content || '';
      answerText += content;
      textEl.textContent = answerText;
      tokenCount++;
      
      // Calculate throughput (tokens per second)
      const duration = (performance.now() - startTime) / 1000;
      if (duration > 0) {
        speedEl.textContent = `${(tokenCount / duration).toFixed(1)} tokens/s`;
      }
      
      const container = document.getElementById('messages-container');
      container.scrollTop = container.scrollHeight;
    }
    
    // Push response to history
    chatHistory.push({ role: 'assistant', content: answerText });
    
  } catch (error) {
    console.error("LLM inference failed: ", error);
    textEl.textContent = `Error generating reply: ${error.message}`;
    textEl.style.color = '#ff007f';
  } finally {
    inputEl.disabled = false;
    sendBtn.disabled = false;
    inputEl.focus();
  }
}
