import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { db } from "./Firebase";

function Login(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();
        setError("");

        try {
            const q = query(collection(db, "users"), where("email", "==", email));
            const result = await getDocs(q);

            if (result.empty){
                setError("wrong");
                return;
            }

            const user = result.docs[0].data();
            const match = await bcrypt.compare(password, user.password);

            if (!match){
                setError("wrong");
                return;
            }

            navigate("/");

        } catch (err) {
            setError("error");
        }
    }

    return(
        <div className="auth_page">
            <div className="auth_box">
                <div className="auth_top">
                    <Link to="/signup" className="signup_btn">Sign up</Link>
                </div>

                <form className="auth_form" onSubmit={handleSubmit}>
                    <label>Your email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                    <label>Your password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    {error === "wrong" && (
                        <p className="auth_error">
                            Incorrect email or password. Please try again or <Link to="/signup">sign up</Link> for a free account.
                        </p>
                    )}

                    {error === "error" && (
                        <p className="auth_error">Something went wrong. Please try again.</p>
                    )}

                    <button type="submit" className="auth_btn">Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login