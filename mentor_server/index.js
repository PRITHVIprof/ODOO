const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

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

app.get('/', (req, res) => {
  res.send('Veteran Talent Finder backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
