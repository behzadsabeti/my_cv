# Edge AI WebGPU Resume & Local Search Engine

A fully client-side, production-grade portfolio application that showcases Behzad Sabeti's CV. It runs local vector search and WebGPU-accelerated LLM chat directly inside the browser, requiring **zero server backend** and **zero API costs**.

Live preview and search query latencies are computed on the fly using local resources.

---

## 🚀 Key Technical Features

### 1. Offline Local Semantic Search
* **Model:** `Xenova/all-MiniLM-L6-v2` (23MB) via Transformers.js.
* **Mechanism:** When the user types a query (e.g., "fastapi databases"), the model generates a 384-dimensional query vector.
* **Vector Index:** Chunks of Behzad's CV are embedded and cached in the browser's `localStorage` on first load.
* **Matching:** Instant cosine similarity computation in JavaScript highlights matching experience/project cards on the fly in **< 15ms**.

### 2. WebGPU Local Chat Agent
* **Engine:** MLC LLM WebGPU (`@mlc-ai/web-llm`).
* **Model Support:** Defaults to `Qwen2-0.5B-Instruct` (~350MB download) with options for `Qwen2-1.5B` and `Gemma-2B`.
* **Prompt Engineering:** System prompt preloads Behzad's structured resume JSON, instructing the local model to act as Behzad's personal hiring representative.
* **Streaming Generation:** Token-by-token streaming response directly from GPU memory.

### 3. Diagnostics & Observability
* **WebGPU Detector:** Real-time WebGPU support detection with CPU Fallback.
* **Latency Counter:** Measures semantic search embedding and matching times in milliseconds.
* **Throughput Monitor:** Calculates and displays inference speed in **tokens per second** during generation.
* **VRAM Estimator:** Shows active model footprint.

---

## 🛠️ Local Development

To run this project locally, ensure you have [Node.js](https://nodejs.org/) installed:

1. Clone or download the repository.
2. Navigate to the `edge_resume` directory:
   ```bash
   cd edge_resume
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173/`.

---

## 🌐 Deploy Live (For Free!)

Since this is a fully static client-side application, it can be hosted on any free static provider:

### Option A: GitHub Pages (Automatic CI/CD)
The project is preconfigured with a GitHub Actions workflow:
1. Initialize a git repository in this project.
2. Push your code to a GitHub repository named `my_cv` or similar.
3. Enable GitHub Actions in repository settings.
4. On every push to the `main` or `master` branch, the workflow inside `.github/workflows/deploy.yml` will automatically build the project and deploy it to GitHub Pages.

### Option B: Vercel
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in the root of the project and follow the prompts.
3. Vercel will host it under a free `*.vercel.app` subdomain.

### Option C: Hugging Face Spaces
1. Create a new Space on [Hugging Face](https://huggingface.co/new-space).
2. Select **Static HTML** as the SDK.
3. Upload or git-push the contents of the `dist/` directory (created by running `npm run build`).
