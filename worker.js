export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Endpoint: /api/status → returns JSON
    if (url.pathname === "/api/status") {
      const POLYTORIA_URL = "https://api.allorigins.win/raw?url=https://polytoria.com/";
      let status = "down";

      try {
        const res = await fetch(POLYTORIA_URL);
        if (res.ok) status = "up";
      } catch (e) {
        status = "down";
      }

      return new Response(JSON.stringify({
        status,
        time: new Date().toISOString()
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Otherwise: serve your existing fancy HTML
    return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Polytoria Status</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
  body {
    font-family: 'Roboto', sans-serif;
    margin: 0; height: 100vh;
    display: flex; justify-content: center; align-items: center;
    background: linear-gradient(135deg, #1f1c2c, #928dab);
    color: white; overflow: hidden;
  }
  .status-card {
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(15px);
    border-radius: 25px;
    padding: 60px 80px;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }
  .status-title {
    font-size: 3em;
    margin-bottom: 20px;
    text-shadow: 2px 2px 10px rgba(0,0,0,0.5);
  }
  .status-up { color: #00ff6a; animation: pulseUp 1.5s infinite; }
  .status-down { color: #ff4b4b; animation: pulseDown 1.5s infinite; }
  @keyframes pulseUp {
    0%,100% { text-shadow: 0 0 20px #00ff6a,0 0 30px #00ff6a; }
    50% { text-shadow: 0 0 40px #00ff6a,0 0 60px #00ff6a; }
  }
  @keyframes pulseDown {
    0%,100% { text-shadow: 0 0 20px #ff4b4b,0 0 30px #ff4b4b; }
    50% { text-shadow: 0 0 40px #ff4b4b,0 0 60px #ff4b4b; }
  }
  .status-icon { font-size: 5em; margin-bottom: 20px; display: block; animation: bounce 1.2s infinite; }
  @keyframes bounce {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
  .footer { position: absolute; bottom: 20px; font-size: 0.9em; color: rgba(255,255,255,0.6); }
</style>
</head>
<body>
<div class="status-card">
  <span id="statusIcon" class="status-icon">🔄</span>
  <div id="statusText" class="status-title">Checking...</div>
  <div id="lastChecked">Last checked: --</div>
</div>
<div class="footer">Fancy Polytoria Status Page 🌐</div>
<script>
async function checkStatus() {
  try {
    const res = await fetch("/api/status");
    const data = await res.json();
    const statusText = document.getElementById("statusText");
    const statusIcon = document.getElementById("statusIcon");

    if (data.status === "up") {
      statusText.textContent = "Polytoria is UP!";
      statusText.className = "status-title status-up";
      statusIcon.textContent = "✅";
      statusIcon.className = "status-icon status-up";
    } else {
      statusText.textContent = "Polytoria is DOWN!";
      statusText.className = "status-title status-down";
      statusIcon.textContent = "❌";
      statusIcon.className = "status-icon status-down";
    }

    document.getElementById("lastChecked").textContent =
      "Last checked: " + new Date(data.time).toLocaleTimeString();
  } catch (err) {
    console.error(err);
  }
}

checkStatus();
setInterval(checkStatus, 30000);
</script>
</body>
</html>`, {
      headers: { "Content-Type": "text/html" }
    });
  }
};
