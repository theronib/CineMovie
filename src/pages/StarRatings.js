import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function StarRating({ rating, onChange, max = 10 }) {
    const stars = [];

    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= max; i++) {
        let starClass = "bi bi-star";
        if (i <= fullStars) starClass = "bi bi-star-fill";
        else if (i === fullStars + 1 && halfStar) starClass = "bi bi-star-half";

        stars.push(
            <i
                key={i}
                className={`${starClass} text-warning`}
                style={{ cursor: "pointer", fontSize: "1.5rem" }}
                onClick={() => onChange(i)}
            ></i>
        );
    }

    return <div className="d-flex align-items-center gap-1">{stars}</div>;
}
