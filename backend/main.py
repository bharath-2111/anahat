from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import tempfile

from backend.preprocessing.audio import preprocess_audio
from backend.inference.detector import detector
from backend.risk.risk_engine import calculate_risk


app = FastAPI(
    title="VoxShield API",
    description="AI-powered voice cloning and spoof detection system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "system": "VoxShield",
        "status": "online",
        "message": "Voice spoof detection system is running."
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "detector": "loaded"
    }


@app.post("/analyze")
async def analyze_audio(file: UploadFile = File(...)):

    # Check that a file was provided
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No audio file provided."
        )

    # Supported formats
    supported_formats = {
        ".wav",
        ".mp3",
        ".flac",
        ".ogg",
        ".m4a"
    }

    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in supported_formats:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported audio format: {extension}"
        )

    temp_path = None

    try:

        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=extension
        ) as temp_file:

            content = await file.read()

            if not content:
                raise HTTPException(
                    status_code=400,
                    detail="Uploaded audio file is empty."
                )

            temp_file.write(content)

            temp_path = temp_file.name

        # -----------------------------
        # 1. AUDIO PREPROCESSING
        # -----------------------------

        audio = preprocess_audio(temp_path)

        # -----------------------------
        # 2. AI VOICE DETECTION
        # -----------------------------

        detection = detector.predict(audio)

        # -----------------------------
        # 3. RISK ASSESSMENT
        # -----------------------------

        risk = calculate_risk(
            detection["spoof_probability"]
        )

        # -----------------------------
        # 4. FINAL RESPONSE
        # -----------------------------

        return {
            "filename": file.filename,

            "prediction": detection["prediction"],

            "spoof_probability": detection[
                "spoof_probability"
            ],

            "real_probability": detection[
                "real_probability"
            ],

            "risk_level": risk["risk_level"],

            "recommendation": risk[
                "recommendation"
            ],

            "windows_analyzed": detection[
                "windows_analyzed"
            ]
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Audio analysis failed: {str(e)}"
        )

    finally:

        # Remove temporary file
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)