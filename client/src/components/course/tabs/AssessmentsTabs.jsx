import React, { useState, useEffect } from "react";
import { IntlProvider, useIntl } from "react-intl";
import { messages, sampleQuestions } from "../../../data/assetdata";




const QuizModal = ({ 
  questions, 
  onClose, 
  onComplete, 
  timeLimit, 
  availableUntil,
  attemptNumber
}) => {
  const intl = useIntl();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [codeAnswer, setCodeAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Convert minutes to seconds
  const [answers, setAnswers] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [attemptData, setAttemptData] = useState({
    startedAt: new Date(),
    finishedAt: null,
    answers: [],
    score: 0,
    totalMarks: questions.reduce((sum, q) => sum + q.marks, 0),
    attemptNumber: attemptNumber
  });

  // Check if quiz is expired during the attempt
  const isQuizExpired = availableUntil && new Date() > new Date(availableUntil);

  useEffect(() => {
    if (isQuizExpired) {
      handleAutoSubmit();
      return;
    }

    if (timeLeft <= 0 || isSubmitted) {
      if (timeLeft <= 0 && !isSubmitted) {
        handleAutoSubmit();
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isSubmitted, isQuizExpired]);

  useEffect(() => {
    setSelectedAnswer(null);
    setWrittenAnswer("");
    setCodeAnswer("");
    
    const prevAnswer = answers[currentQuestionIndex];
    if (prevAnswer) {
      if (questions[currentQuestionIndex].type === "mcq") {
        setSelectedAnswer(prevAnswer.answer);
      } else if (questions[currentQuestionIndex].type === "written") {
        setWrittenAnswer(prevAnswer.answer);
      } else if (questions[currentQuestionIndex].type === "coding") {
        setCodeAnswer(prevAnswer.answer);
      }
    }
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    saveAnswer(answer);
  };

  const saveAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      questionId: questions[currentQuestionIndex].id,
      answer: answer,
      type: questions[currentQuestionIndex].type,
      marks: questions[currentQuestionIndex].marks,
      answeredAt: new Date()
    };
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowSubmitConfirmation(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAutoSubmit = () => {
    const finishedAt = new Date();
    const score = calculateScore();
    
    const attempt = {
      ...attemptData,
      finishedAt,
      answers: [...answers],
      score,
      wasAutoSubmitted: timeLeft <= 0,
      wasExpired: isQuizExpired
    };
    
    setAttemptData(attempt);
    setIsSubmitted(true);
    onComplete(attempt);
  };

  const handleSubmit = () => {
    const finishedAt = new Date();
    const score = calculateScore();
    
    const attempt = {
      ...attemptData,
      finishedAt,
      answers: [...answers],
      score
    };
    
    setAttemptData(attempt);
    setIsSubmitted(true);
    onComplete(attempt);
  };

  const calculateScore = () => {
    return answers.reduce((score, answer) => {
      if (!answer) return score;
      
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) return score;
      
      if (question.type === "mcq" && answer.answer === question.correctAnswer) {
        return score + question.marks;
      }
      if ((question.type === "coding" || question.type === "written") && answer.answer.trim().length > 0) {
        return score + (question.marks * 0.5); // Partial credit for non-MCQ answers
      }
      
      return score;
    }, 0);
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleCopy = (e) => {
    e.preventDefault();
    return false;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case "mcq":
        return (
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`p-3 border rounded-md cursor-pointer ${
                  selectedAnswer === index
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                {option}
              </div>
            ))}
          </div>
        );
      case "written":
        return (
          <div className="mb-6">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md h-40"
              value={writtenAnswer}
              onChange={(e) => {
                setWrittenAnswer(e.target.value);
                saveAnswer(e.target.value);
              }}
              placeholder={intl.formatMessage({ id: "typeYourAnswerHere" })}
            />
          </div>
        );
      case "coding":
        return (
          <div className="mb-6">
            <div className="bg-gray-800 text-gray-100 p-2 text-sm mb-2 rounded-t-md">
              {currentQuestion.language.toUpperCase()}
            </div>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-b-md font-mono h-60"
              value={codeAnswer}
              onChange={(e) => {
                setCodeAnswer(e.target.value);
                saveAnswer(e.target.value);
              }}
              placeholder={intl.formatMessage({ id: "writeYourCodeHere" })}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onCopy={handleCopy}
      onCut={handleCopy}
      onPaste={handleCopy}
      onContextMenu={handleCopy}
    >
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
          <h3 className="font-semibold text-lg">
            {intl.formatMessage({ id: "assessmentQuiz" })} (Attempt {attemptNumber})
          </h3>
          <div className="flex items-center space-x-4">
            <span className="bg-indigo-700 px-3 py-1 rounded-md">
              {intl.formatMessage({ id: "question" })} {currentQuestionIndex + 1}/{questions.length}
            </span>
            <span className={`px-3 py-1 rounded-md ${
              timeLeft < 60 ? 'bg-red-600' : 'bg-indigo-700'
            }`}>
              {intl.formatMessage({ id: "time" })}: {formatTime(timeLeft)}
            </span>
            <span className="bg-indigo-700 px-3 py-1 rounded-md">
              {intl.formatMessage({ id: "marks" })}: {currentQuestion.marks}
            </span>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {isSubmitted ? (
            <div className="text-center py-8">
              {attemptData.wasAutoSubmitted ? (
                <>
                  <h4 className="text-xl font-semibold mb-2 text-red-600">
                    {intl.formatMessage({ id: "timeUp" })}
                  </h4>
                  <p className="text-gray-600 mb-6">
                    {intl.formatMessage({ id: "timeUpMessage" })}
                  </p>
                </>
              ) : attemptData.wasExpired ? (
                <>
                  <h4 className="text-xl font-semibold mb-2 text-red-600">
                    {intl.formatMessage({ id: "quizExpired" })}
                  </h4>
                  <p className="text-gray-600 mb-6">
                    {intl.formatMessage({ id: "quizExpiredMessage" })}
                  </p>
                </>
              ) : (
                <>
                  <h4 className="text-xl font-semibold mb-2">
                    {intl.formatMessage({ id: "assessmentSubmitted" })}
                  </h4>
                  <p className="text-gray-600 mb-6">
                    {intl.formatMessage({ id: "submissionConfirmation" })}
                  </p>
                </>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {intl.formatMessage({ id: "close" })}
              </button>
            </div>
          ) : showSubmitConfirmation ? (
            <div className="text-center py-8">
              <h4 className="text-xl font-semibold mb-4">
                {intl.formatMessage({ id: "submitConfirmation" })}
              </h4>
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={() => setShowSubmitConfirmation(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  {intl.formatMessage({ id: "cancel" })}
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {intl.formatMessage({ id: "confirm" })}
                </button>
              </div>
            </div>
          ) : (
            <>
              <h4 className="text-lg font-medium mb-4">{currentQuestion.text}</h4>
              {renderQuestion()}

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      className={`w-8 h-8 rounded-full text-sm flex items-center justify-center ${
                        index === currentQuestionIndex
                          ? "bg-indigo-600 text-white"
                          : answers[index] !== undefined
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <div className="flex space-x-3">
                  {currentQuestionIndex > 0 && (
                    <button
                      onClick={handlePreviousQuestion}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      {intl.formatMessage({ id: "previous" })}
                    </button>
                  )}
                  <button
                    onClick={handleNextQuestion}
                    className={`px-4 py-2 rounded-md ${
                      currentQuestion.type === "mcq" && selectedAnswer === null
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                    disabled={currentQuestion.type === "mcq" && selectedAnswer === null}
                  >
                    {currentQuestionIndex === questions.length - 1
                      ? intl.formatMessage({ id: "submit" })
                      : intl.formatMessage({ id: "next" })}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const QuizInstructions = ({ 
  quiz, 
  onStart, 
  onCancel,
  attemptNumber,
  totalAttemptsAllowed 
}) => {
  const intl = useIntl();
  const availableFromDate = quiz.availableFrom ? new Date(quiz.availableFrom) : null;
  const availableUntilDate = quiz.availableUntil ? new Date(quiz.availableUntil) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="bg-indigo-600 text-white p-4">
          <h3 className="font-semibold text-lg">
            {quiz.title} - {intl.formatMessage({ id: "quizInstructions" })}
          </h3>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">
              {intl.formatMessage({ id: "readCarefully" })}
            </h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>{intl.formatMessage({ id: "instruction1" }, { time: quiz.timeLimit })}</li>
              <li>{intl.formatMessage({ id: "instruction2" })}</li>
              <li>{intl.formatMessage({ id: "instruction3" })}</li>
              <li>{intl.formatMessage({ id: "instruction4" })}</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {availableFromDate && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium text-sm text-gray-600">
                  {intl.formatMessage({ id: "availableFrom" })}
                </p>
                <p>{availableFromDate.toLocaleDateString()} at {availableFromDate.toLocaleTimeString()}</p>
              </div>
            )}
            {availableUntilDate && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium text-sm text-gray-600">
                  {intl.formatMessage({ id: "availableUntil" })}
                </p>
                <p>{availableUntilDate.toLocaleDateString()} at {availableUntilDate.toLocaleTimeString()}</p>
              </div>
            )}
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="font-medium text-sm text-gray-600">
                {intl.formatMessage({ id: "timeLimit" })}
              </p>
              <p>{quiz.timeLimit} {intl.formatMessage({ id: "minutes" })}</p>
            </div>
            {totalAttemptsAllowed && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium text-sm text-gray-600">
                  {intl.formatMessage({ id: "remainingAttempts" })}
                </p>
                <p>{totalAttemptsAllowed - attemptNumber + 1} of {totalAttemptsAllowed}</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            {intl.formatMessage({ id: "cancel" })}
          </button>
          <button
            onClick={onStart}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {intl.formatMessage({ id: "beginQuiz" })}
          </button>
        </div>
      </div>
    </div>
  );
};

const AttemptDetails = ({ attempt, questions, onClose }) => {
  const intl = useIntl();

  if (!attempt) return null;

  const getQuestionText = (id) => {
    const question = questions.find(q => q.id === id);
    return question ? question.text : "Unknown question";
  };

  const getQuestionType = (id) => {
    const question = questions.find(q => q.id === id);
    return question ? question.type : "unknown";
  };

  const formatAnswer = (answer, type) => {
    if (type === "mcq") {
      const question = questions.find(q => q.id === answer.questionId);
      if (question && question.options) {
        return question.options[answer.answer] || `Option ${answer.answer + 1}`;
      }
      return `Option ${answer.answer + 1}`;
    }
    if (answer.answer.length > 100) {
      return `${answer.answer.substring(0, 100)}...`;
    }
    return answer.answer;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return "N/A";
    const seconds = Math.round((new Date(end) - new Date(start)) / 1000);
    return `${seconds} seconds`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              {intl.formatMessage({ id: "attemptDetails" })} - {intl.formatMessage({ id: "attemptNumber" }, { number: attempt.attemptNumber })}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">
                {intl.formatMessage({ id: "attemptSummary" })}
              </h4>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">{intl.formatMessage({ id: "startedAt" })}:</span>{" "}
                  {formatDate(attempt.startedAt)}
                </p>
                <p>
                  <span className="font-medium">{intl.formatMessage({ id: "finishedAt" })}:</span>{" "}
                  {formatDate(attempt.finishedAt)}
                </p>
                <p>
                  <span className="font-medium">{intl.formatMessage({ id: "duration" })}:</span>{" "}
                  {calculateDuration(attempt.startedAt, attempt.finishedAt)}
                </p>
                <p>
                  <span className="font-medium">{intl.formatMessage({ id: "score" })}:</span>{" "}
                  {attempt.score} / {attempt.totalMarks}
                </p>
                {attempt.wasAutoSubmitted && (
                  <p className="text-red-600">
                    {intl.formatMessage({ id: "timeUp" })}
                  </p>
                )}
                {attempt.wasExpired && (
                  <p className="text-red-600">
                    {intl.formatMessage({ id: "quizExpired" })}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">
                {intl.formatMessage({ id: "questionBreakdown" })}
              </h4>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">{intl.formatMessage({ id: "totalQuestions" })}:</span>{" "}
                  {questions.length}
                </p>
                <p>
                  <span className="font-medium">{intl.formatMessage({ id: "answered" })}:</span>{" "}
                  {attempt.answers.filter(a => a !== undefined).length}
                </p>
                <p>
                  <span className="font-medium">{intl.formatMessage({ id: "unanswered" })}:</span>{" "}
                  {questions.length - attempt.answers.filter(a => a !== undefined).length}
                </p>
              </div>
            </div>
          </div>

          <h4 className="font-medium text-gray-700 mb-4">
            {intl.formatMessage({ id: "questionDetails" })}
          </h4>
          <div className="space-y-4">
            {attempt.answers.map((answer, index) => (
              answer && (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <p className="font-medium mb-1">
                    Q{index + 1}: {getQuestionText(answer.questionId)}
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                    <span>
                      <span className="font-medium">{intl.formatMessage({ id: "answeredAt" })}:</span>{" "}
                      {formatDate(answer.answeredAt)}
                    </span>
                    <span>
                      <span className="font-medium">{intl.formatMessage({ id: "type" })}:</span>{" "}
                      {getQuestionType(answer.questionId)}
                    </span>
                    <span>
                      <span className="font-medium">{intl.formatMessage({ id: "marks" })}:</span>{" "}
                      {answer.marks}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium text-sm mb-1">{intl.formatMessage({ id: "yourAnswer" })}:</p>
                    <pre className="text-sm whitespace-pre-wrap break-all">{formatAnswer(answer, answer.type)}</pre>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AttemptHistory = ({ 
  attempts, 
  onClose, 
  onViewAttempt,
  assessmentTitle 
}) => {
  const intl = useIntl();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold">
                {intl.formatMessage({ id: "attemptHistory" })}
              </h3>
              <p className="text-gray-600">{assessmentTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {attempts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {intl.formatMessage({ id: "noAttempts" })}
            </div>
          ) : (
            <div className="space-y-4">
              {attempts.map((attempt, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">
                        {intl.formatMessage({ id: "attemptNumber" }, { number: attempt.attemptNumber })}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {intl.formatMessage({ id: "dateSubmitted" })}: {new Date(attempt.finishedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">
                          {intl.formatMessage({ id: "finalScore" })}: {attempt.score}/{attempt.totalMarks}
                        </p>
                        <p className="text-sm text-gray-600">
                          {Math.round((attempt.score / attempt.totalMarks) * 100)}%
                        </p>
                      </div>
                      <button
                        onClick={() => onViewAttempt(index)}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                      >
                        {intl.formatMessage({ id: "view" })}
                      </button>
                    </div>
                  </div>
                  {attempt.wasAutoSubmitted && (
                    <p className="text-sm text-red-600 mt-2">
                      {intl.formatMessage({ id: "timeUp" })}
                    </p>
                  )}
                  {attempt.wasExpired && (
                    <p className="text-sm text-red-600 mt-2">
                      {intl.formatMessage({ id: "quizExpired" })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AssessmentsTab = ({ assessments }) => {
  const intl = useIntl();
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [attemptDetails, setAttemptDetails] = useState(null);
  const [attemptHistory, setAttemptHistory] = useState(null);
  const [attemptHistoryForAssessment, setAttemptHistoryForAssessment] = useState(null);
  const [attemptHistoryVisible, setAttemptHistoryVisible] = useState(false);

  // Initialize attempt history from localStorage or empty object
  useEffect(() => {
    const savedAttempts = localStorage.getItem('quizAttemptHistory');
    if (savedAttempts) {
      setAttemptHistory(JSON.parse(savedAttempts));
    } else {
      setAttemptHistory({});
    }
  }, []);

  // Save attempt history to localStorage whenever it changes
  useEffect(() => {
    if (attemptHistory) {
      localStorage.setItem('quizAttemptHistory', JSON.stringify(attemptHistory));
    }
  }, [attemptHistory]);

  const startAssessment = (assessment) => {
    // Check if quiz is available
    const now = new Date();
    const availableFrom = assessment.availableFrom ? new Date(assessment.availableFrom) : null;
    const availableUntil = assessment.availableUntil ? new Date(assessment.availableUntil) : null;

    if (availableFrom && now < availableFrom) {
      alert(intl.formatMessage({ id: "quizNotStartedMessage" }, { 
        date: availableFrom.toLocaleDateString(), 
        time: availableFrom.toLocaleTimeString() 
      }));
      return;
    }

    if (availableUntil && now > availableUntil) {
      alert(intl.formatMessage({ id: "quizExpiredMessage" }));
      return;
    }

    // Check remaining attempts
    const attemptsForQuiz = attemptHistory[assessment.id] || [];
    if (assessment.attemptsAllowed && attemptsForQuiz.length >= assessment.attemptsAllowed) {
      alert(`You have used all ${assessment.attemptsAllowed} attempts for this quiz.`);
      return;
    }

    setActiveQuiz(assessment);
    setShowInstructions(true);
  };

  const handleComplete = (attempt) => {
    const assessmentId = activeQuiz.id;
    setAttemptHistory(prev => ({
      ...prev,
      [assessmentId]: [...(prev[assessmentId] || []), attempt]
    }));
    setActiveQuiz(null);
    setShowInstructions(false);
  };

  const viewAttemptDetails = (assessmentId, attemptIndex) => {
    setAttemptDetails(attemptHistory[assessmentId][attemptIndex]);
  };

  const viewAttemptHistory = (assessment) => {
    setAttemptHistoryForAssessment({
      id: assessment.id,
      title: assessment.title,
      attempts: attemptHistory[assessment.id] || []
    });
    setAttemptHistoryVisible(true);
  };

  const getAssessmentStatus = (assessment) => {
    const now = new Date();
    const availableFrom = assessment.availableFrom ? new Date(assessment.availableFrom) : null;
    const availableUntil = assessment.availableUntil ? new Date(assessment.availableUntil) : null;

    if (availableFrom && now < availableFrom) {
      return {
        status: "Not Started",
        color: "bg-gray-100 text-gray-800",
        message: intl.formatMessage({ id: "quizNotStartedMessage" }, { 
          date: availableFrom.toLocaleDateString(), 
          time: availableFrom.toLocaleTimeString() 
        })
      };
    }

    if (availableUntil && now > availableUntil) {
      return {
        status: "Expired",
        color: "bg-red-100 text-red-800",
        message: intl.formatMessage({ id: "quizExpiredMessage" })
      };
    }

    const attempts = attemptHistory ? (attemptHistory[assessment.id] || []) : [];
    if (assessment.attemptsAllowed && attempts.length >= assessment.attemptsAllowed) {
      return {
        status: "Attempts Used",
        color: "bg-yellow-100 text-yellow-800",
        message: `You have used all ${assessment.attemptsAllowed} attempts.`
      };
    }

    return {
      status: "Available",
      color: "bg-green-100 text-green-800",
      message: ""
    };
  };

  const getNextAttemptNumber = (assessmentId) => {
    const attempts = attemptHistory ? (attemptHistory[assessmentId] || []) : [];
    return attempts.length + 1;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900">
        {intl.formatMessage({ id: "assessments" })}
      </h2>
      <div className="space-y-4">
        {assessments.map((assessment) => {
          const statusInfo = getAssessmentStatus(assessment);
          const attempts = attemptHistory ? (attemptHistory[assessment.id] || []) : [];
          const lastAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : null;

          return (
            <div
              key={assessment.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{assessment.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {assessment.description}
                  </p>
                  {assessment.due && (
                    <p className="text-sm mt-1">
                      <span className="font-medium">Due:</span> {new Date(assessment.due).toLocaleString()}
                    </p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
                  title={statusInfo.message}
                >
                  {statusInfo.status}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {statusInfo.status === "Available" && (
                  <button 
                    onClick={() => startAssessment(assessment)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                  >
                    {intl.formatMessage({ id: "startAssessment" })}
                  </button>
                )}
                {attempts.length > 0 && (
                  <>
                    <button 
                      onClick={() => viewAttemptDetails(assessment.id, attempts.length - 1)}
                      className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50"
                    >
                      {intl.formatMessage({ id: "viewDetails" })}
                    </button>
                    <button 
                      onClick={() => viewAttemptHistory(assessment)}
                      className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50"
                    >
                      {intl.formatMessage({ id: "viewAttempts" })} ({attempts.length})
                    </button>
                  </>
                )}
              </div>
              {lastAttempt && (
                <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
                  <p>
                    <span className="font-medium">Last attempt:</span> {new Date(lastAttempt.finishedAt).toLocaleString()} - Score: {lastAttempt.score}/{lastAttempt.totalMarks}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showInstructions && activeQuiz && (
        <QuizInstructions
          quiz={activeQuiz}
          onStart={() => setShowInstructions(false)}
          onCancel={() => setActiveQuiz(null)}
          attemptNumber={getNextAttemptNumber(activeQuiz.id)}
          totalAttemptsAllowed={activeQuiz.attemptsAllowed}
        />
      )}

      {activeQuiz && !showInstructions && (
        <QuizModal
          questions={sampleQuestions}
          onClose={() => setActiveQuiz(null)}
          onComplete={handleComplete}
          timeLimit={activeQuiz.timeLimit}
          availableUntil={activeQuiz.availableUntil}
          attemptNumber={getNextAttemptNumber(activeQuiz.id)}
          totalAttemptsAllowed={activeQuiz.attemptsAllowed}
        />
      )}

      {attemptDetails && (
        <AttemptDetails
          attempt={attemptDetails}
          questions={sampleQuestions}
          onClose={() => setAttemptDetails(null)}
        />
      )}

      {attemptHistoryVisible && attemptHistoryForAssessment && (
        <AttemptHistory
          attempts={attemptHistoryForAssessment.attempts}
          questions={sampleQuestions}
          onClose={() => setAttemptHistoryVisible(false)}
          onViewAttempt={(index) => {
            setAttemptHistoryVisible(false);
            setAttemptDetails(attemptHistoryForAssessment.attempts[index]);
          }}
          assessmentTitle={attemptHistoryForAssessment.title}
        />
      )}
    </div>
  );
};

// Main exported component with IntlProvider
export default function InternationalizedAssessmentsTab({ assessments }) {
  const [locale] = useState("en");
  
  // Enhanced assessments data with availability and attempt limits
  const enhancedAssessments = assessments.map(assessment => ({
    ...assessment,
    timeLimit: assessment.timeLimit || 30, // Default 30 minutes
    attemptsAllowed: assessment.attemptsAllowed || 3, // Default 3 attempts
    availableFrom: assessment.availableFrom || null,
    availableUntil: assessment.availableUntil || assessment.due || null
  }));
  
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <AssessmentsTab assessments={enhancedAssessments} />
    </IntlProvider>
  );
}

// Export messages if needed elsewhere
export { messages, sampleQuestions };