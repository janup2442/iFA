import { useState, useEffect } from 'react';

const Assignment = ({ assignment, user, onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Mock questions based on assignment type
    const mockQuestions = {
      1: [ // JavaScript Fundamentals
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What is the correct way to declare a variable in JavaScript?',
          options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'declare x = 5;'],
          correct: 0
        },
        {
          id: 2,
          type: 'code',
          question: 'Write a function that returns the sum of two numbers:',
          template: 'function sum(a, b) {\n  // Your code here\n}',
          correct: 'return a + b;'
        },
        {
          id: 3,
          type: 'multiple-choice',
          question: 'Which method is used to add an element to the end of an array?',
          options: ['push()', 'add()', 'append()', 'insert()'],
          correct: 0
        }
      ],
      2: [ // React Component Challenge
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What hook is used to manage state in functional components?',
          options: ['useEffect', 'useState', 'useContext', 'useReducer'],
          correct: 1
        },
        {
          id: 2,
          type: 'code',
          question: 'Create a simple counter component:',
          template: 'import { useState } from "react";\n\nfunction Counter() {\n  // Your code here\n}',
          correct: 'const [count, setCount] = useState(0);'
        }
      ],
      3: [ // Algorithm Problem Solving
        {
          id: 1,
          type: 'code',
          question: 'Implement a function to find the maximum number in an array:',
          template: 'function findMax(arr) {\n  // Your code here\n}',
          correct: 'return Math.max(...arr);'
        },
        {
          id: 2,
          type: 'multiple-choice',
          question: 'What is the time complexity of binary search?',
          options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
          correct: 1
        }
      ],
      4: [ // Database Design
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What is a primary key in a database?',
          options: ['A unique identifier', 'A foreign reference', 'An index', 'A constraint'],
          correct: 0
        },
        {
          id: 2,
          type: 'code',
          question: 'Write a SQL query to select all users with age > 18:',
          template: '-- Your SQL query here',
          correct: 'SELECT * FROM users WHERE age > 18;'
        }
      ]
    };

    const assignmentQuestions = mockQuestions[assignment.id] || [];
    setQuestions(assignmentQuestions);

    // Set timer based on assignment duration
    const minutes = parseInt(assignment.duration.split(' ')[0]);
    setTimeLeft(minutes * 60);
  }, [assignment]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    
    // Calculate score
    let correctAnswers = 0;
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (question.type === 'multiple-choice') {
        if (userAnswer === question.correct) correctAnswers++;
      } else if (question.type === 'code') {
        // Simple check for code questions (in real app, this would be more sophisticated)
        if (userAnswer && userAnswer.toLowerCase().includes(question.correct.toLowerCase())) {
          correctAnswers++;
        }
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    
    // Save progress
    const progress = JSON.parse(localStorage.getItem(`progress_${user.id}`) || '{}');
    progress[assignment.id] = {
      completed: true,
      score: score,
      completedAt: new Date().toISOString()
    };
    localStorage.setItem(`progress_${user.id}`, JSON.stringify(progress));

    setTimeout(() => {
      onComplete(score);
    }, 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Assignment Submitted!</h2>
          <p className="text-gray-600 mb-4">Your answers have been recorded and are being evaluated.</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{assignment.title}</h1>
              <p className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-lg font-mono text-red-600">
                {formatTime(timeLeft)}
              </div>
              <button
                onClick={onBack}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQ.question}</h2>

          {currentQ.type === 'multiple-choice' ? (
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <label key={index} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={index}
                    checked={answers[currentQ.id] === index}
                    onChange={() => handleAnswerChange(currentQ.id, index)}
                    className="mr-3 text-blue-600"
                  />
                  <span className="text-gray-900">{option}</span>
                </label>
              ))}
            </div>
          ) : (
            <div>
              <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">{currentQ.template}</pre>
              </div>
              <textarea
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="Write your code here..."
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Submit Assignment
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assignment;