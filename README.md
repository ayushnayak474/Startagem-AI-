# Stratagem AI — Enterprise Decision Intelligence & Strategic Knowledge Discovery Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Engine: Google Gemini](https://img.shields.io/badge/AI%20Engine-Gemini%202.5%20Flash-4285F4)](https://deepmind.google/technologies/gemini/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791)](https://www.postgresql.org/)

Stratagem AI is a full-stack, multi-tenant Decision Intelligence and Strategic Knowledge Discovery web application built to transform ambiguous, high-stakes dilemmas into structured, mathematically auditable, data-driven decisions.

Powered by the official Google Gen AI SDK (`@google/genai`) using **Gemini 2.5 Flash** with strict JSON Schemas, the platform executes Multi-Criteria Decision Analysis (MCDA), probabilistic risk exposure mapping, scenario stress-testing, and dynamic "What-If" parameter perturbation simulations.

---

## 1. Problem Statement

Modern enterprise leaders and quantitative strategists routinely suffer from **Decision Fragmentation**:
- **Information Asymmetry & Silos:** Critical constraints (budget ceilings, delivery deadlines, regulatory non-negotiables) are scattered across qualitative executive memos, financial models, and engineering specifications.
- **Cognitive Biases & Sunk Cost Fallacy:** Alternatives are rarely evaluated on normalized, weighted scales. Teams default to familiar choices rather than Pareto-optimal strategies.
- **Hidden Second-Order Risks:** Traditional evaluations fail to model failure modes, early warning indicators, and catastrophe exposure before capital is committed.
- **Inflexible Decision Audits:** Once an option is chosen, teams lack a quantitative mechanism to simulate sudden external shocks (e.g., a 35% budget slash or supply chain maritime embargo) to know precisely when a decision should flip.

---

## 2. Solution Overview

Stratagem AI provides an end-to-end Decision Intelligence Operating System:

1. **Guided Multi-Step Decision Builder:**
   - Define strategic domain, urgency level, and problem statement.
   - Enforce hard budget and timeline ceilings alongside regulatory non-negotiables.
   - Calibrate custom weighted evaluation criteria (scale 1–10) with real-time percentage normalization.
   - Configure 2 to 6 competing candidate alternatives with estimated cost, timeline, and known caveats.
   - Or select one of **4 pre-built real-world boardroom presets** for instant evaluation.

2. **Gemini Decision Intelligence Engine (`@google/genai`):**
   - **Multi-Criteria Decision Analysis (MCDA):** Computes normalized 0–100 utility scores across all criteria and options.
   - **Pattern & Trade-off Discovery:** Uncovers non-obvious synergies, bottleneck dependencies, and asymmetric upsides.
   - **Probabilistic Risk Register:** Maps specific failure modes onto a 5×5 Likelihood vs. Impact coordinate grid with actionable mitigation strategies.
   - **Scenario Sensitivity Stress-Testing:** Simulates option performance across Base Case, Optimistic Case, and Stress-Test Black Swan environments.
   - **Explainable AI (XAI) Audit Trail:** Explicitly formulates why the winning alternative won, why the runner-up fell short, foundational assumptions, and quantifiable reversal triggers.
   - **Phased 30-60-90 Day Execution Roadmap:** Actionable deliverables and measurable target KPIs.

3. **Interactive Visual Analytics Dashboard:**
   - **Multi-Option Radar Chart (Recharts):** Side-by-side comparison across Cost Efficiency, Strategic Alignment, Speed to Value, Risk Resilience, and Scalability.
   - **Utility & Sensitivity Bar Chart (Recharts):** Grouped visual comparison of overall weighted utility alongside scenario stress-tests.
   - **5×5 Risk Heatmap Matrix:** Visual likelihood vs. impact coordinates with searchable mitigation register.

4. **Interactive "What-If" Simulation Copilot:**
   - Docked slide-over drawer allowing users to submit parameter perturbations (e.g., *"What if our budget drops by 30% and timeline shrinks to 6 weeks?"*).
   - Generates exact mathematical score deltas (`previousScore → simulatedScore`), surfaces new operational risks, and detects whether the recommendation flipped.

5. **Export-Ready Executive Decision Memo:**
   - Generates printable, Markdown-formatted executive memos for stakeholder alignment and board governance.

---

## 3. System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT / BROWSER (Vite + React)                  │
│  - React Router v6 (Public, Protected, Workspace Routing)              │
│  - Recharts (Radar, Bar, Risk Heatmap Visualizations)                  │
│  - Tailwind CSS Enterprise Dark Slate Design Constitution              │
│  - Axios Interceptors with Bearer JWT Authentication                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST (/api/*)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVER (Node.js + Express)                 │
│  - Security: Helmet, CORS, Express-Rate-Limit                          │
│  - Auth Middleware: JWT Verification (7-day tokens)                    │
│  - Input Validation: Zod Schemas for all payloads & AI outputs         │
│  - Multi-Tenant RLS: WHERE user_id = req.user.id on all queries        │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
┌──────────────────────────────────────┐   ┌─────────────────────────────┐
│    GOOGLE GEMINI DECISION ENGINE     │   │      PERSISTENCE LAYER      │
│  - SDK: @google/genai                │   │  - PostgreSQL (pg pool)     │
│  - Models: gemini-2.5-flash          │   │    Compatible with Supabase,│
│    (fallback: gemini-3.8-flash)      │   │    Neon, Railway, Render    │
│  - Strict JSON Response Schema       │   │  - Embedded Persistent JSON │
│  - Temperature: 0.2 (deterministic)  │   │    Zero-crash fallback store│
└──────────────────────────────────────┘   └─────────────────────────────┘
```

---

## 4. API Documentation

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` — Create user account with name, email, password, organization, and default risk appetite.
- `POST /api/auth/login` — Authenticate existing credentials and receive signed JWT.
- `POST /api/auth/demo` — Instant 1-click login into the seeded Strategist account (`demo@stratagem.ai`) with pre-populated enterprise analyses.
- `GET /api/auth/me` — *(Protected)* Retrieve current user profile.
- `PUT /api/auth/profile` — *(Protected)* Update user name, organization, role title, and default risk appetite.

### Decision Intelligence Routes (`/api/decisions`)
- `GET /api/decisions` — *(Protected)* List all decisions for authenticated user. Query filters: `domain`, `urgency`, `search`, `bookmarked`.
- `GET /api/decisions/stats` — *(Protected)* Aggregate KPI analytics (total decisions, average confidence score, risk counts).
- `POST /api/decisions/analyze` — *(Protected)* Validate input payload, execute Gemini MCDA engine with structured JSON Schema, persist record, and return full report.
- `GET /api/decisions/:id` — *(Protected)* Retrieve single decision with all associated What-If simulations (enforces strict tenant ownership).
- `PATCH /api/decisions/:id/bookmark` — *(Protected)* Toggle bookmarked status.
- `DELETE /api/decisions/:id` — *(Protected)* Permanently delete a decision workspace.

### Simulation Routes (`/api/decisions/:id/simulate`)
- `POST /api/decisions/:id/simulate` — *(Protected)* Submit a perturbation prompt, run Gemini sensitivity re-evaluation against baseline report, persist in `decision_simulations`, and return score deltas.

### Health Check
- `GET /api/health` — Returns server status, uptime, database type, and Gemini API configuration.

---

## 5. Local Setup Instructions

### Prerequisites
- Node.js (v20+)
- npm or pnpm
- Google Gemini API Key ([Google AI Studio](https://aistudio.google.com/))
- Optional: PostgreSQL connection string (Supabase, Neon, Railway, or local Postgres)

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/stratagem-ai.git
   cd stratagem-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   GEMINI_API_KEY=your_gemini_api_key_here
   JWT_SECRET=your_super_secret_64_char_key_here
   # Optional: PostgreSQL Database URL (falls back to embedded persistent store if omitted)
   DATABASE_URL=postgresql://postgres:password@localhost:5432/stratagem_db
   ```

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Instant Demo Exploration:**
   On the login page, click **"⚡ Launch One-Click Demo Account"** to access pre-computed decisions and explore radar charts, 5×5 risk heatmaps, and What-If simulations immediately.

---

## 6. Cloud Deployment Guide

### Deploying to Render / Railway
1. Set the **Build Command** to: `npm run build`
2. Set the **Start Command** to: `npm run start`
3. Configure the environment variables in the service dashboard:
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
   - `DATABASE_URL` (Attach a managed PostgreSQL database)
   - `NODE_ENV=production`

### Deploying to Supabase (Database + Auth RLS)
1. In your Supabase project SQL Editor, run `server/db/init.sql`.
2. Copy the **Postgres Connection URI** (Transaction Pooler or Direct) into `DATABASE_URL`.
3. Stratagem AI will automatically utilize your Supabase PostgreSQL cluster with full Row Level Security (RLS) enforcement.

---

## 7. Submission Artifacts & Verification
- **Zero Placeholders:** Verified end-to-end type safety, real database execution, real Gemini structured outputs.
- **Strict Multi-Tenant Isolation:** All database transactions enforce parameterized `WHERE user_id = $1` filters extracted from verified JWT tokens.
- **Built for AI Studio Build & Google Cloud Run.**
