const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Mock database
let questions = [
  {
    id: 1,
    title: "How to join 2 columns in a data set to make a separate column in SQL",
    description: "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine.",
    tags: ["SQL", "Database", "Beginner"],
    answers: [
      "The || Operator.\nThe + Operator.\nThe CONCAT Function.",
      "Details."
    ]
  }
];

// Get question by ID
app.get('/api/questions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const question = questions.find(q => q.id === id);
  
  if (question) {
    res.json(question);
  } else {
    res.status(404).json({ error: 'Question not found' });
  }
});

// Submit new answer
app.post('/api/questions/:id/answers', (req, res) => {
  const id = parseInt(req.params.id);
  const question = questions.find(q => q.id === id);
  
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }
  
  const newAnswer = req.body.answer;
  question.answers.push(newAnswer);
  
  res.status(201).json({ 
    success: true, 
    answers: question.answers 
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});