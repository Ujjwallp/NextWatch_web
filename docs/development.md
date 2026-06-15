# 🛠️ NextWatch Development Guide

Welcome to the NextWatch development guide. This document serves as the onboarding checklist and style guide for engineering teams.

---

## 1. Local Environment Setup

### Prerequisites
* **Node.js**: `v20.x` or higher (LTS recommended)
* **NPM**: `v10.x` or higher

### Step-by-Step Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Ujjwallp/NextWatch_web.git
   cd NextWatch_web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## 2. Environment Configurations

API requests require a valid Read Access Bearer Token from The Movie Database.

1. Navigate to your TMDB Account Settings ➔ API page.
2. Generate an API Read Access Token (Bearer Token).
3. Create a `.env.local` file in the root of the project:
   ```env
   # TMDB Read Access Token (Bearer Auth)
   VITE_TMDB_TOKEN="your_jwt_bearer_token_here"
   ```

*Warning: Never check `.env.local` or raw API keys into source control. It is ignored by default in the root `.gitignore` configuration.*

---

## 3. Development Commands

The following scripts are defined in `package.json`:

* **Start Development Server**: Runs local dev target with hot module replacement (HMR).
  ```bash
  npm run dev
  ```
* **Build Production Bundle**: Compiles code into standard, split web assets under `/dist`.
  ```bash
  npm run build
  ```
* **Preview Production Build**: Runs local web server to preview static files compiled in `/dist`.
  ```bash
  npm run preview
  ```

---

## 4. Code Standards & Naming Conventions

To keep the repository clean and maintainable, engineers must follow these conventions:

### File Naming Conventions
* **Files**: All React component, page, context, and hook files must use kebab-case:
  * Good: `movie-card.jsx`, `watchlist-context.jsx`, `use-debounce.js`
  * Bad: `MovieCard.jsx`, `WatchlistContext.jsx`, `useDebounce.js`
* **Directories**: Sibling folders must be singular and lowercase (e.g. `pages`, `components/ui`, `contexts`).

### Imports Standard
* Use path aliases (`@/`) to avoid deep relative path nesting:
  * Good: `import { Button } from "@/components/ui/button";`
  * Bad: `import { Button } from "../../../../components/ui/Button";`

### React Best Practices
* Components should export a named component block:
  ```jsx
  export const MovieCard = ({ item }) => {
    // ...
  };
  ```
* Custom hooks must be prefixed with `use-`:
  ```javascript
  export const useDebounce = (value, delay) => {
    // ...
  };
  ```
* Keep state hooks specialized, moving complex shared states to context providers.
