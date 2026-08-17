# 🛡️ ScamShield AI

> **Your AI Digital Safety Agent**

ScamShield AI is an AI-powered digital safety assistant that helps users identify suspicious messages, understand scam indicators, assess risk, and receive practical recovery guidance.

It combines a **React frontend**, **FastAPI backend**, and **Google Gemini AI** to provide an easy-to-use scam detection experience.

---

## 🚀 Features

### 🔍 Scam Message Analysis

Paste a suspicious SMS, WhatsApp message, email, job offer, investment message, or payment request and let ScamShield analyze it.

The system provides:

- Scam type
- Risk score
- Risk level
- Confidence score
- Explanation of suspicious indicators
- Recommended actions

### 🖼️ Screenshot Analysis

Upload a screenshot of a suspicious conversation or message and analyze its contents using AI.

### 🆘 Recovery Assistance

If you have already interacted with a scam, ScamShield provides personalized guidance and recommended next steps.

### ⚡ Quick Demo Samples

The application includes sample scenarios such as:

- 💼 Job scams
- 🏦 OTP scams
- 💰 Investment scams

---

## 🏗️ Architecture

```text
┌──────────────────────┐
│      React.js        │
│      Frontend        │
│       Vercel         │
└──────────┬───────────┘
           │
           │ REST API
           ▼
┌──────────────────────┐
│      FastAPI         │
│       Backend        │
│       Render         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Google Gemini AI   │
│   Scam Analysis      │
└──────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- HTML
- CSS
- Vercel

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- REST APIs
- Render

### AI

- Google Gemini AI
- Google Gen AI SDK

### Development Tools

- Git
- GitHub
- VS Code
- Python Virtual Environment

---

## 📁 Project Structure

```text
ScamShield-AI/
│
├── backend/
│   ├── main.py
│   ├── gemini_service.py
│   ├── requirements.txt
│   └── venv/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── ...
│   ├── package.json
│   └── ...
│
└── README.md
```

> **Note:** Do not commit the `venv/` directory to GitHub. Add it to `.gitignore`.

---

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Backend health/home endpoint |
| POST | `/analyze` | Analyze a suspicious message |
| POST | `/recovery` | Generate recovery guidance |
| POST | `/analyze-screenshot` | Analyze a suspicious screenshot |

### Example: Analyze a Message

```bash
curl -X POST \
  "https://scamshield-ai-dfc5.onrender.com/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Congratulations! You have been selected for a work-from-home job. Pay ₹1499 as a refundable registration fee within 20 minutes."
  }'
```

### Example Response

```json
{
  "scam_type": "Fake Job / Advance-Fee Scam",
  "risk_score": 95,
  "risk_level": "CRITICAL",
  "confidence": 98,
  "summary": "This message displays clear indicators of an employment scam.",
  "indicators": [
    "Demands an upfront payment or registration fee",
    "Uses artificial urgency",
    "Claims job selection without a prior application process"
  ],
  "recommended_actions": [
    "Do not pay any money or share bank/personal details.",
    "Block and report the sender immediately."
  ]
}
```

---

## ⚙️ Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ramritheesh/ScamShield-AI.git
cd ScamShield-AI
```

---

### 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python3 -m venv venv
```

Activate it:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

FastAPI Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the URL shown by Vite, usually:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

ScamShield requires a Gemini API key.

Create:

```text
backend/.env
```

Add:

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

### ⚠️ Important

**Never commit your API key to GitHub.**

Add the following to `.gitignore`:

```text
.env
venv/
__pycache__/
*.pyc
```

For production deployment, configure `GEMINI_API_KEY` in the backend hosting platform's environment variables.

---

## 🌐 Deployment

### Frontend

The React frontend is deployed using **Vercel**.

### Backend

The FastAPI backend is deployed using **Render**.

Production architecture:

```text
User
  │
  ▼
Vercel
React Frontend
  │
  │ HTTPS REST API
  ▼
Render
FastAPI Backend
  │
  ▼
Google Gemini API
```

---

## 🧪 Example Scam Messages

### 💼 Job Scam

```text
Congratulations! You have been selected for a work-from-home job.
Pay ₹1499 as a refundable registration fee within 20 minutes.
```

### 🔐 OTP Scam

```text
Your account will be blocked today.
Share the OTP you received to verify your account immediately.
```

### 💰 Investment Scam

```text
Invest ₹5000 today and get guaranteed returns of ₹50,000 within one week.
Limited slots available. Pay now.
```

These examples demonstrate common warning signs such as:

- Artificial urgency
- Requests for money
- OTP requests
- Guaranteed returns
- Pressure to act immediately
- Requests for sensitive information

---

## 🎯 Why ScamShield AI?

Online scams often rely on:

- Urgency
- Fear
- Attractive rewards
- Fake job opportunities
- Impersonation
- Requests for sensitive information
- Advance payments

ScamShield AI provides users with a second layer of protection by helping them **pause, understand the warning signs, and make safer decisions**.

> **Detect. Understand. Recover.**

---

## 🔮 Future Improvements

Planned improvements include:

- 🌍 Multilingual scam detection
- 🔗 URL and link safety analysis
- 📱 Sender and phone number risk analysis
- 🧠 Improved scam classification
- 🖼️ Advanced OCR for screenshots
- 📊 Scam trend analytics
- 🔔 Real-time scam alerts
- 🛡️ Browser and mobile integration
- 💬 More personalized recovery workflows

---

## ⚠️ Disclaimer

ScamShield AI is an assistive tool and should not be treated as a guaranteed scam detector.

AI-generated results may occasionally be incorrect. Users should independently verify suspicious communications through official channels.

Never share:

- Passwords
- OTPs
- Bank details
- UPI PINs
- Credit/debit card details
- Other sensitive information

---

## 👨‍💻 Author

**Ram Ritheesh**

Built as an AI-powered digital safety project using:

**React.js • FastAPI • Python • Google Gemini AI**

---

## ⭐ Contributing

Contributions, ideas, and improvements are welcome.

### 1. Fork the repository

### 2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

### 3. Make your changes

### 4. Commit your changes

```bash
git add .
git commit -m "Add your feature"
```

### 5. Push the branch

```bash
git push origin feature/your-feature
```

### 6. Open a Pull Request

---

## 📄 License

This project is intended for educational and demonstration purposes.
