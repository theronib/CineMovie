import { Link } from "react-router-dom";
import { useAuth } from "../pages/context/AuthProvider";
import "./Navbar.css";

export default function Navbar() {
    const { role, token, logout } = useAuth();


    return (
        <nav className="navbar navbar-expand-lg px-3">

            {role === null && token === null && (
                <Link className="navbar-brand" to="/login">
                    CINEMOVIE
                </Link>
            )}

            {role === "client" && (
                <Link className="navbar-brand" to="/home">
                    CINEMOVIE
                </Link>

            )}

            {role === "manager" && (
                <Link className="navbar-brand" to="/admin-page">
                    CINEMOVIE
                </Link>

            )}

            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    {/* <li className="nav-item">
                        <Link className="nav-link" to="/user-page/profile">My profile</Link>
                    </li> */}

                    {role === "user" && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/user-page/films/favourite">Favourite films</Link>
                        </li>
                    )}

                    {role === "manager" && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin-page/films">Films</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin-page/users">Users</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin-page/comments">Reviews</Link>
                            </li>
                        </>
                    )}
                </ul>

                {role !== null && (
                    <a className="btn btn-login" href="/user-page/profile">My profile</a>
                )}

                {role !== null && (
                    <button className="btn btn-login" onClick={logout}>
                        Log out
                    </button>
                )}

                {role === null && (
                    <Link className="btn btn-login" to="/login">
                        Log in
                    </Link>
                )}
            </div>
        </nav>
    );
}