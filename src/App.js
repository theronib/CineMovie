import logo from './logo.svg';
import './App.css';
import HomePageClient from "./pages/HomePageClient";
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
      </Routes>
    </Router>
  );
}


export default App;
