export default {
  async fetch(request) {
    // Polytoria URL via CORS proxy
    const POLYTORIA_URL = "https://api.allorigins.win/raw?url=https://polytoria.com/";

    let status = "down";
    try {
      const res = await fetch(POLYTORIA_URL);
      if (res.ok) status = "up";
    } catch (e) {
      status = "down";
    }

    return new Response(JSON.stringify({ status, time: new Date().toISOString() }), {
      headers: { "Content-Type": "application/json" },
    });
  }
};
