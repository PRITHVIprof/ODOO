import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./HomePage.css";

function QuestionPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/questions/${id}`)
      .then(res => setQuestion(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/questions/${id}/answers`, {
        text: answerText,
        image
      });
      setAnswerText("");
      setImage("");
      alert("✅ Answer submitted!");
      // refresh answers
      const res = await axios.get(`http://localhost:5000/api/questions/${id}`);
      setQuestion(res.data);
    } catch {
      alert("❌ Failed to submit answer");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result); // base64
    reader.readAsDataURL(file);
  };

  if (!question) return <p>Loading...</p>;

  return (
    <div className="home-container">
      <h2>{question.title}</h2>
      <p>{question.description}</p>
      <div className="question-tags">
        {question.tags.map((tag, i) => <span className="tag" key={i}>{tag}</span>)}
      </div>

      <h3>Answers:</h3>
      <div className="question-list">
        {question.answers?.map((ans, i) => (
          <div key={i} className="question-card">
            <p>{ans.text}</p>
            {ans.image && <img src={ans.image} alt="Uploaded" style={{ maxWidth: "200px" }} />}
            <div className="user-info">Posted on {new Date(ans.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <h3>Write an Answer</h3>
      <form onSubmit={handleAnswerSubmit} className="question-card">
        <textarea
          placeholder="Type your answer here..."
          rows={5}
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
        />

        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {image && <img src={image} alt="preview" style={{ maxWidth: "150px", marginTop: "10px" }} />}

        <button type="submit" className="btn primary" style={{ marginTop: "10px" }}>
          Submit Answer
        </button>
      </form>
    </div>
  );
}

export default QuestionPage;
