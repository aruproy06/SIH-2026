# Smart India Hackathon 2026 — Product Requirements Document (PRD)

## VisionWare AI — Intelligent Warehouse Dispatch Verification System
- **Problem Statement ID**: SIH26-26198 (Software Edition)
- **Theme**: Student Innovation in Transport & Logistics
- **Prepared By**: Mohit Sharma & Team
- **Version**: 1.0

---

## Executive Summary
VisionWare AI is an AI-powered warehouse monitoring and dispatch verification platform that uses Computer Vision, OCR, and AI to verify goods before they leave a warehouse.

The system compares invoice data with products detected through a camera in real time and alerts warehouse managers about missing, extra, or incorrect items before dispatch.

> **One-Line Pitch**: An AI-powered warehouse co-pilot that verifies every dispatch before it leaves the warehouse, reducing inventory loss and human error.

---

## 1. Problem Statement
### Background
Warehouses across India still rely heavily on manual verification during dispatch. Human counting errors, incorrect loading, and invoice mismatches result in inventory loss, delayed deliveries, and financial damage.

### Current Challenges
- Manual counting of products.
- Wrong products loaded into trucks.
- Missing or extra inventory during dispatch.
- Incorrect invoice verification.
- No real-time monitoring dashboard.

### Objective
Develop an AI-powered warehouse dispatch verification system that automatically detects products, reads invoices using OCR, compares expected vs actual inventory, and generates real-time alerts and reports.

---

## 2. User Personas
1. **Primary Persona — Warehouse Manager**
   - Responsibilities: Approve dispatches, monitor inventory, manage warehouse workers.
   - Pain Points: Manual verification, inventory leakage, lack of visibility.
   - Goals: Fast and accurate dispatch approval, real-time alerts, analytics dashboard.
2. **Secondary Persona — Warehouse Worker**
   - Responsibilities: Load products, scan packages, complete dispatch tasks.
   - Pain Points: Manual counting, repetitive work, dispatch mistakes.
   - Goals: Faster loading process, reduced manual work.
3. **Tertiary Persona — Logistics Administrator**
   - Responsibilities: Monitor warehouse performance, track shipments, audit inventory history.
   - Goals: Reports, analytics, historical dispatch logs.

---

## 3. Product Vision & Success Metrics
- **Dispatch Verification Accuracy**: 95%+
- **Verification Time**: Under 5 seconds
- **Reduction in Manual Verification**: 70%
- **Inventory Accuracy Improvement**: 90%

---

## 4. Key Features
1. **AI Product Detection**: Real-time object detection for Cement bags, Steel rods, Paint buckets, Boxes, Pipes, Medicine cartons.
2. **OCR Invoice Scanner**: Extraction of Invoice Number, Dispatch Date, Batch ID, and Line Items.
3. **Dispatch Verification Engine (USP)**:
   - Missing product $\rightarrow$ Red Alert
   - Extra product $\rightarrow$ Red Alert
   - Wrong product $\rightarrow$ Red Alert
   - Exact match $\rightarrow$ Dispatch Approved
4. **Real-Time Alerts**: Instant buzzer and visual alerts for discrepancies.
5. **Analytics Dashboard**: Total dispatches, success rate, error counts, hourly throughput.
6. **Barcode & QR Verification**: Physical package barcode validation against batch IDs.
7. **Voice AI Assistant (Innovation)**: Multilingual voice control in English, Hindi, and Bengali.
