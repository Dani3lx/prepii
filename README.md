# Prepii

![image](https://github.com/user-attachments/assets/c45e39a8-1546-4e48-8e12-57a68a763aaa)


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
- **Optimized Performance with Caching**: Leveraging Redis to cache frequently accessed data for faster load times and reduced database usage.

## Challenges Faced
- **Choosing the right tool** - Choosing between prebuilt AI services (like Vapi AI) and building custom solutions (e.g., Deepgram + GPT-4) required balancing cost, performance, integration complexity, and development speed.
- **Optimizing AI response quality** - Designing prompts that consistently produce high-quality, relevant, and realistic questions and feedback was an iterative process involving extensive testing and fine-tuning.
- **Data Privacy & Security**: Storing user sessions, feedback, and analytics required implementing secure authentication and careful handling of potentially sensitive data.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Shadcn
- **Backend:** Node.js, Next.js server action, Redis Cache
- **AI Services:** Google Gemini for question and feedback generation, Vapi AI for live voice call sessions
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Deployment:** Vercel

## Future Improvements
- Resume/linkedIn scanner to automatically extract information on user for a more personalized interview experience
- Extract and autofill the interview generation form automatically from the job posting
- Fine-tune models and improve prompts for enhanced AI responses

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
or follow the following structure:
```bash
FIREBASE_PROJECT_ID=""
FIREBASE_PRIVATE_KEY=""
FIREBASE_CLIENT_EMAIL=""
GOOGLE_GENERATIVE_AI_API_KEY=""

NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=""

NEXT_PUBLIC_REDIS_USERNAME=""
NEXT_REDIS_PASSWORD=""
NEXT_PUBLIC_REDIS_HOST=""
NEXT_PUBLIC_REDIS_PORT=""

NEXT_PUBLIC_VAPI_WEB_TOKEN=""
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
