import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./HomePage.css";
import QuestionCard from "../components/QuestionCard";

function HomePage() {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/questions")
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  const indexOfLast = currentPage * questionsPerPage;
  const indexOfFirst = indexOfLast - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  return (
    <div className="home-container">
      <div className="top-bar">
        <h1 className="logo">StackIt</h1>
        <div className="nav-actions">
          <Link to="/searchmentor">
            <button className="btn primary">Search Mentor</button>
          </Link>
          <Link to="/askquestion">
            <button className="btn primary">Ask New Question</button>
          </Link>
          <button className="btn outline">Login</button>
        </div>
      </div>

      <div className="filter-bar">
        <button className="btn light">Newest</button>
        <button className="btn light">Unanswered</button>
        <button className="btn light">More ▾</button>
        <input className="search-input" type="text" placeholder="Search..." />
      </div>

      <div className="question-list">
        {currentQuestions.map((q) => (
          <QuestionCard key={q._id || q.id} question={q} />
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
