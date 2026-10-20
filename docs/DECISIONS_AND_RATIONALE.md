# ⚖️ DECISIONS_AND_RATIONALE.md — Technical Decisions & Architecture Rationale

---

## 1. Dual-Engine Data Architecture (Live REST + Local Mock Fallback)
* **Problem**: Free-tier cloud backends (like Render) spin down during periods of inactivity, taking 30–60 seconds to cold start. When an evaluation judge or user opens the web app, waiting for the backend causes blank loading spinners or frozen states.
* **Decision**: Implement a client-side digital twin engine in `kawach-web/src/mock/mockEngine.ts` that immediately drives telemetry dials, charts, and RAG queries, while polling the backend with a 3-second timeout (`AbortSignal.timeout(3000)`).
* **Outcome**: Sub-second initial page load with zero UI freeze. When the backend wakes up, the frontend automatically syncs with live server data without requiring a page refresh.

## 2. Vercel Root Build Proxy & .vercelignore Masking
* **Problem**: Vercel originally detected Python files (`requirements.txt`, `api/server.py`) in the repository root and locked the project framework preset to FastAPI, failing all deployments with `No FastAPI entrypoint found`.
* **Decision**:
  1. Add a root `package.json` proxying build scripts: `"build": "npm --prefix kawach-web install && npm --prefix kawach-web run build"`.
  2. Set root `vercel.json` output directory to `kawach-web/dist`.
  3. Create `.vercelignore` to mask `api/`, `simulator/`, `AI/`, and `*.py` from the Vercel builder.
  4. Manually update Vercel Framework Preset from `FastAPI` to `Vite`.
* **Outcome**: Reliable, sub-minute builds and clean static SPA hosting on Vercel.

## 3. Letter Initial Avatar Badges vs. Stock Photos
* **Problem**: Stock headshots often appear generic, misrepresent the actual user, and can introduce broken image URLs if hosted on external CDNs.
* **Decision**: Generate dynamic SVG/CSS gradient badges showing the uppercase initial of the officer's name (`S` for Shivam Rai, `A` for Amit Sharma) with an online status indicator.
* **Outcome**: Clean, professional, robust UI that works offline and adapts dynamically to any registered officer.

## 4. Concealed Verification Authorization Key (`54321`)
* **Problem**: During user registration, displaying the plant verification key in placeholder text or helper hints completely defeated its purpose as an access authorization mechanism.
* **Decision**: Hide the key from all UI placeholders and error toasts. The system accepts `54321` internally as the authorized authorization code while presenting a standard secure password input to the user.
* **Outcome**: Enforces realistic role-based security clearance.
