const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/stackit", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "❌ MongoDB error:"));
db.once("open", () => console.log("✅ Connected to MongoDB"));

// ✅ Schema with full features
const answerSchema = new mongoose.Schema({
  text: String,
  image: String, // optional base64 or image URL
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  createdBy: { type: String, default: "Anonymous" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const questionSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    tags: [String],
    createdBy: { type: String, default: "Anonymous" },
    answers: [answerSchema],
    acceptedAnswerIndex: { type: Number, default: -1 },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

// ✅ GET all questions
app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch {
    res.status(500).json({ error: "Error fetching questions" });
  }
});

// ✅ GET single question by ID
app.get("/api/questions/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Not found" });
    res.json(question);
  } catch {
    res.status(400).json({ error: "Invalid question ID" });
  }
});

// ✅ POST new question
app.post("/api/questions", async (req, res) => {
  const { title, description, tags, createdBy } = req.body;
  try {
    const question = new Question({ title, description, tags, createdBy });
    await question.save();
    res.status(201).json({ message: "Question created", question });
  } catch (error) {
    res.status(500).json({ error: "Failed to save question" });
  }
});

// ✅ POST new answer
app.post("/api/questions/:id/answers", async (req, res) => {
  const { text, image, createdBy } = req.body;

  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });

    question.answers.push({ text, image, createdBy });
    await question.save();

    res.json({ message: "Answer added", answers: question.answers });
  } catch (error) {
    res.status(500).json({ error: "Failed to add answer" });
  }
});

// ✅ LIKE or DISLIKE answer
app.post("/api/questions/:id/answers/:index/vote", async (req, res) => {
  const { vote } = req.body; // vote = "like" or "dislike"
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });

    const answer = question.answers[req.params.index];
    if (!answer) return res.status(404).json({ error: "Answer not found" });

    if (vote === "like") answer.likes += 1;
    else if (vote === "dislike") answer.dislikes += 1;

    await question.save();
    res.json({ message: "Vote registered" });
  } catch (error) {
    res.status(500).json({ error: "Failed to vote" });
  }
});

// ✅ ACCEPT an answer
app.post("/api/questions/:id/accept/:index", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });

    question.acceptedAnswerIndex = req.params.index;
    await question.save();

    res.json({ message: "Answer accepted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to accept answer" });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

