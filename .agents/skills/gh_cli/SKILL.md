---
name: gh-cli
description: "GitHub CLI (`gh`) for creating, cloning, and managing repositories, configuring GitHub Pages, working with pull requests, issues, gists, and checking workflow runs."
---

Use the GitHub CLI (`gh`) to interact with GitHub services directly from command-line interfaces.

## Installation
If not installed, install via:
* **Debian/Ubuntu:**
  ```bash
  type -p curl >/dev/null || (sudo apt update && sudo apt install curl -y)
  curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
  sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
  sudo apt update
  sudo apt install gh -y
  ```

## Authentication
* `gh auth login` — Authenticate with your GitHub account. Select SSH or HTTPS, and either log in via browser or paste a personal access token.
* `gh auth status` — Check the current authentication status and username.
* `gh auth logout` — Log out of a specific account.

## Repository Operations
* `gh repo create [name]` — Create a new repository on GitHub.
  * Options: `--public` (public repo), `--private` (private repo), `--source=PATH` (path to local source directory), `--push` (push local commits to the new repository).
  * Example: `gh repo create my-project --public --source=. --push`
* `gh repo clone [owner]/[repo]` — Clone a repository locally.
* `gh repo fork [repo]` — Fork a repository to your account.
* `gh repo view [repo] [--web]` — View a repository on GitHub (open in browser with `--web`).

## Pull Requests (PRs)
* `gh pr create` — Create a pull request.
  * Options: `--title "Title"`, `--body "Description"`, `--web` (edit description/title in browser).
* `gh pr list` — List open pull requests.
* `gh pr merge [pr-number]` — Merge a pull request (options: `--squash`, `--merge`, `--rebase`, `--delete-branch`).
* `gh pr view [pr-number]` — View details of a pull request.
* `gh pr checkout [pr-number]` — Check out the PR branch locally.

## Issues
* `gh issue create` — Create an issue.
* `gh issue list` — List issues in the current repository.
* `gh issue view [issue-number]` — View a specific issue.

## GitHub Actions & Workflows
* `gh run list` — List recent workflow runs.
* `gh run watch [run-id]` — Watch the progress of a running workflow.
* `gh run view [run-id]` — View logs of a specific workflow run.
* `gh workflow list` — List all workflows in the repository.

## GitHub Pages Configuration
To enable GitHub Pages for a repository:
* Go to repo settings or deploy using git. If using git deployment:
  * Create a branch (usually `gh-pages`).
  * In the repo settings on the web: `gh repo edit --enable-pages`. (Note: `gh repo edit` can toggle Pages features).
