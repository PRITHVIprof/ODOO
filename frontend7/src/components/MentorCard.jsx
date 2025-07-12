import React from 'react';

const MentorCard = ({ mentor }) => {
  return (
    <div className="mentor-card" style={{ border: '1px solid #ccc', padding: '15px', margin: '10px', borderRadius: '10px' }}>
      <h2>{mentor.name}</h2>
      <p><strong>Email:</strong> {mentor.email}</p>
      <p><strong>Location:</strong> {mentor.location}</p>
      <p><strong>Experience:</strong> {mentor.experience}</p>
      <p><strong>Keywords:</strong> {mentor.keywords.join(', ')}</p>
      <p><strong>Confidence Score:</strong> {mentor.confidence}%</p>
    </div>
  );
};

export default MentorCard;
