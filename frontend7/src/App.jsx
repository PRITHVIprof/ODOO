// src/App.jsx
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
// import { Router } from 'express';
import HomePage from './pages/HomePage';
import AskQuestion from './pages/AskQuestion';
import QuestionPage from "./pages/QuestionPage";

import "./App.css";
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/searchmentor" element={<SearchPage/>}/>
        <Route path="/askquestion" element={<AskQuestion/>}/>
        <Route path="/question/:id" element={<QuestionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
