import { useState } from 'react';

const ExampleQuestion = ({ questionNumber, imageSrc, questionText, options, correctOption, explanation }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setShowExplanation(true);
  };

  return (
    <div className="card">
      <h3>Example Question {questionNumber}</h3>
      <p style={{ marginBottom: '1rem', fontWeight: '500' }}>{questionText}</p>
      <img src={imageSrc} alt={`Example ${questionNumber}`} className="question-image" />
      
      <div className="options-grid">
        {options.map((opt, idx) => (
          <label key={idx} className={`radio-option ${selectedOption === opt ? 'selected' : ''}`}>
            <input 
              type="radio" 
              name={`example-${questionNumber}`} 
              value={opt}
              onChange={() => handleSelect(opt)}
              checked={selectedOption === opt}
              disabled={showExplanation}
            />
            <span></span>
            {opt}
          </label>
        ))}
      </div>

      {showExplanation && (
        <div className={`explanation-box ${selectedOption === correctOption ? 'success' : 'error'}`}>
          <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: selectedOption === correctOption ? 'var(--success-color)' : 'var(--error-color)' }}>
            {selectedOption === correctOption ? 'Correct!' : 'Incorrect.'}
          </div>
          <strong>Correct Answer: {correctOption}</strong>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default function IntroPage({ onStart }) {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    grade: '',
    section: ''
  });

  const isFormValid = formData.name.trim() !== '' && 
                      formData.rollNo.trim() !== '' && 
                      formData.grade.trim() !== '' && 
                      formData.section.trim() !== '';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      onStart(formData);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Perspective-Taking Spatial Orientation Test</h1>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          Welcome to the Spatial Orientation Test. Before you begin the timed section, please read the instructions below, fill in your details, and try the two example questions.
        </p>
        
        <h2>Instructions</h2>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          <li>This test consists of 12 questions.</li>
          <li>You will have exactly 5 minutes to complete the test.</li>
          <li>For each question, imagine you are standing at the first object facing the second object. You must identify the angle/direction of the third object.</li>
          <li>The angles are measured in degrees in clockwise direction.</li>
          <li>Choose the correct angle from the multiple-choice options.</li>
          <li>The test will automatically submit when the timer runs out.</li>
          <li>DO NOT leave the test page or switch tabs during the test. You will be penalized for any violations.</li>
        </ul>

        <h2>Participant Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Roll No.</label>
            <input type="text" name="rollNo" value={formData.rollNo} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Standard / Grade</label>
            <input type="text" name="grade" value={formData.grade} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Section</label>
            <input type="text" name="section" value={formData.section} onChange={handleChange} required />
          </div>
        </form>
      </div>

      <ExampleQuestion 
        questionNumber={1}
        imageSrc="/questions/eg.png"
        questionText="
For example, in the image below: 
Imagine you are standing at the cat and facing the house (this is 0°).
Now measure clockwise to find the stop sign.
"
        questionText="Imagine you are standing at the cat and facing the house (this is 0°). Now measure clockwise to find the stop sign."
        options={['A. 60º', 'B. 300º', 'C. 180º', 'D. 270º']}
        correctOption="A. 60º"
        explanation="Since you are facing the house, the stop sign is to your front-right, making it a 60-degree angle."
      />

      <ExampleQuestion 
        questionNumber={2}
        imageSrc="/questions/eg.png"
        questionText="Imagine you are standing at the cat and facing the house (this is 0°). Now measure clockwise to find the flower."
        options={['A. 60º', 'B. 300º', 'C. 180º', 'D. 270º']}
        correctOption="B. 300º"
        explanation="Facing the house, the flower is to your left. Measuring clockwise, 360 - 60 = 300 degrees."
      />

      <div className="card" style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Once you have completed the examples and filled in your details, you can begin the test. The 5-minute timer will start immediately on the next page.
        </p>
        <button 
          className="btn" 
          onClick={handleSubmit} 
          disabled={!isFormValid}
        >
          {isFormValid ? 'Start Timed Test' : 'Fill all details to start'}
        </button>
      </div>
    </div>
  );
}
