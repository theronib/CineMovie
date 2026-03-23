import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/AxiosConfig";
import "./AllReviewsPage.css";

export default function AllReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [films, setFilms]     = useState([]);
    const [users, setUsers]     = useState([]);

    const [userFilter, setUserFilter] = useState(null);
    const [filmFilter, setFilmFilter] = useState(null);

    useEffect(() => {
        loadReviews();
        loadFilms();
        loadUsers();
    }, []);

    const filmsMap = new Map(films.map((m) => [m.id, m.titleName]));
    const usersMap = new Map(users.map((m) => [m.userId, m.login]));

    const loadReviews = async () => {
        try { const r = await api.get("/comments"); setReviews(r.data); }
        catch (err) { console.error("Failed to load reviews", err); }
    };

    const loadFilms = async () => {
        try { const r = await api.get("/titles"); setFilms(r.data); }
        catch (err) { console.error("Failed to load films", err); }
    };

    const loadUsers = async () => {
        try { const r = await api.get("/users"); setUsers(r.data); }
        catch (err) { console.error("Failed to load users", err); }
    };

    const displayedReviews = reviews.filter(
        (r) =>
            (!userFilter || r.userId === userFilter) &&
            (!filmFilter || r.titleId === filmFilter)
    );

    const hasFilters = userFilter || filmFilter;

    return (
        <div className="reviews-admin-page">
            <div className="container py-5">

                <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                >
                    <h2 className="reviews-admin-title">Reviews Management</h2>
                </motion.div>

                <AnimatePresence>
                    {hasFilters && (
                        <motion.div
                            className="reviews-filters mb-4"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.22 }}
                        >
                            {userFilter && (
                                <span className="reviews-filter-chip user">
                                    <i className="bi bi-person"></i>
                                    {usersMap.get(userFilter)}
                                    <button onClick={() => setUserFilter(null)}>✕</button>
                                </span>
                            )}
                            {filmFilter && (
                                <span className="reviews-filter-chip film">
                                    <i className="bi bi-film"></i>
                                    {filmsMap.get(filmFilter)}
                                    <button onClick={() => setFilmFilter(null)}>✕</button>
                                </span>
                            )}
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
                                    <th>User</th>
                                    <th>Title</th>
                                    <th>Review</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedReviews.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="users-empty">No reviews found</td>
                                    </tr>
                                ) : (
                                    displayedReviews.map((review, index) => (
                                        <tr key={review.id} className="users-row">
                                            <td className="users-num">{index + 1}</td>
                                            <td>
                                                <div className="users-name">
                                                    {usersMap.get(review.userId) || "—"}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="reviews-film-name">
                                                    {filmsMap.get(review.titleId) || "—"}
                                                </div>
                                            </td>
                                            <td className="reviews-text-cell">
                                                <span className="reviews-info">{review.info}</span>
                                            </td>
                                            <td>
                                                <div className="users-actions">
                                                    <button
                                                        className="users-btn view"
                                                        onClick={() => setUserFilter(review.userId)}
                                                        title="All reviews by this user"
                                                    >
                                                        <i className="bi bi-person"></i>
                                                        <span>By user</span>
                                                    </button>
                                                    <button
                                                        className="users-btn comments"
                                                        onClick={() => setFilmFilter(review.titleId)}
                                                        title="All reviews for this film"
                                                    >
                                                        <i className="bi bi-film"></i>
                                                        <span>By film</span>
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