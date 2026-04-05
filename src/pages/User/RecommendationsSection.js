import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import ReadMore from "../../films/ReadMore";

export default function RecommendationsSection({ favoriteFilms, allFilms }) {
    const [recommendedFilms, setRecommendedFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!favoriteFilms || favoriteFilms.length === 0) {
            setLoading(false);
            return;
        }

        const loadRecommendations = async () => {
            try {
                const titles = favoriteFilms
                    .map(f => f.titleName)
                    .filter(title => typeof title === "string" && title.trim() !== "");

                if (titles.length === 0) {
                    setRecommendedFilms([]);
                    setLoading(false);
                    return;
                }

                const response = await fetch("http://localhost:8080/recommend", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ titles }),
                    credentials: "include",
                });

                if (!response.ok) throw new Error("Failed to fetch recommendations");

                const data = await response.json();

                const recommendedIds = Array.isArray(data.recommended_title_ids) ? data.recommended_title_ids : [];

                const matchedFilms = recommendedIds
                    .map(id => allFilms.find(f => f.id === id))
                    .filter(f => f);

                setRecommendedFilms(matchedFilms);
            } catch (err) {
                console.error("Error fetching recommendations:", err);
                setError("Could not load recommendations 😢");
            } finally {
                setLoading(false);
            }
        };

        loadRecommendations();
    }, [favoriteFilms, allFilms]);

    return (
        <div className="mt-5">
            <h2 className="mb-4">Based on the films you liked</h2>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center py-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : error ? (
                <Alert variant="secondary" className="text-center">{error}</Alert>
            ) : recommendedFilms.length === 0 ? (
                <Alert variant="secondary" className="text-center">No recommendations found 😢</Alert>
            ) : (
                <div className="row g-4">
                    {recommendedFilms.map((film) => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4" key={film.id}>
                            <Card className="shadow-sm h-100">
                                <Card.Img
                                    variant="top"
                                    src={film.imageUrl ?
                                        `https://image.tmdb.org/t/p/w500${film.imageUrl}` :
                                        '/images/placeholder.png'}
                                    alt={film.titleName}
                                    className="film-poster"
                                />
                                <Card.Body>
                                    <Card.Title className="text-truncate">{film.titleName}</Card.Title>
                                    <Card.Text className="text-muted mb-1">
                                        <ReadMore text={
                                            `${film.releaseYear} • ${film.genres ?
                                                film.genres.join(', ').replace(/([a-z])([A-Z])/g, "$1 $2") : '-'}`
                                        } maxLength={50}/>

                                    </Card.Text>
                                    <Card.Text>
                                        ⭐ <strong>{film.rating}</strong>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
