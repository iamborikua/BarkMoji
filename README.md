# 🐶 BarkMoji

**BarkMoji** is a playful web app that analyzes your dog's bark and returns a fun, AI-powered mood with a custom emoji and caption. You can share your dog’s mood as a beautiful, DALL·E-generated image—complete with confetti, paw prints, and the BarkMoji logo!

---

## ✨ Features

- **Bark Analysis:** Uses your device’s microphone to analyze your dog’s bark (pitch, volume, duration, and frequency) and determines a mood.
- **Fun Results:** Each bark returns a unique emoji and playful caption.
- **Shareable Images:** Instantly generate a premium, glassy, DALL·E-powered image of your dog’s mood to share with friends.
- **Dog Profile:** Personalize with your dog’s name, breed, age, and more.
- **Mobile-First, Accessible UI:** Beautiful, glassmorphic design with playful colors and accessible controls.

---

## 🛠️ How It Works

1. **Frontend (React + Vite):**
   - Records your dog’s bark and analyzes its audio features in real time.
   - Maps bark characteristics to a mood, emoji, and caption.
   - Lets you view, share, and download a DALL·E-generated image of your dog’s mood.

2. **Backend (Node.js + Express):**
   - Provides API endpoints for sharing moods and generating images.
   - Uses OpenAI’s DALL·E to create custom dog images based on the detected mood.
   - Stores share metadata in a local SQLite database.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)
- An **OpenAI API key** (for DALL·E image generation)

---

### 1. Clone the Repo

```bash
git clone https://github.com/iamborikua/BarkMoji.git
cd BarkMoji
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

- Create a `.env` file in the `backend` folder with your OpenAI API key:
  ```
  OPENAI_API_KEY=your_openai_api_key_here
  ```

- Start the backend server:
  ```bash
  node index.js
  ```
  The backend will run on [http://localhost:4000](http://localhost:4000) by default.

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

- Start the frontend dev server:
  ```bash
  npm run dev
  ```
  The frontend will run on [http://localhost:5174](http://localhost:5174) (or similar).

- The frontend is configured to proxy API requests to the backend.

---

### 4. Build for Production

- **Frontend:**  
  ```bash
  npm run build
  ```
  The production build will be in `frontend/dist`.

- **Backend:**  
  The backend is ready to run as-is; just ensure your `.env` and `barkmoji_shares.db` are present.

---

## 🧪 Usage

1. Open the frontend in your browser.
2. Follow the onboarding to set up your dog’s profile.
3. Press the record button and let your dog bark!
4. See the fun mood result and share or download the custom image.

---

## 📝 Project Structure

```
BarkMoji/
  backend/      # Node.js API, DALL·E integration, SQLite DB
  frontend/     # React app, UI, bark analysis
```

---

## 🐾 Credits

- Built with [React](https://react.dev/), [Vite](https://vitejs.dev/), [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [OpenAI DALL·E](https://platform.openai.com/docs/guides/images), and [SQLite](https://www.sqlite.org/).
- Inspired by the joy and drama of real dogs everywhere!

---

## 📄 License

MIT 