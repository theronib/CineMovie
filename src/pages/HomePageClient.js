import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Client.css";
import api from "../api/AxiosConfig"; 
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";


export default function HomePageClient() {
    const [films, setFilms] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [search, setSearch] = useState("");
    const [searchField, setSearchField] = useState("title");

    const [currentPage, setCurrentPage] = useState(1);
    const filmsPerPage = 12;

    const navigate = useNavigate();

    useEffect(() => {
        loadFilms();
    }, []);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const loadFilms = async () => {
        try {
            const response = await api.get("/titles");
            setFilms(response.data);
        } catch (err) {
            console.error("Failed to load films", err);
        }
    };

    const filteredFilms = films.filter((film) => {
        const query = search.toLowerCase().split(' ').join('');

        if (!search.trim()) return true;

        switch (searchField) {
            case "title":
                return film.titleName?.toLowerCase().includes(query);
            case "actors":
                return film.actors?.some((actor) =>
                    actor.toLowerCase().includes(query)
                );
            case "genres":
                return film.genres?.some((genre) =>
                    genre.toLowerCase().includes(query)
                );
            case "directors":
                return film.director?.some((dir) =>
                    dir.toLowerCase().includes(query)
                );
            default:
                return false;
        }
    });

    const toggleFavorite = (filmId) => {
        if (favorites.includes(filmId)) {
            alert("You can delete this film from your favorites on favourite page");
        } else {
            setFavorites([...favorites, filmId]);
        }
    };

    const indexOfLastFilm = currentPage * filmsPerPage;
    const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
    const currentFilms = filteredFilms.slice(indexOfFirstFilm, indexOfLastFilm);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container py-4">
            <div className="search-wrapper mb-4 d-flex flex-column flex-md-row align-items-md-center gap-2">
                <div className="position-relative flex-grow-1">
                    <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
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
            </div>

            <h2 className="mt-5 mb-4">Other people also like</h2>
            <div className="row">
                {currentFilms.map((film) => (
                    <div key={film.id} className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4">
                        <Card
                            className="h-100 shadow-sm film-card"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/home/films/info/${film.id}`)}
                        >
                            <button
                                className={`btn btn-sm position-absolute top-0 end-0 m-2 ${favorites.includes(film.id) ? "btn-danger" : "btn-outline-danger"
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(film.id);
                                }}
                                title={favorites.includes(film.id) ? "Delete from favorites" : "Add to favourites"}
                            >
                                ❤️
                            </button>
                            <Card.Img
                                variant="top"
                                src={film.imageUrl ?
                                    `https://image.tmdb.org/t/p/w500${film.imageUrl}` :
                                    '/images/placeholder.png'}
                                alt={film.titleName}
                                style={{ height: "350px", objectFit: "cover" }}
                            />
                            <Card.Body>
                                <Card.Title className="text-truncate">{film.titleName}</Card.Title>
                                <Card.Text>
                                    ⭐ <strong>{film.rating}</strong>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                ))}

                <div className="d-flex justify-content-center mt-4">
                    <nav>
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                                    &laquo;
                                </button>
                            </li>

                            {Array.from({ length: Math.ceil(filteredFilms.length / filmsPerPage) })
                                .map((_, index) => index + 1)
                                .filter(
                                    (page) =>
                                        page === 1 ||
                                        page === Math.ceil(filteredFilms.length / filmsPerPage) ||
                                        (page >= currentPage - 2 && page <= currentPage + 2)
                                )
                                .map((page, i, arr) => {
                                    const prevPage = arr[i - 1];
                                    if (prevPage && page - prevPage > 1) {
                                        return (
                                            <React.Fragment key={page}>
                                                <li className="page-item disabled">
                                                    <span className="page-link">...</span>
                                                </li>
                                                <li className={`page-item ${currentPage === page ? "active" : ""}`}>
                                                    <button onClick={() => paginate(page)} className="page-link">
                                                        {page}
                                                    </button>
                                                </li>
                                            </React.Fragment>
                                        );
                                    }

                                    return (
                                        <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                                            <button onClick={() => paginate(page)} className="page-link">
                                                {page}
                                            </button>
                                        </li>
                                    );
                                })}

                            <li className={`page-item ${currentPage === Math.ceil(films.length / filmsPerPage) ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                                    &raquo;
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>

                {filteredFilms.length === 0 && (
                    <div className="col-12">
                        <div className="alert alert-warning text-center">Unfortunately no films were found 😢</div>
                    </div>
                )}
            </div>
        </div>
    );
}