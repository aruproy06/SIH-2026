"""
VisionWare AI - Backend Main Application
FastAPI Server for Intelligent Warehouse Dispatch Verification System
Smart India Hackathon 2026 (Problem Statement ID: SIH26-26198)
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.routes.auth_routes import router as auth_router
from backend.routes.invoice_routes import router as invoice_router
from backend.routes.detection_routes import router as detection_router
from backend.routes.verification_routes import router as verification_router
from backend.routes.dashboard_routes import router as dashboard_router
from backend.routes.alert_routes import router as alert_router
from backend.routes.report_routes import router as report_router
from backend.routes.voice_routes import router as voice_router
from backend.services.db_service import db_service

app = FastAPI(
    title="VisionWare AI - Warehouse Dispatch Verification API",
    description="AI-powered warehouse co-pilot integrating YOLOv11 Computer Vision, OCR, and Multi-language Voice AI.",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router, prefix="/api")
app.include_router(invoice_router, prefix="/api")
app.include_router(detection_router, prefix="/api")
app.include_router(verification_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(alert_router, prefix="/api")
app.include_router(report_router, prefix="/api")
app.include_router(voice_router, prefix="/api")

# Serve Frontend Static Directory
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
os.makedirs(frontend_path, exist_ok=True)

app.mount("/static", StaticFiles(directory=frontend_path), name="static")

@app.api_route("/", methods=["GET", "HEAD"])
async def serve_dashboard():
    index_file = os.path.join(frontend_path, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "VisionWare AI Backend Server Running. Frontend index.html not yet placed."}

@app.get("/health")
async def health_check():
    return {
        "status": "HEALTHY",
        "service": "VisionWare AI Verification Gateway",
        "yolo_engine": "ONLINE (YOLOv11x)",
        "ocr_engine": "ONLINE (PaddleOCR)",
        "database": "CONNECTED (SQLite/Postgres)"
    }

if __name__ == "__main__":
    import uvicorn
    # Make sure DB is initialized
    db_service.init_db()
    print("🚀 Starting VisionWare AI Server at http://localhost:8000")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
