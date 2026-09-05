import { createContext, useContext, useState, useCallback } from 'react';
import { getData, setData, uid } from '../utils/storage';

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [version, setVersion] = useState(0);
  const bump = () => setVersion((v) => v + 1);

  const quizzes = getData('quizzes', []);
  const questions = getData('questions', []);
  const students = getData('students', []);
  const assignments = getData('assignments', []);
  const submissions = getData('submissions', []);
  const results = getData('results', []);

  const saveQuizzes = useCallback((next) => { setData('quizzes', next); bump(); }, []);
  const saveQuestions = useCallback((next) => { setData('questions', next); bump(); }, []);
  const saveAssignments = useCallback((next) => { setData('assignments', next); bump(); }, []);
  const saveSubmissions = useCallback((next) => { setData('submissions', next); bump(); }, []);
  const saveResults = useCallback((next) => { setData('results', next); bump(); }, []);
  const saveStudents = useCallback((next) => { setData('students', next); bump(); }, []);

  function createQuiz(quiz) {
    const newQuiz = { status: 'Draft', ...quiz, id: uid('quiz') };
    saveQuizzes([...quizzes, newQuiz]);
    return newQuiz;
  }

  function updateQuiz(id, patch) {
    saveQuizzes(quizzes.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function deleteQuiz(id) {
    saveQuizzes(quizzes.filter((q) => q.id !== id));
  }

  function addQuestion(q) {
    const newQ = { id: uid('q'), ...q };
    saveQuestions([...questions, newQ]);
    return newQ;
  }

  function updateQuestion(id, patch) {
    saveQuestions(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function deleteQuestion(id) {
    saveQuestions(questions.filter((q) => q.id !== id));
  }

  function registerForQuiz(quizId, studentId) {
    const existing = assignments.find((a) => a.quizId === quizId && a.studentId === studentId);
    if (existing) {
      saveAssignments(assignments.map((a) => (a.id === existing.id ? { ...a, status: 'Registered', registered: true } : a)));
    } else {
      const quiz = quizzes.find((q) => q.id === quizId);
      saveAssignments([...assignments, {
        id: uid('asg'), quizId, studentId,
        assignedDate: new Date().toISOString(),
        startDate: quiz?.startDate, endDate: quiz?.endDate,
        status: 'Registered', registered: true,
      }]);
    }
  }

  function markAssignmentStatus(quizId, studentId, status) {
    const existing = assignments.find((a) => a.quizId === quizId && a.studentId === studentId);
    if (existing) {
      saveAssignments(assignments.map((a) => (a.id === existing.id ? { ...a, status } : a)));
    }
  }

  function submitQuiz({ quizId, studentId, answers, timeTaken, markedForReview }) {
    const submissionId = uid('sub');
    const newSub = {
      id: submissionId, quizId, studentId, answers,
      submittedAt: new Date().toISOString(), timeTaken,
      status: 'Under Evaluation', markedForReview: markedForReview || [],
    };
    saveSubmissions([...submissions, newSub]);
    markAssignmentStatus(quizId, studentId, 'Submitted');

    // auto-evaluate objective questions
    const quiz = quizzes.find((q) => q.id === quizId);
    const qObjs = questions.filter((q) => quiz.questionIds.includes(q.id));
    let scored = 0, correct = 0, incorrect = 0, unanswered = 0;
    qObjs.forEach((q) => {
      const given = answers[q.id];
      if (given === undefined || given === null || given === '') unanswered++;
      else if (given === q.correctAnswer) { correct++; scored += q.marks; }
      else incorrect++;
    });
    const totalMarks = quiz.totalMarks;
    const percentage = totalMarks > 0 ? Math.round((scored / totalMarks) * 100) : 0;
    const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : percentage >= 40 ? 'D' : 'F';

    const newResult = {
      id: uid('res'), submissionId, quizId, studentId,
      scored, totalMarks, percentage, grade,
      passed: percentage >= quiz.passPercentage,
      published: false, correct, incorrect, unanswered,
    };
    saveResults([...results, newResult]);
    return newResult;
  }

  function publishResults(quizId, studentIds) {
    saveResults(results.map((r) => (r.quizId === quizId && (!studentIds || studentIds.includes(r.studentId)) ? { ...r, published: true } : r)));
    saveSubmissions(submissions.map((s) => (s.quizId === quizId && (!studentIds || studentIds.includes(s.studentId)) ? { ...s, status: 'Published' } : s)));
    updateQuiz(quizId, { status: 'Results Published', resultsPublished: true });

    // update student stats
    const nextStudents = students.map((s) => {
      const myResults = results.filter((r) => r.studentId === s.studentId && (r.published || (r.quizId === quizId && studentIds?.includes(s.studentId))));
      if (!myResults.length) return s;
      const avg = Math.round(myResults.reduce((a, r) => a + r.percentage, 0) / myResults.length);
      return { ...s, completedQuizzes: myResults.length, averageScore: avg };
    });
    saveStudents(nextStudents);
  }

  function saveEvaluation(submissionId, patch) {
    saveSubmissions(submissions.map((s) => (s.id === submissionId ? { ...s, status: 'Evaluated', ...patch } : s)));
  }

  return (
    <QuizContext.Provider
      value={{
        version,
        quizzes, questions, students, assignments, submissions, results,
        createQuiz, updateQuiz, deleteQuiz,
        addQuestion, updateQuestion, deleteQuestion,
        registerForQuiz, markAssignmentStatus, submitQuiz,
        publishResults, saveEvaluation,
        saveAssignments,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  return useContext(QuizContext);
}
