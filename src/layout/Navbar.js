import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg px-3">
            <Link className="navbar-brand" to="/">
                CINEMOVIE
            </Link>

            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link" to="/user-page/films/favourite">Favourite films</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/user-page/profile">My profile</Link>
                    </li>
                </ul>

                <Link className="btn btn-login" to="/login">
                    Log in
                </Link>
            </div>
        </nav>
    );
}