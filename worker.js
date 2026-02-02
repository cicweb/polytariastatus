export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Endpoint: /api/status → returns JSON
    if (url.pathname === "/api/status") {
  let status = "down";
  let code = 0;
  try {
    const res = await fetch("https://polytoria.com/", {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
      }
    });
    code = res.status;
    status = res.ok ? "up" : "down";
  } catch (e) {
    status = "down";
    code = 0;
  }

  return new Response(JSON.stringify({ status, httpStatus: code, time: new Date().toISOString() }), {
    headers: { 
      "Content-Type": "application/json" 
      "Access-Control-Allow-Origin": "https://polysts.surge.sh"}
  });
}


    // Serve HTML page
    return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Polytoria Status</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
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
    backdrop-filter: blur(12px);
    border-radius: 25px;
    padding: 60px 80px;
    text-align: center;
    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
  }
  .status-title {
    font-size: 3em;
    margin-bottom: 20px;
    text-shadow: 1px 1px 6px rgba(0,0,0,0.5);
  }
  .status-up { color: #00ff6a; }
  .status-down { color: #ff4b4b; }
  .status-icon { font-size: 5em; margin-bottom: 20px; display: block; animation: bounce 1.2s infinite; }
  @keyframes bounce {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
</style>
</head>
<body>
<div class="status-card">
  <i id="statusIcon" class="fas fa-sync status-icon"></i>
  <div id="statusText" class="status-title">Checking...</div>
  <div id="lastChecked">Last checked: --</div>
</div>
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
      statusIcon.className = "fas fa-check status-icon status-up";
    } else if (data.httpStatus === 524) {
      statusText.textContent = "Polytoria timed out (524)";
      statusText.className = "status-title status-down";
      statusIcon.className = "fas fa-clock status-icon status-down";
    } else {
      statusText.textContent = "Polytoria is DOWN!";
      statusText.className = "status-title status-down";
      statusIcon.className = "fas fa-times status-icon status-down";
    }

    document.getElementById("lastChecked").textContent =
      "Last checked: " + new Date(data.time).toLocaleTimeString();
  } catch (err) {
    console.error(err);
    const statusText = document.getElementById("statusText");
    const statusIcon = document.getElementById("statusIcon");
    statusText.textContent = "Error checking status";
    statusText.className = "status-title status-down";
    statusIcon.className = "fas fa-exclamation-triangle status-icon status-down";
    document.getElementById("lastChecked").textContent = "";
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
