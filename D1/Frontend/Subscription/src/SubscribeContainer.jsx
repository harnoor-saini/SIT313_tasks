import { useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SubscribeContainer() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubscribe() {
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setError("");
        setSuccess(data.message);
        setEmail("");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Could not reach the server. Please try again later.");
    }
  }

  return (
    <div className="subscribe-container">
      <p className="subscribe-title">SIGN UP FOR OUR DAILY INSIDER</p>

      <div className="subscribe-field">
        <input
          className={error ? "subscribe-email input-error" : "subscribe-email"}
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
        />
        {error && (
          <p className="error-text">
            <span className="error-icon">!</span>
            {error}
          </p>
        )}
      </div>

      <button className="subscribe-btn" onClick={handleSubscribe}>
        Subscribe
      </button>

      {success && <p className="subscribe-success">{success}</p>}
    </div>
  );
}

export default SubscribeContainer;
