# 🎯 NEXT_SESSION_ACTION_PLAN.md — Action Plan for Next Session

> **For the incoming AI Engineer**:
> This document details the exact state of the project and priority tasks for the next development session.

---

## 1. Current State Summary
* **Codebase Health**: 100% building and passing type checks (`tsc -b && vite build` in <500ms).
* **Live Production Link**: `https://etaihackathon-zeta.vercel.app` (Serving HTTP 200).
* **Git Status**: Fully synchronized between `personal` (`111shivamrai/et_ai_hackathon`) and `origin` (`snehashish-saha/ET_AI_HACKATHON`).

---

## 2. Priority Tasks for Next Session

### Task 1: Custom Domain Binding on Vercel
* **Context**: The user previously requested the URL to be updated to `kawach`.
* **Action**: In the Vercel Project Dashboard (`Settings` -> `Domains`), add a free Vercel subdomain with `.vercel.app` suffix:
  * Example: `kawach-safety.vercel.app` or `kawach-intel.vercel.app`.
  * (Ensure there is a period `.` before `vercel.app` rather than a hyphen).

### Task 2: Real WebSocket Integration (Optional Scale-up)
* **Context**: Current frontend uses 1000ms polling via `useLiveReport.ts`.
* **Action**: Connect a persistent WebSocket channel `ws://<backend-host>/ws/live` as outlined in `useLiveReport.ts` lines 1–8.
* **Pre-requisite**: FastAPI backend already has WebSocket handler ready in `api/server.py`.

### Task 3: Mobile Touch Drawer Refinements
* **Context**: The desktop layout uses `ZoneDetailDrawer` on zone card clicks.
* **Action**: Verify drawer animations and touch gestures on smaller mobile viewport widths (<480px).

---

## 3. What Must NOT Be Changed
* Do NOT remove the local fallback simulation engine in `useLiveReport.ts` (Render free-tier sleep guard).
* Do NOT display the official verification key (`54321`) in placeholder or hint text.
* Do NOT change the framework preset in Vercel away from `Vite`.
