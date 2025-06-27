
import React, { useState } from 'react';

const Dashboard = ({ username }) => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('video', file);
    const res = await fetch(\`\${process.env.REACT_APP_API_BASE}/analyze-video\`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    setResult(data);
  };

  const renderSuggestions = () => {
    if (!result) return null;
    const suggestions = [];
    if (result.video?.eye_movement?.includes("Frequent")) suggestions.push("Reduce blinking and maintain eye contact.");
    if (result.video?.speech_analysis?.includes("fast")) suggestions.push("Slow down your speech.");
    if (result.video?.grammar_mistakes > 0) suggestions.push("Work on grammar.");
    if (result.emotion?.dominant_emotion === "sad" || result.emotion?.dominant_emotion === "angry") suggestions.push("Try to maintain a positive expression.");
    return suggestions.map((s, i) => <li key={i}>{s}</li>);
  };

  return (
    <div>
      <h2>Welcome, {username}</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={e => setFile(e.target.files[0])} required />
        <button type="submit">Analyze Video</button>
      </form>
      {result && (
        <div>
          <h3>Analysis Summary</h3>
          <p>You showed {result.video?.confidence} confidence, {result.video?.tone} tone, and {result.video?.grammar_mistakes} grammar mistakes.</p>
          <h4>Suggestions:</h4>
          <ul>{renderSuggestions()}</ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
