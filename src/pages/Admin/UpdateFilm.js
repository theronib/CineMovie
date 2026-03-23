import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/AxiosConfig";
import TagInput from "../TagInput";
import StarRating from "../StarRatings";
import "./UpdateFilm.css";

export default function UpdateFilm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [film, setFilm]             = useState({});
    const [message, setMessage]       = useState("");
    const [messageType, setMessageType] = useState("success");
    const [loading, setLoading]       = useState(true);
    const [errors, setErrors]         = useState({});

    useEffect(() => { loadFilm(); }, [id]);

    const loadFilm = async () => {
        try {
            const response = await api.get(`/titles/${id}`);
            const d = response.data;
            setFilm({
                title:         d.titleName,
                genres:        d.genres,
                year:          d.releaseYear,
                rating:        d.rating,
                director:      d.director,
                actors:        d.actors,
                regions:       d.regions,
                tmdb_image_url: d.imageUrl,
                overview:      d.overview,
            });
            setLoading(false);
        } catch (err) {
            console.error(err);
            showMessage("Failed to load film", "danger");
            setLoading(false);
        }
    };

    const onInputChange = (e) => setFilm({ ...film, [e.target.name]: e.target.value });

    const validate = () => {
        const newErrors = {};
        if (!film.title?.trim())         newErrors.title         = "Title is required";
        if (!film.overview?.trim())      newErrors.overview      = "Overview is required";
        if (!film.tmdb_image_url?.trim()) newErrors.tmdb_image_url = "Poster path is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const token = localStorage.getItem("site");
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/titles/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                credentials: "include",
                body: JSON.stringify({
                    titleName:   film.title,
                    genres:      film.genres,
                    releaseYear: film.year,
                    rating:      film.rating,
                    director:    film.director,
                    actors:      film.actors,
                    imageUrl:    film.tmdb_image_url,
                    overview:    film.overview,
                    regions:     film.regions,
                }),
            });
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || "Failed to update film");
            }
            showMessage("Film updated successfully", "success");
            setTimeout(() => navigate("/admin-page/films"), 1500);
        } catch (err) {
            console.error(err);
            showMessage("Failed to update film", "danger");
        }
    };

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(""), 3000);
    };

    if (loading) {
        return (
            <div className="addfilms-loading">
                <div className="addfilms-spinner" />
            </div>
        );
    }

    return (
        <div className="update-film-page">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-7">

                        <motion.div
                            className="mb-4"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45 }}
                        >
                            <h2 className="reviews-admin-title">
                                <i className="bi bi-pencil-square me-2" style={{ fontSize: "1.4rem" }}></i>
                                Update Film
                            </h2>
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
                            className="update-film-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.1 }}
                        >
                            <form onSubmit={onSubmit} noValidate>

                                <div className="uf-field">
                                    <label htmlFor="tmdb_image_url" className="uf-label">TMDB Poster URL</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.tmdb_image_url ? "uf-invalid" : ""}`}
                                        id="tmdb_image_url"
                                        name="tmdb_image_url"
                                        value={film.tmdb_image_url || ""}
                                        onChange={onInputChange}
                                    />
                                    {errors.tmdb_image_url && <div className="uf-error">{errors.tmdb_image_url}</div>}
                                </div>

                                <div className="uf-field">
                                    <label htmlFor="title" className="uf-label">Title</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.title ? "uf-invalid" : ""}`}
                                        id="title"
                                        name="title"
                                        value={film.title || ""}
                                        onChange={onInputChange}
                                    />
                                    {errors.title && <div className="uf-error">{errors.title}</div>}
                                </div>

                                <div className="uf-field">
                                    <TagInput
                                        label="Genres"
                                        values={film.genres || []}
                                        onChange={(genres) => setFilm({ ...film, genres })}
                                    />
                                </div>

                                <div className="uf-field">
                                    <TagInput
                                        label="Actors"
                                        values={film.actors || []}
                                        onChange={(actors) => setFilm({ ...film, actors })}
                                    />
                                </div>

                                <div className="uf-field">
                                    <TagInput
                                        label="Directors"
                                        values={film.director || []}
                                        onChange={(director) => setFilm({ ...film, director })}
                                    />
                                </div>

                                <div className="uf-field">
                                    <TagInput
                                        label="Regions"
                                        values={film.regions || []}
                                        onChange={(regions) => setFilm({ ...film, regions })}
                                    />
                                </div>

                                <div className="uf-field">
                                    <label htmlFor="year" className="uf-label">Year</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="year"
                                        name="year"
                                        value={film.year || ""}
                                        onChange={onInputChange}
                                    />
                                </div>

                                <div className="uf-field">
                                    <label className="uf-label">Rating</label>
                                    <StarRating
                                        rating={film.rating || 0}
                                        onChange={(value) => setFilm({ ...film, rating: value })}
                                        max={10}
                                    />
                                    <small className="uf-hint">{film.rating?.toFixed(1)} / 10</small>
                                </div>

                                <div className="uf-field">
                                    <label htmlFor="overview" className="uf-label">Overview</label>
                                    <textarea
                                        className={`form-control ${errors.overview ? "uf-invalid" : ""}`}
                                        id="overview"
                                        name="overview"
                                        rows={4}
                                        value={film.overview || ""}
                                        onChange={onInputChange}
                                    />
                                    {errors.overview && <div className="uf-error">{errors.overview}</div>}
                                </div>

                                <div className="uf-actions">
                                    <Link to="/admin-page/films" className="films-modal-btn cancel">
                                        <i className="bi bi-arrow-left-circle me-1"></i> Back
                                    </Link>
                                    <button type="submit" className="films-modal-btn edit">
                                        <i className="bi bi-check-circle me-1"></i> Save Changes
                                    </button>
                                </div>

                            </form>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    );
}