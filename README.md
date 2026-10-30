## Hi there 👋

<!--
**jennysandhi150/jennysandhi150** is a ✨ _special_ ✨ repository because its `README.md` (this file) appears on your GitHub profile.

Here are some ideas to get you started:

- 🔭 I’m currently working on ...
- 🌱 I’m currently learning ...
- 👯 I’m looking to collaborate on ...
- 🤔 I’m looking for help with ...
- 💬 Ask me about ...
- 📫 How to reach me: ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...
-->

## Antigravity GitHub Integration Test

This section verifies the local Antigravity-to-GitHub workflow.

---

# MindMate AI — AI-Powered Productivity Assistant

MindMate AI is a modern productivity dashboard built with React 18, TypeScript, Tailwind CSS, and Vite. It provides conversational AI guidance, starter prompt accelerators, text summarization, actionable task extraction, and structured milestone planning.

![MindMate AI Theme](https://img.shields.io/badge/Theme-Dark%20Navy%20%26%20Violet-7C3AED)
![Stack](https://img.shields.io/badge/Stack-React%2018%20%7C%20TypeScript%20%7C%20Vite%20%7C%20Tailwind-blue)
![Testing](https://img.shields.io/badge/Testing-Vitest%20%7C%20Testing%20Library-green)

---

## Features

### 🤖 AI Conversational Assistant
- **Productivity-Optimized Chat**: Discuss objectives, ask questions, or request project breakdowns.
- **Suggested Prompts**: Instant starters for summarization, task planning, focus habits, and milestone roadmaps.
- **Demo Mode & Live Mode**: Includes an interactive local Demo Mode for realistic simulation without requiring an external API key.
- **Transparent Status**: Clear indicators for AI status and helpful configuration guidance when external services are unavailable.

### ⚡ Productivity Workbench
- **Text Summarizer**: Ingests articles, emails, or notes and extracts executive summaries and bulleted key points.
- **Actionable Task Extractor**: Converts rough notes into an interactive, checkable checklist with automatic priority detection (High, Medium, Low).
- **Structured Plan Builder**: Generates phased 5-step milestone plans complete with timeline estimates and priority tags.
- **One-Click Clipboard Copy**: Instantly copy summaries, checklists, and plans in formatted Markdown.

### 💾 Local Privacy & Conversation History
- **Client-Side Persistence**: Saves conversations in browser `LocalStorage` so you can revisit past sessions.
- **Privacy Disclosure**: Conversations are stored locally on your device and are never transmitted to external databases.
- **Session Management**: Rename, resume, or delete conversations with accessible confirmation dialogs.

### 🎨 User Interface & Accessibility
- **Dark Navy & Violet Aesthetics**: Styled with a `#070B14` base, `#131B2E` cards, and vibrant `#7C3AED` violet accents.
- **Fully Responsive**: Mobile drawer navigation, tablet layouts, and full desktop multi-panel view.
- **Accessible Design**: Semantic HTML, visible keyboard focus indicators (`focus-ring`), and screen-reader friendly controls.

---

## Project Structure

```text
jennysandhi150-project/
├── .env.example                # Example environment configuration
├── .gitignore                  # Git ignore rules for node_modules, build & secrets
├── index.html                  # HTML5 entrypoint with dark theme metadata
├── package.json                # Project dependencies and operational scripts
├── postcss.config.js           # PostCSS configuration for Tailwind CSS
├── tailwind.config.js          # Tailwind CSS theme configuration (navy/violet tokens)
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite bundler & Vitest test runner configuration
├── vitest.setup.ts             # Vitest setup with @testing-library/jest-dom
├── src/
│   ├── App.tsx                 # Root application component
│   ├── index.css               # Tailwind directives and custom scrollbars
│   ├── main.tsx                # React DOM entrypoint
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces (Conversation, Message, Plan, Task)
│   ├── services/
│   │   ├── aiService.ts        # AI engine (Demo mode and live API provider hook)
│   │   ├── productivityService.ts # Summarization, task extraction, and plan generator
│   │   └── storageService.ts   # LocalStorage persistence manager
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx      # Header bar with mode pill and quick actions
│   │   │   ├── Sidebar.tsx     # Responsive navigation sidebar
│   │   │   └── ConfirmationModal.tsx # Accessible modal dialog
│   │   ├── chat/
│   │   │   ├── ChatInput.tsx   # Text input with keyboard shortcuts
│   │   │   ├── ChatView.tsx    # Conversational chat workspace
│   │   │   ├── LoadingSkeleton.tsx # Pulsing shimmer loading indicator
│   │   │   ├── MessageItem.tsx # Message bubble with markdown & copy buttons
│   │   │   └── SuggestedPrompts.tsx # Clickable prompt acceleration chips
│   │   ├── productivity/
│   │   │   └── ProductivityView.tsx # Multi-tab productivity tools
│   │   ├── history/
│   │   │   └── HistoryView.tsx # Saved chat sessions manager
│   │   └── settings/
│   │       └── SettingsView.tsx # Mode toggling & API configuration guide
│   └── test/
│       ├── aiService.test.ts   # Unit tests for AI service & demo modes
│       ├── ChatView.test.tsx   # Component tests for chat feed & prompts
│       ├── productivityService.test.ts # Unit tests for summarizer & planner
│       └── storageService.test.ts # Unit tests for conversation persistence
└── README.md                   # Repository documentation
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended; v24 verified)
- npm (v9 or higher recommended; v11 verified)

### Installation
Install project dependencies:
```bash
npm install
```

### Running the Development Server
Start the local Vite development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Running Tests
Execute unit and component tests with Vitest:
```bash
npm test
```

To run tests in watch mode during development:
```bash
npm run test:watch
```

### Production Build
Compile TypeScript and build the optimized production assets:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## Environment Configuration

MindMate AI starts in **Demo Mode** by default, allowing you to explore all features immediately.

To configure live server-side AI integration:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure your API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. API keys are strictly loaded server-side and excluded from source control via `.gitignore`.
