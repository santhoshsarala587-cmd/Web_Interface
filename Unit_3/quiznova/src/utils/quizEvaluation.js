import { gradeFromPercent } from './formatters';

export function evaluateSubmission(questions, answers) {
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;
  let totalMarks = 0;
  let scored = 0;

  questions.forEach((q) => {
    totalMarks += q.marks || 1;
    const given = answers[q.id];
    if (given === undefined || given === null || given === '') {
      unanswered += 1;
    } else if (given === q.correctAnswer) {
      correct += 1;
      scored += q.marks || 1;
    } else {
      incorrect += 1;
    }
  });

  const percentage = totalMarks > 0 ? Math.round((scored / totalMarks) * 100) : 0;

  return {
    correct,
    incorrect,
    unanswered,
    totalQuestions: questions.length,
    totalMarks,
    scored,
    percentage,
    grade: gradeFromPercent(percentage),
  };
}
