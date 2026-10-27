
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (name.trim().split(/\s+/).length < 2) {
            setError("Please enter your first and last name.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    data.error ||
                    "Registration failed. Please try again."
                );
                return;
            }

            navigate("/login");
        } catch (err) {
            setError(
                "Cannot connect to the server. Make sure the backend is running."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth_page">
            <div className="auth_box signup_box">
                <h3 className="signup_title">
                    Create a DEV@Deakin Account
                </h3>

                <form className="signup_form" onSubmit={handleSubmit}>
                    <div className="signup_row">
                        <label>Name*</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="signup_row">
                        <label>Email*</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="signup_row">
                        <label>Password*</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="signup_row">
                        <label>Confirm password*</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            required
                        />
                    </div>

                    {error && (
                        <p className="auth_error">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="auth_btn"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Create"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Signup;
