# 🔮 DURABLE RESEARCH ORCHESTRATOR

> **"An autonomous agent that never forgets."**

The Durable Research Orchestrator is a fault-tolerant AI agent designed to perform deep research tasks without the fragility of standard API calls. Built on **Motia** and **Google Gemini**, this system ensures that long-running workflows survive server crashes, network timeouts, and redeployments.

---

## 🔥 THE PROBLEM VS. THE SOLUTION

### ❌ The Old Way (Fragile):
- If the server restarts mid-task, the progress is **lost forever**.
- Long-running AI tasks often **time out**.
- Debugging async flows is a **nightmare**.

### ✅ The Durable Way (Robust):
- The Orchestrator **"remembers"** its state and resumes exactly where it left off.
- Workflows are **checkpointed** at every step using Motia.
- **Motia Workbench** provides real-time visualization of the agent's logic.

---

## 🏗️ ARCHITECTURE

The system uses a **Durable Workflow Pattern**:

1. **Frontend (Vanilla JS)**: Submits a research topic to the backend.
2. **Orchestrator (Motia Flow)**: Receives the signal and initializes a durable workflow instance.
3. **Task Worker**: A dedicated step that connects to Google Gemini 1.5 Flash to generate the report.
4. **State Persistence**: Every input, output, and state change is saved automatically.

---

## 🛠️ TECH STACK

| Component | Technology |
|-----------|------------|
| **Orchestration Engine** | Motia |
| **LLM** | Google Gemini 2.5 Flash |
| **Runtime** | Node.js / TypeScript |
| **Frontend** | HTML5 / CSS (Cyberpunk Aesthetic) |
| **Deployment** | Railway (Backend) + Github Pages (Frontend) |

---

## 🚀 INSTALLATION & SETUP

Follow these steps to run the **"Invincible Agent"** on your local machine.

### 1. Clone the Repository
```bash
git clone https://github.com/faheemakhmed/motia-durable-task-orchestrator.git
cd motia-durable-task-orchestrator
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file in the root directory and add your Gemini API key:
```env
GEMINI_API_KEY=your_google_api_key_here
```

### 4. Run the Backend
```bash
npm run dev
```
You will see: `Server ready and listening on port 3000`

### 5. Run the Frontend
Open `index.html` using a live server or Python:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

---

## 🧠 HOW WE USED MOTIA

This project relies entirely on **Motia's Durable Execution primitives**:

- **`flow()`**: Used to define the high-level `durable-orchestrator` that manages the lifecycle of the research request.
- **`step()`**: Wraps the volatile API call to Google Gemini. By isolating the AI call in a step, we ensure that if the external API hangs or the process dies, Motia can retry or resume without restarting the whole flow.
- **Workbench**: We utilized the Motia Workbench for real-time observability, allowing us to see the "brain" of the agent as it processes tasks step-by-step.

---

## 🎯 KEY FEATURES

- ✨ **Fault-Tolerant Execution** - Survives crashes and restarts
- 🔄 **Automatic State Checkpointing** - Never lose progress
- 👁️ **Real-Time Observability** - Watch your agent think
- 🚀 **Production-Ready** - Deploy with confidence
- 🎨 **Cyberpunk UI** - Because why not?

---

## 📝 LICENSE

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Made with ☕ and resilience</sub>
</div>
