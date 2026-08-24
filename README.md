# 🏆 VisionWare AI — Intelligent Warehouse Dispatch Verification System

**Smart India Hackathon 2026**
- **Problem Statement ID**: `SIH26-26198` (Software Edition)
- **Theme**: Student Innovation in Transport & Logistics
- **Team**: Mohit Sharma & Team
- **Version**: 1.0 (Production-Ready MVP)

---

## 🌟 Executive Summary & Pitch
**VisionWare AI** is an AI-powered warehouse monitoring and dispatch verification platform that uses **Computer Vision (YOLOv11)**, **OCR**, **Barcode Cross-Verification**, and a **Multilingual Voice AI Co-Pilot (Hindi, English, Bengali)** to verify goods before they leave a warehouse.

The system compares invoice data with products detected through cameras in real-time ($<1.8\text{s}$) and alerts warehouse managers about missing, extra, or incorrect items before dispatch.

> **One-Line Pitch**: *An AI-powered warehouse co-pilot that verifies every dispatch before it leaves the warehouse, reducing inventory leakage and human error to zero.*

---

## 🎯 Key Features & PRD Compliance

| Feature | Description | PRD Status |
| :--- | :--- | :--- |
| **1. AI Product Detection** | Real-time YOLOv11 detection for Cement bags, Steel rods, Paint buckets, Boxes, Pipes, and Medicine cartons with live canvas bounding boxes. | ✅ Implemented |
| **2. OCR Invoice Scanner** | Auto-extraction of Invoice Number, Dispatch Date, Batch ID, Customer, and expected quantities. | ✅ Implemented |
| **3. Dispatch Verification (USP)** | Strict comparison rules: Missing $\rightarrow$ Red Alert, Extra $\rightarrow$ Red Alert, Wrong item $\rightarrow$ Red Alert, Exact match $\rightarrow$ Approved. | ✅ Implemented |
| **4. Real-Time Alerts** | Dynamic visual alert cards and instant Web Audio API buzzer sound for mismatches. | ✅ Implemented |
| **5. Executive Dashboard** | Real-time KPIs, inventory accuracy %, hourly volume charts, and error distribution. | ✅ Implemented |
| **6. Barcode & QR Scanner** | Physical package code inspector cross-validating Batch IDs against active manifest. | ✅ Implemented |
| **7. Multilingual Voice AI** | Hands-free voice assistant supporting **English, हिन्दी (Hindi), and বাংলা (Bengali)** with speech recognition and voice synthesis. | ✅ Implemented |
| **8. Audit Gate Pass & PDF** | 1-Click printable digital dispatch certificate with SHA256 verification hash and itemized breakdown. | ✅ Implemented |

---

## 🏗️ Repository Structure

```
VisionWare-AI/
├── frontend/
│   ├── index.html            # Ultra-modern dark HUD verification studio
│   ├── css/
│   │   └── style.css         # Glassmorphism design system & neon HUD animations
│   └── js/
│       ├── app.js            # Main application controller & audio synth
│       ├── detection_canvas.js # Canvas HUD bounding box & scanline renderer
│       ├── voice_assistant.js  # Multilingual Web Speech API integration
│       ├── barcode_scanner.js  # Barcode/QR validator
│       └── report_generator.js # Gate pass & audit certificate generator
│
├── backend/
│   ├── main.py               # FastAPI server & static mount
│   ├── api/                  # API endpoints
│   ├── routes/               # Modular route handlers (auth, invoice, detect, verify, reports, voice)
│   ├── services/             # DB, Barcode, and Voice AI business logic
│   ├── models/               # Pydantic schemas
│   └── utils/                # Logging & helpers
│
├── ai/
│   ├── detection.py          # YOLOv11 inference & bounding box generator
│   ├── ocr/
│   │   └── ocr_engine.py     # Invoice OCR extraction engine
│   ├── verify.py             # Core USP Dispatch Reconciliation Engine
│   └── yolo_model/           # Model classes and config
│
├── database/
│   ├── schema.sql            # PostgreSQL & SQLite relational schema
│   └── seed.sql              # Realistic seed data & test invoices
│
├── docs/
│   ├── PRD.md                # Full Smart India Hackathon PRD
│   ├── API.md                # REST API Endpoint documentation
│   └── ARCHITECTURE.md       # Architectural diagrams and dataflow
│
├── Dockerfile                # Production containerization
├── docker-compose.yml        # 1-Click containerized deployment
├── requirements.txt          # Python dependencies
└── README.md
```

---

## 🚀 Quickstart & Running the Application

### Option A: Run Locally with Python Virtual Environment (Fastest)

```bash
# 1. Activate virtual environment
source venv/bin/activate

# 2. Run the FastAPI server
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Then open your browser to **[http://localhost:8000](http://localhost:8000)**.

### Option B: Run with Docker Compose

```bash
docker-compose up --build
```

---

## 🧪 Live Demo Test Scenarios for Judges

Click through the pre-configured scenarios in the **Demo Manifest Scenarios** bar:

1. **Scenario 1: Match (Cement & Steel)** $\rightarrow$ Exact match ($10$ Cement bags, $5$ Steel bundles). Status: `✅ DISPATCH APPROVED` with green chime.
2. **Scenario 2: Missing Paint (Alert)** $\rightarrow$ Expected $6$ Paint buckets, AI detected only $4$. Status: `🚨 RED ALERT: MISMATCH DETECTED` with audio buzzer.
3. **Scenario 3: Extra Boxes & Wrong Medicine** $\rightarrow$ Unexpected Medicine cartons detected on pallet. Status: `🚨 RED ALERT: CRITICAL MISMATCH`.
4. **Scenario 4: Heavy Pipes Load** $\rightarrow$ High volume load verification ($12$ Pipes, $8$ Cement bags).
5. **Multilingual Voice Assistant**: Click the **Voice Co-Pilot** button or try preset commands:
   - English: `"Verify invoice INV-2026-001"`
   - Hindi: `"आज की डिस्पैच रिपोर्ट दिखाओ"`
   - Bengali: `"আজকের ডিসপ্যাচ রিপোর্ট দেখাও"`
6. **Barcode Verification**: Click the quick test chips (`890123456001` Cement, `890123456002` Steel) to test instant batch matching.
7. **Gate Pass Generator**: Click `📄 Generate Dispatch Gate Pass` to view and print the official audit certificate.

---

## 🔒 Security & Performance
- **Sub-2 Second Latency**: Verification runs in $<1.5\text{s}$ (target $<5\text{s}$).
- **Role-Based Access Control**: Warehouse Manager, Worker, and Logistics Admin roles.
- **Tamper-Evident Audit Trail**: Every dispatch generates a SHA256 hashed digital pass.
