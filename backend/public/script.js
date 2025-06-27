
document.getElementById('uploadForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const formData = new FormData();
  const file = document.getElementById('videoInput').files[0];
  formData.append('video', file);

  const response = await fetch('/analyze-video', {
    method: 'POST',
    body: formData
  });
  const data = await response.json();

  let summary = 'Summary not available.';
  let suggestions = [];

  if (!data.video?.error && !data.emotion?.error && !data.speech?.error) {
    summary = \`You showed \${data.video.confidence.toLowerCase()} confidence with \${data.video.tone.toLowerCase()} tone, and made \${data.video.grammar_mistakes} grammar mistakes.\`;
    if (data.video.eye_movement.includes('Frequent')) suggestions.push("Reduce blinking and maintain eye contact.");
    if (data.video.speech_analysis.includes('fast')) suggestions.push("Slow down your speech.");
    if (data.video.grammar_mistakes > 0) suggestions.push("Work on reducing grammar mistakes.");
    if (data.emotion.dominant_emotion === "sad" || data.emotion.dominant_emotion === "angry") suggestions.push("Try to maintain a positive expression.");
  }

  const resultHTML = \`
    <p><strong>Summary:</strong> \${summary}</p>
    <ul>\${suggestions.map(s => '<li>' + s + '</li>').join('')}</ul>
  \`;
  document.getElementById('resultContainer').innerHTML = resultHTML;

  // Fake username from localStorage (replace with real session logic in production)
  const username = localStorage.getItem("username") || "Guest";
  document.getElementById('username').textContent = "Welcome, " + username;
});

// Simulate user login (for demo)
localStorage.setItem("username", "Yugandhara");
