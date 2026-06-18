# 🍿 NextWatch – Movie & TV Show Discovery App

[![React](https://img.shields.io/badge/React-19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![TMDB API](https://img.shields.io/badge/TMDB_API-Integration-01B4E4?style=flat-square&logo=themoviedb&logoColor=white)](https://www.themoviedb.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://opensource.org/licenses/MIT)

NextWatch is a movie discovery platform that helps users find trending movies and TV shows, view streaming availability, and manage their personal watchlists. I created this project to practice fetching and managing data from third-party APIs.

---

## 🌐 Live Demo

**Live App:** [https://next-watch-web.vercel.app/](https://next-watch-web.vercel.app/)

---

## 📸 Interactive System Tour

![NextWatch Preview](docs/screenshots/preview.png)

---

## ✨ Key Features

* **Movie discovery:** Browse trending movies and TV shows.
* **Search:** Search for specific titles with real-time results.
* **Watchlist:** Add movies to a personal watchlist saved in local storage.
* **Streaming providers:** Find out where to stream your favorite movies.
* **Responsive UI:** A beautifully designed interface that works seamlessly on desktop and mobile.

---

## 🧠 What I Learned

* Interacting with external REST APIs (TMDB API) and handling asynchronous data in React.
* Implementing debounce for search inputs to reduce unnecessary API calls.
* Creating smooth micro-animations and page transitions using Framer Motion.
* Managing global state utilizing React's Context API.

---

## 🛠 Tech Stack

* **React 19**
* **Vite**
* **Tailwind CSS**
* **Framer Motion**
* **TMDB API**
* **React Router**
* **Context API**

---

## 🚀 Installation & Local Setup

### 1. Prerequisites
- Node.js 20+
- npm or pnpm
- TMDB Read Access Token

### 2. Clone & Install Dependencies

```bash
git clone https://github.com/Ujjwallp/NextWatch_web.git
cd NextWatch_web
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add your TMDB Token:

```env
VITE_TMDB_TOKEN="your_tmdb_read_access_token_here"
```

### 4. Run Development Server

```bash
npm run dev
```

---

## 👨‍💻 Author

**Ujjwal Prakash**
* **GitHub:** [https://github.com/Ujjwallp](https://github.com/Ujjwallp)
