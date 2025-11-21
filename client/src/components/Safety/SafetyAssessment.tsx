import React, { useState } from 'react';

const SafetyAssessment: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [_, setAnswers] = useState<Record<string, number>>({}); // Fixed unused variable
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: '1',
      text: 'How often do you feel unsafe in your current living situation?',
      options: [
        { value: 1, text: 'Rarely or never' },
        { value: 2, text: 'Sometimes' },
        { value: 3, text: 'Often' },
        { value: 4, text: 'Constantly' }
      ]
    },
    {
      id: '2', 
      text: 'Has your partner ever threatened to harm you or your children?',
      options: [
        { value: 1, text: 'No, never' },
        { value: 2, text: 'Made threats but no action' },
        { value: 3, text: 'Yes, with specific threats' },
        { value: 4, text: 'Yes, with weapons involved' }
      ]
    },
    {
      id: '3',
      text: 'Has physical violence occurred in your relationship?',
      options: [
        { value: 1, text: 'No physical violence' },
        { value: 2, text: 'Pushing or grabbing' },
        { value: 3, text: 'Hitting or punching' },
        { value: 4, text: 'Severe beating or use of weapons' }
      ]
    }
  ];

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <div style={{ padding: '20px', background: 'white', borderRadius: '10px' }}>
        <h3>🛡️ Safety Assessment Complete</h3>
        <p>Your responses have been recorded. Remember:</p>
        <ul>
          <li>Call 999 in emergencies</li>
          <li>Use 1195 for gender violence support</li>
          <li>Your safety is the priority</li>
        </ul>
        <button 
          onClick={() => {
            setShowResults(false);
            setCurrentQuestion(0);
            setAnswers({});
          }}
          style={{
            padding: '10px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Restart Assessment
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div style={{ padding: '20px', background: 'white', borderRadius: '10px' }}>
      <h3>🛡️ Safety Assessment</h3>
      <p style={{ color: '#666' }}>Question {currentQuestion + 1} of {questions.length}</p>
      <h4 style={{ marginBottom: '20px' }}>{currentQ.text}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {currentQ.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(currentQ.id, option.value)}
            style={{
              padding: '15px',
              background: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SafetyAssessment;
