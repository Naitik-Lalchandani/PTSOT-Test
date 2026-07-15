import { useState } from 'react';
import './index.css';
import IntroPage from './components/IntroPage';
import TestPage from './components/TestPage';
import EndPage from './components/EndPage';

function App() {
  const [currentPage, setCurrentPage] = useState('intro'); // 'intro', 'test', 'end'
  const [participantData, setParticipantData] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [sessionId] = useState(() => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2)));

  const handleStartTest = (data) => {
    setParticipantData(data);
    setCurrentPage('test');
  };

  const handleTestComplete = (results) => {
    setTestResults(results);
    setCurrentPage('end');
    
    // In a real scenario, this is where you'd send data to Google Sheets
    submitToGoogleSheets(participantData, results);
  };

  const submitToGoogleSheets = async (user, answers) => {
    const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;
    const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;

    if (!SCRIPT_URL) {
      console.error('VITE_SCRIPT_URL is missing in .env');
      return;
    }

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        // using 'cors' mode since Apps Script will naturally bounce back if preflight is handled,
        // or we can use standard fetch. Wait, Apps Script redirects POST requests.
        // It's safer to use normal cors fetch, but since Apps Script issues a 302 redirect on POST,
        // we might actually need to handle that or stick with no-cors if we just want it to fire.
        // However, if we use no-cors, we can't read the JSON response.
        // Let's stick with standard fetch (which defaults to cors).
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // Using text/plain avoids CORS preflight OPTIONS in many cases
        },
        body: JSON.stringify({
          ...user,
          answers,
          sessionId,
          secret_token: SECRET_TOKEN,
          timestamp: new Date().toISOString()
        })
      });
      
      console.log('Submitted successfully', response);
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
    }
  };

  return (
    <div className="App">
      {currentPage === 'intro' && <IntroPage onStart={handleStartTest} />}
      {currentPage === 'test' && <TestPage onComplete={handleTestComplete} />}
      {currentPage === 'end' && <EndPage />}
    </div>
  );
}

export default App;
