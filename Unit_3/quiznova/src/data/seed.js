import { getData, setData, uid } from '../utils/storage';
import { buildRealQuestions, REAL_QUESTIONS_BY_SUBJECT } from './realQuestions';

const SUBJECTS = Object.keys(REAL_QUESTIONS_BY_SUBJECT);

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const STUDENT_NAMES = [
  'Sandy Kumar', 'Rahul Sharma', 'Priya Singh', 'Ananya Iyer', 'Vikram Rao',
  'Meera Nair', 'Arjun Patel', 'Divya Reddy', 'Karthik Menon', 'Sneha Gupta',
];

// Bump this whenever seed content changes so existing users get fresh data.
const SEED_VERSION = 2;

export function seedIfNeeded() {
  const existingVersion = getData('seedVersion', 0);
  if (getData('seeded', null) && existingVersion >= SEED_VERSION) return;

  // Users (auth)
  const users = [
    {
      id: 'u_admin',
      name: 'Dr. Anil Verma',
      email: 'admin@quiznova.com',
      password: 'admin123',
      role: 'admin',
      studentId: null,
    },
    {
      id: 'u_student',
      name: 'Student Demo',
      email: 'student@quiznova.com',
      password: '1234',
      role: 'student',
      studentId: 'STU1001',
    },
  ];

  // Additional students
  const students = [];
  STUDENT_NAMES.forEach((name, idx) => {
    const id = idx === 0 ? 'STU1001' : `STU${1002 + idx}`;
    const email = idx === 0 ? 'student@quiznova.com' : `${name.split(' ')[0].toLowerCase()}@quiznova.com`;
    if (idx > 0) {
      users.push({
        id: `u_stu_${idx}`,
        name,
        email,
        password: '1234',
        role: 'student',
        studentId: id,
      });
    }
    students.push({
      studentId: id,
      name,
      email,
      department: ['CSE', 'IT', 'ECE'][idx % 3],
      year: ['I', 'II', 'III', 'IV'][idx % 4],
      avatar: null,
      completedQuizzes: 0,
      averageScore: 0,
      status: 'Active',
    });
  });

  setData('users', users);
  setData('students', students);

  // Questions pool — real, hand-written questions with correct answers
  const allQuestions = buildRealQuestions();
  setData('questions', allQuestions);

  // Quizzes
  const quizzes = SUBJECTS.map((subject, idx) => {
    const qList = allQuestions.filter((q) => q.subject === subject).map((q) => q.id);
    const now = new Date();
    const start = new Date(now.getTime() - (idx - 3) * 86400000);
    const end = new Date(start.getTime() + 7 * 86400000);
    const statusPool = ['Active', 'Scheduled', 'Completed', 'Evaluation Pending', 'Results Published'];
    return {
      id: uid('quiz'),
      title: subject,
      description: `A comprehensive assessment covering key concepts of ${subject}, designed to test conceptual understanding and applied knowledge.`,
      subject,
      category: subject.includes('Web') || subject.includes('React') ? 'Web Dev' : 'Core CS',
      difficulty: DIFFICULTIES[idx % 3],
      duration: 30 + (idx % 3) * 10,
      totalMarks: qList.length * 5,
      passPercentage: 40,
      attemptsAllowed: 1,
      randomize: idx % 2 === 0,
      showExplanations: true,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      questionIds: qList,
      status: statusPool[idx % statusPool.length],
      createdBy: 'Dr. Anil Verma',
      resultsPublished: statusPool[idx % statusPool.length] === 'Results Published',
    };
  });
  setData('quizzes', quizzes);

  // Assignments: assign first 5 quizzes to all students
  const assignments = [];
  quizzes.slice(0, 6).forEach((quiz) => {
    students.forEach((student, sIdx) => {
      const regStates = ['Not Started', 'Assigned', 'Registered', 'Started', 'Submitted'];
      const stateIdx = (sIdx + quizzes.indexOf(quiz)) % regStates.length;
      assignments.push({
        id: uid('asg'),
        quizId: quiz.id,
        studentId: student.studentId,
        assignedDate: quiz.startDate,
        startDate: quiz.startDate,
        endDate: quiz.endDate,
        status: regStates[stateIdx],
        registered: stateIdx >= 2,
      });
    });
  });
  setData('assignments', assignments);

  // Submissions + Results for quizzes that are Completed/Evaluation Pending/Results Published
  const submissions = [];
  const results = [];
  quizzes.forEach((quiz) => {
    if (!['Completed', 'Evaluation Pending', 'Results Published'].includes(quiz.status)) return;
    const qObjs = allQuestions.filter((q) => quiz.questionIds.includes(q.id));
    students.slice(0, 6).forEach((student, sIdx) => {
      if ((sIdx + quizzes.indexOf(quiz)) % 3 === 0) return; // skip some students
      const answers = {};
      let scored = 0;
      qObjs.forEach((q) => {
        const willBeCorrect = Math.random() > 0.35;
        answers[q.id] = willBeCorrect ? q.correctAnswer : q.options[(q.options.indexOf(q.correctAnswer) + 1) % 4];
        if (willBeCorrect) scored += q.marks;
      });
      const percentage = Math.round((scored / quiz.totalMarks) * 100);
      const submissionId = uid('sub');
      const evalStatus = quiz.status === 'Results Published' ? 'Published' : quiz.status === 'Evaluation Pending' ? 'Under Evaluation' : 'Evaluated';

      submissions.push({
        id: submissionId,
        quizId: quiz.id,
        studentId: student.studentId,
        answers,
        submittedAt: new Date(new Date(quiz.startDate).getTime() + 3600000).toISOString(),
        timeTaken: Math.floor(quiz.duration * 60 * 0.8),
        status: evalStatus,
        markedForReview: [],
      });

      results.push({
        id: uid('res'),
        submissionId,
        quizId: quiz.id,
        studentId: student.studentId,
        scored,
        totalMarks: quiz.totalMarks,
        percentage,
        grade: percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : percentage >= 40 ? 'D' : 'F',
        passed: percentage >= quiz.passPercentage,
        published: quiz.status === 'Results Published',
        correct: Object.keys(answers).filter((qid) => answers[qid] === qObjs.find((q) => q.id === qid)?.correctAnswer).length,
        incorrect: Object.keys(answers).filter((qid) => answers[qid] !== qObjs.find((q) => q.id === qid)?.correctAnswer).length,
        unanswered: 0,
      });
    });
  });
  setData('submissions', submissions);
  setData('results', results);

  // Update student stats
  const updatedStudents = students.map((s) => {
    const myResults = results.filter((r) => r.studentId === s.studentId && r.published);
    const avg = myResults.length ? Math.round(myResults.reduce((a, r) => a + r.percentage, 0) / myResults.length) : 0;
    return { ...s, completedQuizzes: myResults.length, averageScore: avg };
  });
  setData('students', updatedStudents);

  setData('notifications', [
    { id: uid('note'), message: 'Welcome to QuizNova! Explore your assigned quizzes.', read: false, date: new Date().toISOString() },
  ]);

  setData('seeded', true);
  setData('seedVersion', SEED_VERSION);
}
