# 🤖 AGENTS.md — Permanent Guidelines for AI Coding Agents

> **CRITICAL NOTICE FOR ALL FUTURE AI AGENTS**:
> Read this file and `docs/AI_HANDOVER.md` before making ANY changes to this repository. Do NOT rewrite working systems, do NOT alter the established architecture without reviewing decisions, and do NOT remove mock simulation fallback behaviors.

---

## 📌 1. Project Identity & Architecture Baseline

1. **Dual-Environment Architecture**:
   * **Frontend**: `kawach-web/` (React 19 + TypeScript + Vite + Tailwind CSS). Deployed on **Vercel** with SPA rewrites (`kawach-web/vercel.json` and root `vercel.json`).
   * **Backend**: `api/` + `simulator/` + `AI/` (FastAPI + Python 3.11). Deployed on **Render** via `Procfile` / `render.yaml`.
2. **Zero-Downtime Fallback Architecture**:
   * Because Render free-tier instances enter cold sleep after inactivity, the frontend hook [`kawach-web/src/hooks/useLiveReport.ts`](kawach-web/src/hooks/useLiveReport.ts) implements an **instant client-side fallback engine** ([`kawach-web/src/mock/mockEngine.ts`](kawach-web/src/mock/mockEngine.ts)).
   * The app **never freezes on a loading screen**. It immediately loads live telemetry and queries the live backend with a 3-second timeout (`AbortSignal.timeout(3000)`). If the backend is waking up, the local engine handles telemetry and RAG queries seamlessly until the backend responds.
   * **NEVER remove or bypass this dual-source fallback architecture.**

---

## 🛡️ 2. Core Constraints & Golden Rules

1. **Authentication & Authorization**:
   * All officer logins and user registration are managed in [`kawach-web/src/pages/Login.tsx`](kawach-web/src/pages/Login.tsx).
   * **Security Key**: Account creation strictly requires the official security key **`54321`**. This code must NEVER be exposed as plaintext placeholder or hint text in the UI.
   * **Chief Safety Controller**: Officer **Shivam Rai** (Officer ID: `Shivam Rai` / `shivam`, Password: `54321`) must remain valid and configured.
   * **Letter Initial Avatar**: Officers display an initial-letter gradient circle badge (`S` for Shivam Rai, `A` for Amit Sharma) rather than stock photos.
2. **Branding & UI Consistency**:
   * Custom vector branding is encapsulated in [`kawach-web/src/components/ui/KawachLogo.tsx`](kawach-web/src/components/ui/KawachLogo.tsx) and [`kawach-web/public/favicon.svg`](kawach-web/public/favicon.svg).
   * Theme colors: Industrial Blue (`#3B6FF0`), Emerald Safe (`#10B981`), Amber Caution (`#D97706`), Red Hazard (`#DC2626`).
3. **Vercel & Build Configuration**:
   * Root `package.json` delegates builds: `"build": "npm --prefix kawach-web install && npm --prefix kawach-web run build"`.
   * Root `vercel.json` points `outputDirectory: "kawach-web/dist"`.
   * `.vercelignore` ignores `api/`, `*.py`, `requirements.txt` to prevent Vercel from mistaking the project for a Python serverless app.

---

## 🧪 3. Verification Protocol

Before pushing any commit:
1. Run `npm --prefix kawach-web run build` and ensure Vite builds with exit code 0.
2. Verify both remotes:
   * `personal`: `https://github.com/111shivamrai/et_ai_hackathon.git`
   * `origin`: `https://github.com/snehashish-saha/ET_AI_HACKATHON.git`
3. Always push to both remotes unless instructed otherwise.
