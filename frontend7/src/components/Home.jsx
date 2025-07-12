// src/components/Home.js
import React, { useState } from 'react';
import './Home.css'; // Optional: you can create a separate CSS file or use App.css
import axios from 'axios';

const Home = () => {
  const [domain, setDomain] = useState('');
  const [keywords, setKeywords] = useState('');
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/search', {
        domain,
        keywords: keywords.split(',').map(k => k.trim())
      });
      setMentors(response.data.mentors);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter Domain (e.g., Cybersecurity)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Optional Keywords (comma-separated)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <button type="submit">Search Mentors</button>
      </form>

      {loading && <p>Searching for mentors...</p>}

      {mentors.length > 0 && mentors.map((mentor, index) => (
        <div className="mentor-card" key={index}>
          <h3>{mentor.name}</h3>
          <p><strong>Email:</strong> {mentor.email}</p>
          <p><strong>Location:</strong> {mentor.location}</p>
          <p><strong>Experience:</strong> {mentor.experience}</p>
          <p><strong>Expertise:</strong> {mentor.keywords.join(', ')}</p>
          <p><strong>Confidence Score:</strong> {mentor.confidence}%</p>
        </div>
      ))}

      {mentors.length === 0 && !loading && (
        <p>No mentors found. Try different keywords or domain.</p>
      )}
    </div>
  );
};

export default Home;
