// src/components/AnswerForm.jsx
import React, { useState } from 'react';
import '../styles.css';

const AnswerForm = () => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim()) {
      // Submit logic would go here
      console.log("Submitted answer:", answer);
      setAnswer('');
    }
  };

  return (
    <form className="answer-form" onSubmit={handleSubmit}>
      <h3 className="form-title">Submit Your Answer</h3>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="answer-textarea"
        placeholder="Write your answer here..."
        rows={4}
        required
      />
      <button type="submit" className="submit-button">
        Submit Your Answer
      </button>
    </form>
  );
};

export default AnswerForm;