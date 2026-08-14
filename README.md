# Rann Mitra AI 🌵
### Smart Rann of Kutch Eco-Tourism & Carrying Capacity Planner

> **An Agentic AI solution for sustainable tourism management in Kutch, Gujarat — built for the Smart Rann of Kutch Eco-Tourism & Carrying Capacity Planner challenge.**

---

## 🌍 Problem Statement

The Rann of Kutch is one of India's most ecologically fragile and culturally rich landscapes. The annual **Rann Utsav** festival draws hundreds of thousands of tourists, concentrating pressure on a handful of popular spots — threatening flamingo habitats, exhausting limited water resources, and bypassing the authentic local communities and artisans who are the true custodians of Kutch culture.

---

## 💡 Solution

**Rann Mitra AI** is a ChatGPT-style conversational AI platform that combines a modern chat interface with a multi-agent backend to:

- Help tourists **plan sustainable, low-impact itineraries**
- **Identify and redirect** visitors away from overcrowded spots
- **Explain ecological carrying capacity** of different destinations
- **Connect tourists with local artisans** and community tourism
- Provide an **admin dashboard** for tourism impact visualization
- Enable **responsible tourism** through AI-powered guidance

---

## ✨ Features

| Feature | Description |
|---|---|
| 💬 ChatGPT-style UI | Modern conversational interface with message history |
| 🤖 Multi-Agent Architecture | 5 specialized AI agents + orchestrator |
| 📊 Tourism Dashboard | Interactive charts for impact visualization |
| 🗺️ Destination Explorer | Browse & filter 8 Kutch destinations |
| 🌿 Sustainability Scoring | 0–100 scoring model for every destination |
| ⚡ Carrying Capacity | Pressure indicators per destination |
| 🎨 Artisan & Community Guide | Promotes local crafts and community tourism |
| 📱 Responsive Design | Works on mobile, tablet, and desktop |
| 🔒 Secure Backend | API key never exposed to frontend |
| 🔌 IBM Granite Ready | Abstracted AI provider layer |

---

## 🤖 Agent Architecture

```
User Query
    │
    ▼
┌─────────────────────┐
│   Agent Orchestrator │  ← Detects intent, routes to agents
└─────────┬───────────┘
          │
    ┌─────┴──────────────────────────────┐
    │                                    │
    ▼                                    ▼
Tourist Load Agent          Itinerary Agent
    │                            │
    ▼                            ▼
Carrying Capacity Agent    Community Agent
                                │
                                ▼
                       Tourism Impact Agent
```

### Agents:

1. **Tourist Load Forecasting Agent** — Estimates crowd levels, identifies peak periods, recommends alternatives
2. **Sustainable Itinerary Agent** — Creates day-by-day eco-friendly travel plans
3. **Ecological Carrying Capacity Agent** — Calculates pressure scores, identifies risk levels
4. **Local Community & Artisan Agent** — Promotes local crafts, community tourism, responsible purchasing
5. **Tourism Impact Dashboard Agent** — Provides analytical data for dashboard and complex queries

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Backend | Node.js + Express |
| AI API | Groq (llama3-8b-8192 by default) |
| AI Abstraction | Custom AIProvider (GroqProvider / GraniteProvider) |
| Rate Limiting | express-rate-limit |
| Security | helmet, CORS, .env |
| Markdown | react-markdown + remark-gfm |

---

## 📁 Project Structure

```
rann-mitra-ai/
│
├── client/                         # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx          # Collapsible conversation sidebar
│   │   │   ├── ChatArea.jsx         # Main chat display
│   │   │   ├── ChatInput.jsx        # Multi-line input box
│   │   │   ├── Message.jsx          # Chat message with markdown
│   │   │   ├── TypingIndicator.jsx  # Animated thinking indicator
│   │   │   └── WelcomeScreen.jsx    # Suggested prompts screen
│   │   ├── pages/
│   │   │   ├── ChatPage.jsx         # Main chat page
│   │   │   ├── DashboardPage.jsx    # Tourism impact dashboard
│   │   │   └── DestinationsPage.jsx # Destination explorer
│   │   ├── services/
│   │   │   └── api.js               # Backend API client
│   │   ├── hooks/
│   │   │   └── useChat.js           # Chat state management
│   │   ├── utils/
│   │   │   └── helpers.js           # Scoring helpers
│   │   └── App.jsx
│   └── package.json
│
├── server/                          # Node.js + Express backend
│   ├── agents/
│   │   ├── orchestrator.js          # Intent detection + agent routing
│   │   ├── touristLoadAgent.js      # Tourist pressure analysis
│   │   ├── itineraryAgent.js        # Sustainable trip planning
│   │   ├── carryingCapacityAgent.js # Ecological capacity scoring
│   │   ├── communityAgent.js        # Artisan & community guide
│   │   └── tourismImpactAgent.js    # Dashboard analytics agent
│   ├── services/
│   │   ├── groqService.js           # Main AI service
│   │   └── aiProvider.js            # GroqProvider / GraniteProvider
│   ├── routes/
│   │   └── chat.js                  # API routes
│   ├── data/
│   │   └── destinations.js          # Demo destination dataset
│   ├── middleware/
│   │   └── rateLimiter.js           # Rate limiting
│   └── server.js
│
├── .env.example
└── README.md
```

---

## ⚙️ Environment Setup

### 1. Clone / navigate to project

```bash
cd rann-mitra-ai
```

### 2. Create `.env` in the `server/` directory

```bash
cp .env.example server/.env
```

Edit `server/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama3-8b-8192
AI_PROVIDER=groq
PORT=5000
```

### 3. Get a Groq API Key

1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up / log in
3. Create a new API key
4. Paste it into `server/.env`

---

## 🚀 Running the Application

### Install & Start Backend

```bash
cd server
npm install
npm run dev
```

Server starts at: `http://localhost:5000`

### Install & Start Frontend

```bash
cd client
npm install
npm run dev
```

Frontend starts at: `http://localhost:5173`

Open your browser at **http://localhost:5173**

---

## 🎯 Demo Instructions

1. Open `http://localhost:5173`
2. Try the suggested prompts on the welcome screen
3. Ask: *"Plan a 3-day sustainable trip for a family during Rann Utsav"*
4. Visit `/dashboard` to see the impact analytics
5. Visit `/destinations` to browse and filter destinations
6. Click **"Ask AI"** on any destination card to continue in chat

### Best Demo Scenario

> "I am planning a 3-day Kutch trip during Rann Utsav with my family of 4. I want to avoid crowded places and support local communities. Suggest a sustainable itinerary."

The system will:
- Route to Tourist Load + Itinerary + Community agents
- Analyze crowd pressure
- Generate a day-by-day itinerary
- Include community tourism experiences
- Provide sustainability reasoning

---

## 🔮 Future Improvements

- [ ] Real-time tourist counter integration (Gujarat Tourism API)
- [ ] Live weather API (rain/dust storm alerts)
- [ ] Accommodation booking integration
- [ ] GIS/Map integration (Leaflet.js with real markers)
- [ ] User accounts and itinerary saving
- [ ] Multi-language support (Gujarati, Hindi)
- [ ] Offline-first PWA for areas with poor connectivity
- [ ] Government alert system integration
- [ ] Artisan marketplace integration
- [ ] Festival calendar (Rann Utsav dates, local events)

---

## 🔵 IBM Granite / IBM Cloud Integration Roadmap

The AI layer is fully abstracted via the `AIProvider` pattern:

```javascript
// server/services/aiProvider.js
class GroqProvider { ... }      // Current prototype
class GraniteProvider { ... }   // Future production
```

To switch to IBM Granite:

1. Set `AI_PROVIDER=granite` in `.env`
2. Add `IBM_API_KEY`, `IBM_PROJECT_ID`, `IBM_ENDPOINT` to `.env`
3. Implement the `chat()` method in `GraniteProvider` using the IBM watsonx.ai SDK
4. No other code changes required

**Migration Path:**

```
Prototype → Groq (llama3-8b-8192) [CURRENT]
Production → IBM Granite 13B Instruct via watsonx.ai [PLANNED]
```

---

## ⚠️ Important Disclaimer

All destination scores, tourist load figures, and carrying capacity values in this project are **demo/estimated data for planning and demonstration purposes only**. They are **not** official government measurements, scientific assessments, or real-time data. The system clearly labels all demo data in the UI.

---

## 📄 License

MIT License — Built for the Smart Rann of Kutch Eco-Tourism & Carrying Capacity Planner challenge.
