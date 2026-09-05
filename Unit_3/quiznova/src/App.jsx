import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

import StudentDashboard from './pages/student/StudentDashboard';
import AssignedQuizzes from './pages/student/AssignedQuizzes';
import QuizDetails from './pages/student/QuizDetails';
import QuizAttempt from './pages/student/QuizAttempt';
import StudentResults from './pages/student/StudentResults';
import ResultDetails from './pages/student/ResultDetails';
import StudentProfile from './pages/student/StudentProfile';

import AdminDashboard from './pages/admin/AdminDashboard';
import QuizManagement from './pages/admin/QuizManagement';
import CreateQuiz from './pages/admin/CreateQuiz';
import AdminQuizView from './pages/admin/AdminQuizView';
import QuestionBank from './pages/admin/QuestionBank';
import StudentManagement from './pages/admin/StudentManagement';
import Assignments from './pages/admin/Assignments';
import Submissions from './pages/admin/Submissions';
import Evaluation from './pages/admin/Evaluation';
import ResultManagement from './pages/admin/ResultManagement';
import Analytics from './pages/admin/Analytics';

function RootRoute() {
  const { currentUser } = useAuth();
  if (currentUser) {
    return <Navigate to={currentUser.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }
  return <Home />;
}

function NotFoundRedirect() {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/" replace />;
  return <Navigate to={currentUser.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
}

export default function App() {
  const [booting, setBooting] = useState(true);

  if (booting) {
    return <LoadingScreen onDone={() => setBooting(false)} duration={2200} />;
  }

  return (
    <ThemeProvider>
    <AuthProvider>
      <QuizProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RootRoute />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
              <Route path="/student/quizzes" element={<ProtectedRoute role="student"><AssignedQuizzes /></ProtectedRoute>} />
              <Route path="/student/quizzes/:id" element={<ProtectedRoute role="student"><QuizDetails /></ProtectedRoute>} />
              <Route path="/student/quiz/:id" element={<ProtectedRoute role="student"><QuizAttempt /></ProtectedRoute>} />
              <Route path="/student/results" element={<ProtectedRoute role="student"><StudentResults /></ProtectedRoute>} />
              <Route path="/student/results/:id" element={<ProtectedRoute role="student"><ResultDetails /></ProtectedRoute>} />
              <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />

              <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/quizzes" element={<ProtectedRoute role="admin"><QuizManagement /></ProtectedRoute>} />
              <Route path="/admin/quizzes/create" element={<ProtectedRoute role="admin"><CreateQuiz /></ProtectedRoute>} />
              <Route path="/admin/quizzes/:id" element={<ProtectedRoute role="admin"><AdminQuizView /></ProtectedRoute>} />
              <Route path="/admin/questions" element={<ProtectedRoute role="admin"><QuestionBank /></ProtectedRoute>} />
              <Route path="/admin/students" element={<ProtectedRoute role="admin"><StudentManagement /></ProtectedRoute>} />
              <Route path="/admin/assignments" element={<ProtectedRoute role="admin"><Assignments /></ProtectedRoute>} />
              <Route path="/admin/submissions" element={<ProtectedRoute role="admin"><Submissions /></ProtectedRoute>} />
              <Route path="/admin/evaluation/:submissionId" element={<ProtectedRoute role="admin"><Evaluation /></ProtectedRoute>} />
              <Route path="/admin/results" element={<ProtectedRoute role="admin"><ResultManagement /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><Analytics /></ProtectedRoute>} />

              <Route path="*" element={<NotFoundRedirect />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </QuizProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}
