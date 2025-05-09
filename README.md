# Prepii

<p align="center">
  <strong>
  <em>Prepii</em> is an all-in-one platform for mastering behavioral interviews, featuring live, AI-voiced mock interviews and intelligent feedback.<br>
    It helps you practice, track progress, and build the confidence to ace interviews and land your dream job.
  </strong>
</p>

## Features

- **Personalized Interview Questions**: Utilizes Google Gemini to generate tailored interview questions based on job postings.
- **Live AI-voiced mock interviews**: One-on-one live interview sessions with an AI powered by Vapi AI, delivering realistic voice and speech for a highly immersive experience.
- **Smart feedback**: Generates actionable insights and personalized feedback after each session using Google Gemini.
- **Progress tracking and analytics**: User dashboard featuring comprehensive charts and performance metrics for tracking progress over time.
- **Secure authentication**: Uses Firebase Auth to provide reliable, secure sign-in and user management.

## 🛠Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Shadcn
- **Backend:** Node.js, Next.js server action
- **AI Services:** Google Gemini for question and feedback generation, Vapi AI for live voice call sessions
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Deployment:** Vercel

## Getting Started

First, clone the project:
```bash
git clone https://github.com/Dani3lx/prepii.git
```

Go to project repository:
```bash
cd prepii
```

Install dependencies:
```bash
npm i
```

Set up environment variables using the structure specified in the example:
```bash
cp .env.example .env
```

Lastly, run the server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
