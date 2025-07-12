import { useState } from "react";
import "../pages/HomePage.css";
import axios from "axios";

function QuestionCard({ question }) {
  const [showAnswers, setShowAnswers] = useState(false);
  const [fullQuestion, setFullQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [image, setImage] = useState("");

  const fetchAnswers = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/questions/${question._id}`);
      setFullQuestion(res.data);
      setShowAnswers(true);
    } catch (err) {
      console.error("Error loading answers:", err);
    }
  };

  const refreshAnswers = async () => {
    const res = await axios.get(`http://localhost:5000/api/questions/${question._id}`);
    setFullQuestion(res.data);
  };

  const handleLike = async (index) => {
    await axios.post(`http://localhost:5000/api/questions/${question._id}/answers/${index}/vote`, {
      vote: "like"
    });
    refreshAnswers();
  };

  const handleDislike = async (index) => {
    await axios.post(`http://localhost:5000/api/questions/${question._id}/answers/${index}/vote`, {
      vote: "dislike"
    });
    refreshAnswers();
  };

  const handleAccept = async (index) => {
    await axios.post(`http://localhost:5000/api/questions/${question._id}/accept/${index}`);
    refreshAnswers();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!answerText) return alert("Please write something.");

    try {
      await axios.post(`http://localhost:5000/api/questions/${question._id}/answers`, {
        text: answerText,
        image: image,
        createdBy: "Anonymous" // or use logged in user later
      });

      setAnswerText("");
      setImage("");
      refreshAnswers();
    } catch (err) {
      console.error("Failed to submit answer:", err);
      alert("Error submitting answer");
    }
  };

  return (
    <div className="question-card">
      <div className="question-top">
        <h2 className="question-title">{question.title}</h2>
        <span className="answer-count">{question.answers?.length || 0} ans</span>
      </div>

      <p className="question-desc">{question.description?.slice(0, 150)}...</p>

      <div className="question-tags">
        {(question.tags || []).map((tag, i) => (
          <span key={i} className="tag">{tag}</span>
        ))}
      </div>

      <div className="user-info">User: {question.createdBy || "@username"}</div>

      <button onClick={fetchAnswers} className="btn small-btn">
        {showAnswers ? "Hide" : "Ans"}
      </button>

      {showAnswers && fullQuestion && (
        <>
          <div className="answer-list">
            {fullQuestion.answers.length === 0 ? (
              <p className="no-answers">No answers yet.</p>
            ) : (
              fullQuestion.answers.map((ans, i) => (
                <div
                  key={i}
                  className={`answer-item ${fullQuestion.acceptedAnswerIndex === i ? "accepted-answer" : ""}`}
                >
                  <p>{ans.text}</p>
                  {ans.image && (
                    <img src={ans.image} alt="attached" style={{ maxWidth: "150px", marginTop: "10px" }} />
                  )}
                  <div className="answer-actions">
                    <button onClick={() => handleLike(i)}>👍 {ans.likes}</button>
                    <button onClick={() => handleDislike(i)}>👎 {ans.dislikes}</button>
                    <button onClick={() => handleAccept(i)}>✅ Accept</button>
                  </div>
                  <div className="answer-meta">by {ans.createdBy}</div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAnswerSubmit} className="answer-form">
            <textarea
              rows={4}
              placeholder="Write your answer..."
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && <img src={image} alt="preview" style={{ maxWidth: "150px", marginTop: "10px" }} />}
            <button type="submit" className="btn primary" style={{ marginTop: "10px" }}>
              Submit Answer
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default QuestionCard;
