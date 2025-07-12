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

app.post('/api/search', async (req, res) => {
  const { domain, keywords } = req.body;
  const keywordString = keywords?.join(' ') || '';

  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  try {
    const allMentors = [];

    // --- GitHub ---
    const githubQuery = `${domain} ${keywordString}`;
    const githubResponse = await axios.get(`https://api.github.com/search/users`, {
      params: {
        q: `${githubQuery} in:login in:name`,
        per_page: 5,
      },
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Veteran-Talent-Finder-App',
      }
    });

    const githubUsers = githubResponse.data.items || [];
    const githubMentors = await Promise.all(
      githubUsers.map(async (user) => {
        const userDetails = await axios.get(user.url);
        const detail = userDetails.data;

        return {
          source: "GitHub",
          sourceLogo: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
          avatar: detail.avatar_url,
          name: detail.name || detail.login,
          email: detail.email || 'Not Public',
          contactUrl: detail.html_url,
          location: detail.location || 'Unknown',
          experience: detail.bio || 'No bio available',
          keywords: [domain, ...keywords],
          confidence: Math.floor(Math.random() * 20) + 80,
          willingToMentor: Math.random() > 0.5,
          contactable: !!detail.email || !!detail.html_url
        };
      })
    );
    allMentors.push(...githubMentors);

    // --- Dev.to ---
    const devtoResponse = await axios.get(`https://dev.to/api/articles?tag=${domain}&per_page=5`);
    const devtoMentors = devtoResponse.data.map(article => {
      const user = article.user;
      return {
        source: "Dev.to",
        sourceLogo: "https://d2fltix0v2e0sb.cloudfront.net/dev-badge.svg",
        avatar: user.profile_image,
        name: user.name,
        email: 'Not Public',
        contactUrl: `https://dev.to/${user.username}`,
        location: 'Unknown',
        experience: `Writes articles on ${domain}`,
        keywords: [domain],
        confidence: Math.floor(Math.random() * 20) + 75,
        willingToMentor: Math.random() > 0.5,
        contactable: true
      };
    });
    allMentors.push(...devtoMentors);

    // --- Medium ---
    try {
      const mediumResp = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/tag/${domain}`);
      const mediumMentors = mediumResp.data.items.slice(0, 5).map(article => {
        return {
          source: "Medium",
          sourceLogo: "https://cdn.iconscout.com/icon/free/png-256/medium-47-433328.png",
          avatar: "https://cdn-icons-png.flaticon.com/512/5968/5968885.png",
          name: article.author,
          email: 'Not Public',
          contactUrl: article.link,
          location: 'Unknown',
          experience: `Writes articles on ${domain}`,
          keywords: [domain],
          confidence: Math.floor(Math.random() * 20) + 70,
          willingToMentor: Math.random() > 0.5,
          contactable: true
        };
      });
      allMentors.push(...mediumMentors);
    } catch (err) {
      console.error('Medium API error:', err.message);
    }

    // --- Stack Overflow ---
    try {
      const soResp = await axios.get(`https://api.stackexchange.com/2.3/tags/${domain}/top-users/all_time`, {
        params: { site: 'stackoverflow' }
      });
      const soMentors = soResp.data.items.slice(0, 5).map(user => {
        return {
          source: "Stack Overflow",
          sourceLogo: "https://cdn.iconscout.com/icon/free/png-256/stack-overflow-2752072-2284892.png",
          avatar: user.user.profile_image,
          name: user.user.display_name,
          email: 'Not Public',
          contactUrl: user.user.link,
          location: 'Unknown',
          experience: `Top contributor for ${domain} tag`,
          keywords: [domain],
          confidence: Math.floor(Math.random() * 20) + 75,
          willingToMentor: Math.random() > 0.5,
          contactable: true
        };
      });
      allMentors.push(...soMentors);
    } catch (err) {
      console.error('Stack Overflow API error:', err.message);
    }

    // --- Semantic Scholar ---
    try {
      const ssResp = await axios.get(`https://api.semanticscholar.org/graph/v1/author/search`, {
        params: {
          query: domain,
          limit: 5,
          fields: 'name,url,homepage'
        }
      });
      const ssMentors = ssResp.data.data.map(author => {
        return {
          source: "Semantic Scholar",
          sourceLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Semantic_Scholar_logo.png/320px-Semantic_Scholar_logo.png",
          avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Semantic_Scholar_logo.png/320px-Semantic_Scholar_logo.png",
          name: author.name,
          email: 'Not Public',
          contactUrl: author.homepage || `https://www.semanticscholar.org/author/${author.authorId}`,
          location: 'Unknown',
          experience: `Academic author in ${domain}`,
          keywords: [domain],
          confidence: Math.floor(Math.random() * 20) + 70,
          willingToMentor: Math.random() > 0.5,
          contactable: true
        };
      });
      allMentors.push(...ssMentors);
    } catch (err) {
      console.error('Semantic Scholar API error:', err.message, err.response?.data);
    }

    const contactableMentors = allMentors.filter(mentor => mentor.contactable);
    res.json({ mentors: contactableMentors });
  } catch (error) {
    console.error('Error fetching from APIs:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to fetch mentor data' });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

