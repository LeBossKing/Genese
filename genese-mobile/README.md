# GENESE Mobile (Expo / React Native)

This project is a mobile client wired to the GENESE REST backend you built.

## 1) Install
```bash
npm install
```

If Expo complains about versions, run:
```bash
npx expo install
```

## 2) Configure API base URL
In `app.json`:
```json
"extra": { "apiBaseUrl": "http://localhost:3000/api" }
```

### Important (real phone)
On Android/iOS device, `localhost` means **the phone**, not your computer.
Use your computer LAN IP instead, e.g.
`http://192.168.1.20:3000/api`

## 3) Run
```bash
npm start
```

Open with Expo Go, or run:
```bash
npm run android
npm run ios
```

## Backend endpoints used
- POST /auth/signup
- POST /auth/login
- POST /auth/refresh (auto-retry)
- PUT /users/me
- POST /users/me/consents
- POST /bilans
- POST /programmes/generate
- GET /programmes/:id
- GET /seances/:id
- POST /seances/:id/feedback
- GET /dashboard
- GET /notifications

## Default test creds (seed)
- admin: admin@genese.local / AdminPassword123!
