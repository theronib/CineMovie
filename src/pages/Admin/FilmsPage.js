import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/AxiosConfig";
import { Link } from "react-router-dom";
import ReadMore from "../ReadMore";
import "./FilmsPage.css";

export default function FilmsPage() {
    const [films, setFilms] = useState([]);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const filmsPerPage = 12;

    const [search, setSearch] = useState("");
    const [searchField, setSearchField] = useState("title");

    const [showConfirm, setShowConfirm] = useState(false);
    const [filmToDelete, setFilmToDelete] = useState(null);

    useEffect(() => { loadFilms(); }, []);
    useEffect(() => { setCurrentPage(1); }, [search]);

    const loadFilms = async () => {
        try {
            const response = await api.get("/titles");
            setFilms(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredFilms = films.filter((film) => {
        const query = search.toLowerCase();
        if (!search.trim()) return true;
        switch (searchField) {
            case "title": return film.titleName?.toLowerCase().includes(query);
            case "actors": return film.actors?.some((a) => a.toLowerCase().includes(query.split(' ').join('')));
            case "genres": return film.genres?.some((g) => g.toLowerCase().includes(query.split(' ').join('')));
            case "directors": return film.director?.some((d) => d.toLowerCase().includes(query.split(' ').join('')));
            default: return false;
        }
    });

    const indexOfLastFilm = currentPage * filmsPerPage;
    const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
    const currentFilms = filteredFilms.slice(indexOfFirstFilm, indexOfLastFilm);
    const totalPages = Math.ceil(filteredFilms.length / filmsPerPage);
    const paginate = (p) => setCurrentPage(p);

    const confirmDelete = (film) => { setFilmToDelete(film); setShowConfirm(true); };

    const deleteFilm = async () => {
        if (!filmToDelete) return;
        try {
            const token = localStorage.getItem("site");

            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/titles/${filmToDelete.id}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
            if (response.ok) setFilms(films.filter((f) => f.id !== filmToDelete.id));
        } catch (err) {
            console.error("Error while deleting film:", err);
        } finally {
            setShowConfirm(false);
            setFilmToDelete(null);
        }
    };

    const pagesVisible = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
        (p) => p === 1 || p === totalPages || (p >= currentPage - 2 && p <= currentPage + 2)
    );

    return (
        <div className="films-admin-page">
            <div className="container py-5">

                <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                >
                    <h2 className="films-admin-title">Films Management</h2>
                </motion.div>

                <motion.div
                    className="search-wrapper mb-4 d-flex flex-column flex-md-row align-items-md-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.08 }}
                >
                    <div className="position-relative flex-grow-1">
                        <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                        <input
                            type="text"
                            className="form-control ps-5"
                            placeholder={`Search by ${searchField}...`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="form-select"
                        style={{ maxWidth: "180px" }}
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                    >
                        <option value="title">Title</option>
                        <option value="actors">Actors</option>
                        <option value="genres">Genres</option>
                        <option value="directors">Directors</option>
                    </select>
                </motion.div>

                <motion.div
                    className="mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.14 }}
                >
                    <Link to="/admin-page/films/add" className="films-add-btn">
                        <i className="bi bi-plus-lg"></i>
                        Add new film
                    </Link>
                </motion.div>

                {loading && (
                    <div className="text-center py-5">
                        <Spinner animation="border" style={{ color: "var(--color-accent)" }} />
                    </div>
                )}

                {error && (
                    <div className="users-alert users-alert-danger mb-4">{error}</div>
                )}

                {!loading && !error && (
                    <>
                        <div className="row g-3">
                            {currentFilms.map((film, i) => (
                                <motion.div
                                    key={film.id}
                                    className="col-6 col-sm-4 col-md-3 col-lg-2"
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, delay: i * 0.03 }}
                                >
                                    <div
                                        className="film-card h-100"
                                        onClick={() => setSelectedFilm(film)}
                                    >
                                        <div className="film-card-img-wrap">
                                            <img
                                                src={film.imageUrl
                                                    ? `https://image.tmdb.org/t/p/w500${film.imageUrl}`
                                                    : '/images/placeholder.png'}
                                                alt={film.titleName}
                                                className="card-img-top"
                                                style={{ height: "260px", objectFit: "cover", width: "100%" }}
                                            />
                                        </div>
                                        <div className="card-body">
                                            <div className="card-title">{film.titleName}</div>
                                            <p className="card-text">
                                                <ReadMore
                                                    text={`${film.releaseYear} • ${film.genres
                                                        ? film.genres.join(', ').replace(/([a-z])([A-Z])/g, "$1 $2")
                                                        : '-'}`}
                                                    maxLength={50}
                                                />
                                            </p>
                                            <p className="card-text">
                                                ⭐ <strong>{film.rating}</strong>
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="d-flex justify-content-center mt-5">
                            <ul className="pagination">
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => paginate(currentPage - 1)}>«</button>
                                </li>
                                {pagesVisible.map((page, i, arr) => {
                                    const prev = arr[i - 1];
                                    return (
                                        <React.Fragment key={page}>
                                            {prev && page - prev > 1 && (
                                                <li className="page-item disabled">
                                                    <span className="page-link">…</span>
                                                </li>
                                            )}
                                            <li className={`page-item ${currentPage === page ? "active" : ""}`}>
                                                <button className="page-link" onClick={() => paginate(page)}>{page}</button>
                                            </li>
                                        </React.Fragment>
                                    );
                                })}
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => paginate(currentPage + 1)}>»</button>
                                </li>
                            </ul>
                        </div>
                    </>
                )}
            </div>

            <AnimatePresence>
                {showConfirm && (
                    <div className="films-modal-overlay" onClick={() => setShowConfirm(false)}>
                        <motion.div
                            className="films-modal"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.93 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.93 }}
                            transition={{ duration: 0.22 }}
                        >
                            <div className="films-modal-header">
                                <span>Confirm Deletion</span>
                                <button className="films-modal-close" onClick={() => setShowConfirm(false)}>✕</button>
                            </div>
                            <div className="films-modal-body">
                                Are you sure you want to delete{" "}
                                <strong style={{ color: "var(--color-milk)" }}>{filmToDelete?.titleName}</strong>?
                            </div>
                            <div className="films-modal-footer">
                                <button className="films-modal-btn cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
                                <button className="films-modal-btn delete" onClick={deleteFilm}>Delete</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
                                <div className="row g-4">
                                    <div className="col-md-5">
                                        <img
                                            src={selectedFilm.imageUrl
                                                ? `https://image.tmdb.org/t/p/w500${selectedFilm.imageUrl}`
                                                : '/images/placeholder.png'}
                                            alt={selectedFilm.titleName}
                                            className="img-fluid rounded"
                                            style={{ borderRadius: "var(--radius-card)", width: "100%", objectFit: "cover" }}
                                        />
                                    </div>
                                    <div className="col-md-7">
                                        <div className="films-modal-info-title">Information</div>
                                        <div className="films-modal-info-row"><span>Year</span><span>{selectedFilm.releaseYear}</span></div>
                                        <div className="films-modal-info-row">
                                            <span>Genres</span>
                                            <span>{selectedFilm.genres?.join(', ').replace(/([a-z])([A-Z])/g, "$1 $2") || '—'}</span>
                                        </div>
                                        <div className="films-modal-info-row">
                                            <span>Actors</span>
                                            <span>{selectedFilm.actors?.join(', ').replace(/([a-z])([A-Z])/g, "$1 $2") || '—'}</span>
                                        </div>
                                        <div className="films-modal-info-row">
                                            <span>Directors</span>
                                            <span>{selectedFilm.director?.join(', ').replace(/([a-z])([A-Z])/g, "$1 $2") || '—'}</span>
                                        </div>
                                        <div className="films-modal-info-row">
                                            <span>Rating</span>
                                            <span>⭐ {selectedFilm.rating}</span>
                                        </div>
                                        {selectedFilm.overview && (
                                            <p className="films-modal-overview">{selectedFilm.overview}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="films-modal-footer">
                                <Link
                                    to={`/admin-page/films/edit/${selectedFilm.id}`}
                                    className="films-modal-btn edit"
                                >
                                    Edit film
                                </Link>

                                <button
                                    className="films-modal-btn delete"
                                    onClick={() => {
                                        setSelectedFilm(null);
                                        confirmDelete(selectedFilm);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}