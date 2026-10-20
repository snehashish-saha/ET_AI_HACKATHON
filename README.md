# 🏭 KAWACH (कवच) — AI Industrial Safety Intelligence
### *Zero Harm. Real-Time. Multi-Modal AI-Powered Safety Defense.*

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Production-success?logo=vercel)](https://etaihackathon-zeta.vercel.app)
[![FastAPI Backend](https://img.shields.io/badge/FastAPI-Render%20Cloud-009688?logo=fastapi)](https://et-ai-hackathon-gtey.onrender.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-React%2019-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11-yellow?logo=python)](https://www.python.org/)

---

## 📌 1. Executive Summary

**Kawach** is an enterprise-grade **Multi-Modal AI Safety Intelligence & Incident Prevention Platform** designed for high-risk industrial manufacturing and processing plants (steel manufacturing plants, chemical processing facilities, oil & gas refineries, and thermal power stations).

### 🚨 The Core Problem:
In industrial plants, catastrophic disasters rarely stem from an isolated sensor anomaly. They occur when multiple, seemingly minor conditions **compound unnoticed across operational silos**:
* A slow gas leak occurs in a pipeline.
* A worker is issued a standard welding (**Hot Work**) permit in an adjacent zone.
* Boiler room operating pressure is steadily climbing.

Because telemetry sensors, CCTV streams, work permits, and maintenance logs are managed in isolated systems, operators cannot detect compounding risk before an explosion occurs (e.g., historical disasters such as the Vizag Steel Plant incident).

### 💡 The Kawach Solution:
Kawach serves as the **central unified real-time intelligence layer**. It fuses:
1. **IoT Telemetry**: Gas concentration (ppm), Temperature (°C), Pressure (bar), and Humidity.
2. **Computer Vision (YOLOv8)**: Automated PPE compliance (helmets, vests) and unauthorized zone ingress.
3. **Operational Registers**: Active work permits (Hot Work, Confined Space) and scheduled maintenance states.
4. **Compound Risk Brain**: Real-time multi-variable scoring and graph-based geospatial hazard propagation.
5. **Safety Copilot (FAISS + RAG)**: Instant statutory regulatory guidance grounded in **OISD-116, OISD-117, OSHA 29 CFR 1910, and PNGRB** standards.

---

## 🌐 2. Live Deployments

* **Web Application (Vercel)**: [https://etaihackathon-zeta.vercel.app](https://etaihackathon-zeta.vercel.app)
* **Backend API (Render)**: [https://et-ai-hackathon-gtey.onrender.com](https://et-ai-hackathon-gtey.onrender.com)
* **GitHub Repository**:
  * Primary: `https://github.com/111shivamrai/et_ai_hackathon`
  * Upstream: `https://github.com/snehashish-saha/ET_AI_HACKATHON`

---

## 🔐 3. Authentication & Officer Access

The application features role-based access control with security clearance verification:

| Officer Name | Role / Title | Officer ID | Password | Verification Key |
| :--- | :--- | :--- | :--- | :--- |
| **Shivam Rai** | Chief Safety Controller | `Shivam Rai` / `shivam` | `54321` | — |
| **Amit Sharma** | Head Safety Officer | `admin` | `password` | — |
| **Rahul Verma** | Senior Safety Inspector | `officer-01` | `kawach2026` | — |
| **New Registration** | Custom Selection | Custom ID | Custom Password | **`54321`** |

> **Plant Authorization Protocol**: When creating a new account via the portal, officers must provide the secret **Official Plant Security Key (`54321`)** to be granted system access.

---

## ⚙️ 4. System Architecture

```
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│   IoT Sensor Telemetry │      │    CCTV Camera Feeds   │      │ Work Permits & Regs    │
│  (Gas, Temp, Pressure) │      │ (YOLOv8 PPE Detection) │      │ (Hot Work, Confined)   │
└───────────┬────────────┘      └───────────┬────────────┘      └───────────┬────────────┘
            │                               │                               │
            └───────────────────────┬───────┴───────────────────────────────┘
                                    ▼
                ┌───────────────────────────────────────┐
                │        KAWACH COMPOUND AI BRAIN       │
                │  • Multi-variable Compound Risk Engine│
                │  • Geospatial Adjacency Propagation   │
                │  • FAISS Vector RAG (OSHA / OISD)     │
                │  • Google Gemini Executive Summaries  │
                └───────────────────┬───────────────────┘
                                    │
                                    ▼
                ┌───────────────────────────────────────┐
                │     INTERACTIVE SAFETY COMMAND CONSOLE│
                │  • Sub-second Live Telemetry Gauges   │
                │  • 6-Zone Plant Geospatial Heatmap    │
                │  • AI Safety Copilot Assistant        │
                │  • Instant PDF Audit Incident Reports │
                └───────────────────────────────────────┘
```

---

## 🚀 5. Quick Start & Local Setup

### Prerequisites
* **Node.js**: v18+ (Node 20+ recommended)
* **Python**: 3.10 or 3.11
* **npm**: v9+

### Frontend Setup (`kawach-web`)
```bash
cd kawach-web
npm install
npm run dev
```
Runs locally at `http://localhost:5173`.

### Backend Setup (`api`)
```bash
# In repository root
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start FastAPI server
uvicorn api.server:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation available at `http://localhost:8000/docs`.

---

## 📚 6. Documentation Index

For complete technical documentation, refer to the `docs/` directory:
* [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — System architecture, data flow, and engine specs.
* [`docs/AI_HANDOVER.md`](docs/AI_HANDOVER.md) — Complete knowledge transfer and state recovery.
* [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md) — Production status, test results, and verified features.
* [`docs/DEVELOPMENT_LOG.md`](docs/DEVELOPMENT_LOG.md) — Chronological development history and fixes.
* [`docs/NEXT_SESSION_ACTION_PLAN.md`](docs/NEXT_SESSION_ACTION_PLAN.md) — Step-by-step roadmap for next session.
* [`docs/DECISIONS_AND_RATIONALE.md`](docs/DECISIONS_AND_RATIONALE.md) — Architecture decisions and engineering rationale.
* [`docs/SETUP_AND_INSTALLATION.md`](docs/SETUP_AND_INSTALLATION.md) — Comprehensive environment and deployment guide.
