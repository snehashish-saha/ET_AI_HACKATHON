# 🧠 AI_HANDOVER.md — Project Continuity & Handover Guide

> **NOTICE FOR INCOMING AI AGENT**:
> You are continuing the development of **Kawach**, an AI Industrial Safety Intelligence platform. The original developer context is preserved in this document. Read this file first before taking any development action.

---

## 1. Project Purpose & High-Level Overview
Kawach is a multi-modal safety defense platform designed to protect industrial plants from compound risk disasters. It monitors:
* **IoT Sensor Telemetry**: Gas (ppm), Temperature (°C), Pressure (bar), and Humidity.
* **Computer Vision**: CCTV feeds processed with YOLOv8 to verify PPE compliance (helmets, vests) and unauthorized personnel presence.
* **Operations**: Active hot work permits and maintenance schedules.
* **Geospatial Spread**: Graph adjacency risk propagation between connected plant zones (*Boiler Room, Gas Pipeline, Coke Oven Battery, Valve Station, Storage Tank, Control Room*).
* **Statutory Compliance (RAG)**: AI Copilot grounded in OISD, OSHA, and PNGRB manuals.

---

## 2. Directory Layout & Key Entrypoints

```
ET_AI_HACKATHON/
├── api/
│   ├── server.py             # FastAPI entrypoint: /report, /scenario, /ask, /alerts
│   └── db.py                 # SQLite database initialization & persistence
├── simulator/
│   ├── plant_simulator.py    # Multi-zone state generator
│   ├── sensor_simulator.py   # IoT telemetry simulation & Gaussian noise
│   └── incident_engine.py    # Compound risk rules engine
├── AI/
│   ├── executive_ai.py       # Gemini API integration for executive briefings
│   ├── rag_engine.py         # FAISS vector store search on safety PDFs
│   └── vision_engine.py      # YOLOv8 object detection on camera feeds
├── knowledge_base/           # Statutory PDF safety manuals
├── kawach-web/               # Production React 19 Frontend
│   ├── src/
│   │   ├── components/layout/# AppShell, Sidebar, TopBar
│   │   ├── components/ui/    # KawachLogo, RiskBadge, AnimatedNumber
│   │   ├── hooks/            # useLiveReport.ts (primary data hook with fallback)
│   │   ├── mock/             # mockEngine.ts (client-side simulation engine)
│   │   ├── pages/            # Dashboard, AlertsHistory, SafetyCopilot, Login, Profile
│   │   ├── types/            # TypeScript interfaces for reports, zones, sensors
│   │   └── config.ts         # API_BASE URL config
│   ├── package.json          # Frontend dependencies
│   ├── vercel.json           # Frontend SPA routing configuration
│   └── vite.config.ts        # Vite build configuration
├── package.json              # Root build script proxying to kawach-web
├── vercel.json               # Root Vercel deployment spec
├── .vercelignore             # Masks Python files from Vercel
├── Procfile                  # Render start command
└── render.yaml               # Render infrastructure blueprint
```

---

## 3. Important Implementation Details & Edge Cases

### A. Zero-Freeze Dual Data Pipeline
* [`kawach-web/src/hooks/useLiveReport.ts`](../kawach-web/src/hooks/useLiveReport.ts):
  * On mount, state initializes immediately via `engine.tick()` so components render in sub-millisecond time.
  * Every second, the hook attempts to poll `${API_BASE}/report` with `signal: AbortSignal.timeout(3000)`.
  * If the backend is active, it seamlessly displays live server data.
  * If the backend is asleep or unreachable, it smoothly falls back to local simulation without throwing uncaught errors or freezing the UI.

### B. Safety Copilot Instant Answering
* [`kawach-web/src/pages/SafetyCopilot.tsx`](../kawach-web/src/pages/SafetyCopilot.tsx):
  * Queries are posted to `${API_BASE}/ask` with a 3-second timeout.
  * If the live backend is cold starting, a keyword router matches the question against pre-indexed regulatory excerpts from OISD-116, OSHA 29 CFR, and PNGRB manuals and responds in 200ms.

### C. Authentication & Role-Based Clearance
* [`kawach-web/src/pages/Login.tsx`](../kawach-web/src/pages/Login.tsx):
  * Credentials for **Shivam Rai** (Officer ID: `Shivam Rai` / `shivam`, Password: `54321`) are hardcoded for guaranteed demo login.
  * User registration saves new officers to `localStorage.getItem('kawach_registered_officers')`.
  * Registration requires the official authorization key **`54321`**, but this key is kept hidden from the UI.

---

## 4. How to Verify and Run

### Run Frontend Locally:
```bash
cd kawach-web
npm install
npm run dev
# Visit http://localhost:5173
```

### Build Test:
```bash
npm --prefix kawach-web run build
# Must complete cleanly with dist/ generated
```

### Run Backend Locally:
```bash
pip install -r requirements.txt
uvicorn api.server:app --host 0.0.0.0 --port 8000
```
