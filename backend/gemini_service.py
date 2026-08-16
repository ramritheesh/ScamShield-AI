import json
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env")

client = genai.Client(api_key=api_key)


def analyze_message(message: str):

    prompt = f"""
You are ScamShield AI, an AI-powered digital safety assistant.

Analyze the following message for potential scams.

Look for:
- urgency
- threats
- requests for money
- requests for OTP, passwords, PINs or bank information
- suspicious links
- impersonation
- unrealistic promises
- social engineering
- fake jobs
- investment scams
- phishing

Do NOT automatically classify a message as a scam when there is insufficient evidence.

Return ONLY valid JSON using exactly this structure:

{{
    "scam_type": "string",
    "risk_score": 0,
    "risk_level": "LOW",
    "confidence": 0,
    "summary": "string",
    "indicators": [
        "string"
    ],
    "recommended_actions": [
        "string"
    ]
}}

Rules:

- risk_score must be an integer from 0 to 100.
- confidence must be an integer from 0 to 100.
- risk_level must be LOW, MEDIUM, HIGH, or CRITICAL.

MESSAGE:

{message}
"""

    interaction = client.interactions.create(
        model="gemini-3.6-flash",
        input=prompt
    )

    text = interaction.output_text.strip()

    # Remove markdown code fences if Gemini adds them
    if text.startswith("```"):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

    # Convert Gemini's JSON string into a Python dictionary
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {
            "scam_type": "Unknown",
            "risk_score": 0,
            "risk_level": "UNKNOWN",
            "confidence": 0,
            "summary": text,
            "indicators": [],
            "recommended_actions": []
        }
def generate_recovery_plan(message: str, situation: str):

    prompt = f"""
You are ScamShield AI, a digital safety recovery assistant.

A user received the following potentially fraudulent message:

MESSAGE:
{message}

The user says:

SITUATION:
{situation}

Create a practical, situation-specific recovery plan.

Your response must contain:

1. immediate_actions
2. things_to_avoid
3. accounts_to_secure
4. evidence_to_preserve
5. explanation

IMPORTANT:
- Give practical and calm advice.
- Do not blame or shame the user.
- Do not ask the user to provide passwords, OTPs, PINs, or other secrets.
- If money or banking information may be involved, recommend contacting the relevant bank/payment provider through its official channel.
- Never ask the user to send sensitive information to ScamShield.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "immediate_actions": [
        "action 1",
        "action 2",
        "action 3"
    ],
    "things_to_avoid": [
        "thing 1",
        "thing 2"
    ],
    "accounts_to_secure": [
        "account 1",
        "account 2"
    ],
    "evidence_to_preserve": [
        "evidence 1",
        "evidence 2"
    ],
    "explanation": "Short explanation of why these actions matter."
}}
"""

    interaction = client.interactions.create(
        model="gemini-3.6-flash",
        input=prompt
    )

    text = interaction.output_text.strip()

    if text.startswith("```"):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

    try:
        return json.loads(text)

    except json.JSONDecodeError:
        return {
            "immediate_actions": [text],
            "things_to_avoid": [],
            "accounts_to_secure": [],
            "evidence_to_preserve": [],
            "explanation": "Please follow the recommended safety steps."
        }
        
def analyze_screenshot(image_bytes: bytes, mime_type: str):

    prompt = """
You are ScamShield AI, a digital scam detection assistant.

Analyze the provided screenshot carefully.

The screenshot may contain:
- SMS messages
- WhatsApp conversations
- emails
- social media messages
- fake job offers
- payment requests
- phishing messages
- suspicious URLs
- impersonation attempts

Extract the visible message content and assess whether it contains
potential scam indicators.

Look for:
- requests for money
- registration fees
- OTP requests
- passwords or PIN requests
- bank information requests
- Aadhaar or identity document requests
- suspicious links
- artificial urgency
- threats
- unrealistic rewards or salaries
- impersonation
- social engineering

Return ONLY valid JSON.

Use exactly this structure:

{
    "scam_type": "string",
    "risk_score": 0,
    "risk_level": "LOW",
    "confidence": 0,
    "summary": "string",
    "extracted_text": "string",
    "indicators": [
        "string"
    ],
    "recommended_actions": [
        "string"
    ]
}

Rules:

- risk_score must be an integer from 0 to 100.
- confidence must be an integer from 0 to 100.
- risk_level must be LOW, MEDIUM, HIGH, or CRITICAL.
- Do not invent text that is not visible in the screenshot.
- If the screenshot does not contain enough information to determine
  whether it is suspicious, say so clearly.
"""

    import base64

    image_b64 = base64.b64encode(image_bytes).decode("utf-8")

    interaction = client.interactions.create(
        model="gemini-3.6-flash",
        input=[
            {
                "type": "text",
                "text": prompt
            },
            {
                "type": "image",
                "data": image_b64,
                "mime_type": mime_type
            }
        ]
    )

    text = interaction.output_text.strip()

    if text.startswith("```"):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

    try:
        return json.loads(text)

    except json.JSONDecodeError:

        return {
            "scam_type": "Unknown",
            "risk_score": 0,
            "risk_level": "UNKNOWN",
            "confidence": 0,
            "summary": text,
            "extracted_text": "",
            "indicators": [],
            "recommended_actions": []
        }