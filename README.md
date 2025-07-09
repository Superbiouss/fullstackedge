
# 🚀 FullStackEdge - AI-Powered Online Course Platform

<p align="center">
  <img src="https://placehold.co/800x400.png" alt="FullStackEdge Dashboard" data-ai-hint="dashboard learning" />
</p>

**FullStackEdge** is a feature-rich, open-source platform for creating and selling online courses. It's built with a modern, full-stack technology set and includes powerful AI features to streamline course creation. This project serves as a comprehensive, real-world example of building a production-grade application with Next.js, Firebase, Stripe, and Google's Genkit for AI integration.

## ✨ Key Features

### For Students
- **🔐 Secure Authentication:** Sign up and log in with email/password or using a GitHub account via Firebase Authentication.
- **📚 Course Dashboard:** Browse all available courses, track your progress, and see which courses you've purchased.
- **▶️ Interactive Course Player:** A dedicated, distraction-free interface for learning. Supports both text-based (Markdown) and video lessons.
- **📊 Progress Tracking:** Automatically saves your progress. Completed lessons are marked, and a progress bar shows how far you've come.
- **🧠 Knowledge Checks:** Test your understanding with multiple-choice quizzes after lessons, with instant feedback.
- **🏆 Certificate Generation:** Automatically receive a downloadable SVG certificate upon completing a course, which is stored in Firebase Storage.
- **💳 Secure Payments:** Purchase courses seamlessly through Stripe Checkout, with a dedicated API route to handle session creation.
- **💬 Community Forum:** Engage with other learners, ask questions, and share ideas in a dedicated discussion forum built with Firestore real-time listeners.

### For Admins
- **🔐 Protected Admin Panel:** A secure area accessible only to the designated admin user, protected via environment variables and client-side checks.
- **🤖 AI-Powered Course Generation:** Create a complete, well-structured course with lessons and quizzes from a single title prompt, powered by Google's Gemini model via Genkit.
- **📝 Full CRUD Functionality:** Create, read, update, and delete courses, lessons, and quizzes through an intuitive interface.
- **📈 Platform Analytics:** Get insights into your platform's performance with charts for total revenue, daily revenue, and course enrollments, powered by Recharts.
- **🎬 Flexible Lesson Management:** Add lessons with either rich text (Markdown) or by uploading video content directly to Firebase Storage.

## 🛠️ Tech Stack

| Category             | Technology / Library                                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Framework**        | [Next.js](https://nextjs.org/) (App Router, Server Components, Server Actions)                                        |
| **AI**               | [Genkit](https://firebase.google.com/docs/genkit), [Google AI (Gemini)](https://ai.google.dev/)                          |
| **UI Components**    | [React](https://react.dev/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)               |
| **State Management** | React Hooks (`useState`, `useEffect`, `useContext`)                                                                     |
| **Forms**            | [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation                                |
| **Charts/Data Vis**  | [Recharts](https://recharts.org/)                                                                                     |
| **Icons**            | [Lucide React](https://lucide.dev/guide/packages/lucide-react)                                                          |
| **Backend & DB**     | [Firebase](https://firebase.google.com/) (Authentication, Firestore, Storage)                                         |
| **Payments**         | [Stripe](https://stripe.com/)                                                                                         |
| **Deployment**       | [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)                                                  |

## 📁 Project Structure

The project follows a standard Next.js App Router structure with some key directories:

```
src
├── app/                    # Next.js App Router routes
│   ├── (auth)/             # Route group for auth pages (login, signup)
│   ├── admin/              # Protected admin panel routes
│   ├── api/                # API routes (Stripe, Admin Stats)
│   ├── community/          # Community forum pages
│   ├── courses/            # Course consumption/player pages
│   ├── dashboard/          # Student dashboard
│   ├── globals.css         # Global styles and ShadCN theme variables
│   └── layout.tsx          # Root layout
├── ai/                     # Genkit AI flows and configuration
│   ├── flows/              # Business-specific AI logic (e.g., course generation)
│   └── genkit.ts           # Genkit initialization
├── components/             # Reusable React components
│   ├── admin/              # Components specific to the admin panel
│   ├── auth/               # Auth-related forms
│   ├── course-viewer/      # Components for the course player UI
│   ├── providers/          # React Context providers (e.g., AuthProvider)
│   └── ui/                 # ShadCN UI components
├── hooks/                  # Custom React hooks (e.g., useAuth, use-toast)
├── lib/                    # Core libraries and utility functions
│   ├── firebase.ts         # Firebase SDK initialization and configuration
│   ├── stripe.ts           # Stripe SDK initialization
│   └── utils.ts            # Utility functions (e.g., cn for Tailwind)
└── types/                  # TypeScript type definitions for the project
```

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A **Firebase Project** with Authentication, Firestore, and Storage enabled.
- A **Stripe Account** to handle payments.

### Installation & Setup

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
    # Firebase Configuration
    # Found in your Firebase project settings > General
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=

    # Admin User UID (see "Admin Access" section below)
    NEXT_PUBLIC_FIREBASE_ADMIN_UID=

    # Stripe Configuration
    # Found in your Stripe Dashboard > Developers > API keys
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

1.  Sign up for a new account in your running application (using email or GitHub).
2.  Go to the **Firebase Console** -> **Authentication** tab.
3.  Find the user you just created and copy its **UID**.
4.  Paste the UID into the `NEXT_PUBLIC_FIREBASE_ADMIN_UID` field in your `.env` file.
5.  Restart your development server. You should now see the "Admin" link in the header when logged in with that account.

## 💡 Core Concepts Explained

### AI Course Generation
The AI-powered features are managed using **Genkit**. The core logic resides in `src/ai/flows/course-generator-flow.ts`. This flow defines a structured `generateCourse` server action that communicates with the Google AI API. When an admin provides a course title, this flow:
1.  Receives the title as input.
2.  Uses a Zod schema to define the exact output structure it needs from the AI (including lesson titles, content, and quiz questions/answers).
3.  Sends a detailed prompt to the Gemini model, instructing it to act as an expert course creator.
4.  Receives the structured JSON data back from the model.
5.  Writes the complete course, along with all its lessons and quizzes, to Firestore in a single operation.

### Firebase Integration
Firebase is the backbone of the application's backend:
-   **Authentication:** Manages user sign-up, login, and sessions for both email/password and GitHub providers.
-   **Firestore:** A NoSQL database used to store all application data, including `users`, `courses`, `lessons`, `quizzes`, `threads`, and `userProgress`. Real-time listeners (`onSnapshot`) are used throughout the app to keep the UI in sync with the database.
-   **Storage:** Used to host user-uploaded media like course thumbnails, video lessons, and generated course completion certificates.

### Stripe Payments
Paid courses are handled via Stripe. The checkout flow is initiated in `src/app/api/stripe/checkout/route.ts`.
1.  A user clicks the "Buy" button on a paid course.
2.  The client sends a request with the `courseId` and `userId` to the API route.
3.  The server validates the request and uses the Stripe Node.js library to create a `Checkout Session`.
4.  The session's URL is returned to the client, which then redirects the user to Stripe's secure checkout page.
5.  Upon successful payment, Stripe redirects the user back to the course page, where a `useEffect` hook handles the enrollment logic by updating the user's profile in Firestore.

---

<p align="center">
  Happy Coding!
</p>
