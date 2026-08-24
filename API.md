# VisionWare AI — REST API Documentation

Base URL: `http://localhost:8000/api`

Interactive Swagger Docs: `http://localhost:8000/docs`

---

## Endpoints

### 1. Authentication
- `POST /login`: Authenticates user (Warehouse Manager, Worker, Admin).
  - Request: `{"email": "mohit.sharma@visionware.ai", "password": "password"}`
  - Response: JWT token & user profile.

### 2. Invoice OCR Extraction
- `POST /upload-invoice`: Uploads invoice PDF/image or code for OCR extraction.
  - Body: Form-data with file or `invoice_code`.
  - Response: Extracted invoice number, items list, batches, totals.

### 3. AI Product Detection
- `POST /detect-products`: Runs YOLOv11 object detection on incoming camera frames or scenario.
  - Body: `scenario` (e.g. `perfect_cement_steel`, `missing_paint_mismatch`, `extra_boxes_and_wrong_meds`, `pipes_and_cement`).
  - Response: Detected product counts, confidence scores, and normalized bounding box coordinates.

### 4. Dispatch Verification Engine (USP)
- `POST /verify-dispatch`: Compares invoice data vs detected products and enforces discrepancy rules.
  - Request: `{"invoice_code": "INV-2026-001", "scenario": "perfect_cement_steel"}`
  - Response: `VerificationSummary` with `APPROVED` or `REJECTED`, variance counts, and alerts.

### 5. Barcode & QR Verification
- `POST /verify-barcode`: Validates scanned package code against active dispatch batch.
  - Request: `{"scanned_code": "890123456001", "invoice_id": "INV-001"}`
  - Response: Validation match status and product mapping.

### 6. Dashboard Analytics
- `GET /dashboard`: Returns real-time KPI metrics, accuracy rate, error breakdown, and hourly trends.

### 7. Multilingual Voice Assistant
- `POST /voice-command`: Processes speech transcripts in English, Hindi, or Bengali.
  - Request: `{"audio_transcript": "आज की डिस्पैच रिपोर्ट दिखाओ", "language": "hi"}`
  - Response: Intent, spoken reply, and UI navigation trigger.

### 8. Audit Reports
- `GET /reports/{id}`: Generates downloadable/printable official dispatch certificate.
