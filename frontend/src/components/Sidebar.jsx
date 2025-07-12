// src/components/Sidebar.jsx
import React from 'react';
import '../styles.css';

const Sidebar = () => (
  <div className="sidebar">
    <div className="widget">
      <h3 className="widget-title">How to Format</h3>
      <div className="widget-content">
        <ul className="widget-list">
          <li>Use backticks for `code`</li>
          <li>Add images via link</li>
          <li>Use lists for multiple points</li>
          <li>Reference documentation</li>
        </ul>
      </div>
    </div>
    
    <div className="widget">
      <h3 className="widget-title">Related Questions</h3>
      <div className="widget-content">
        <ul className="widget-list">
          <li>SQL join multiple columns</li>
          <li>Concatenate strings in SQL</li>
          <li>Beginner SQL examples</li>
          <li>Database normalization</li>
        </ul>
      </div>
    </div>
  </div>
);

export default Sidebar;