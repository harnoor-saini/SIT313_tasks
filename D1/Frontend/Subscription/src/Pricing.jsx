import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000";

const PLANS = [
  {
    id: "free",
    label: "GET STARTED",
    name: "Free",
    description: "The essentials for getting started.",
    price: "₹0",
    period: "/ forever",
    features: [
      "Create and share posts",
      "Access free content",
      "Standard image uploads",
      "Basic profile",
    ],
  },
  {
    id: "education",
    label: "FOR STUDENTS",
    name: "Education",
    description: "A plan designed for learning and academic projects.",
    price: "₹199",
    period: "/ month",
    recommended: true,
    features: [
      "Everything in Free",
      "More room for academic posts",
      "Larger image uploads",
      "Student project showcase",
      "Enhanced profile features",
    ],
  },
  {
    id: "pro",
    label: "FOR CREATORS",
    name: "Pro",
    description: "More flexibility for regular content creators.",
    price: "₹399",
    period: "/ month",
    features: [
      "Everything in Free",
      "More posts per month",
      "Larger image uploads",
      "Access to paid content",
      "Enhanced profile features",
    ],
  },
];

function Pricing() {
  const navigate = useNavigate();

  const [currentPlan, setCurrentPlan] = useState("free");
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoggedIn(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
          }

          setLoggedIn(false);
          setCurrentPlan("free");
          setIsPaid(false);
          return;
        }

        const data = await response.json();
        const user = data.user;

        setLoggedIn(true);

        if (user.plan === "paid") {
          setIsPaid(true);
          setCurrentPlan(user.selectedPlan || "free");
        } else {
          setIsPaid(false);
          setCurrentPlan("free");
        }
      } catch {
        setError("Unable to load your subscription status.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSelect = (planId) => {
    setError("");

    if (!loggedIn) {
      navigate("/login");
      return;
    }

    navigate("/upgrade", { state: { plan: planId } });
  };

  const getButton = (plan) => {
    if (currentPlan === plan.id) {
      return {
        className: "pricing_action current_plan_button",
        text: "Current Plan",
        disabled: true,
      };
    }

    if (isPaid) {
      return {
        className: "pricing_action current_plan_button",
        text: "Already on a Paid Plan",
        disabled: true,
      };
    }

    return {
      className: "pricing_action upgrade_plan_button",
      text: `Choose ${plan.name}`,
      disabled: false,
    };
  };

  return (
    <main className="pricing_page">
      <header className="pricing_header">
        <p className="pricing_label">SIMPLE, FLEXIBLE PRICING</p>
        <h1>Choose your plan</h1>
        <p>
          Find the right plan to share ideas and create posts on DEV@Deakin.
        </p>
      </header>

      {error && (
        <p className="pricing_error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="pricing_loading">Loading your subscription...</p>
      ) : (
        <section className="pricing_plans">
          {PLANS.map((plan) => {
            const button = getButton(plan);
            const isSelected = currentPlan === plan.id;

            return (
              <article
                key={plan.id}
                className={`pricing_card${
                  plan.recommended ? " recommended_plan" : ""
                }${isSelected ? " selected_plan" : ""}`}
              >
                {plan.recommended && (
                  <span className="recommended_badge">STUDENT PICK</span>
                )}

                <p className="pricing_label">{plan.label}</p>
                <h2>{plan.name}</h2>
                <p className="pricing_description">{plan.description}</p>

                <p className="pricing_price">
                  {plan.price} <span>{plan.period}</span>
                </p>

                <ul className="pricing_features">
                  {plan.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>

                <button
                  className={button.className}
                  disabled={button.disabled}
                  onClick={() => handleSelect(plan.id)}
                >
                  {button.text}
                </button>
              </article>
            );
          })}
        </section>
      )}

      <p className="pricing_note">
        Subscription features are for demonstration purposes. No real payment
        will be processed.
      </p>
    </main>
  );
}

export default Pricing;