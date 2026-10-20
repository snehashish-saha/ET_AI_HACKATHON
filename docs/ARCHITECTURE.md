# 🏗️ ARCHITECTURE.md — System Architecture & Technical Specifications

---

## 1. Architectural Model

Kawach implements an asynchronous decoupled architecture separating real-time telemetry streaming from compute-intensive RAG and vision pipelines:

```
[IoT Sensors / CCTV Streams]
            │
            ▼
 [FastAPI Telemetry Ingestion] ────► [Compound Risk Engine] ────► [SQLite Persistence]
            │                                    │
            ▼                                    ▼
[Client Polling with Timeout] ◄──── [Geospatial Propagation]
            │
            ▼
[React 19 Dashboard / Console] ◄──── [Local Fallback Engine]
```

---

## 2. The 5 Core Engines

### 1. Multi-Variable Compound Risk Engine
* Located in `simulator/incident_engine.py` (Python) and mirrored in `kawach-web/src/mock/mockEngine.ts` (TypeScript).
* Evaluates non-linear compound triggers:
  * $\text{Gas} > 45\,\text{ppm} \land \text{Permit} == \text{Hot Work} \implies \text{Explosion Hazard } (+30\text{ risk points})$.
  * $\text{Gas} > 35\,\text{ppm} \land \text{Temperature} > 450^\circ\text{C} \implies \text{Auto-ignition Risk } (+20\text{ risk points})$.
  * $\text{Pressure} > 8\,\text{bar} \land \text{Temperature} > 470^\circ\text{C} \implies \text{Boiler Rupture Risk } (+25\text{ risk points})$.
* Scales overall plant risk from $0$ to $100$:
  * **LOW**: $0 - 24\%$
  * **MEDIUM**: $25 - 54\%$
  * **HIGH**: $55 - 79\%$
  * **CRITICAL**: $80 - 100\%$

### 2. Geospatial Graph Adjacency Engine
* Models plant topological connectivity across 6 monitored zones:
  * **Boiler Room** $\leftrightarrow$ Gas Pipeline, Control Room
  * **Gas Pipeline** $\leftrightarrow$ Boiler Room, Valve Station, Storage Tank
  * **Coke Oven Battery** $\leftrightarrow$ Valve Station, Storage Tank
  * **Valve Station** $\leftrightarrow$ Gas Pipeline, Coke Oven Battery
  * **Storage Tank** $\leftrightarrow$ Gas Pipeline, Coke Oven Battery
* When an incident occurs in a primary zone (e.g. Gas Leak in Gas Pipeline), the incident zone is marked **CRITICAL/HIGH**, immediate graph neighbors are marked **HIGH/MEDIUM**, and 2nd-degree neighbors are marked **MEDIUM/LOW**.

### 3. Safety Copilot RAG Engine
* Backend uses LangChain, FAISS CPU, and `all-MiniLM-L6-v2` embeddings to index statutory documents:
  * `OISD DOC 1.pdf` (OISD Standard 116 — Fire Protection)
  * `OISD DOC 2.pdf` (OISD Standard 117)
  * `OSHA3122.pdf` (OSHA 29 CFR 1910 — General Industry)
  * `PNGRB DOC.pdf` (City Gas Distribution Network Regulations)
* Provides verbatim citations with page references.

### 4. Vision & PPE Compliance Engine
* Uses `yolov8n.pt` with OpenCV headless streaming.
* Detects person bounding boxes, head/chest coordinates, helmet presence, and reflective vest compliance.

### 5. Client-Side Telemetry & PDF Generator
* Uses Recharts for real-time 30-second sparklines.
* Uses `html2canvas` and `jsPDF` for instant statutory PDF incident report compilation with digital timestamps and officer signatures.
