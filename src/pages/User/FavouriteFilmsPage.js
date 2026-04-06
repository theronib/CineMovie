import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Spinner, Alert } from "react-bootstrap";
import api from "../../api/AxiosConfig";
import ReadMore from "../ReadMore";
import "./FavouriteFilmsPage.css";

export default function FavouriteFilmsPage() {
    const [favorites, setFavorites] = useState([]);
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);

    const [recommendedFilms, setRecommendedFilms] = useState([]);
    const [recommendationsLoading, setRecommendationsLoading] = useState(true);
    const [recommendationsError, setRecommendationsError] = useState(null);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    // Завантаження всіх фільмів
    useEffect(() => {
        const loadFilms = async () => {
            try {
                const response = await api.get("/titles");
                setFilms(response.data);
            } catch (err) {
                console.error("Failed to load films", err);
            }
        };
        loadFilms();
    }, []);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}/favs/${user.userId}`,
                    { credentials: "include" }
                );
                if (response.ok) {
                    const data = await response.json();
                    setFavorites(data);
                } else {
                    console.error("Error fetching favorites");
                }
            } catch (error) {
                console.error("Error fetching favourites:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, [user.userId]);


    useEffect(() => {
        if (favorites.length === 0 || films.length === 0) {
            setRecommendationsLoading(false);
            return;
        }

        const loadRecommendations = async () => {
            try {
                const favoriteFilms = films.filter(film =>
                    favorites.some(fav => fav.titleId === film.id)
                );
                const titles = favoriteFilms.map(f => f.titleName).filter(Boolean);

                if (titles.length === 0) {
                    setRecommendedFilms([]);
                    setRecommendationsLoading(false);
                    return;
                }

                const response = await fetch("http://localhost:5001/recommend/titles", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ titles, top_k: 12 }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch recommendations: ${response.status}`);
                }

                const data = await response.json();
                const matchedFilms = data.recommendations
                    ?.map(rec => films.find(f => f.id === rec.title_id))
                    .filter(Boolean) || [];

                setRecommendedFilms(matchedFilms);
            } catch (err) {
                console.error("Error fetching recommendations:", err);
                setRecommendationsError("Could not load recommendations.");
            } finally {
                setRecommendationsLoading(false);
            }
        };

        loadRecommendations();
    }, [favorites, films]);

    const favouriteFilms = films.filter(film =>
        favorites.some(fav => fav.titleId === film.id)
    );

    const handleRemoveFav = async (e, film) => {
        e.stopPropagation();
        try {
            const favRecord = favorites.find(fav => fav.titleId === film.id);
            if (!favRecord) return;
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/favs/${favRecord.favId}`,
                { method: "DELETE", credentials: "include" }
            );
            if (response.ok) {
                setFavorites(prev => prev.filter(fav => fav.titleId !== film.id));
            }
        } catch (err) {
            console.error("Error deleting favourite:", err);
        }
    };

    if (loading) {
        return (
            <div className="fav-page d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div className="fav-page container py-5">

            {/* ── Favourite films ── */}
            <h2>Favourite Films</h2>

            {favouriteFilms.length === 0 ? (
                <div className="fav-empty">
                    <h5>No favourite films yet</h5>
                    <p>Explore films and click the ❤️ icon to save them!</p>
                </div>
            ) : (
                <div className="row g-4">
                    {favouriteFilms.map(film => (
                        <div className="col-sm-6 col-md-4 col-lg-3" key={film.id}>
                            <Card
                                className="fav-film-card h-100"
                                onClick={() => navigate(`/home/films/info/${film.id}`)}
                            >
                                <button
                                    className="btn-fav-remove"
                                    title="Remove from favourites"
                                    onClick={(e) => handleRemoveFav(e, film)}
                                >
                                    ❤️
                                </button>
                                <Card.Img
                                    variant="top"
                                    src={
                                        film.imageUrl
                                            ? `https://image.tmdb.org/t/p/w500${film.imageUrl}`
                                            : "/images/placeholder.png"
                                    }
                                    alt={film.titleName}
                                    className="film-poster"
                                />
                                <Card.Body>
                                    <Card.Title className="text-truncate">{film.titleName}</Card.Title>
                                    <Card.Text>
                                        <ReadMore
                                            text={`${film.releaseYear} • ${film.genres?.join(", ") || "-"}`}
                                            maxLength={50}
                                        />
                                    </Card.Text>
                                    <Card.Text>⭐ <strong>{film.rating}</strong></Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            )}

            <hr className="section-divider" />

            {/* ── Recommendations ── */}
            <h2>Based on films you liked</h2>

            {recommendationsLoading ? (
                <div className="spinner-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : recommendationsError ? (
                <Alert variant="secondary" className="text-center">{recommendationsError}</Alert>
            ) : recommendedFilms.length === 0 ? (
                <Alert variant="secondary" className="text-center">No recommendations found.</Alert>
            ) : (
                <div className="row g-4">
                    {recommendedFilms.map(film => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-2" key={film.id}>
                            <Card
                                className="rec-film-card h-100"
                                onClick={() => navigate(`/home/films/info/${film.id}`)}
                            >
                                <Card.Img
                                    variant="top"
                                    src={
                                        film.imageUrl
                                            ? `https://image.tmdb.org/t/p/w500${film.imageUrl}`
                                            : "/images/placeholder.png"
                                    }
                                    alt={film.titleName}
                                    className="film-poster"
                                />
                                <Card.Body>
                                    <Card.Title className="text-truncate">{film.titleName}</Card.Title>
                                    <Card.Text>⭐ <strong>{film.rating}</strong></Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
