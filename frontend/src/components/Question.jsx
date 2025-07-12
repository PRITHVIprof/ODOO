import React from 'react';
import Tag from './Tag';
import '../styles.css';

const Question = ({ question }) => (
  <div className="question-container">
    <div className="question-header">
      <h1 className="question-title">{question.title}</h1>
      
      <div className="question-meta">
        <div>
          <span>Asked today</span>
          <span> • Viewed 42 times</span>
        </div>
      </div>
      
      <div className="question-tags">
        {question.tags.map((tag, index) => (
          <Tag key={index} name={tag} />
        ))}
      </div>
    </div>
    
    <div className="question-body">
      <p className="question-description">
        {question.description}
      </p>
      
      <div className="question-example">
        <p>
          <strong>Example:</strong><br />
          "Column 1 containing First name, and column 2 consists of last name I want to combine."
        </p>
      </div>
    </div>
  </div>
);

export default Question;