# GENESE

GENESE is a mobile app (React Native / Expo) with a Node.js + Express + MongoDB backend. It guides users through onboarding + RGPD consent, an auto-assessment (bilan), generates a personalized training programme (phases + séances), and adapts intensity using session feedback (RPE + pain scale). Safety alerts are triggered when pain thresholds are exceeded.

---

## Features

### User
- Signup/Login (JWT access + refresh)
- Profile onboarding (age, goal, activity level, time available, practice location…)
- RGPD consents (versioned)
- Auto-bilan (mobility/stability/body-awareness tests)
- Programme generation from bilan
- Séance execution (exercise list)
- Feedback (RPE + pain NRS + comment)
- Automatic adaptation + blocking programme on critical pain
- Notifications + mark as read
- Dashboard aggregation

### Safety Rules
- **On bilan creation:** if any test `douleur_nrs >= 7` → create alert `DOULEUR_CRITIQUE`
- **On séance feedback:** if `douleur_nrs_post >= 6` → create alert, set programme status `BLOQUE`, reduce future intensity
- RPE-based intensity adjustments for future sessions

---

## Tech Stack

**Backend**
- Node.js, Express, TypeScript
- MongoDB + Mongoose
- Auth: bcrypt + JWT (access/refresh)
- Security: helmet, rate-limit, CORS
- Validation: Zod/Joi (depending on implementation)
- Tests: Jest + Supertest (integration)

**Mobile**
- Expo (React Native) + TypeScript
- Navigation + Secure token storage
- REST API client

---

## Requirements

- Node.js 18+
- npm 9+
- MongoDB (local) **or** MongoDB Atlas
- For mobile testing: Expo Go (Android/iOS), same network/hotspot

---

# Backend Setup (`backend/`)

## 1) Install dependencies
```bash
cd backend
npm install
````

## 2) Create `.env`

```bash
cp .env.example .env
```

### Required env variables (example)

```env
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/genese?retryWrites=true&w=majority

JWT_ACCESS_SECRET=change_me
JWT_REFRESH_SECRET=change_me
JWT_ACCESS_TTL_SECONDS=900
JWT_REFRESH_TTL_SECONDS=604800

CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100

SEED_ADMIN_EMAIL=admin@genese.local
SEED_ADMIN_PASSWORD=AdminPassword123!
```

### MongoDB Atlas notes (important)

* In Atlas, add your current IP in **Network Access** (or temporary `0.0.0.0/0` for dev).
* Always include a database name in the URI (e.g. `/genese?...`).
* Never commit real credentials. If you exposed a password publicly, rotate it immediately.

## 3) Seed database (admin + exercises)

```bash
npm run seed
```

## 4) Start dev server

```bash
npm run dev
```

Health check:

```bash
curl http://localhost:3000/api/health
```

### If your phone needs to reach the backend

Make sure Express listens on all interfaces (0.0.0.0) and port 3000 is open on firewall:

* Test from phone browser: `http://<PC_IP>:3000/api/health`

---

## Running tests

```bash
npm test
```

---

# Mobile Setup (`genese-mobile/`)

## 1) Install dependencies

```bash
cd genese-mobile
npm install
```

## 2) Configure API Base URL

### Real phone (Expo Go)

**Do not use `localhost`**. Use your computer LAN IP.

Example (hotspot / Wi-Fi):

* `http://10.91.221.197:3000/api`
* `http://192.168.1.20:3000/api`

### Android emulator

* `http://10.0.2.2:3000/api`

Update it wherever the app stores config (commonly in `app.json`):

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "http://YOUR_PC_IP:3000/api"
    }
  }
}
```

## 3) Start Expo

```bash
npx expo start -c --lan
```

If LAN fails on your network, try:

```bash
npx expo start -c --tunnel
```

### Common Expo fixes

* If Metro won’t connect: ensure phone and PC are on the same hotspot/Wi-Fi, and allow ports (Linux UFW):

  ```bash
  sudo ufw allow 8081/tcp
  sudo ufw allow 19000/tcp
  sudo ufw allow 19001/tcp
  sudo ufw allow 3000/tcp
  ```
* If Expo CLI shows `TypeError: fetch failed` on Linux:

  ```bash
  NODE_OPTIONS="--dns-result-order=ipv4first" npx expo start -c --lan
  ```

---

# API Summary

Base URL:

* `http://localhost:3000/api`

Auth:

* `POST /auth/signup`
* `POST /auth/login`
* `POST /auth/refresh`
* `POST /auth/logout`

Onboarding:

* `GET /users/me`
* `PUT /users/me`
* `PUT /users/me/experience-digitale`
* `PUT /users/me/experience-sportive`

RGPD:

* `POST /users/me/consents`
* `GET /users/me/consents`

Bilans:

* `GET /bilans/tests-definition`
* `POST /bilans`

Programmes:

* `POST /programmes/generate`
* `GET /programmes/:id`

Séances:

* `GET /seances/:id`
* `POST /seances/:id/feedback`

Dashboard:

* `GET /dashboard`

Staff:

* `GET/POST/PUT/DELETE /exercices`
* `GET/PUT /alerts`
* `GET/PUT /notifications`

---

# Postman Quick Start

1. Create environment variables:

* `baseUrl = http://localhost:3000/api`
* `accessToken`, `refreshToken`, `bilanId`, `programmeId`, `seanceId`

2. Signup
   `POST {{baseUrl}}/auth/signup`

```json
{ "email":"user@test.com", "mot_de_passe":"Password123!", "prenom":"Mustapha" }
```

3. Login
   `POST {{baseUrl}}/auth/login`

```json
{ "email":"user@test.com", "mot_de_passe":"Password123!" }
```

4. Bilan → Programme → Séance → Feedback

* `POST /bilans`
* `POST /programmes/generate` (with `bilan_id`)
* `GET /seances/:id`
* `POST /seances/:id/feedback`

---

# Troubleshooting

## Backend: `ECONNREFUSED 127.0.0.1:27017`

You’re using local Mongo but it’s not running. Either:

* start Mongo locally, or
* switch `MONGODB_URI` to Atlas.

## Backend: seed works but dev uses localhost Mongo

Your dev process is loading a different `.env` or an overridden shell variable.

* Check:

  ```bash
  cat .env | grep MONGODB_URI
  echo $MONGODB_URI
  ```
* Ensure `dotenv.config()` loads the correct `.env` path in `src/server.ts`.

## Mobile: “Network request failed” on signup/login

Your phone can’t reach the backend.

* Set API base URL to `http://<PC_IP>:3000/api`
* Confirm phone browser opens `http://<PC_IP>:3000/api/health`
* Allow firewall port 3000

## Expo: “Cannot connect to Metro”

* Start with `npx expo start -c --lan`
* Use hotspot, allow ports, or try `--tunnel`

---

## License

MIT (or choose your license)

## Author

BENCHAHYD Mustapha
MTDTS- Groupe 2 
