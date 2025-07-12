// src/pages/SearchPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import "./SearchPage.css";

function SearchPage() {
  const [domain, setDomain] = useState('');
  const [keywords, setKeywords] = useState('');
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: domain.trim(),
          keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMentors(data.mentors);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch mentors');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Veteran Talent Finder</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter domain (e.g., AI, React)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="Comma-separated keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={handleSearch} style={{ padding: '10px 20px' }}>
          Search
        </button>
      </div>

      {loading && <p>Loading mentors...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div
        className="mentor-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {mentors.map((mentor, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              borderRadius: '12px',
              padding: '15px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              backgroundColor: '#fff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <img
                src={mentor.avatar}
                alt="avatar"
                style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
              />
              <div>
                <h3 style={{ margin: 0 }}>{mentor.name}</h3>
                <small>{mentor.location}</small>
              </div>
            </div>

            <p style={{ fontSize: '14px' }}>{mentor.experience}</p>

            <div style={{ marginTop: '10px' }}>
              <strong>Source: </strong>
              <img src={mentor.sourceLogo} alt={mentor.source} style={{ width: '20px', verticalAlign: 'middle' }} />
              <span style={{ marginLeft: '5px' }}>{mentor.source}</span>
            </div>

            <div style={{ marginTop: '10px' }}>
              <strong>Confidence: </strong> {mentor.confidence}%
            </div>

            <div style={{ marginTop: '10px' }}>
              <strong>Willing to Mentor: </strong>{' '}
              {mentor.willingToMentor ? '✅ Yes' : '❌ No'}
            </div>

            <div style={{ marginTop: '10px' }}>
              <strong>Contact: </strong>
              {mentor.email && mentor.email !== 'Not Public' ? (
                <a href={`mailto:${mentor.email}`} style={{ color: 'blue' }}>
                  Email
                </a>
              ) : mentor.contactUrl ? (
                <a
                  href={mentor.contactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'green' }}
                >
                  Visit Profile
                </a>
              ) : (
                'Not available'
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;

