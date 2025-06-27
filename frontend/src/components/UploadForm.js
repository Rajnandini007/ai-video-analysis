import React, { useState } from 'react';

function UploadForm() {
  const [video, setVideo] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!video) return alert('Choose a video');
    setLoading(true);
    const formData = new FormData();
    formData.append('video', video);

    try {
      const res = await fetch('http://localhost:3000/analyze-video', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
    setLoading(false);
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={e => setVideo(e.target.files[0])} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Analyzing...' : 'Upload & Analyze'}
      </button>

      {result && (
        <div>
          <h3>Analysis Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default UploadForm;
