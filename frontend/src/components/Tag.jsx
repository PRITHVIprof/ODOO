// src/components/Tag.jsx
import React from 'react';
import '../styles.css';

const Tag = ({ name }) => (
  <span className="tag">
    {name}
  </span>
);

export default Tag;