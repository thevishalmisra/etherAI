# Ether AI – Gemini Chatbot

A modern, conversational AI chatbot powered by Google Gemini (via AI SDK), built with Next.js, React, and Tailwind CSS.  
Deployed on Vercel for seamless, serverless operation.

---

## ✨ Features

- **Conversational AI**: Uses Google Gemini for intelligent, context-aware responses.
- **Voice Input**: Speak your questions using built-in speech recognition.
- **Theme Toggle**: Switch between dark and light modes.
- **Chat Export & Share**: Download or share your chat history.
- **Responsive UI**: Mobile-friendly, beautiful design with Tailwind CSS.
- **Streaming Responses**: See answers as they’re generated.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/thevishalmisra/etherAI.git
cd etherAI
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_gemini_api_key_here
```

Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### 4. Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🛠️ Deployment

This project is ready to deploy on [Vercel](https://vercel.com/):

1. Push your code to GitHub.
2. Import your repo into Vercel.
3. Set the `GOOGLE_GENERATIVE_AI_API_KEY` environment variable in Vercel dashboard.
4. Deploy!

---

## 📁 Project Structure

```
app/                # Next.js app directory (pages, API routes)
components/         # Reusable React components
hooks/              # Custom React hooks
lib/                # Utility functions
public/             # Static assets
styles/             # Global styles (Tailwind)
```

---

## 🧠 Credits

- [Google Gemini](https://ai.google.dev/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)

---

## 📄 License

MIT License

---

**Made with ❤️ by Vishal Misra**

