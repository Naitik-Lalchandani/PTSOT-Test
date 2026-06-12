import { useState, useEffect, useCallback, useRef } from 'react';

const TEST_DURATION_SECONDS = 5 * 60; // 5 minutes

const QUESTION_DATA = [
  {
    number: 1,
    imageSrc: `./questions/1.png`,
    questionText: `1. Imagine you are standing at the car and facing the traffic light. Select the correct direction and angle at which the stop sign will be.`,
    options: ['A. 120º', 'B. 300º', 'C. 180º', 'D. 270º']
  },
  {
    number: 2,
    imageSrc: `./questions/2.png`,
    questionText: `2. Imagine you are standing at the cat and facing the tree. Select the correct direction and angle at which the car will be.`,
    options: ['A. 90º', 'B. 240º', 'C. 190º', 'D. 270º']
  },
  {
    number: 3,
    imageSrc: `./questions/3.png`,
    questionText: `3. Imagine you are standing at the stop sign and facing the cat. Select the correct direction and angle at which the house will be.`,
    options: ['A. 180º', 'B. 90º', 'C. 225º', 'D. 45º']
  },
  {
    number: 4,
    imageSrc: `./questions/4.png`,
    questionText: `4. Imagine you are standing at the cat and facing the flower. Select the correct direction and angle at which the car will be.`,
    options: ['A. 180º', 'B. 225º', 'C. 270º', 'D. 150º']
  },
  {
    number: 5,
    imageSrc: `./questions/5.png`,
    questionText: `5. Imagine you are standing at the stop sign and facing the tree. Select the correct direction and angle at which the traffic light will be.`,
    options: ['A. 120º', 'B. 45º', 'C. 300º', 'D. 330º']
  },
  {
    number: 6,
    imageSrc: `./questions/6.png`,
    questionText: `6. Imagine you are standing at the stop sign and facing the flower. Select the correct direction and angle at which the car will be.`,
    options: ['A. 240º', 'B. 30º', 'C. 180º', 'D. 270º']
  },
  {
    number: 7,
    imageSrc: `./questions/7.png`,
    questionText: `7. Imagine you are standing at the traffic light and facing the house. Select the correct direction and angle at which the flower will be.`,
    options: ['A. 270º', 'B. 30º', 'C. 330º', 'D. 200º']
  },
  {
    number: 8,
    imageSrc: `./questions/8.png`,
    questionText: `8. Imagine you are standing at the house and facing the flower. Select the correct direction and angle at which the stop sign will be.`,
    options: ['A. 180º', 'B. 230º', 'C. 350º', 'D. 260º']
  },
  {
    number: 9,
    imageSrc: `./questions/9.png`,
    questionText: `9. Imagine you are standing at the car and facing the stop sign. Select the correct direction and angle at which the tree will be.`,
    options: ['A. 180º', 'B. 240º', 'C. 270º', 'D. 90º']
  },
  {
    number: 10,
    imageSrc: `./questions/10.png`,
    questionText: `10. Imagine you are standing at the traffic light and facing the cat. Select the correct direction and angle at which the car will be.`,
    options: ['A. 90º', 'B. 60º', 'C. 300º', 'D. 270º']
  },
  {
    number: 11,
    imageSrc: `./questions/11.png`,
    questionText: `11. Imagine you are standing at the tree and facing the flower. Select the correct direction and angle at which the house will be.`,
    options: ['A. 150º', 'B. 90º', 'C. 60º', 'D. 30º']
  },
  {
    number: 12,
    imageSrc: `./questions/12.png`,
    questionText: `12. Imagine you are standing at the cat and facing the house. Select the correct direction and angle at which the traffic light will be.`,
    options: ['A. 150º', 'B. 180º', 'C. 270º', 'D. 90º']
  }
];

const Question = ({ data, selectedValue, onChange }) => {
  return (
    <div className="card">
      <h3>Question {data.number}</h3>
      <p style={{ marginBottom: '1rem', fontWeight: '500' }}>{data.questionText}</p>
      <div className="image-container">
        <img src={data.imageSrc.replace('./', import.meta.env.BASE_URL)} alt={`Question ${data.number}`} className="question-image" />
      </div>
      <div className="options-grid">
        {data.options.map((opt, idx) => (
          <label key={idx} className={`radio-option ${selectedValue === opt ? 'selected' : ''}`}>
            <input 
              type="radio" 
              name={`q-${data.number}`} 
              value={opt}
              onChange={() => onChange(data.number, opt)}
              checked={selectedValue === opt}
            />
            <span></span>
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
};

export default function TestPage({ onComplete }) {
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS);
  const [answers, setAnswers] = useState({});
  
  // Anti-cheat state
  const [tabSwitches, setTabSwitches] = useState(0);
  const [timeOutsideTab, setTimeOutsideTab] = useState(0); // in seconds
  const [showWarning, setShowWarning] = useState(false);
  
  const hiddenTimestamp = useRef(null);

  const handleComplete = useCallback(() => {
    // Add time taken metric and anti-cheat metrics
    const timeTaken = TEST_DURATION_SECONDS - timeLeft;
    onComplete({ 
      ...answers, 
      timeTakenSeconds: timeTaken,
      tabSwitches: tabSwitches,
      timeOutsideTabSeconds: timeOutsideTab
    });
  }, [answers, onComplete, timeLeft, tabSwitches, timeOutsideTab]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleComplete]);

  // Anti-cheat: Track visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        hiddenTimestamp.current = Date.now();
      } else {
        if (hiddenTimestamp.current) {
          const timeAwayMs = Date.now() - hiddenTimestamp.current;
          const timeAwaySec = Math.floor(timeAwayMs / 1000);
          
          setTabSwitches(prev => prev + 1);
          setTimeOutsideTab(prev => prev + timeAwaySec);
          setShowWarning(true);
          
          hiddenTimestamp.current = null;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleAnswerChange = (questionNumber, value) => {
    setAnswers(prev => ({ ...prev, [`Q${questionNumber}`]: value }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLeft <= 60; // Less than 1 minute

  return (
    <div style={{ paddingBottom: '4rem' }}>
      
      {/* Anti-cheat warning modal */}
      {showWarning && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="card" style={{ maxWidth: '500px', textAlign: 'center', border: '2px solid var(--error-color)' }}>
            <h2 style={{ color: 'var(--error-color)' }}>Warning!</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              You have navigated away from the test tab. This action has been recorded.
              Continuing to switch tabs may result in disqualification.
            </p>
            <button className="btn" onClick={() => setShowWarning(false)}>I Understand</button>
          </div>
        </div>
      )}

      <div className="timer-header">
        <div className="container" style={{ padding: 0 }}>
          <div className={`timer-display ${isWarning ? 'timer-warning' : ''}`}>
            Time Remaining: {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="container">
        {QUESTION_DATA.map(qData => (
          <Question 
            key={qData.number}
            data={qData}
            selectedValue={answers[`Q${qData.number}`]}
            onChange={handleAnswerChange}
          />
        ))}

        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Please make sure you have answered all questions. You cannot change your answers once submitted.
          </p>
          <button className="btn" onClick={handleComplete}>
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
}
