import React, { useState, useEffect, useMemo } from 'react';
import { Assessmentss } from '../../../data/assetdata';

function QuizApp() {
  const [courseCode, setCourseCode] = useState('');
  const [assessments, setAssessments] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'pending'

  // Get all available course codes
  const courseCodes = Object.keys(Assessmentss);

  // Load assessments when a course is selected
  useEffect(() => {
    if (!courseCode) return;

    const assessmentsArray = Object.keys(Assessmentss)
      .filter(code => code === courseCode)
      .map(code => ({
        id: code,
        code,
        title: `${code}: ${Assessmentss[code].name}`,
        name: Assessmentss[code].name,
        description: Assessmentss[code].description || `Assessment for ${Assessmentss[code].name}`,
        questions: Assessmentss[code].questions,
        timeLimit: Assessmentss[code].timeLimit || 30,
        attemptsAllowed: Assessmentss[code].attemptsAllowed || 3,
        passingScore: Assessmentss[code].passingScore || 70
      }));

    setAssessments(assessmentsArray);
  }, [courseCode]);

  // Filter and search assessments
  const filteredAssessments = useMemo(() => {
    return assessments.filter(assessment => {
      const matchesSearch =
        assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.code.toLowerCase().includes(searchTerm.toLowerCase());

      const attemptsForAssessment = attempts.filter(a => a.assessmentId === assessment.id);
      const isCompleted = attemptsForAssessment.some(a => a.scorePercentage >= assessment.passingScore);

      if (filter === 'completed') return matchesSearch && isCompleted;
      if (filter === 'pending') return matchesSearch && !isCompleted;
      return matchesSearch;
    });
  }, [assessments, attempts, searchTerm, filter]);

  const startAssessment = (assessment) => {
    setActiveAssessment(assessment);
    setShowInstructions(true);
  };

  const handleQuizComplete = (score, answers) => {
    const totalMarks = activeAssessment.questions.reduce((sum, q) => sum + q.marks, 0);
    const scorePercentage = Math.round((score / totalMarks) * 100);
    const attemptNumber = attempts.filter(a => a.assessmentId === activeAssessment.id).length + 1;

    const newAttempt = {
      assessmentId: activeAssessment.id,
      assessmentTitle: activeAssessment.title,
      attemptNumber,
      date: new Date(),
      score,
      totalMarks,
      scorePercentage,
      passed: scorePercentage >= activeAssessment.passingScore,
      answers,
      questions: activeAssessment.questions
    };

    setAttempts([...attempts, newAttempt]);
    setCurrentAttempt(newAttempt);
    setActiveAssessment(null);
    setShowResults(true);
  };


  return (
    <div className="max-w-8xl mx-auto p-4 md:p-6 rounded-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Assessments for {courseCode}</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select
            className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-2 sm:mb-0"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
          >
            <option value="">Select Course</option>
            {courseCodes.map(code => (
              <option key={code} value={code}>{Assessmentss[code].name || code}</option>
            ))}
          </select>
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search assessments..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select 
            className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Assessments</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {filteredAssessments.length === 0 ? (
        <div className="text-center py-10">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No assessments found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm || filter !== 'all' 
              ? "Try adjusting your search or filter" 
              : `No assessments available for ${courseCode}`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {filteredAssessments.map(assessment => {
            const assessmentAttempts = attempts.filter(a => a.assessmentId === assessment.id);
            const lastAttempt = assessmentAttempts[0];
            const attemptsLeft = assessment.attemptsAllowed - assessmentAttempts.length;
            
            return (
              <div key={assessment.id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                        lastAttempt?.passed ? 'bg-green-100' : 
                        assessmentAttempts.length > 0 ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        {lastAttempt?.passed ? (
                          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : assessmentAttempts.length > 0 ? (
                          <span className="text-yellow-600 font-medium">!</span>
                        ) : (
                          <span className="text-gray-500 font-medium">?</span>
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{assessment.title}</h2>
                        <p className="text-gray-600">{assessment.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-500">Time: {assessment.timeLimit} mins</span>
                      <span className={`font-medium ${
                        attemptsLeft <= 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        Attempts: {assessmentAttempts.length}/{assessment.attemptsAllowed}
                      </span>
                    </div>
                    
                    {lastAttempt ? (
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Last attempt: {lastAttempt.score}/{lastAttempt.totalMarks}</p>
                        <p className={`text-sm font-medium ${
                          lastAttempt.passed ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {lastAttempt.scorePercentage}% ({lastAttempt.passed ? 'Passed' : 'Failed'})
                        </p>
                      </div>
                    ) : null}
                    
                    <button
                      onClick={() => startAssessment(assessment)}
                      disabled={attemptsLeft <= 0}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        attemptsLeft <= 0 
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {assessmentAttempts.length > 0 ? 'Retake' : 'Start'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showInstructions && activeAssessment && (
        <QuizInstructions
          assessment={activeAssessment}
          onStart={() => setShowInstructions(false)}
          onCancel={() => setActiveAssessment(null)}
          attemptNumber={attempts.filter(a => a.assessmentId === activeAssessment.id).length + 1} 
          attemptsLeft={activeAssessment.attemptsAllowed - attempts.filter(a => a.assessmentId === activeAssessment.id).length}
        />
      )}

      {activeAssessment && !showInstructions && (
        <Quiz
          questions={activeAssessment.questions}
          timeLimit={activeAssessment.timeLimit}
          onComplete={handleQuizComplete}
          onCancel={() => setActiveAssessment(null)} 
        />
      )}

      {showResults && currentAttempt && (
        <QuizResults
          attempt={currentAttempt}
          assessment={assessments.find(a => a.id === currentAttempt.assessmentId)}
          onClose={() => setShowResults(false)}
          onRetry={() => {
            setShowResults(false);
            startAssessment(assessments.find(a => a.id === currentAttempt.assessmentId));
          }}
        />
      )}
    </div>
  );
}

const QuizInstructions = ({ assessment, onStart, onCancel, attemptNumber, attemptsLeft }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-800">{assessment.title}</h2>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
            Attempt {attemptNumber} of {assessment.attemptsAllowed}
          </span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Time limit: {assessment.timeLimit} minutes</li>
              <li>Some questions may have multiple correct answers</li>
              <li>You can't go back after submitting</li>
              <li>Passing score: {assessment.passingScore}%</li>
              {attemptsLeft < assessment.attemptsAllowed && (
                <li className="font-medium">You have {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining</li>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Assessment Breakdown</h3>
            <div className="space-y-3">
              {assessment.questions.map((q, i) => (
                <div key={i} className="flex justify-between border-b border-gray-100 pb-2">
                  <span>Question {i+1}</span>
                  <span className="font-medium">{q.marks} mark{q.marks !== 1 ? 's' : ''}</span>
                </div>
              ))}
              <div className="flex justify-between font-medium pt-2">
                <span>Total</span>
                <span>{assessment.questions.reduce((sum, q) => sum + q.marks, 0)} marks</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onStart}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Begin Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

const Quiz = ({ questions, timeLimit, onComplete, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);
  const [timerActive, setTimerActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle timer
  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      handleSubmit();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const calculateScore = () => {
    return questions.reduce((score, question, index) => {
      if (question.type === 'mcq' && answers[index] === question.correctAnswer) {
        return score + question.marks;
      } else if (question.type !== 'mcq' && answers[index]) {
        return score + question.marks * 0.5; // Partial marks for non-MCQ answers
      }
      return score;
    }, 0);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setTimerActive(false);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const score = calculateScore();
    onComplete(score, answers);
    setIsSubmitting(false);
  };

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-xl">
        {/* Header with progress and timer */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              Question {currentIndex + 1} of {questions.length}
            </h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              timeLeft < 60 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
            }`}>
              Time left: {formatTime(timeLeft)}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-4 text-gray-900">
            {currentQuestion.text}
            {currentQuestion.marks > 1 && (
              <span className="ml-2 text-sm text-gray-500">({currentQuestion.marks} marks)</span>
            )}
          </h4>
          
          {currentQuestion.type === 'mcq' && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <div 
                  key={idx}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    answers[currentIndex] === idx 
                      ? 'bg-indigo-50 border-indigo-600' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleAnswer(idx)}
                >
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-5 w-5 rounded-full border mr-3 flex items-center justify-center ${
                      answers[currentIndex] === idx 
                        ? 'border-indigo-600 bg-indigo-600 text-white' 
                        : 'border-gray-400'
                    }`}>
                      {answers[currentIndex] === idx && (
                        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div>{option}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentQuestion.type === 'written' && (
            <div>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md h-32 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={answers[currentIndex] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your answer here..."
              />
              {currentQuestion.hint && (
                <p className="mt-1 text-sm text-gray-500">{currentQuestion.hint}</p>
              )}
            </div>
          )}

          {currentQuestion.type === 'coding' && (
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <div className="bg-gray-800 text-white p-2 text-sm font-mono flex justify-between items-center">
                <span>{currentQuestion.language.toUpperCase()}</span>
                {currentQuestion.expectedOutput && (
                  <button className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">
                    View Expected Output
                  </button>
                )}
              </div>
              <textarea
                className="w-full p-3 font-mono text-sm h-48 focus:outline-none bg-gray-50"
                value={answers[currentIndex] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder={`Write your ${currentQuestion.language} code here...`}
              />
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-col-reverse md:flex-row justify-between gap-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel Quiz
          </button>
          
          <div className="flex gap-2 justify-end">
            {currentIndex > 0 && (
              <button
                onClick={handlePrev}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Previous
              </button>
            )}
            
            {currentIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={answers[currentIndex] === null || isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={answers[currentIndex] === null || isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuizResults = ({ attempt, assessment, onClose, onRetry }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Assessment Results</h2>
            <p className="text-gray-600">{attempt.assessmentTitle}</p>
          </div>
          <div className="flex gap-2">
            {attempt.attemptNumber < assessment.attemptsAllowed && (
              <button
                onClick={onRetry}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
              >
                Retry
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-3xl font-bold text-center mb-1">{attempt.score}</div>
            <div className="text-sm text-gray-600 text-center">Your Score</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-3xl font-bold text-center mb-1">{attempt.totalMarks}</div>
            <div className="text-sm text-gray-600 text-center">Total Marks</div>
          </div>
          
          <div className={`p-4 rounded-lg ${
            attempt.passed ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <div className="text-3xl font-bold text-center mb-1">{attempt.scorePercentage}%</div>
            <div className="text-sm text-center">
              {attempt.passed ? 'Passed' : 'Failed'} (Requires {assessment.passingScore}%)
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Question Breakdown</h3>
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {showDetails ? 'Hide details' : 'Show details'}
            </button>
          </div>
          
          {showDetails ? (
            <div className="space-y-4">
              {attempt.questions.map((question, index) => (
                <div 
                  key={index} 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedQuestion === index 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedQuestion(index)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">Q{index + 1}: {question.text}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Your answer: <span className="font-mono bg-gray-100 px-1 rounded">
                          {attempt.answers[index] !== null ? attempt.answers[index].toString() : 'No answer'}
                        </span>
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      question.type === 'mcq' && attempt.answers[index] === question.correctAnswer
                        ? 'bg-green-100 text-green-800'
                        : question.type === 'mcq'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {question.type === 'mcq' 
                        ? attempt.answers[index] === question.correctAnswer 
                          ? `${question.marks} mark${question.marks !== 1 ? 's' : ''}`
                          : '0 marks'
                        : 'Partial marks'}
                    </span>
                  </div>
                  
                  {selectedQuestion === index && question.type === 'mcq' && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium text-gray-700">Correct answer: {question.options[question.correctAnswer]}</p>
                      {question.explanation && (
                        <p className="text-sm text-gray-600 mt-1">{question.explanation}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {attempt.questions.map((question, index) => (
                <div 
                  key={index}
                  className={`h-10 rounded-md flex items-center justify-center ${
                    question.type === 'mcq' && attempt.answers[index] === question.correctAnswer
                      ? 'bg-green-100 text-green-800'
                      : question.type === 'mcq'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                  title={`Q${index+1}: ${question.text}`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Return to Assessments
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;