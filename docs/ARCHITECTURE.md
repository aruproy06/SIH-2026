# VisionWare AI — System Architecture

## Architecture Overview
VisionWare AI connects industrial warehouse hardware (CCTV / Conveyor Overhead Cameras / Barcode Scanners / Weighbridges) with edge and cloud AI models to automate dispatch verification.

```
+-------------------------------------------------------------------------+
|                         Frontend Web Client                             |
|  - High-Tech Dark HUD Dashboard (Vanilla ES Modules / Modern Web)      |
|  - Real-time Canvas YOLO Bounding Box & HUD Overlay                     |
|  - Web Audio API Alert Buzzer & Chime Synthesizer                       |
|  - Web Speech API Multilingual Voice Co-Pilot (EN, HI, BN)             |
|  - Printable Gate Pass & Audit Report Generator                         |
+-------------------------------------------------------------------------+
                                    │
                               REST API / HTTP
                                    ▼
+-------------------------------------------------------------------------+
|                         FastAPI Application                             |
|  ├── /api/login, /api/me (Role-Based Access Control)                    |
|  ├── /api/upload-invoice (OCR Ingestion & Normalization)                 |
|  ├── /api/detect-products (YOLOv11 Inference Pipeline)                   |
|  ├── /api/verify-dispatch (Reconciliation Rules Engine - USP)          |
|  ├── /api/verify-barcode (Package Batch Cross-Checker)                  |
|  ├── /api/voice-command (Multilingual NLP Intent Router)                |
|  └── /api/dashboard (Real-time Analytics & Throughput Aggregator)       |
+-------------------------------------------------------------------------+
         │                              │                         │
         ▼                              ▼                         ▼
+-------------------+        +--------------------+     +-----------------+
|   AI & CV Layer   |        |   Relational DB    |     |  Reports Engine |
| - YOLOv11 Engine  |        | - SQLite / Postgres|     | - Digital Sign  |
| - OCR Scanner     |        | - Schemas & Seeds  |     | - Audit Trail   |
| - Rules Matrix    |        | - Persistent Logs  |     | - PDF Gate Pass |
+-------------------+        +--------------------+     +-----------------+
```
