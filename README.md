# Polytoria Status API

A lightweight serverless API that checks Polytoria’s availability and exposes a simple JSON status endpoint.

The backend runs on Cloudflare Workers, while the frontend is hosted separately (for example, Surge.sh).  
This repository contains only the API.

---

## Base URL

```
https://api.polytariastatus.ziadn6b.workers.dev
```

---

## Endpoint

### GET /api/status

Checks Polytoria’s website and returns its current status.

---

## Example Response

```json
{
  "status": "up",
  "httpStatus": 200,
  "time": "2026-02-02T17:03:21.412Z"
}
```

---

## Response Fields

| Field       | Type   | Description |
|------------|--------|-------------|
| status     | string | "up" or "down" depending on the result |
| httpStatus | number | HTTP status code returned by Polytoria |
| time       | string | ISO 8601 timestamp of when the check was performed |

---

## Status Logic

The API performs a GET request to:

```
https://polytoria.com/
```

Results are interpreted as follows:

- 200–299 → status: "up"
- 403 → status: "down" (blocked / forbidden)
- 524 → status: "down" (Cloudflare timeout)
- Network error / timeout → status: "down", httpStatus: 0

---

## CORS

CORS is enabled for the frontend:

```
https://polysts.surge.sh
```

Allowed methods:
- GET
- OPTIONS

This allows the API to be safely consumed from browsers.

---

## Usage Example (JavaScript)

```js
fetch("https://api.polytariastatus.ziadn6b.workers.dev/api/status")
  .then(res => res.json())
  .then(data => {
    console.log(data.status);
    console.log(data.httpStatus);
    console.log(data.time);
  });
```

---

## Error Handling

If the API itself is unreachable or an error occurs:

- The endpoint still returns JSON
- status will be "down"
- httpStatus will be 0

This ensures frontend code does not break due to missing fields.

---

## Deployment

This API is deployed using Wrangler:

```bash
npx wrangler deploy
```

The Worker entry point is worker.js.

---

## Notes

- This API does not cache responses
- Every request performs a live check
- Designed for dashboards, status pages, and uptime monitors

---

## License
MIT
