// ✅ Check if user is logged in
if (localStorage.getItem('isLoggedIn') !== 'true') {
  window.location.href = 'login.html';
}

// ✅ DOM Elements
const logoutBtn = document.getElementById('logoutBtn');
const uploadForm = document.getElementById('uploadForm');
const videoFileInput = document.getElementById('videoFile');
const uploadError = document.getElementById('uploadError');

const reportCard = document.getElementById('reportCard');
const confidenceEl = document.getElementById('confidence');
const eyeMovementEl = document.getElementById('eyeMovement');
const speechAnalysisEl = document.getElementById('speechAnalysis');
const toneEl = document.getElementById('tone');
const grammarMistakesEl = document.getElementById('grammarMistakes');
const summaryTextEl = document.getElementById('summaryText');
const generatePdfBtn = document.getElementById('generatePdfBtn');
const historyList = document.getElementById('historyList');

let analysisChart = null;

// ✅ Logout functionality
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('isLoggedIn');
  window.location.href = 'login.html';
});

// ✅ Save report to localStorage history
function saveReportToHistory(report) {
  let history = JSON.parse(localStorage.getItem('analysisHistory')) || [];
  report.date = new Date().toLocaleString();
  history.unshift(report);
  if (history.length > 10) history.pop();
  localStorage.setItem('analysisHistory', JSON.stringify(history));
}

// ✅ Load past history
function loadHistory() {
  let history = JSON.parse(localStorage.getItem('analysisHistory')) || [];
  historyList.innerHTML = '';
  if (history.length === 0) {
    historyList.innerHTML = '<li class="text-gray-500">No past uploads found.</li>';
    return;
  }
  history.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'border-b py-2 cursor-pointer hover:bg-gray-100';
    li.textContent = `${item.date} - Confidence: ${item.confidence}, Grammar Mistakes: ${item.grammar_mistakes}`;
    li.onclick = () => showReport(item);
    historyList.appendChild(li);
  });
}

// ✅ Show analysis report
function showReport(report) {
  reportCard.style.display = 'block';
  confidenceEl.textContent = report.confidence;
  eyeMovementEl.textContent = report.eye_movement;
  speechAnalysisEl.textContent = report.speech_analysis;
  toneEl.textContent = report.tone;
  grammarMistakesEl.textContent = report.grammar_mistakes;

  // ✨ Summary generation
  let summary = `The candidate's overall confidence is ${report.confidence.toLowerCase()}, `;
  summary += `with ${report.eye_movement.toLowerCase()} eye movement and a ${report.tone.toLowerCase()} tone. `;
  summary += `Speech was ${report.speech_analysis.toLowerCase()}, `;
  summary += `and grammar mistakes detected were ${report.grammar_mistakes}.`;

  summaryTextEl.textContent = summary;

  // 📊 Chart data mapping
  const chartData = {
    labels: ['Confidence', 'Eye Movement', 'Speech', 'Tone', 'Grammar Mistakes'],
    datasets: [{
      label: 'Analysis Score',
      data: [
        report.confidence === 'High' ? 90 : report.confidence === 'Moderate' ? 60 : 30,
        report.eye_movement === 'Normal' ? 90 : 60,
        report.speech_analysis === 'Fluent' ? 90 : 60,
        report.tone === 'Neutral' ? 80 : 50,
        100 - (report.grammar_mistakes * 20)
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(234, 179, 8, 0.7)',
        'rgba(234, 88, 12, 0.7)',
        'rgba(239, 68, 68, 0.7)',
      ],
      borderRadius: 5,
    }]
  };

  if (analysisChart) {
    analysisChart.data = chartData;
    analysisChart.update();
  } else {
    const ctx = document.getElementById('analysisChart').getContext('2d');
    analysisChart = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        scales: {
          y: { beginAtZero: true, max: 100 },
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        }
      }
    });
  }
}

// ✅ Handle file upload (simulate analysis)
uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  uploadError.textContent = '';

  const file = videoFileInput.files[0];
  if (!file) {
    uploadError.textContent = 'Please select a video file to upload.';
    return;
  }

  if (file.size > 100 * 1024 * 1024) {
    uploadError.textContent = 'File size exceeds 100 MB limit.';
    return;
  }

  uploadError.textContent = 'Analyzing video, please wait...';

  setTimeout(() => {
    const exampleReport = {
      confidence: ['High', 'Moderate', 'Low'][Math.floor(Math.random() * 3)],
      eye_movement: ['Normal', 'Frequent blinking', 'Nervous'][Math.floor(Math.random() * 3)],
      speech_analysis: ['Fluent', 'Slightly fast', 'Hesitant'][Math.floor(Math.random() * 3)],
      tone: ['Neutral', 'Warm', 'Monotone'][Math.floor(Math.random() * 3)],
      grammar_mistakes: Math.floor(Math.random() * 5)
    };

    saveReportToHistory(exampleReport);
    showReport(exampleReport);
    uploadError.textContent = 'Analysis complete!';
    uploadForm.reset();
  }, 2500);
});

// ✅ Generate PDF using jsPDF
generatePdfBtn.addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const dateStr = new Date().toLocaleString();
  const summary = summaryTextEl.textContent;

  const confidence = confidenceEl.textContent;
  const eye = eyeMovementEl.textContent;
  const speech = speechAnalysisEl.textContent;
  const tone = toneEl.textContent;
  const grammar = grammarMistakesEl.textContent;

  const candidateName = document.getElementById('candidateName').value || "N/A";
  const notes = document.getElementById('interviewerNotes').value || "None";

  // 🔷 Title & Date
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("AI Recruitment Interview Report", 20, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated on: ${dateStr}`, 20, 28);
  doc.text(`Candidate Name/ID: ${candidateName}`, 20, 34);

  // 🔹 Section: Detailed Metrics
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Candidate Analysis:", 20, 45);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  let y = 53;
  const lineSpacing = 8;

  doc.text(`• Confidence: ${confidence}`, 25, y); y += lineSpacing;
  doc.text(`• Eye Movement: ${eye}`, 25, y); y += lineSpacing;
  doc.text(`• Speech Analysis: ${speech}`, 25, y); y += lineSpacing;
  doc.text(`• Tone: ${tone}`, 25, y); y += lineSpacing;
  doc.text(`• Grammar Mistakes: ${grammar}`, 25, y); y += lineSpacing + 4;

  // 🔹 Section: Summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Overall Summary:", 20, y); y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const wrappedSummary = doc.splitTextToSize(summary, 170);
  doc.text(wrappedSummary, 25, y);
  y += wrappedSummary.length * 6 + 10;

  // 🔹 Section: Interviewer Notes
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Interviewer Notes:", 20, y); y += 8;

  doc.setFont("helvetica", "normal");
  const wrappedNotes = doc.splitTextToSize(notes, 170);
  doc.text(wrappedNotes, 25, y);

  doc.save(`interview-report-${candidateName.replace(/\s+/g, "_") || 'candidate'}.pdf`);
});


// ✅ Initialize Chart.js
const ctx = document.getElementById('analysisChart').getContext('2d');
if (ctx) {
  analysisChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Confidence', 'Eye Movement', 'Speech', 'Tone', 'Grammar Mistakes'],
      datasets: [{
        label: 'Analysis Score',
        data: [0, 0, 0, 0, 0], // Initial empty data
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(234, 179, 8, 0.7)',
          'rgba(234, 88, 12, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderRadius: 5,
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: 100 },
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      }
    }
  });
}
// ✅ Load most recent report and history on load
window.onload = () => {
  const history = JSON.parse(localStorage.getItem('analysisHistory'));
  if (history && history.length > 0) {
    showReport(history[0]);
  }
  loadHistory();
};
