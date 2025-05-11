# Prepii

<p align="center">
  <strong>
  <em>Prepii</em> is an all-in-one platform for mastering behavioral interviews, featuring live, AI-voiced mock interviews and intelligent feedback.
    It helps you practice, track progress, and build the confidence to ace interviews and land your dream job.
  </strong>
</p>

## Defining the Problem
Many job candidates struggle to perform well in behavioral interviews, not because they lack experience, but because they lack a clear way to prepare. Unlike technical interviews, which have established platforms offering structured, repeatable practice, behavioral prep is often ad hoc — limited to scattered blog posts, generic advice, or mock interviews with friends. This lack of a focused, feedback-driven system leaves candidates underprepared for a critical part of the hiring process.

## Features
- **Personalized Interview Questions**: Generates tailored behavioral questions based on specific job postings using Google Gemini.
- **Live AI-Voiced Mock Interviews**: Conduct realistic, voice-based mock interviews powered by Vapi AI for an immersive experience.
- **Smart Feedback**: Receive actionable insights and personalized feedback after each session, powered by Google Gemini.
- **Progress Tracking & Analytics**: Monitor your improvement over time with detailed charts and performance metrics.
- **Secure Authentication**: Reliable user login and management via Firebase Auth.

## Tech Stack

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
