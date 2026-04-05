import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/AxiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Client.css";
import "./FilmPage.css";

export default function FilmInfoPageClient() {
    const { id } = useParams();
    const [film, setFilm] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState(0);
    const [favorites, setFavorites] = useState([]);

    const [sortOption, setSortOption] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");

    const sortedReviews = reviews.slice().sort((a, b) => {
        let compare = 0;

        if (sortOption === "date") {
            compare = new Date(a.creationDate) - new Date(b.creationDate);
        } else if (sortOption === "rating") {
            compare = a.rating - b.rating;
        }

        return sortOrder === "asc" ? compare : -compare;
    });

    // useEffect(() => {
    //     loadFilm();
    //     loadReviews();
    // }, [id]);

    useEffect(() => {
        loadFilm();
        loadReviews();
        loadFavorites();  // <-- додаємо тут
    }, [id]);

    const loadFilm = async () => {
        try {
            const response = await api.get(`/titles/${id}`);
            setFilm(response.data);
        } catch (err) {
            console.error("Failed to load film", err);
        }
    };

    const loadReviews = async () => {
        try {
            const response = await api.get(`/comments/title/${id}`);
            const reviewsData = response.data;

            const userIds = [...new Set(reviewsData.map(r => r.userId))];

            const usersData = await Promise.all(
                userIds.map(uid => api.get(`/users/${uid}`).then(res => res.data))
            );

            const userMap = {};
            usersData.forEach(user => {
                userMap[user.userId] = user.userName; 
            });

            console.log("Fetched users for reviews:", usersData);

            console.log("User map for reviews:", userMap);

            const reviewsWithNames = reviewsData.map(r => ({
                ...r,
                userName: userMap[r.userId] || "Anonym"
            }));

            console.log("Reviews with user names:", reviewsWithNames);

            setReviews(reviewsWithNames);
        } catch (err) {
            console.error("Failed to load reviews", err);
        }
    };
    // const loadReviews = async () => {
    //     try {
    //         const response = await api.get(`/comments/title/${id}`);
    //         setReviews(response.data);
    //     } catch (err) {
    //         console.error("Failed to load reviews", err);
    //     }
    // };

    // const toggleFavorite = () => {
    //     if (favorites.includes(id)) {
    //         setFavorites(favorites.filter((fid) => fid !== id));
    //     } else {
    //         setFavorites([...favorites, id]);
    //     }
    // };

    const loadFavorites = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;

        try {
            const response = await api.get(`/favs/${user.userId}`);
            const favIds = response.data.map(fav => fav.titleId);
            setFavorites(favIds);
        } catch (err) {
            console.error("Failed to load favorites", err);
        }
    };

    const toggleFavorite = async () => {
        const token = localStorage.getItem("site");
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.userId;

        try {
            if (favorites.includes(id)) {
                // Видаляємо з фаворитів
                await api.delete(`/favs/${id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                setFavorites(prev => prev.filter(fid => fid !== id));
            } else {
                // Додаємо в фаворити
                await api.post(`/favs`, {
                    userId: userId,
                    titleId: id
                }, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                setFavorites(prev => [...prev, id]);
            }
        } catch (err) {
            console.error("Failed to toggle favorite", err);
        }
    };



    const handleAddReview = async (e) => {
        e.preventDefault();
        if (newReview.trim() === "") return;

        const token = localStorage.getItem("site");
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.userId;
        const titleId = film?.id;

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        userId: userId,
                        titleId: titleId,
                        rating: Number(rating),
                        info: newReview,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }


            setNewReview("");
            setRating(0);
            loadReviews();
        } catch (err) {
            console.error("Failed to add review", err);
        }
    };

    if (!film) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    return (
        <div className="container py-5 film-info-container">
            <div className="row align-items-start">
                <div className="col-md-4 mb-4 mb-md-0 text-center">
                    <img
                        src={film.imageUrl ?
                            `https://image.tmdb.org/t/p/w500${film.imageUrl}` :
                            '/images/placeholder.png'}
                        alt={film.titleName}
                        className="img-fluid rounded shadow-lg"
                    />
                    <button
                        className={`btn mt-3 ${favorites.includes(id) ? "btn-danger" : "btn-outline-danger"}`}
                        onClick={toggleFavorite}
                    >
                        ❤️ {favorites.includes(id) ? "Already in favourites" : "Add to favourites"}
                    </button>
                </div>

                <div className="col-md-8">
                    <h2 className="fw-bold mb-3">{film.titleName}</h2>
                    <div className="d-flex align-items-center mb-3">
                        <span className="badge bg-warning text-dark me-2">⭐ {film.rating}</span>
                        <span className="text-muted">{film.releaseYear}</span>
                    </div>

                    <p className="text-muted">{film.overview}</p>

                    <div className="mb-2">
                        <strong>Genres:</strong>{" "}
                        {film.genres ? film.genres.map((genre, idx) => (
                            <span key={idx} className="badge bg-secondary me-1">{genre.replace(/([a-z])([A-Z])/g, "$1 $2")}</span>
                        )) : "-"}
                    </div>

                    <div className="mb-2">
                        <strong>Directors:</strong>{" "}
                        {film.director ? film.director.join(", ").replace(/([a-z])([A-Z])/g, "$1 $2") : '-'}
                    </div>

                    <div className="mb-2">
                        <strong>Actors:</strong>{" "}
                        {film.actors ? film.actors.join(", ").replace(/([a-z])([A-Z])/g, "$1 $2") : '-'}
                    </div>

                    <div className="mb-2">
                        <strong>Regions:</strong>{" "}
                        {film.regions ? film.regions.join(", ").replace(/([a-z])([A-Z])/g, "$1 $2") : '-'}
                    </div>
                </div>
            </div>

            <div className="reviews-section mt-5">
                <h4 className="fw-bold mb-3">Reviews</h4>

                <form onSubmit={handleAddReview} className="mb-4">
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Your review</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            placeholder="Write something..."
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Rating</label>
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${rating >= star ? "filled" : ""}`}
                                    onClick={() => setRating(star)}
                                    style={{ cursor: "pointer", fontSize: "1.5rem", color: rating >= star ? "#FFD700" : "#ccc" }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <small className="text-muted ms-2">{rating} / 5</small>
                    </div>

                    <button className="btn btn-primary">Add review</button>
                </form>

                <div className="mb-3 d-flex gap-2 align-items-center">
                    <label>Sort by:</label>
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="form-select w-auto"
                    >
                        <option value="date">Date</option>
                        <option value="rating">Rating</option>
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="form-select w-auto"
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>

                {sortedReviews.length === 0 ? (
                    <div className="alert alert-secondary">There are no reviews yet</div>
                ) : (
                    <div className="list-group">
                        {sortedReviews.map((r, idx) => (
                            <div key={idx} className="list-group-item mb-2 rounded shadow-sm review-body">
                                <div className="d-flex justify-content-between">
                                    <strong className="title-name" >{r.userName || "Anonym"}</strong>
                                    <span className="text-warning">⭐ {r.rating}</span>
                                </div>
                                <p className="mb-0">{r.info}</p>
                                <small className="text-muted">
                                    {new Date(r.creationDate).toLocaleString()}
                                </small>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
