# 📜 DEVELOPMENT_LOG.md — Chronological Engineering Log

---

### Phase 1: Dependency Modernization & Render Backend Deployment
* **Problem**: Backend build failed due to impossible dependency pins (`numpy==2.5.0` on Python 3.11).
* **Fix**: Unpinned requirements in `requirements.txt`. Added `ultralytics`, `opencv-python-headless`, and `uvicorn[standard]`.
* **Deployment**: Created `Procfile` and `render.yaml` for Render web service deployment.

### Phase 2: Frontend API Connection & SPA Rewrites
* **Implementation**: Created `kawach-web/src/config.ts` referencing `import.meta.env.VITE_API_URL`.
* **Routing**: Configured client-side SPA rewrites in `kawach-web/vercel.json` and root `vercel.json` to prevent 404 on deep links.

### Phase 3: Vercel Framework Preset Lock Resolution
* **Problem**: Vercel failed builds with `No FastAPI entrypoint found` because it remembered the repo as FastAPI.
* **Fix**: Added root `.vercelignore` to mask Python files, added root `package.json` proxying build to `kawach-web`, and updated Vercel framework preset to `Vite`.

### Phase 4: Officer Authentication & Chief Safety Controller Setup
* **Commit**: `ffa3ad4`
* **Changes**: Added Officer **Shivam Rai** credentials (Officer ID: `Shivam Rai` / `shivam`, Password: `54321`, Title: `Chief Safety Controller`, Badge: `K-0001`).

### Phase 5: Zero-Freeze Client-Side Engine Architecture
* **Commit**: `bb8f4a8`
* **Problem**: Free-tier Render backend sleep caused frontend to hang on *"Loading safety copilot..."*.
* **Fix**: Updated `useLiveReport.ts` to initialize state instantly via `mockEngine.ts` and introduced a 3-second timeout (`AbortSignal.timeout(3000)`) with automatic fallback.

### Phase 6: Officer Account Registration & Security Protocol
* **Commit**: `056d6c7`
* **Changes**:
  * Added registration tab on `Login.tsx` with name, officer ID, role selection, and password.
  * Added mandatory verification key check (`54321`) to prevent unauthorized access.
  * Replaced stock photos in `Profile.tsx` and `Sidebar.tsx` with dynamic uppercase initial-letter gradient badges.

### Phase 7: Instant Regulatory Copilot & 3-Second Timeout
* **Commit**: `ae4589f`
* **Changes**: Added query timeout and instant local knowledge retrieval across OISD-116, OSHA 29 CFR, and PNGRB manuals in `SafetyCopilot.tsx`.

### Phase 8: Security Key UI Concealment
* **Commit**: `26dd7b4`
* **Changes**: Completely removed plaintext hints and placeholders displaying `54321` from `Login.tsx`.

### Phase 9: Custom Vector Shield Branding & Responsive Layout
* **Commit**: `778faec`
* **Changes**: Created `KawachLogo.tsx` with multi-layered hex-shield vector graphics, updated `favicon.svg`, and enhanced login card responsive styling.

### Phase 10: Compound Risk & Geospatial Adjacency Upgrade
* **Commit**: `7f539e8`
* **Changes**: Upgraded `mockEngine.ts` so active scenarios (Gas Leak, Boiler Overheating) propagate risk to neighboring zones and generate instant live alerts.
