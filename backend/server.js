const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();


const mongoose = require('mongoose');
require('dotenv').config();
const Report = require('./models/Report');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = 3000;

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// File storage setup
const upload = multer({ dest: 'uploads/' });

// Dummy in-memory user database
const users = [];

// -------------------------
// Login Route
// -------------------------
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.status(200).send('Login successful');
  } else {
    res.status(401).send('Invalid username or password');
  }
});

// -------------------------
// Register Route
// -------------------------
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.status(400).send('Username already taken');
  }
  users.push({ username, password });
  res.status(201).send('Registration successful');
});

// -------------------------
// Upload and Analyze Video
// -------------------------
app.post('/upload', upload.single('video'), (req, res) => {
  const videoPath = path.join(__dirname, req.file.path);
  const pythonScript = `python app/main.py "${videoPath}"`;

  console.log('🎥 Analyzing video with command:', pythonScript);

  exec(pythonScript, (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Python script error:', err.message);
      return res.status(500).send('Failed to analyze video.');
    }

    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (parseErr) {
      console.error('⚠️ Failed to parse Python output:', stdout);
      res.status(500).send('Invalid analysis result.');
    }
  });
});

// -------------------------
// Start Server
// -------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});



// -------------------------
// Analyze Video Route
// -------------------------
const { spawn } = require('child_process');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

app.post('/analyze-video', upload.single('video'), (req, res) => {
  const videoPath = req.file.path;

  const results = {};
  let scriptsCompleted = 0;

  const runScript = (script, label) => {
    const process = spawn('python', [script, videoPath]);

    let output = '';
    process.stdout.on('data', data => {
      output += data.toString();
    });

    process.stderr.on('data', err => {
      console.error(`Error from ${label}:`, err.toString());
    });

    process.on('close', () => {
      try {
        results[label] = JSON.parse(output);
      } catch {
        results[label] = { error: 'Invalid output' };
      }
      scriptsCompleted++;
      
        // Dummy userId (replace with real session auth later)
        const userId = "665e9e0c1234567890abcdef";
        const report = new Report({
          userId,
          analysisResult: results,
          videoFileName: req.file.originalname
        });
        await report.save();

      if (scriptsCompleted === 3) {
        res.json(results);
      }
    });
  };

  runScript('video_analysis.py', 'video');
  runScript('emotion_analysis.py', 'emotion');
  runScript('speech_analysis.py', 'speech');
});
