// src/components/QuestionCard.jsx
import './QuestionCard.css';

function QuestionCard({ question }) {
  return (
    <div className="question-card">
      <h2>{question.title}</h2>
      <p>{question.description}</p>
    </div>
  );
}

export default QuestionCard;
