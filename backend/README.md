# HomeCare 360 - Civic FastAPI Backend

Robust, production-grade FastAPI backend for **HomeCare 360** with Fair Civic Negotiation, Escrow Protection, and Verified Technicians.

---

## 🛠 Tech Stack

- **FastAPI** + **Pydantic v2**
- **SQLAlchemy 2.0** (ORM)
- **Database**: SQLite (Local Dev) / PostgreSQL (Production: Supabase / Neon)
- **Authentication**: JWT (Access + Refresh tokens) + Passlib/Bcrypt password hashing
- **Role-based Access Control (RBAC)**: `citizen`, `technician`, `admin`
- **Real-Time Communication**: WebSockets (`/ws/bookings/{id}`) + In-App Polling fallback
- **Localization (i18n)**: English (EN), Hindi (HI), Marathi (MR) via `Accept-Language` header

---

## 🚀 Local Development Setup

### 1. Install Dependencies
```bash
cd backend
python -m pip install -r requirements.txt
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Seed Database
Seeds 1 Admin, 3 Citizens, 6 Verified Technicians (including Ramesh Patil, 429 jobs), and all 10 Services with local market benchmarks:
```bash
python seed.py
```

### 4. Run Development Server
```bash
python -m uvicorn app.main:app --reload --port 8000
```
- Swagger UI Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Alternative ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 5. Run Unit Tests
```bash
python -m pytest tests
```

---

## 🌐 Deploying to Production

### Option A: Vercel Serverless
1. Deploy the `backend` directory to Vercel:
   ```bash
   cd backend
   vercel
   ```
2. In Vercel Project Settings > Environment Variables, set:
   - `DATABASE_URL`: Your Supabase/Neon PostgreSQL connection string.
   - `SECRET_KEY`: A strong random string.
   - `CORS_ORIGINS`: `["https://homecare360-pied.vercel.app","http://localhost:5173"]`

> **Note on WebSockets on Vercel**: Vercel Serverless functions do not keep persistent WebSocket connections open. The frontend automatically falls back to secure HTTP message streaming/polling when deployed on Vercel.

### Option B: Render / Railway / Fly.io (Full WebSocket Support)
For complete persistent WebSockets, deploy using the included `Dockerfile` to Render, Railway, or VPS:
1. Connect repository to Railway/Render.
2. Select Dockerfile build.
3. Set environment variables from `.env.example`.
4. Expose port 8000.

---

## 🔑 Default Seed Credentials

| Role | Username / Phone | Password / PIN | Description |
|---|---|---|---|
| **Admin** | `admin@homecare360.gov.in` | `3600` | Civic Operations Desk Supervisor |
| **Citizen** | `+91 98221 12345` (or `asha.sharma@example.com`) | `password123` | Asha Sharma (Koregaon Park) |
| **Technician** | `+91 98221 44021` (or `ramesh.patil@homecare360.gov.in`) | `password123` | Ramesh Patil (Master Plumber, 4.9⭐) |
| **Technician (AC)** | `+91 98225 66043` | `password123` | Amit Shinde (AC Care Specialist, 4.9⭐) |
| **Technician (Security)**| `+91 98228 99076` | `password123` | Capt. Ganesh Shinde (Armed PSO, 5.0⭐) |
