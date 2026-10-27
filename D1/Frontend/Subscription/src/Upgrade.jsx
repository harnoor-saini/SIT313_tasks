import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "http://localhost:3000";

const prices = {
  education: 199,
  pro: 399,
  premium: 699,
};

function Upgrade() {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan || "pro";

  const [form, setForm] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const cardNumber = form.cardNumber.replace(/\s/g, "");
    const expiryMatch = form.expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);

    if (!form.name.trim()) {
      setError("Please enter the cardholder name.");
      return;
    }

    if (!/^\d{16}$/.test(cardNumber)) {
      setError("Enter a 16-digit demo card number.");
      return;
    }

    if (!expiryMatch) {
      setError("Enter expiry in MM/YY format.");
      return;
    }

    const month = Number(expiryMatch[1]);
    const year = 2000 + Number(expiryMatch[2]);
    const now = new Date();

    if (
      year < now.getFullYear() ||
      (year === now.getFullYear() && month < now.getMonth() + 1)
    ) {
      setError("The card expiry date has passed.");
      return;
    }

    if (!/^\d{3,4}$/.test(form.cvv)) {
      setError("Enter a valid 3- or 4-digit demo CVV.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/upgrade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        throw new Error(
          data.error || data.message || "Unable to upgrade your subscription.",
        );
      }

      navigate("/pricing", {
        replace: true,
        state: { upgraded: true },
      });
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="upgrade_page">
      <section className="upgrade_card">
        <button
          type="button"
          className="upgrade_back"
          onClick={() => navigate("/pricing")}
        >
          ← Back to Pricing
        </button>

        <p className="pricing_label">SUBSCRIPTION CHECKOUT</p>
        <h1>Upgrade to Paid</h1>
        <p className="upgrade_description">
          Unlock the additional features offered by the Paid plan.
        </p>

        <div className="upgrade_summary">
          <span>Paid plan</span>
          <strong>₹{prices[plan]} / month</strong>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Cardholder name</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            autoComplete="cc-name"
            required
          />

          <label htmlFor="cardNumber">Demo card number</label>
          <input
            id="cardNumber"
            name="cardNumber"
            value={form.cardNumber}
            onChange={handleChange}
            inputMode="numeric"
            autoComplete="off"
            maxLength={19}
            placeholder="1234 5678 9012 3456"
            required
          />

          <div className="upgrade_form_row">
            <div>
              <label htmlFor="expiry">Expiry (MM/YY)</label>
              <input
                id="expiry"
                name="expiry"
                value={form.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                autoComplete="off"
                required
              />
            </div>

            <div>
              <label htmlFor="cvv">Demo CVV</label>
              <input
                id="cvv"
                name="cvv"
                value={form.cvv}
                onChange={handleChange}
                inputMode="numeric"
                autoComplete="off"
                maxLength={4}
                required
              />
            </div>
          </div>

          {error && (
            <p className="upgrade_error" role="alert">
              {error}
            </p>
          )}

          <button
            className="pricing_action upgrade_plan_button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Demo Upgrade"}
          </button>
        </form>

        <p className="upgrade_notice">
          Demo only: no real payment is processed. Use fictional details and
          never enter real card information.
        </p>
      </section>
    </main>
  );
}

export default Upgrade;
