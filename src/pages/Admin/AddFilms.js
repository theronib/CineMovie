import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion, AnimatePresence } from "framer-motion";
import "./AddFilms.css";
import ReadMore from "../ReadMore";

export default function AddFilms() {
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    useEffect(() => { getFilms(page); }, [page]);

    const getFilms = async (pageNumber) => {
        setLoading(true);
        try {

            const res = await axios.request({
                method: "GET",
                url: `${process.env.REACT_APP_POPULAR_API_CALL}?page=${pageNumber}`,
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`,
                },
            });
            setFilms(res.data.results);
            setTotalPages(res.data.total_pages);
        } catch (err) {
            console.error("Error while getting films data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToDatabase = async (film) => {
        console.log("HERE 1")
        try {
            const token = localStorage.getItem("site");
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/titles`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                credentials: "include",
                body: JSON.stringify({
                    titleName: film.titleName,
                    genres: film.genres,
                    releaseYear: film.releaseYear,
                    rating: film.rating,
                    director: film.director,
                    actors: film.actors,
                    imageUrl: film.posterPath,
                    overview: film.overview,
                    keywords: null
                }),
            });

            if (!response.ok) {
                console.log("HERE 2")
                const token = localStorage.getItem("site");
                console.log(`token: ${token}`)
                const errorText = await response.text();
                throw new Error(errorText || "Failed to create film");
            }

            showMessage("Film added to database successfully", "success");
            setTimeout(() => setSelectedFilm(null), 1500);
        } catch (err) {
            console.log("HERE 3")
            console.error(err);
            showMessage("Failed to add film", "danger");
        }
    };

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(""), 3000);
    };

    const handleOpenFilm = async (film) => {
        try {
            const headers = {
                accept: "application/json",
                Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`,
            };

            const [creditsRes, detailsRes] = await Promise.all([
                axios.get(`${process.env.REACT_APP_MOVIE_API_CALL}/${film.id}/credits`, { headers }),
                axios.get(`${process.env.REACT_APP_MOVIE_API_CALL}/${film.id}`, { headers }),
            ]);

            const credits = creditsRes.data;
            const details = detailsRes.data;

            setSelectedFilm({
                director: credits.crew.filter((c) => c.job === "Director").map((d) => d.name),
                genres: details.genres.map((g) => g.name),
                actors: credits.cast.map((a) => a.name),
                titleName: film.title,
                overview: film.overview,
                releaseYear: film.release_date ? parseInt(film.release_date.split("-")[0]) : null,
                rating: Math.round(film.vote_average),
                posterPath: film.poster_path,
                keywords: film.keywords,
            });
        } catch (error) {
            console.error("Error while fetching film data:", error);
        }
    };

    if (loading) {
        return (
            <div className="addfilms-loading">
                <div className="addfilms-spinner" />
            </div>
        );
    }

    return (
        <div className="addfilms-page">
            <div className="container py-5">

                <motion.div
                    className="mb-5 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                >
                    <h2 className="addfilms-title">Popular Films</h2>
                </motion.div>

                <div className="row g-3">
                    {films.map((film, i) => (
                        <motion.div
                            key={film.id}
                            className="col-6 col-md-4 col-lg-3"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: i * 0.03 }}
                            onClick={() => handleOpenFilm(film)}
                        >
                            <div className="film-card h-100">
                                <div className="film-card-img-wrap">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
                                        className="card-img-top"
                                        alt={film.title}
                                        style={{ height: "280px", objectFit: "cover", width: "100%" }}
                                    />
                                    <button
                                        className="addfilms-add-overlay"
                                        onClick={() => handleOpenFilm(film)}
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="card-body">
                                    <div className="card-title">{film.title}</div>
                                    <p className="card-text">⭐ <strong>{film.vote_average.toFixed(1)}</strong></p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="d-flex justify-content-center align-items-center mt-5 gap-3">
                    <ul className="pagination mb-0">
                        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setPage(p => p - 1)}>«</button>
                        </li>
                        <li className="page-item disabled">
                            <span className="page-link addfilms-page-counter">{page} / {totalPages}</span>
                        </li>
                        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setPage(p => p + 1)}>»</button>
                        </li>
                    </ul>
                </div>
            </div>

            <AnimatePresence>
                {selectedFilm && (
                    <div className="films-modal-overlay" onClick={() => setSelectedFilm(null)}>
                        <motion.div
                            className="films-modal films-modal-lg"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.93 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.93 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="films-modal-header">
                                <span>{selectedFilm.titleName}</span>
                                <button className="films-modal-close" onClick={() => setSelectedFilm(null)}>✕</button>
                            </div>

                            <div className="films-modal-body">
                                <AnimatePresence>
                                    {message && (
                                        <motion.div
                                            className={`users-alert users-alert-${messageType} mb-4`}
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.22 }}
                                        >
                                            <span>{message}</span>
                                            <button className="users-alert-close" onClick={() => setMessage("")}>✕</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="row g-4">
                                    <div className="col-md-4 text-center">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500/${selectedFilm.posterPath}`}
                                            alt={selectedFilm.titleName}
                                            className="img-fluid"
                                            style={{ borderRadius: "var(--radius-card)", width: "100%", objectFit: "cover" }}
                                        />
                                    </div>
                                    <div className="col-md-8">
                                        <div className="films-modal-info-title">Information</div>

                                        <div className="films-modal-info-row">
                                            <span>Directors</span>
                                            <span>{selectedFilm.director?.join(", ") || "—"}</span>
                                        </div>
                                        <div className="films-modal-info-row">
                                            <span>Genres</span>
                                            <span>{selectedFilm.genres?.join(", ") || "—"}</span>
                                        </div>
                                        <div className="films-modal-info-row">
                                            <span>Year</span>
                                            <span>{selectedFilm.releaseYear}</span>
                                        </div>
                                        <div className="films-modal-info-row">
                                            <span>Rating</span>
                                            <span>⭐ {selectedFilm.rating}</span>
                                        </div>

                                        {selectedFilm.actors?.length > 0 && (
                                            <div className="films-modal-info-row" style={{ flexDirection: "column", gap: "0.25rem" }}>
                                                <span style={{ color: "var(--color-accent)", fontWeight: 600, fontSize: 13 }}>Actors</span>
                                                <span style={{ color: "var(--color-muted)", fontWeight: 300, fontSize: 13 }}>
                                                    <ReadMore text={selectedFilm.actors.join(", ")} maxLength={250} />
                                                </span>
                                            </div>
                                        )}

                                        {selectedFilm.overview && (
                                            <p className="films-modal-overview">
                                                <ReadMore text={selectedFilm.overview} maxLength={250} />
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="films-modal-footer">
                                <button className="films-modal-btn cancel" onClick={() => setSelectedFilm(null)}>
                                    Cancel
                                </button>
                                <button
                                    className="films-modal-btn edit"
                                    onClick={() => handleAddToDatabase(selectedFilm)}
                                >
                                    Add to database
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}