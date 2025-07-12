import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Question from './components/Question';
import AnswerList from './components/AnswerList';
import AnswerForm from './components/AnswerForm';
import Sidebar from './components/Sidebar';
import './styles.css';

function App() {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch question data from backend
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/questions/1');
        setQuestion(response.data);
      } catch (err) {
        setError('Failed to load question. Please try again later.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestion();
  }, []);

  // Function to submit new answer
  const handleSubmitAnswer = async (newAnswer) => {
    try {
      // Submit to backend
      await axios.post('http://localhost:5000/api/questions/1/answers', {
        answer: newAnswer
      });
      
      // Update local state
      setQuestion(prev => ({
        ...prev,
        answers: [...prev.answers, newAnswer]
      }));
    } catch (err) {
      console.error('Error submitting answer:', err);
      alert('Failed to submit answer. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="container" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading question...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <Header />
        <div className="container" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="content">
        <div className="container">
          <div className="main-content">
            <Question question={question} />
            <AnswerList answers={question.answers} />
            <AnswerForm onSubmit={handleSubmitAnswer} />
          </div>
          <Sidebar />
        </div>
      </main>
    </div>
  );
}

export default App;