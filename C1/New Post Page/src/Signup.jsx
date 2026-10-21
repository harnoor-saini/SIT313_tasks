import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { db } from "./Firebase";

function Signup(){

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();
        setError("");

        if (name.trim().split(" ").length < 2){
            setError("Please enter your first and last name.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            setError("Please enter a valid email address.");
            return;
        }

        if (password.length < 8){
            setError("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword){
            setError("Passwords do not match.");
            return;
        }

        try {
            const q = query(collection(db, "users"), where("email", "==", email));
            const existing = await getDocs(q);

            if (!existing.empty){
                setError("An account with this email already exists.");
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await addDoc(collection(db, "users"), {
                name: name.trim(),
                email: email,
                password: hashedPassword
            });

            navigate("/login");

        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    }

    return(
        <div className="auth_page">
            <div className="auth_box signup_box">
                <h3 className="signup_title">Create a DEV@Deakin Account</h3>

                <form className="signup_form" onSubmit={handleSubmit}>
                    <div className="signup_row">
                        <label>Name*</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="signup_row">
                        <label>Email*</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="signup_row">
                        <label>Password*</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div className="signup_row">
                        <label>Confirm password*</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>

                    {error && <p className="auth_error">{error}</p>}

                    <button type="submit" className="auth_btn">Create</button>
                </form>
            </div>
        </div>
    )
}

export default Signup