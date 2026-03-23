import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './LoginPage.css';
import {Link, useNavigate} from "react-router-dom";

export default function RegisterPage({ onRegister }) {
    const [name, setName] = useState("");
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [managerRole, setManagerRole] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const validate = () => {
        if (!name) return "Enter your name";
        if (!email) return "Enter your email";
        if (!login) return "Create your login";
        const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!re.test(email)) return "Wrong email format";
        if (!password) return "Enter your password";
        if (password.length < 6) return "Password must be at least 6 characters";
        if (password !== confirmPassword) return "Passwords do not match.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login: login, email: email, name: name, password: password, state: managerRole })
            });
            const res = await response.json();

            if (res) {
                alert("You registered successfully!");
                navigate("/login");
            }


            if (onRegister) onRegister({ name, email });
        } catch (err) {
            console.error(err);
            setError("Registration failed. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container py-4 login-page">
            <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-12 col-md-10 col-lg-8">
                    <div className="card shadow-sm">
                        <div className="row g-0">
                            <div className="col-12 col-md-6">
                                <div className="card-body p-4">
                                    <h5 className="card-title mb-3 title-one">Registration of {managerRole ? "manager" : "client"}</h5>

                                    {error && (
                                        <div className="alert alert-danger py-2" role="alert">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Name</label>
                                            <input
                                                id="name"
                                                type="text"
                                                className="form-control"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Your name"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Login</label>
                                            <input
                                                id="login"
                                                type="text"
                                                className="form-control"
                                                value={login}
                                                onChange={(e) => setLogin(e.target.value)}
                                                placeholder="Your login"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input
                                                id="email"
                                                type="email"
                                                className="form-control"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="name@example.com"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <div className="input-group">
                                                <input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    className="form-control"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => setShowPassword((s) => !s)}
                                                >
                                                    {showPassword ? "Hide" : "Show"}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="confirmPassword" className="form-label">Confirm your
                                                password</label>
                                            <input
                                                id="confirmPassword"
                                                type={showPassword ? "text" : "password"}
                                                className="form-control"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <div
                                                className="d-flex align-items-center gap-3 justify-content-center"
                                            >
                                                <span>Client</span>
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        name="state"
                                                        checked={managerRole}
                                                        onChange={(e) => setManagerRole(e.target.checked)}
                                                        type="checkbox"
                                                        id="flexSwitchCheckDefault"
                                                    />
                                                </div>
                                                <span>Manager</span>
                                            </div>
                                        </div>

                                        <div className="d-grid mb-3">
                                            <button className="btn btn-success login-button" type="submit"
                                                    disabled={loading}>
                                                {loading ? (
                                                    <span className="spinner-border spinner-border-sm" role="status"
                                                          aria-hidden="true"></span>
                                                ) : (
                                                    "Register"
                                                )}
                                            </button>
                                        </div>

                                        <div className="text-center">
                                            <small>
                                                Already have an account? <Link to="/login">Log in</Link>
                                            </small>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-3 small text-muted">
                        © {new Date().getFullYear()} UkmaCritic
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}
