
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    data.error ||
                    "Incorrect email or password. Please try again."
                );
                return;
            }

            if (!data.token) {
                setError("Login succeeded, but the server did not return a token.");
                return;
            }

            localStorage.setItem("token", data.token);
            window.dispatchEvent(new Event("auth-change"));

            navigate("/");
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
            <div className="auth_box">
                <div className="auth_top">
                    <Link to="/signup" className="signup_btn">
                        Sign up
                    </Link>
                </div>

                <form className="auth_form" onSubmit={handleSubmit}>
                    <label>Your email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Your password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && (
                        <p className="auth_error">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="auth_btn"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
