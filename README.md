# Coverly – AI Resume & Cover Letter Builder 📝✨

Coverly is a frontend-only React + Vite application that helps professionals create polished resumes and tailored cover letters in seconds. The experience is powered by Google’s Gemini generative API, styled with Tailwind CSS, and exports beautiful PDFs with jsPDF — all without a custom backend.

---

## ✨ Features

- **AI-Powered Resume Generation** – Collects detailed contact, experience, education, and skills data and asks Gemini to return a fully structured resume (JSON).
- **Dynamic Resume Preview** – Renders the AI output into a modern layout with fixed-height preview and scrollable sections.
- **Cover Letter Mode** – Switch to cover-letter prompts whenever you just need a quick introduction mailer.
- **PDF Export** – Download resumes or cover letters immediately via jsPDF.
- **Client-Side Only** – No server required; supply your own API key and go.

---

## 🛠 Tech Stack

| Layer          | Tools / Libraries               |
| -------------- | ------------------------------- |
| UI Framework   | React 19 + Vite                 |
| Styling        | Tailwind CSS                    |
| AI Integration | Google AI Gemini API (via REST) |
| PDF Export     | jsPDF                           |
| Dev Utilities  | ESLint, npm scripts             |

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <repo-url> coverly
cd coverly
npm install
```

### 2. Configure Environment

Create a `.env` file at the project root (same level as `package.json`) and add your Gemini credentials:

```env
VITE_GEMINI_API_KEY=your_google_generative_ai_key
# Optional: specify any other Gemini model returned by the ListModels endpoint
VITE_GEMINI_MODEL=gemini-2.5-flash
```

Need a key? Enable the Generative Language API in Google AI Studio, generate a key, and ensure the selected model supports `generateContent`.

### 3. Run the App

```bash
npm run dev
```

The Vite dev server will start (typically at http://localhost:5173). Open it in your browser and start crafting resumes.

---

## 🧭 Usage Tips

1. **Select “Resume” or “Cover Letter.”**
2. **Fill out the expanded form.** The resume flow asks for full contact details, experience roles (with dynamic add/remove), education, skills, certifications, and projects.
3. **Generate with AI.** The app sends a structured prompt to Gemini and expects JSON back. Errors are surfaced with human-friendly messages.
4. **Review & Export.** The right-hand panel keeps a standard resume height, scrollable for longer results, and offers Copy / Clear / Download PDF actions.

> ⚠️ Since Coverly runs entirely in the browser, your Gemini API key is exposed to anyone using the built bundle. For public deployments, proxy the AI call through a lightweight backend you control.

---

## 🧪 Scripts

| Command         | Description                   |
| --------------- | ----------------------------- |
| `npm run dev`   | Start Vite development server |
| `npm run build` | Production build              |
| `npm run lint`  | Run ESLint over the project   |

---

## 🧰 Folder Structure

```
src/
├─ components/
│  ├─ Header.jsx
│  ├─ InputArea.jsx
│  ├─ Loader.jsx
│  ├─ OptionSelector.jsx
│  └─ OutputBox.jsx
├─ utils/
│  └─ generateText.js
├─ App.jsx
├─ index.css
└─ main.jsx
```

- `InputArea` handles the dynamic resume form.
- `OutputBox` renders resume JSON or cover letter text and manages PDF / copy actions.
- `generateText.js` calls the Gemini model using the configured API key.

---

## 📦 Deployment Notes

- Ensure `VITE_GEMINI_API_KEY` is set in the production environment (e.g., on Vercel/Netlify) before build time.
- Consider adding a proxy/API layer before exposing the app publicly to protect your key and rate limits.

---

## 🙌 Contributing

Issues and pull requests are welcome! Ideas for future enhancements:

- Multiple resume templates / PDF themes
- Local storage of draft resumes
- Integrations with other LLMs (OpenAI, Anthropic, Groq, etc.)
- Form validation + auto-suggestions for highlights

---

## 📄 License

Free for personal and educational use. If you integrate Coverly into a commercial offering, give credit and ensure user API keys remain secure.

---

Happy building—and best of luck with your AI-crafted job applications! 🚀

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
