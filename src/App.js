import logo from './logo.svg';
import './App.css';
import HomePageClient from "./pages/HomePageClient";
import FilmInfoPageClient from './pages/FilmInfoPageClient';
import Navbar from "./layout/Navbar";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/home"
          element={
            <HomePageClient />
          }
        />

        <Route
          path="/home/films/info/:id"
          element={
            <FilmInfoPageClient />
          }
        />
      </Routes>
    </Router>
  );
}


export default App;
