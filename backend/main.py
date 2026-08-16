from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from gemini_service import (
    analyze_message,
    generate_recovery_plan,
    analyze_screenshot
)


app = FastAPI(
    title="ScamShield AI",
    description="AI-powered digital scam detection system"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MessageRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {
        "message": "ScamShield AI is running 🚀"
    }


@app.post("/analyze")
def analyze(request: MessageRequest):

    result = analyze_message(request.message)

    return result

class RecoveryRequest(BaseModel):
    message: str
    situation: str


@app.post("/recovery")
def recovery(request: RecoveryRequest):

    result = generate_recovery_plan(
        request.message,
        request.situation
    )

    return result

@app.post("/analyze-screenshot")
async def analyze_screenshot_endpoint(
    file: UploadFile = File(...)
):

    image_bytes = await file.read()

    result = analyze_screenshot(
        image_bytes,
        file.content_type
    )

    return result