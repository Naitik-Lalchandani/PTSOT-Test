import { useState } from 'react';
import './index.css';
import IntroPage from './components/IntroPage';
import TestPage from './components/TestPage';
import EndPage from './components/EndPage';

function App() {
  const [currentPage, setCurrentPage] = useState('intro'); // 'intro', 'test', 'end'
  const [participantData, setParticipantData] = useState(null);
  const [testResults, setTestResults] = useState(null);

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
    // This is the endpoint URL for the Google Apps Script Web App
    // We will leave it empty for now, the user can replace it.
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwT8LqSQBendZopLwPU36UAuLrkUR1EmLqfD2DCanyfKgAg1flgqoakoJnZ1pOvfPAl/exec';
    
    if (SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbwT8LqSQBendZopLwPU36UAuLrkUR1EmLqfD2DCanyfKgAg1flgqoakoJnZ1pOvfPAl/execc') {
      console.log('Submission mocked. Add your Google Apps Script URL to submit data.');
      console.log('Data payload:', { user, answers });
      return;
    }

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...user,
          answers,
          timestamp: new Date().toISOString()
        })
      });
      console.log('Submitted successfully');
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
