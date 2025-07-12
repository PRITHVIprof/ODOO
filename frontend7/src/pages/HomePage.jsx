import { useState, useEffect } from "react";
import axios from "axios";
import "./HomePage.css";
import QuestionCard from "../components/QuestionCard";

function HomePage() {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  // 🔁 Fetch data from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/questions")
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  // 🔁 Pagination logic
  const indexOfLast = currentPage * questionsPerPage;
  const indexOfFirst = indexOfLast - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  return (
    <div className="container">
      <header className="header">
        <h1 className="logo">StackIt</h1>
        <div>
          <button className="ask-btn">Ask Question</button>
          <button className="login-btn">Login</button>
        </div>
      </header>

      <div className="toolbar">
        <button>Newest</button>
        <button>Unanswered</button>
        <input placeholder="Search..." />
      </div>

      <div className="question-list">
        {currentQuestions.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={i + 1 === currentPage ? "active-page" : ""}
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
