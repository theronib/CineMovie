import logo from './logo.svg';
import './App.css';
import HomePageClient from "./pages/User/HomePageClient";
import FilmInfoPageClient from './pages/User/FilmInfoPageClient';
import Navbar from "./layout/Navbar";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import LoginPage from './pages/Authentication/LoginPage';
import RegisterPage from './pages/Authentication/RegisterPage';
import ProtectedRoute from "./pages/context/ProtectedRoute";
import { AuthProvider } from './pages/context/AuthProvider';
import { CookiesProvider } from "react-cookie";
import HomePageManager from './pages/Admin/AdminHomePageManager';
import UsersPage from './pages/Admin/UsersPage';
import FilmsPage from './pages/Admin/FilmsPage';
import ProfilePageClient from './pages/User/ProfilePageClient';
import AllReviewsPage from './pages/Admin/AllReviewsPage';
import ViewUser from './pages/Admin/ViewUser';
import UsersCommentsPage from './pages/Admin/UserCommentsPage';
import AddFilms from './pages/Admin/AddFilms';
import UpdateFilm from './pages/Admin/UpdateFilm';

function App() {
  return (
    <Router>
      <CookiesProvider>

        <AuthProvider>
          <Navbar />
          <Routes>

            <Route path="/"
              element={
                <ProtectedRoute>
                  <HomePageClient />
                </ProtectedRoute>
              }
            />

            <Route path="/home"
              element={
                <ProtectedRoute>
                  <HomePageClient />
                </ProtectedRoute>
              }
            />

            <Route path="/home/films/info/:id"
              element={
                <ProtectedRoute>
                  <FilmInfoPageClient />
                </ProtectedRoute>
              }
            />

            <Route path="/login"
              element={
                <LoginPage />
              }
            />

            <Route path="/register"
              element={
                <RegisterPage />
              }
            />

            <Route path="/user-page/profile"
              element={
                <ProtectedRoute>
                  <ProfilePageClient />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-page"
              element={
                <ProtectedRoute>
                  <HomePageManager />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-page/users"
              element={
                <ProtectedRoute>
                  <UsersPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-page/films"
              element={
                <ProtectedRoute>
                  <FilmsPage />
                </ProtectedRoute>
              }
            />


            <Route
              path="/admin-page/comments/"
              element={
                <ProtectedRoute>
                  <AllReviewsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-page/users/view_user/:id"
              element={
                <ProtectedRoute>
                  <ViewUser />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-page/users/comments/:id"
              element={
                <ProtectedRoute>
                  <UsersCommentsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-page/films/add"
              element={
                <ProtectedRoute>
                  <AddFilms />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-page/films/edit/:id"
              element={
                <ProtectedRoute>
                  <UpdateFilm />
                </ProtectedRoute>
              }
            />


          </Routes>
        </AuthProvider>

      </CookiesProvider>

    </Router>
  );
}


export default App;
