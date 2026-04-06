import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/AxiosConfig";
import "./UserCommentsPage.css";

export default function UsersCommentsPage() {
    const { id } = useParams();
    const [message, setMessage]       = useState("");
    const [messageType, setMessageType] = useState("success");
    const [reviews, setReviews]       = useState([]);
    const [films, setFilms]           = useState([]);

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(""), 3000);
    };

    useEffect(() => {
        loadReviews();
        loadFilms();
    }, [id]);

    const filmsMap = new Map(films.map((m) => [m.id, m.titleName]));

    const loadReviews = async () => {
        try {
            const response = await api.get(`/comments/user/${id}`);
            setReviews(response.data);
        } catch (err) {
            console.error("Failed to load reviews", err);
        }
    };

    const loadFilms = async () => {
        try {
            const response = await api.get("/titles");
            setFilms(response.data);
        } catch (err) {
            console.error("Failed to load films", err);
        }
    };

    const deleteReview = async (userId, reviewId) => {
    };

    return (
        <div className="reviews-admin-page">
            <div className="container py-5">

                <motion.div
                    className="mb-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                >
                    <h2 className="reviews-admin-title">User's Reviews</h2>
                </motion.div>

                <motion.div
                    className="mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.08 }}
                >
                    <span className="comments-user-id">
                        <i className="bi bi-person-badge"></i>
                        {id}
                    </span>
                </motion.div>

                <AnimatePresence>
                    {message && (
                        <motion.div
                            className={`users-alert users-alert-${messageType} mb-4`}
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
                    transition={{ duration: 0.45, delay: 0.12 }}
                >
                    <div className="users-table-wrap">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>№</th>
                                    <th>Title</th>
                                    <th>Review</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="users-empty">No reviews found</td>
                                    </tr>
                                ) : (
                                    reviews.map((review, index) => (
                                        <tr key={review.id} className="users-row">
                                            <td className="users-num">{index + 1}</td>
                                            <td>
                                                <div className="users-name">
                                                    {filmsMap.get(review.titleId) || "—"}
                                                </div>
                                            </td>
                                            <td className="reviews-text-cell">
                                                <span className="reviews-info">{review.info}</span>
                                            </td>
                                            <td>
                                                <div className="users-actions">
                                                    <button
                                                        className="users-btn delete"
                                                        onClick={() => deleteReview(review.userId, review.id)}
                                                        title="Delete review"
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