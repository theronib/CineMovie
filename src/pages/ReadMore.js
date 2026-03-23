import React from "react";

export default function ReadMore({ text, maxLength = 200 }) {
    const [expanded, setExpanded] = React.useState(false);

    if (text.length <= maxLength) {
        return <p>{text}</p>;
    }

    const shortText = text.substring(0, maxLength) + "...";

    return (
        <p>
            {expanded ? text : shortText}{" "}
            <button
                onClick={() => setExpanded(!expanded)}
                className="btn btn-link p-0 m-0 align-baseline text-decoration-none"
            >
                {expanded ? "Read less" : "Read more"}
            </button>
        </p>
    );
}