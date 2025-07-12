import React from 'react';
import '../styles.css';

const AnswerList = ({ answers }) => (
  <div className="answers-container">
    <div className="answers-header">
      <h2 className="answers-title">Answers</h2>
      <div className="answers-count">{answers.length}</div>
    </div>
    
    {answers.map((answer, index) => (
      <div className="answer" key={index}>
        <div className="answer-voting">
          <button className="vote-btn">▲</button>
          <div className="vote-count">{Math.floor(Math.random() * 20) + 1}</div>
          <button className="vote-btn">▼</button>
        </div>
        
        <div className="answer-content">
          <div className="answer-body">
            {typeof answer === 'string' ? (
              // For string answers (like the initial ones)
              <p>{answer}</p>
            ) : (
              // For object-based answers (if you expand later)
              <>
                {answer.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </>
            )}
          </div>
          
          <div className="answer-meta">
            <div className="answer-author">
              <div className="author-name">
                User {index + 1}
              </div>
              <div className="author-time">
                answered {index === 0 ? '2 hours ago' : '1 hour ago'}
              </div>
            </div>
            
            <div className="answer-actions">
              <span className="action-link">Share</span>
              <span className="action-link">Edit</span>
              <span className="action-link">Follow</span>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default AnswerList;