# 🛠️ SETUP_AND_INSTALLATION.md — Complete Setup & Deployment Guide

---

## 1. System Requirements
* **Operating System**: macOS, Linux, or Windows (WSL2 recommended)
* **Node.js**: v18.0.0 or higher (v20 LTS recommended)
* **npm**: v9.0.0 or higher
* **Python**: v3.10 or v3.11 (Python 3.11 recommended)
* **Git**: v2.30 or higher

---

## 2. Local Environment Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/111shivamrai/et_ai_hackathon.git
cd et_ai_hackathon
```

### Step 2: Configure Environment Variables
Copy the template `.env.example` in the root:
```bash
cp .env.example .env
```
Populate `.env`:
```ini
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
HOST=0.0.0.0
```

### Step 3: Backend Installation
```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Run FastAPI server
uvicorn api.server:app --host 0.0.0.0 --port 8000 --reload
```
Test backend health:
```bash
curl http://localhost:8000/
# Expected: {"message": "Industrial Safety Intelligence API Running"}
```

### Step 4: Frontend Installation
Open a new terminal window:
```bash
cd kawach-web
npm install

# Start Vite development server
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 3. Production Deployment

### Vercel (Frontend)
1. Import repository `111shivamrai/et_ai_hackathon` into Vercel.
2. In **Project Settings** -> **Build & Development**:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `./` (or `kawach-web`)
   * **Build Command**: `npm --prefix kawach-web install && npm --prefix kawach-web run build`
   * **Output Directory**: `kawach-web/dist`
3. Deploy!

### Render (Backend)
1. Create a new **Web Service** on Render connected to `ET_AI_HACKATHON`.
2. Select **Python 3** environment.
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `uvicorn api.server:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variable: `GEMINI_API_KEY`.
