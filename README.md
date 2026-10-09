# 🚧 Hafra.DZ (حفرة) — Carte Citoyenne des Routes Algériennes

> **"Krahna mel hfari w trik lamharia taa chkopi surtt f djnan sfari, w amortisseurs mchaw fiha!"**  
> An open-source, citizen-powered platform born out of sheer frustration with crater-filled roads across Algeria.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status: Active](https://img.shields.io/badge/Status-Community%20Driven-orange.svg)](https://github.com)
[![Wilayas: 58](https://img.shields.io/badge/Wilayas-58%20DZ-blue.svg)](https://github.com)

---

## 🇩🇿 Why Hafra.DZ? (The Story Behind the Project)

Every driver, motorcyclist, and pedestrian in Algeria knows the struggle:
- You fix your suspension or buy brand new tires, and three days later you dive into an unlit crater on the RN or inside your neighborhood.
- Speed bumps (*dos-d'âne sauvages*) built overnight that look like mini mountains without any warning paint.
- Open manholes (*regards maftouhin*) swallowing wheels and putting people in danger.
- Everyone vents in tea shops, taxi chats, and Facebook groups: *"Kayen hafra kbira f l'autoroute!"*, but nothing is mapped, tracked, or made visible.

**Instead of waiting and complaining, we built Hafra.DZ.**  
A fast, lightweight, map-first web app that lets any Algerian snap a photo, drop an exact GPS pin, and put every road disaster on a live public map for everyone — citizens, drivers, and local municipalities (*Baladiya* / *DTP*) — to see and act on.

---

## ⚡ Features

- 📍 **Live Interactive Map**: Crisp CARTO basemaps with automatic Dark Mode / Light Mode support.
- 📸 **10-Second Signalement**:
  - Auto GPS geolocation or manual pin drop anywhere across the 58 Wilayas.
  - Photo upload directly from smartphone camera.
  - Categorization: *Hafra (Nid-de-poule)*, *Dos-d'âne non-réglementaire*, *Regard découvert (Open manhole)*, *Glissement / Chaussée dégradée*.
  - Danger severity rating (Faible, Moyen, Critique).
- 🔥 **Heatmap & Clustering**: See high-density danger zones where whole avenues need resurfacing.
- 🛡️ **Admin & Municipal Dashboard (`/admin`)**:
  - Filter by Wilaya, status (*En attente*, *En cours*, *Réparé*), and date.
  - Generate official PDF summary reports for community leaders or local delegations.
  - Real-time updates backed by Firebase Firestore.
- 📱 **PWA & Mobile-First**: Works seamlessly on any smartphone browser without heavy downloads.

---

## 📖 User Manual — How to Use Hafra.DZ

### 1. For Citizens & Drivers (Reporting a Problem)
1. **Open the App**: Visit the app on your phone or computer.
2. **Click "Signaler un obstacle" (بلّغ عن حفرة)**: Tap the bottom action button.
3. **Set the Location**:
   - Tap **"Ma position"** to automatically pin using your phone's GPS.
   - Or drag the pin on the map to the exact spot.
4. **Take a Picture**: Snap a clear photo of the road hazard (helps others estimate depth/danger).
5. **Add Details**:
   - Choose hazard type (Pothole, Dangerous speed bump, Open manhole, Degraded asphalt).
   - Rate severity: Low (slow down), Medium (vehicle damage risk), High (immediate accident hazard).
   - Add a brief note (e.g., *"Devant l'arrêt de bus, non éclairé la nuit"*).
6. **Publish**: Tap **Envoyer**. Your report is immediately pinned to the public map for all drivers!

### 2. For Drivers on the Road (Navigating)
- Open the map before taking unfamiliar routes.
- Red markers indicate critical hazards; click any pin to view actual photos and reported date.
- Switch between **Light Mode** (daytime driving) and **Dark Matter** (night mode to reduce glare).

### 3. For Community Managers & Municipalities (`/admin`)
- Access `/admin` to view incoming reports in real time.
- Review photos and update statuses (*En attente* ➡️ *Pris en charge* ➡️ *Réparé*).
- Export printable PDF reports to submit to local road maintenance departments (*Travaux Publics* / *APC*).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Mapping**: Leaflet, React-Leaflet, CARTO Basemaps (Voyager & Dark Matter)
- **Database & Sync**: Firebase Firestore (real-time documents & geo-indexing)
- **Server / Deployment**: Node.js / Express proxy & Vercel serverless integration

---

## 🚀 Local Development Setup

If you want to run or contribute to Hafra.DZ on your local machine:

### Prerequisites
- Node.js (v18+)
- npm or bun

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/hafra-dz.git
cd hafra-dz
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (you can copy `.env.example`):
```bash
cp .env.example .env
```
Inside `.env`:
```env
VITE_CARTO_API_KEY="your_carto_api_key_here"
```
*(Firebase configuration is loaded automatically from `firebase-applet-config.json`).*

### 4. Start the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
npm run build
```

---

## 🌐 Deploying to Vercel

This repository is pre-configured with `vercel.json` for smooth SPA routing and `/admin` rewrites.

1. Push your changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: updated Hafra.DZ app"
   git push origin main
   ```
2. Connect your GitHub repository in your [Vercel Dashboard](https://vercel.com).
3. In **Project Settings** > **Environment Variables**, add:
   - `VITE_CARTO_API_KEY`: your CARTO API key.
4. Deploy! Vercel handles building the Vite app and serving the `dist/` directory.

---

## 🤝 Contributing (Li hab y'3awen)

Contributions are welcome from developers, designers, and active citizens all over Algeria!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/MlihaLiha`).
3. Commit your Changes (`git commit -m 'Add awesome feature'`).
4. Push to the Branch (`git push origin feature/MlihaLiha`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

**Tahya El Djazair 🇩🇿 — Pour des routes plus sûres.**
