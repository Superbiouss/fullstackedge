# FullStackEdge - AI-Powered Online Course Platform

FullStackEdge is a feature-rich, open-source platform for creating and selling online courses. It's built with a modern, full-stack technology set and includes powerful AI features to streamline course creation. This project serves as a comprehensive example of building a real-world application with Next.js, Firebase, Stripe, and Genkit.

![FullStackEdge Dashboard](https://placehold.co/800x400.png)
_Note: This is a placeholder image. A real screenshot of the application should be added here._

## ✨ Features

### For Students
- **🔐 Secure Authentication:** Sign up and log in with email/password or using a GitHub account.
- **📚 Course Dashboard:** Browse all available courses, both free and paid.
- **▶️ Interactive Course Player:** View course content, including text-based (Markdown) and video lessons.
- **📊 Progress Tracking:** Keep track of completed lessons with a visual progress bar.
- **🧠 Knowledge Checks:** Test your understanding with multiple-choice quizzes after lessons.
- **🏆 Certificate Generation:** Automatically receive a downloadable SVG certificate upon completing a course.
- **💳 Secure Payments:** Purchase courses seamlessly through Stripe Checkout.
- **💬 Community Forum:** Engage with other learners, ask questions, and share ideas in a dedicated discussion forum.

### For Admins
- **🔐 Protected Admin Panel:** A secure area accessible only to the designated admin user.
- **🤖 AI-Powered Course Generation:** Create a complete, well-structured course with lessons and quizzes from a single title prompt, powered by Google's Gemini model via Genkit.
- **📝 Full CRUD Functionality:** Create, read, update, and delete courses, lessons, and quizzes.
- **📈 Platform Analytics:** Get insights into your platform's performance with charts for total revenue, daily revenue, and course enrollments.
- **🎬 Flexible Lesson Management:** Add lessons with either rich text (Markdown) or uploaded video content.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **AI:** [Genkit](https://firebase.google.com/docs/genkit) & [Google AI (Gemini)](https://ai.google.dev/)
- **UI:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication, Firestore, Storage)
- **Payments:** [Stripe](https://stripe.com/)
- **Deployment:** [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## 🔧 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Firebase](https://firebase.google.com/) project
- A [Stripe](https://stripe.com/) account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/fullstack-edge.git
    cd fullstack-edge
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of your project and add the following variables.

    ```env
    # Firebase Configuration (get these from your Firebase project settings)
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=

    # Admin User UID (see "Admin Access" section below)
    NEXT_PUBLIC_FIREBASE_ADMIN_UID=

    # Stripe Configuration
    STRIPE_SECRET_KEY=

    # Application URL (for Stripe redirects)
    NEXT_PUBLIC_APP_URL=http://localhost:9002
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application should now be running at `http://localhost:9002`.

## 👑 Admin Access

To gain access to the admin dashboard, you need to set your Firebase User ID (UID) as an environment variable.

1.  Sign up for a new account in your running application.
2.  Go to the Firebase Console -> Authentication tab.
3.  Find the user you just created and copy its UID.
4.  Paste the UID into the `NEXT_PUBLIC_FIREBASE_ADMIN_UID` field in your `.env` file.
5.  Restart your development server. You should now see the "Admin" link in the header when logged in with that account.

## 💡 Genkit & AI Flows

The AI-powered features are managed using Genkit. The core logic resides in `src/ai/flows/course-generator-flow.ts`. This flow is defined as a server action and is responsible for communicating with the Google AI API to generate course content based on a user's prompt.
