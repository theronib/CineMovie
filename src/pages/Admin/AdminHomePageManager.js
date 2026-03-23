import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Film, Users, MessageSquare } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Manager.css";

export default function HomePageManager() {
    const navigate = useNavigate();

    const sections = [
        {
            title: "Managing films",
            description: "Add, update, or delete movies in the catalog.",
            icon: <Film size={32} color="var(--color-accent)" />,
            path: "/admin-page/films",
        },
        {
            title: "Users",
            description: "View user info, their comments, or delete clients.",
            icon: <Users size={32} color="var(--color-accent)" />,
            path: "/admin-page/users",
        },
        {
            title: "Reviews",
            description: "Review and moderate user reviews.",
            icon: <MessageSquare size={32} color="var(--color-accent)" />,
            path: "/admin-page/comments",
        },
    ];

    return (
        <div className="manager-page">
            <div className="container">

                <motion.div
                    className="text-center mb-5"
                    initial={{ opacity: 0, y: -24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="manager-title">Manager panel</h1>
                </motion.div>

                <div className="row justify-content-center g-4">
                    {sections.map((section, i) => (
                        <motion.div
                            key={i}
                            className="col-12 col-md-6 col-lg-4"
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: i * 0.1 }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <div className="manager-card card h-100">
                                <div className="card-body d-flex flex-column align-items-center text-center">
                                    <div className="manager-icon-wrap">
                                        {section.icon}
                                    </div>
                                    <h5 className="manager-card-title">{section.title}</h5>
                                    <p className="manager-card-desc">{section.description}</p>
                                    <button
                                        className="manager-btn btn mt-auto"
                                        onClick={() => navigate(section.path)}
                                    >
                                        Follow →
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
}