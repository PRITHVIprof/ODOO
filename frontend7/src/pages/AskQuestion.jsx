import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./HomePage.css"; // Reuse same styling for consistency

function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return alert("Please fill all fields");
    const tagArray = tags.split(',').map(tag => tag.trim());

    try {
      await axios.post("http://localhost:5000/api/questions", {
        title,
        description,
        tags: tagArray,
      });
      alert("✅ Question submitted!");
      navigate("/"); // Go back to homepage
    } catch (err) {
      alert("❌ Failed to submit question.");
      console.error(err);
    }
  };

  return (
    <div className="home-container">
      <h2>Ask a New Question</h2>
      <form onSubmit={handleSubmit} className="question-card">
        <label>Title</label>
        <input
          type="text"
          placeholder="Enter question title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Description</label>
        <textarea
          rows={5}
          placeholder="Describe your question in detail"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Tags (comma separated)</label>
        <input
          type="text"
          placeholder="e.g. react, database, api"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <button type="submit" className="btn primary" style={{ marginTop: "10px" }}>
          Submit Question
        </button>
      </form>
    </div>
  );
}

export default AskQuestion;
