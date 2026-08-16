import { useState, useEffect } from "react";

// =========================================================
// API CONFIGURATION
// =========================================================

// Vercel:
// Set VITE_API_URL to:
// https://scamshield-ai-dfc5.onrender.com

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://scamshield-ai-dfc5.onrender.com"
).replace(/\/$/, "");

function App() {
  const [mode, setMode] = useState("message");

  const [message, setMessage] = useState("");

  // =========================
  // HISTORY
  // =========================

  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem(
        "scamshield_history"
      );

      return savedHistory
        ? JSON.parse(savedHistory)
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "scamshield_history",
      JSON.stringify(history)
    );
  }, [history]);

  // =========================
  // SCREENSHOT
  // =========================

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // =========================
  // RESULT
  // =========================

  const [result, setResult] = useState(null);

  // =========================
  // RECOVERY
  // =========================

  const [situation, setSituation] = useState("");
  const [recovery, setRecovery] = useState(null);

  const [completedActions, setCompletedActions] =
    useState([]);

  // =========================
  // LOADING / ERROR
  // =========================

  const [loading, setLoading] = useState(false);

  const [recoveryLoading, setRecoveryLoading] =
    useState(false);

  const [error, setError] = useState("");

  // =========================================================
  // HISTORY
  // =========================================================

  const saveToHistory = (data, scanType) => {
    const historyItem = {
      id: Date.now(),

      date: new Date().toLocaleString(),

      type: scanType,

      scam_type:
        data.scam_type || "Unknown",

      risk_score:
        data.risk_score ?? 0,

      risk_level:
        data.risk_level || "UNKNOWN",

      confidence:
        data.confidence ?? 0,

      summary:
        data.summary || "",
    };

    setHistory((previousHistory) => [
      historyItem,
      ...previousHistory,
    ]);
  };

  // =========================================================
  // DASHBOARD STATS
  // =========================================================

  const totalScans = history.length;

  const highRiskScans = history.filter(
    (item) =>
      item.risk_level === "HIGH" ||
      item.risk_level === "CRITICAL"
  ).length;

  const lowRiskScans = history.filter(
    (item) =>
      item.risk_level === "LOW"
  ).length;

  // =========================================================
  // CLEAR HISTORY
  // =========================================================

  const clearHistory = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete all ScamShield history?"
    );

    if (confirmed) {
      setHistory([]);
    }
  };

  // =========================================================
  // MESSAGE ANALYSIS
  // =========================================================

  const analyzeMessage = async () => {
    if (!message.trim()) {
      setError(
        "Please enter a message to analyze."
      );
      return;
    }

    setLoading(true);

    setError("");

    setResult(null);

    setRecovery(null);

    setSituation("");

    setCompletedActions([]);

    try {
      console.log(
        "ScamShield API:",
        `${API_URL}/analyze`
      );

      const response = await fetch(
        `${API_URL}/analyze`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Analysis failed: ${response.status}`
        );
      }

      const data =
        await response.json();

      setResult(data);

      saveToHistory(
        data,
        "Message"
      );

    } catch (err) {
      console.error(
        "ScamShield analysis error:",
        err
      );

      setError(
        "Unable to connect to ScamShield backend. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DEMO MESSAGES
  // =========================================================

  const loadDemo = (type) => {
    const demos = {
      job: `Congratulations! You have been selected for a Work From Home position with Amazon. Salary ₹45,000 per month. Pay ₹1,499 registration fee within 20 minutes to confirm your position. Send your Aadhaar, bank details and OTP to our HR manager on WhatsApp.`,

      bank: `URGENT: Your bank account will be permanently blocked today due to suspicious activity. Verify your account within 10 minutes by sharing the OTP sent to your mobile number with our customer support executive.`,

      investment: `Congratulations! Your investment account has been selected for an exclusive AI trading opportunity. Invest ₹5,000 today and receive guaranteed returns of ₹50,000 within 7 days. Limited slots available. Send your UPI payment screenshot immediately.`,
    };

    setMode("message");

    setMessage(
      demos[type]
    );

    setResult(null);

    setRecovery(null);

    setSituation("");

    setCompletedActions([]);

    setError("");
  };

  // =========================================================
  // SCREENSHOT
  // =========================================================

  const handleImageChange = (event) => {
    const file =
      event.target.files[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setError(
        "Please select an image file."
      );

      return;
    }

    setImageFile(file);

    setError("");

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(
      previewUrl
    );

    setResult(null);

    setRecovery(null);

    setSituation("");

    setCompletedActions([]);
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImageFile(null);

    setImagePreview(null);

    setError("");
  };

  const analyzeScreenshot =
    async () => {
      if (!imageFile) {
        setError(
          "Please select a screenshot first."
        );

        return;
      }

      setLoading(true);

      setError("");

      setResult(null);

      setRecovery(null);

      setSituation("");

      setCompletedActions([]);

      try {
        const formData =
          new FormData();

        formData.append(
          "file",
          imageFile
        );

        // IMPORTANT:
        // Screenshot endpoint is different
        // from normal message analysis.

        console.log(
          "ScamShield API:",
          `${API_URL}/analyze-screenshot`
        );

        const response =
          await fetch(
            `${API_URL}/analyze-screenshot`,
            {
              method: "POST",

              body: formData,
            }
          );

        if (!response.ok) {
          throw new Error(
            `Screenshot analysis failed: ${response.status}`
          );
        }

        const data =
          await response.json();

        setResult(data);

        saveToHistory(
          data,
          "Screenshot"
        );

      } catch (err) {
        console.error(
          "ScamShield screenshot error:",
          err
        );

        setError(
          "Unable to analyze the screenshot. Please try again."
        );

      } finally {
        setLoading(false);
      }
    };

  // =========================================================
  // RECOVERY AGENT
  // =========================================================

  const generateRecoveryPlan =
    async () => {
      if (!situation) {
        setError(
          "Please select what happened first."
        );

        return;
      }

      setRecoveryLoading(true);

      setError("");

      try {
        console.log(
          "ScamShield API:",
          `${API_URL}/recovery`
        );

        const response =
          await fetch(
            `${API_URL}/recovery`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                message:
                  message ||
                  result?.extracted_text ||
                  "The user uploaded a suspicious screenshot.",

                situation:
                  situation,
              }),
            }
          );

        if (!response.ok) {
          throw new Error(
            `Recovery request failed: ${response.status}`
          );
        }

        const data =
          await response.json();

        setRecovery(data);

        setCompletedActions([]);

      } catch (err) {
        console.error(
          "ScamShield recovery error:",
          err
        );

        setError(
          "Unable to generate your recovery plan. Please try again."
        );

      } finally {
        setRecoveryLoading(
          false
        );
      }
    };

  // =========================================================
  // CHECKLIST
  // =========================================================

  const toggleAction = (index) => {
    setCompletedActions(
      (previous) => {
        if (
          previous.includes(index)
        ) {
          return previous.filter(
            (item) =>
              item !== index
          );
        }

        return [
          ...previous,
          index,
        ];
      }
    );
  };

  // =========================================================
  // RESET
  // =========================================================

  const analyzeAnother =
    () => {
      setMessage("");

      setImageFile(null);

      if (imagePreview) {
        URL.revokeObjectURL(
          imagePreview
        );
      }

      setImagePreview(null);

      setResult(null);

      setSituation("");

      setRecovery(null);

      setCompletedActions([]);

      setError("");

      setMode("message");
    };

  // =========================================================
  // RISK CLASS
  // =========================================================

  const getRiskClass =
    (level) => {
      if (
        level === "CRITICAL"
      ) {
        return "critical";
      }

      if (
        level === "HIGH"
      ) {
        return "high";
      }

      if (
        level === "MEDIUM"
      ) {
        return "medium";
      }

      return "low";
    };

  // =========================================================
  // RISK MESSAGE
  // =========================================================

  const getRiskMessage =
    (score) => {
      if (score >= 90) {
        return "Very likely to be a scam";
      }

      if (score >= 70) {
        return "Strong scam indicators detected";
      }

      if (score >= 40) {
        return "Some suspicious indicators detected";
      }

      return "Few scam indicators detected";
    };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="app">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="header">

        <div className="logo">
          🛡️ ScamShield
        </div>

        <div className="tagline">
          Your AI Digital Safety Agent
        </div>

      </header>

      <main className="container">

        {/* =====================================================
            DASHBOARD
        ===================================================== */}

        {!result &&
          history.length > 0 && (

            <section className="dashboard">

              <div className="dashboard-header">

                <div>

                  <div className="section-eyebrow">
                    SECURITY OVERVIEW
                  </div>

                  <h2>
                    📊 ScamShield Dashboard
                  </h2>

                  <p>
                    Your recent scam
                    analysis activity
                  </p>

                </div>

                <button
                  className="clear-history"
                  onClick={
                    clearHistory
                  }
                >
                  🗑️ Clear History
                </button>

              </div>

              <div className="stats-grid">

                <div className="stat-card">

                  <span className="stat-icon">
                    🔍
                  </span>

                  <div>

                    <strong>
                      {totalScans}
                    </strong>

                    <span>
                      Total Scans
                    </span>

                  </div>

                </div>

                <div className="stat-card danger">

                  <span className="stat-icon">
                    🚨
                  </span>

                  <div>

                    <strong>
                      {highRiskScans}
                    </strong>

                    <span>
                      High Risk
                    </span>

                  </div>

                </div>

                <div className="stat-card safe">

                  <span className="stat-icon">
                    🟢
                  </span>

                  <div>

                    <strong>
                      {lowRiskScans}
                    </strong>

                    <span>
                      Low Risk
                    </span>

                  </div>

                </div>

              </div>

              <div className="history-section">

                <div className="history-title">

                  <h3>
                    Recent Scans
                  </h3>

                  <span>
                    {history.length} records
                  </span>

                </div>

                <div className="history-list">

                  {history
                    .slice(0, 5)
                    .map(
                      (item) => (

                        <div
                          className="history-item"
                          key={item.id}
                        >

                          <div className="history-main">

                            <div className="history-type">

                              {item.type ===
                              "Screenshot"
                                ? "🖼️"
                                : "💬"}

                            </div>

                            <div>

                              <strong>
                                {
                                  item.scam_type
                                }
                              </strong>

                              <p>
                                {item.date}
                              </p>

                            </div>

                          </div>

                          <div className="history-risk">

                            <span
                              className={`history-badge ${getRiskClass(
                                item.risk_level
                              )}`}
                            >
                              {
                                item.risk_level
                              }
                            </span>

                            <strong>
                              {
                                item.risk_score
                              }
                              /100
                            </strong>

                          </div>

                        </div>

                      )
                    )}

                </div>

              </div>

            </section>

          )}

        {/* =====================================================
            HERO
        ===================================================== */}

        {!result && (

          <section className="hero premium-hero">

            <div className="hero-badge">
              🛡️ AI-POWERED DIGITAL SAFETY
            </div>

            <h1>
              Don't trust the message.
              <br />

              <span>
                Verify it with AI.
              </span>
            </h1>

            <p>
              ScamShield analyzes suspicious
              messages and screenshots, explains
              the warning signs, and guides you
              through what to do next.
            </p>

            <div className="trust-pills">

              <span>
                🤖 Gemini AI
              </span>

              <span>
                🔍 Explainable Analysis
              </span>

              <span>
                🛡️ Recovery Guidance
              </span>

            </div>

          </section>

        )}

        {/* =====================================================
            FEATURE CARDS
        ===================================================== */}

        {!result && (

          <section className="feature-grid">

            <div className="feature-card">

              <div className="feature-icon">
                💬
              </div>

              <h3>
                Analyze Messages
              </h3>

              <p>
                Detect suspicious SMS,
                WhatsApp messages,
                emails and job offers.
              </p>

            </div>

            <div className="feature-card">

              <div className="feature-icon">
                🖼️
              </div>

              <h3>
                Analyze Screenshots
              </h3>

              <p>
                Upload a screenshot and
                let AI investigate the
                visible conversation.
              </p>

            </div>

            <div className="feature-card">

              <div className="feature-icon">
                🧠
              </div>

              <h3>
                Get Recovery Help
              </h3>

              <p>
                Tell ScamShield what
                happened and receive
                personalized next steps.
              </p>

            </div>

          </section>

        )}

        {/* =====================================================
            MODE SELECTOR
        ===================================================== */}

        {!result && (

          <div className="mode-selector">

            <button
              className={
                mode === "message"
                  ? "mode-button active"
                  : "mode-button"
              }

              onClick={() => {

                setMode("message");

                setError("");

              }}
            >
              💬 Message
            </button>

            <button
              className={
                mode === "screenshot"
                  ? "mode-button active"
                  : "mode-button"
              }

              onClick={() => {

                setMode(
                  "screenshot"
                );

                setError("");

              }}
            >
              🖼️ Screenshot
            </button>

          </div>

        )}

        {/* =====================================================
            MESSAGE ANALYZER
        ===================================================== */}

        {!result &&
          mode === "message" && (

            <section className="analyzer">

              <div className="input-header">

                <div>

                  <label>
                    Paste a suspicious message
                  </label>

                  <p className="input-help">
                    Don't know if it's
                    safe? Let ScamShield
                    investigate it.
                  </p>

                </div>

                <span className="input-status">
                  AI READY
                </span>

              </div>

              <textarea
                value={message}

                onChange={(e) => {

                  setMessage(
                    e.target.value
                  );

                  setError("");

                }}

                placeholder="Paste a suspicious SMS, WhatsApp message, email, job offer, payment request..."
              />

              <div className="character-count">
                {message.length} characters
              </div>

              <button
                className="analyze-button"

                onClick={
                  analyzeMessage
                }

                disabled={loading}
              >

                {loading
                  ? "🔄 Analyzing with AI..."
                  : "🔍 Analyze Message"}

              </button>

              <div className="demo-section">

                <div className="demo-header">

                  <span>
                    Quick demo
                  </span>

                  <span>
                    Try a sample
                  </span>

                </div>

                <div className="demo-buttons">

                  <button
                    onClick={() =>
                      loadDemo("job")
                    }
                  >
                    💼 Job Scam
                  </button>

                  <button
                    onClick={() =>
                      loadDemo("bank")
                    }
                  >
                    🏦 OTP Scam
                  </button>

                  <button
                    onClick={() =>
                      loadDemo("investment")
                    }
                  >
                    💰 Investment Scam
                  </button>

                </div>

              </div>

            </section>

          )}

        {/* =====================================================
            SCREENSHOT ANALYZER
        ===================================================== */}

        {!result &&
          mode === "screenshot" && (

            <section className="analyzer">

              <div className="input-header">

                <div>

                  <label>
                    Upload a suspicious screenshot
                  </label>

                  <p className="input-help">
                    WhatsApp, SMS, email,
                    social media or payment
                    screenshot.
                  </p>

                </div>

                <span className="input-status">
                  VISION AI
                </span>

              </div>

              <div className="upload-box">

                <input
                  id="screenshot-upload"
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                />

                <label
                  htmlFor="screenshot-upload"
                  className="upload-label"
                >

                  <div className="upload-icon">
                    🖼️
                  </div>

                  <strong>
                    Choose Screenshot
                  </strong>

                  <span>
                    PNG, JPG, JPEG or WEBP
                  </span>

                </label>

              </div>

              {imagePreview && (

                <div className="image-preview">

                  <img
                    src={imagePreview}
                    alt="Screenshot preview"
                  />

                  <button
                    className="remove-image"
                    onClick={
                      removeImage
                    }
                  >
                    ✕ Remove
                  </button>

                </div>

              )}

              <button
                className="analyze-button"

                onClick={
                  analyzeScreenshot
                }

                disabled={
                  loading ||
                  !imageFile
                }
              >

                {loading
                  ? "🔄 Analyzing Screenshot..."
                  : "🔍 Analyze Screenshot"}

              </button>

            </section>

          )}

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && !result && (

          <div className="error">
            ⚠️ {error}
          </div>

        )}

        {/* =====================================================
            RESULT
        ===================================================== */}

        {result && (

          <section className="result-card">

            {/* RESULT HEADER */}

            <div className="result-header">

              <div>

                <div className="result-source">

                  {result.extracted_text
                    ? "🖼️ SCREENSHOT ANALYSIS"
                    : "💬 MESSAGE ANALYSIS"}

                </div>

                <div
                  className={`risk-label ${getRiskClass(
                    result.risk_level
                  )}`}
                >

                  {result.risk_level ===
                    "CRITICAL" ||
                  result.risk_level ===
                    "HIGH"

                    ? "🚨 HIGH RISK"

                    : result.risk_level ===
                      "MEDIUM"

                    ? "⚠️ MEDIUM RISK"

                    : "🟢 LOW RISK"}

                </div>

                <h2>
                  {result.scam_type}
                </h2>

              </div>

              {/* SCORE RING */}

              <div
                className={`score-ring ${getRiskClass(
                  result.risk_level
                )}`}

                style={{
                  "--score":
                    `${result.risk_score * 3.6}deg`,
                }}
              >

                <div className="score-ring-inner">

                  <strong>
                    {result.risk_score}
                  </strong>

                  <span>
                    /100
                  </span>

                </div>

              </div>

            </div>

            <div className="risk-verdict">

              <span>
                AI Assessment
              </span>

              <strong>
                {getRiskMessage(
                  result.risk_score
                )}
              </strong>

            </div>

            {/* SUMMARY */}

            <div className="result-section">

              <h3>
                🔎 What we found
              </h3>

              <p className="summary">
                {result.summary}
              </p>

            </div>

            {/* EXTRACTED TEXT */}

            {result.extracted_text && (

              <div className="result-section extracted-section">

                <h3>
                  📝 Extracted Message
                </h3>

                <div className="extracted-text">
                  {result.extracted_text}
                </div>

              </div>

            )}

            {/* INDICATORS */}

            <div className="result-section">

              <h3>
                🚩 Why we're concerned
              </h3>

              <div className="indicator-list">

                {result.indicators?.map(
                  (indicator, index) => (

                    <div
                      className="indicator"
                      key={index}
                    >

                      <span className="indicator-icon">
                        🔴
                      </span>

                      <span>
                        {indicator}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* ACTIONS */}

            <div className="result-section action-section">

              <h3>
                🛡️ Recommended Actions
              </h3>

              <div className="action-list">

                {result.recommended_actions?.map(
                  (action, index) => (

                    <div
                      className="action"
                      key={index}
                    >

                      <span className="action-icon">
                        ✓
                      </span>

                      <span>
                        {action}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* CONFIDENCE */}

            <div className="confidence">

              <span>
                🤖 Gemini AI Confidence
              </span>

              <strong>
                {result.confidence}%
              </strong>

            </div>

            {/* =================================================
                RECOVERY AGENT
            ================================================= */}

            <div className="situation-section">

              <div className="agent-heading">

                <div className="agent-icon">
                  🧠
                </div>

                <div>

                  <div className="section-eyebrow">
                    RECOVERY AGENT
                  </div>

                  <h3>
                    What have you already done?
                  </h3>

                </div>

              </div>

              <p>
                Your answer helps ScamShield
                create a personalized safety plan.
              </p>

              <div className="situation-options">

                <label
                  className={
                    situation ===
                    "I only received the message"
                      ? "selected"
                      : ""
                  }
                >

                  <input
                    type="radio"
                    name="situation"
                    value="I only received the message"

                    checked={
                      situation ===
                      "I only received the message"
                    }

                    onChange={(e) =>
                      setSituation(
                        e.target.value
                      )
                    }
                  />

                  <span>
                    📩 I only received it
                  </span>

                </label>

                <label
                  className={
                    situation ===
                    "I clicked the link"
                      ? "selected"
                      : ""
                  }
                >

                  <input
                    type="radio"
                    name="situation"
                    value="I clicked the link"

                    checked={
                      situation ===
                      "I clicked the link"
                    }

                    onChange={(e) =>
                      setSituation(
                        e.target.value
                      )
                    }
                  />

                  <span>
                    🔗 I clicked the link
                  </span>

                </label>

                <label
                  className={
                    situation ===
                    "I entered my personal details"
                      ? "selected"
                      : ""
                  }
                >

                  <input
                    type="radio"
                    name="situation"
                    value="I entered my personal details"

                    checked={
                      situation ===
                      "I entered my personal details"
                    }

                    onChange={(e) =>
                      setSituation(
                        e.target.value
                      )
                    }
                  />

                  <span>
                    🪪 I entered my personal details
                  </span>

                </label>

                <label
                  className={
                    situation ===
                    "I shared an OTP"
                      ? "selected"
                      : ""
                  }
                >

                  <input
                    type="radio"
                    name="situation"
                    value="I shared an OTP"

                    checked={
                      situation ===
                      "I shared an OTP"
                    }

                    onChange={(e) =>
                      setSituation(
                        e.target.value
                      )
                    }
                  />

                  <span>
                    🔐 I shared an OTP
                  </span>

                </label>

                <label
                  className={
                    situation ===
                    "I made a payment"
                      ? "selected"
                      : ""
                  }
                >

                  <input
                    type="radio"
                    name="situation"
                    value="I made a payment"

                    checked={
                      situation ===
                      "I made a payment"
                    }

                    onChange={(e) =>
                      setSituation(
                        e.target.value
                      )
                    }
                  />

                  <span>
                    💳 I made a payment
                  </span>

                </label>

              </div>

              <button
                className="recovery-button"

                onClick={
                  generateRecoveryPlan
                }

                disabled={
                  recoveryLoading
                }
              >

                {recoveryLoading
                  ? "🧠 Creating Safety Plan..."
                  : "🛡️ Create My Safety Plan"}

              </button>

            </div>

            {/* =================================================
                RECOVERY PLAN
            ================================================= */}

            {recovery && (

              <div className="recovery-card">

                <div className="recovery-header">

                  <div>

                    <div className="section-eyebrow">
                      PERSONALIZED RESPONSE
                    </div>

                    <h2>
                      🛡️ Your Safety Plan
                    </h2>

                  </div>

                  <div className="recovery-status">

                    {
                      completedActions.length
                    }

                    /

                    {
                      recovery
                        .immediate_actions
                        ?.length || 0
                    }

                    {" "}done

                  </div>

                </div>

                {/* IMMEDIATE ACTIONS */}

                <div className="recovery-section">

                  <h3>
                    🚨 Do this now
                  </h3>

                  {recovery.immediate_actions?.map(
                    (action, index) => {

                      const completed =
                        completedActions.includes(
                          index
                        );

                      return (

                        <button
                          className={
                            completed
                              ? "recovery-item checklist completed"
                              : "recovery-item checklist"
                          }

                          key={index}

                          onClick={() =>
                            toggleAction(
                              index
                            )
                          }
                        >

                          <span>
                            {completed
                              ? "✓"
                              : "○"}
                          </span>

                          <span>
                            {action}
                          </span>

                        </button>

                      );

                    }
                  )}

                </div>

                {/* AVOID */}

                <div className="recovery-section">

                  <h3>
                    ⚠️ Avoid these actions
                  </h3>

                  {recovery.things_to_avoid?.map(
                    (item, index) => (

                      <div
                        className="recovery-item avoid"
                        key={index}
                      >

                        <span>
                          ✕
                        </span>

                        {item}

                      </div>

                    )
                  )}

                </div>

                {/* ACCOUNTS */}

                <div className="recovery-section">

                  <h3>
                    🔐 Accounts to secure
                  </h3>

                  {recovery.accounts_to_secure?.map(
                    (account, index) => (

                      <div
                        className="recovery-item"
                        key={index}
                      >

                        <span>
                          🔒
                        </span>

                        {account}

                      </div>

                    )
                  )}

                </div>

                {/* EVIDENCE */}

                <div className="recovery-section">

                  <h3>
                    📋 Evidence to preserve
                  </h3>

                  {recovery.evidence_to_preserve?.map(
                    (evidence, index) => (

                      <div
                        className="recovery-item"
                        key={index}
                      >

                        <span>
                          📌
                        </span>

                        {evidence}

                      </div>

                    )
                  )}

                </div>

                {/* WHY */}

                <div className="recovery-explanation">

                  <strong>
                    Why this matters
                  </strong>

                  <p>
                    {recovery.explanation}
                  </p>

                </div>

              </div>

            )}

            {/* ANALYZE ANOTHER */}

            <button
              className="again-button"

              onClick={
                analyzeAnother
              }
            >
              🔄 Analyze Another
            </button>

          </section>

        )}

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        <p>
          🛡️ ScamShield AI
        </p>

        <p>
          Detect. Understand. Recover.
        </p>

      </footer>

    </div>
  );
}

export default App;