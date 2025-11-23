NEXFLIX – Netflix Clone (React + Vite + Tailwind)
A beautiful, fully responsive Netflix clone built with React, Vite, Tailwind CSS, Framer Motion & React Toastify. Works 100% offline with dummy data and real movie posters.
Live Demo → Just run it locally!
Features

2-second animated NEXFLIX splash screen
Login / Register / Logout (saved in localStorage)
Stunning hero banner with gradient overlay
Smooth horizontal scrolling rows (mobile-friendly)
Click any movie → beautiful modal with details
Add/Remove from My List (saved forever)
Toast notifications
Fully responsive – looks perfect on phone, tablet, desktop
No API key needed – 20 gorgeous dummy movies included
Framer Motion animations everywhere
Tailwind CSS + modern dark UI

Tech Stack

React 18 + Vite
Tailwind CSS
Framer Motion
React Toastify
localStorage (for auth & watchlist)

Quick Start (2 minutes)
Bash# 1. Clone or download this project
git clone https://github.com/yourname/nexflix-clone.git
cd nexflix-clone

# 2. Install dependencies
npm install

# 3. Start the app
npm run dev
Open http://localhost:5173 → Enjoy your Netflix clone!
Folder Structure
textsrc/
├── App.jsx          ← Everything in ONE beautiful file
├── main.jsx
├── index.css        ← Tailwind base
└── assets/          ← (optional images)
Want Real Movies? (Optional)
Replace the dummy data with TMDB API:

Get free API key → https://www.themoviedb.org/settings/api
In App.jsx, replace:

JavaScriptconst TMDB_API_KEY = "your_real_key_here";

Uncomment the fetch useEffect and remove dummy data

Screenshots
(You can add real screenshots later)
Credits

Movie posters from TMDB & Unsplash
Inspired by Netflix UI
Built with love by You

License
MIT – feel free to use for learning, portfolio, or fun!
