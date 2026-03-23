import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/AxiosConfig";

export default function ViewUser() {
    const [user, setUser] = useState({
        userName: "",
        login: "",
        state: false
    })

    const { id } = useParams();

    const [copied, setCopied] = useState(false);


    const handleCopyId = () => {
        navigator.clipboard.writeText(user.userId).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };


    useEffect(() => {
        loadUser();
    }, [id]);

    if (!user) {
        return (
            <div className="profile-page d-flex align-items-center justify-content-center">
                <p className="text-muted">No user data found. Please log in.</p>
            </div>
        );
    }

    const loadUser = async () => {
        try {
            const response = await api.get(`/users/${id}`);
            setUser(response.data)
        }
        catch (err) {
            console.error(err);
        }
    }


    const initials = user.userName
        ? user.userName.slice(0, 2).toUpperCase()
        : "??";

    const roleLabel = user.state ? "Manager" : "Client";
    const roleClass = user.state ? "role-badge manager" : "role-badge client";

    return (
        <div className="profile-page">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-7">

                        <div className="profile-hero mb-4">
                            <div className="profile-avatar">{initials}</div>
                            <div className="profile-hero-info">
                                <h2 className="profile-name">{user.userName}</h2>
                                <span className={roleClass}>{roleLabel}</span>
                            </div>
                        </div>

                        <div className="profile-card mb-3">
                            <div className="profile-section-label">Account details</div>

                            <div className="profile-field">
                                <span className="profile-field-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </span>
                                <div>
                                    <div className="profile-field-label">Full name</div>
                                    <div className="profile-field-value">{user.userName}</div>
                                </div>
                            </div>

                            <div className="profile-divider" />

                            <div className="profile-field">
                                <span className="profile-field-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </span>
                                <div>
                                    <div className="profile-field-label">Login</div>
                                    <div className="profile-field-value">@{user.login}</div>
                                </div>
                            </div>

                            <div className="profile-divider" />

                            <div className="profile-field">
                                <span className="profile-field-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                </span>
                                <div>
                                    <div className="profile-field-label">Role</div>
                                    <div className="profile-field-value">{roleLabel}</div>
                                </div>
                            </div>
                        </div>

                        <div className="profile-card mb-4">
                            <div className="profile-section-label">System info</div>
                            <div className="profile-field profile-id-field">
                                <span className="profile-field-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                                </span>
                                <div className="flex-grow-1 overflow-hidden">
                                    <div className="profile-field-label">User ID</div>
                                    <div className="profile-field-value profile-id-value">{user.userId}</div>
                                </div>
                                <button
                                    className={`profile-copy-btn ${copied ? "copied" : ""}`}
                                    onClick={handleCopyId}
                                    title="Copy ID"
                                >
                                    {copied ? (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    ) : (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="text-center small profile-footer">
                            © {new Date().getFullYear()} UKMACritic
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )

}