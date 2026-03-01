import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Client.css";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";


export default function HomePageClient() {
    const [films] = useState([
        { id: 1, titleName: "Inception", releaseYear: 2010, genres: ["Action", "SciFi", "Thriller"], rating: 8.8, imageUrl: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg", actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt"], director: ["Christopher Nolan"] },
        { id: 2, titleName: "The Dark Knight", releaseYear: 2008, genres: ["Action", "Crime", "Drama"], rating: 9.0, imageUrl: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg", actors: ["Christian Bale", "Heath Ledger"], director: ["Christopher Nolan"] },
        { id: 3, titleName: "Interstellar", releaseYear: 2014, genres: ["Adventure", "Drama", "SciFi"], rating: 8.6, imageUrl: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", actors: ["Matthew McConaughey", "Anne Hathaway"], director: ["Christopher Nolan"] },
        { id: 4, titleName: "The Shawshank Redemption", releaseYear: 1994, genres: ["Drama"], rating: 9.3, imageUrl: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", actors: ["Tim Robbins", "Morgan Freeman"], director: ["Frank Darabont"] },
        { id: 5, titleName: "Pulp Fiction", releaseYear: 1994, genres: ["Crime", "Drama"], rating: 8.9, imageUrl: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", actors: ["John Travolta", "Uma Thurman"], director: ["Quentin Tarantino"] },
        { id: 6, titleName: "The Matrix", releaseYear: 1999, genres: ["Action", "SciFi"], rating: 8.7, imageUrl: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", actors: ["Keanu Reeves", "Laurence Fishburne"], director: ["Lana Wachowski", "Lilly Wachowski"] },
        { id: 7, titleName: "Fight Club", releaseYear: 1999, genres: ["Drama", "Thriller"], rating: 8.8, imageUrl: "/2lECpi35Hnbpa4y46JX0aY3AWTy.jpg", actors: ["Brad Pitt", "Edward Norton"], director: ["David Fincher"] },
        { id: 8, titleName: "The Lord of the Rings: The Fellowship of the Ring", releaseYear: 2001, genres: ["Adventure", "Fantasy"], rating: 8.8, imageUrl: "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg", actors: ["Elijah Wood", "Ian McKellen"], director: ["Peter Jackson"] },
        { id: 9, titleName: "Goodfellas", releaseYear: 1990, genres: ["Crime", "Drama"], rating: 8.7, imageUrl: "/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg", actors: ["Ray Liotta", "Robert De Niro"], director: ["Martin Scorsese"] },
        { id: 10, titleName: "Schindler's List", releaseYear: 1993, genres: ["Biography", "Drama", "History"], rating: 9.0, imageUrl: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg", actors: ["Liam Neeson", "Ben Kingsley"], director: ["Steven Spielberg"] },
        { id: 11, titleName: "The Silence of the Lambs", releaseYear: 1991, genres: ["Crime", "Drama", "Thriller"], rating: 8.6, imageUrl: "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg", actors: ["Jodie Foster", "Anthony Hopkins"], director: ["Jonathan Demme"] },
        { id: 12, titleName: "Parasite", releaseYear: 2019, genres: ["Comedy", "Drama", "Thriller"], rating: 8.5, imageUrl: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", actors: ["Song Kang-ho", "Lee Sun-kyun"], director: ["Bong Joon-ho"] },
        { id: 13, titleName: "Whiplash", releaseYear: 2014, genres: ["Drama", "Music"], rating: 8.5, imageUrl: "/7fn624j5lj3xTme2SgiLCeuedmO.jpg", actors: ["Miles Teller", "J.K. Simmons"], director: ["Damien Chazelle"] },
        { id: 14, titleName: "Gladiator", releaseYear: 2000, genres: ["Action", "Adventure", "Drama"], rating: 8.5, imageUrl: "/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg", actors: ["Russell Crowe", "Joaquin Phoenix"], director: ["Ridley Scott"] },
    ]);
    const [favorites, setFavorites] = useState([]);
    const [search, setSearch] = useState("");
    const [searchField, setSearchField] = useState("title");

    const [currentPage, setCurrentPage] = useState(1);
    const filmsPerPage = 12;

    const navigate = useNavigate();

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

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
            {/*<div className="flex flex-wrap gap-2 mt-4" style={{display: "flex", justifyContent: "center"}}>*/}
            {/*    {genres.map((genre) => (*/}
            {/*        <span*/}
            {/*            key={genre}*/}
            {/*            className={`genre-chip ${selectedGenre === genre ? "active" : ""}`}*/}
            {/*            onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}*/}
            {/*        >*/}
            {/*          {genre}*/}
            {/*        </span>*/}
            {/*    ))}*/}
            {/*</div>*/}

            {/* <RecommendationsSection
                key={favorites.length}
                favoriteFilms={films.filter(f => favorites.includes(f.id))}
                allFilms={films}
            /> */}

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
                            onClick={() => navigate(`/user-page/films/info/${film.id}`)}
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
                                {/* <Card.Text className="text-muted mb-1">
                                    <ReadMore text={
                                        `${film.releaseYear} • ${film.genres ?
                                            film.genres.join(', ').replace(/([a-z])([A-Z])/g, "$1 $2") : '-'}`
                                    } maxLength={50}/>
                                </Card.Text> */}
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