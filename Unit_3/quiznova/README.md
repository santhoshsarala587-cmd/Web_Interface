# QuizNova — Online Quiz & Assessment Management System

A frontend-only, dark-glassmorphism React app simulating a full college assessment platform for Students and Admins, powered entirely by localStorage.

## Setup

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

To build for production:
```bash
npm run build
npm run preview
```

## Demo Accounts

**Student**
- Email: `student@quiznova.com`
- Password: `1234`

**Admin**
- Email: `admin@quiznova.com`
- Password: `admin123`

(Use the "Fill Student/Admin Demo" buttons on the login screen for one-click access.)

## What's included

- Role-based auth (Student / Admin) simulated with localStorage — protected routes prevent cross-role access
- Full student flow: browse assigned quizzes → register → take timed quiz with question navigator → submit → view results once published
- Full admin flow: create quiz (4-step wizard) → build/reuse questions → assign to students/departments → monitor participation → evaluate submissions → publish results → analytics dashboard (Recharts)
- Realistic seeded demo data (10 students, 8 quizzes, 48 questions, assignments/submissions/results across every workflow status) generated on first load
- Responsive layout with collapsible sidebar on mobile

## Project Structure

```
src/
  components/   Sidebar, Modal, Toast, QuizCard, Timer, UI atoms, ProtectedRoute
  pages/auth/   Login, Signup
  pages/student/ Dashboard, AssignedQuizzes, QuizDetails, QuizAttempt, Results, ResultDetails, Profile
  pages/admin/   Dashboard, QuizManagement, CreateQuiz, AdminQuizView, QuestionBank,
                 StudentManagement, Assignments, Submissions, Evaluation, ResultManagement, Analytics
  context/      AuthContext, QuizContext (all shared state + localStorage logic)
  data/         seed.js (mock data generator)
  utils/        storage.js, formatters.js, quizEvaluation.js
```

## Notes

- All data lives in `localStorage` under the `quiznova_` prefix. To reset the demo data, clear site storage in devtools and reload.
- This is a frontend-only prototype — there is no backend, database, or real authentication server.
