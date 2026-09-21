# Sammie Digital Studio Website

Official website for **Sammie Digital Studio** — built with clean, modern **HTML5, CSS3, JavaScript (ES6), and Google Cloud Firestore**.

---

## 📁 Project Structure

```text
├── index.html                  # Main website entry point (Semantic HTML5 & SEO)
├── style.css                   # Main stylesheet (Dark mode, responsive grid, RTL)
├── app.js                      # Main JavaScript (Cloud Firestore, 7 languages, WhatsApp quote)
├── firebase-applet-config.json # Firebase database credentials
├── public/
│   ├── manifest.json           # Progressive Web App (PWA) manifest
│   ├── sw.js                   # PWA Service Worker (offline cache)
│   └── assets/images/          # Logos, flyer graphics, and artwork assets
├── package.json                # Minimal project manifest
├── vite.config.js              # Minimal preview configuration
└── README.md                   # Setup and deployment guide
```

---

## 🚀 How to Run Locally

### Option 1: Live Server in VS Code
1. Open the folder in **VS Code**.
2. Right-click `index.html` and select **"Open with Live Server"**.

### Option 2: Using Python (Built into Mac & Windows)
Run in your terminal inside the folder:
```bash
python3 -m http.server 3000
```
Then visit `http://localhost:3000`.

### Option 3: Using Node / Vite
```bash
npm install
npm run dev
```

---

## 🌐 How to Deploy to Vercel (Free & Instant)

1. Upload or push this folder to your **GitHub** account.
2. Go to **[vercel.com](https://vercel.com)** and sign in.
3. Click **"Add New Project"** and import your GitHub repository.
4. Vercel automatically detects the configuration (`npm run build` -> `dist`).
5. Click **"Deploy"**. Your website is live in 30 seconds!

---

## 🗄️ Real-Time Cloud Firestore Portfolio

The portfolio is dynamically connected to your **Cloud Firestore** database:
- **Database ID:** `ai-studio-sammiedigitalstu-d0267da7-ad4a-4e5d-b71b-6a0163321355`
- **Collection Name:** `portfolio`

Each document in `portfolio` can have the following fields:
* `title` (string): Project name (e.g., "Sunday Service Church Flyer")
* `category` (string): `websites`, `flyers`, `branding`, or `social`
* `description` (string): Short summary
* `image` (string): Image URL or relative path

Whenever you add or update an item in Firebase, the website updates live without needing a rebuild!

---

## 📞 Studio Contact Info
* **Founder:** Adeniran Samuel Inioluwa
* **Direct Line & WhatsApp:** 08168874826
* **Email:** sammiedigitalstudio1@gmail.com
* **Tagline:** Design. Develop. Grow.
