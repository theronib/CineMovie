import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/AxiosConfig";
import "./UsersPage.css";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await api.get("/users");
            setUsers(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteUser = async (id, name) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (!confirmed) {
            showMessage(`User ${name} was not deleted`, "warning");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/users/${id}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            });

            if (response.ok) {
                await loadUsers();
                showMessage(`User ${name} was deleted`, "success");
            } else {
                console.error("Error while deleting the user " + name);
            }
        } catch (err) {
            console.error("Failed to delete user:", err);
            showMessage(`Failed to delete user ${name}`, "danger");
        }
    };

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(""), 3000);
    };

    return (
        <div className="users-page">
            <div className="container py-5">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="mb-4"
                >
                    <h2 className="users-title">User Management</h2>
                </motion.div>

                <AnimatePresence>
                    {message && (
                        <motion.div
                            className={`users-alert users-alert-${messageType}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                        >
                            <span>{message}</span>
                            <button className="users-alert-close" onClick={() => setMessage("")}>✕</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    className="users-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.1 }}
                >
                    <div className="users-table-wrap">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>№</th>
                                    <th>Name</th>
                                    <th>Login</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="users-empty">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => (
                                        <tr key={user.id} className="users-row">
                                            <td className="users-num">{index + 1}</td>
                                            <td>
                                                <div className="users-name">{user.userName}</div>
                                                <div className="users-email">{user.email}</div>
                                            </td>
                                            <td className="users-login">@{user.login}</td>
                                            <td>
                                                <span className={`users-role-badge ${user.state ? "manager" : "client"}`}>
                                                    {user.state ? "Manager" : "Client"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="users-actions">
                                                    <Link
                                                        to={`/admin-page/users/view_user/${user.userId}`}
                                                        className="users-btn view"
                                                        title="View"
                                                    >
                                                        <span>View</span>
                                                    </Link>

                                                    {!user.state && (
                                                        <Link
                                                            to={`/admin-page/users/comments/${user.userId}`}
                                                            className="users-btn comments"
                                                            title="Comments"
                                                        >
                                                            <span>Comments</span>
                                                        </Link>
                                                    )}

                                                    <button
                                                        className="users-btn delete"
                                                        onClick={() => deleteUser(user.userId, user.name)}
                                                        title="Delete"
                                                    >
                                                        <span>Delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}