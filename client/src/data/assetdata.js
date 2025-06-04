// assessmentsdata.js
export const sampleQuestions = [
  {
    id: 1,
    type: "mcq",
    text: "What is the capital of France?",
    options: ["London", "Paris", "Berlin", "Madrid"],
    correctAnswer: 1,
    marks: 1
  },
  {
    id: 2,
    type: "mcq",
    text: "Which of these is not a programming language?",
    options: ["Python", "HTML", "Java", "C++"],
    correctAnswer: 1,
    marks: 1
  },
  {
    id: 3,
    type: "coding",
    text: "Write a function in JavaScript that reverses a string.",
    language: "javascript",
    marks: 3
  },
  {
    id: 4,
    type: "written",
    text: "Explain the concept of closures in JavaScript with an example.",
    marks: 2
  },
  {
    id: 5,
    type: "mcq",
    text: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Creative Style Sheets",
      "Cascading Style Sheets",
      "Colorful Style Sheets"
    ],
    correctAnswer: 2,
    marks: 1
  }
];

export const messages = {
  en: {
    assessments: "Assessments",
    startAssessment: "Start Assessment",
    viewDetails: "View Details",
    viewAttempts: "View Attempts",
    assessmentQuiz: "Assessment Quiz",
    question: "Question",
    time: "Time",
    marks: "Marks",
    assessmentSubmitted: "Assessment Submitted!",
    submissionConfirmation: "Your answers have been recorded. You can now close this window.",
    close: "Close",
    previous: "Previous",
    next: "Next",
    submit: "Submit",
    typeYourAnswerHere: "Type your answer here...",
    writeYourCodeHere: "Write your code here...",
    attemptDetails: "Attempt Details",
    attemptSummary: "Attempt Summary",
    startedAt: "Started at",
    finishedAt: "Finished at",
    duration: "Duration",
    score: "Score",
    questionBreakdown: "Question Breakdown",
    totalQuestions: "Total questions",
    answered: "Answered",
    unanswered: "Unanswered",
    questionDetails: "Question Details",
    answeredAt: "Answered at",
    type: "Type",
    yourAnswer: "Your answer",
    availableFrom: "Available from",
    availableUntil: "Available until",
    timeLimit: "Time limit",
    minutes: "minutes",
    attemptsAllowed: "Attempts allowed",
    remainingAttempts: "Remaining attempts",
    quizNotAvailable: "Quiz not available",
    quizNotAvailableMessage: "This quiz is not currently available.",
    quizExpired: "Quiz expired",
    quizExpiredMessage: "The due date for this quiz has passed.",
    quizNotStarted: "Quiz not started",
    quizNotStartedMessage: "This quiz will be available on {date} at {time}.",
    timeRemaining: "Time remaining",
    overdue: "Overdue",
    submitConfirmation: "Are you sure you want to submit your answers?",
    confirm: "Confirm",
    cancel: "Cancel",
    quizInstructions: "Quiz Instructions",
    readCarefully: "Please read the following instructions carefully:",
    instruction1: "You have {time} minutes to complete the quiz.",
    instruction2: "Once started, the quiz must be completed in one sitting.",
    instruction3: "You cannot go back to previous questions after moving forward.",
    instruction4: "The quiz will auto-submit when time expires.",
    beginQuiz: "Begin Quiz",
    attemptHistory: "Attempt History",
    noAttempts: "No attempts yet",
    attemptNumber: "Attempt #{number}",
    dateSubmitted: "Date submitted",
    finalScore: "Final score",
    view: "View",
    backToAssessments: "Back to Assessments",
    timeUp: "Time's up!",
    timeUpMessage: "Your quiz has been auto-submitted as the time limit has been reached."
  }
};