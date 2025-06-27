const express = require('express');
const multer = require('multer');
const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();
const Report = require('./models/Report');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
const upload = multer({ dest: 'uploads/' });

const users = []; // In-memory users (for dev/testing only)

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  user ? res.status(200).send('Login successful') : res.status(401).send('Invalid username or password');
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).send('Username already taken');
  }
  users.push({ username, password });
  res.status(201).send('Registration successful');
});

app.post('/upload', upload.single('video'), (req, res) => {
  const videoPath = path.join(__dirname, req.file.path);
  const pythonScript = `python app/main.py "${videoPath}"`;

  console.log('🎥 Running:', pythonScript);
  exec(pythonScript, (err, stdout) => {
    if (err) {
      console.error('❌ Python error:', err);
      return res.status(500).send('Analysis failed');
    }
    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch {
      console.error('⚠️ Parse error:', stdout);
      res.status(500).send('Invalid JSON from script');
    }
  });
});

app.post('/analyze-video', upload.single('video'), async (req, res) => {
  const videoPath = req.file.path;
  const labels = ['video_analysis.py', 'emotion_analysis.py', 'speech_analysis.py'];
  const results = {};

  const runScript = (scriptPath, label) => new Promise(resolve => {
    let output = '';
    const child = spawn('python', [path.join(__dirname, scriptPath), videoPath]);

    child.stdout.on('data', data => output += data);
    child.stderr.on('data', err => console.error(`❌ ${label} stderr:`, err.toString()));

    child.on('close', () => {
      try {
        results[label] = JSON.parse(output);
      } catch {
        results[label] = { error: 'Invalid JSON' };
      }
      resolve();
    });
  });

  await Promise.all(labels.map(script => runScript(script, script.replace('.py', ''))));

  const report = new Report({
    userId: "665e9e0c1234567890abcdef", // placeholder
    analysisResult: results,
    videoFileName: req.file.originalname
  });

  try {
    await report.save();
    console.log('✅ Report saved');
    res.json(results);
  } catch (e) {
    console.error('❌ Save error:', e);
    res.status(500).json({ error: 'Failed to save report' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server listening at http://localhost:${PORT}`));
