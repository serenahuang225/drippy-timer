import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [boxes, setBoxes] = useState([]);
  const [defaultDuration, setDefaultDuration] = useState(5);
  const [activeTimers, setActiveTimers] = useState({});

  const addBox = () => {
    const newBox = {
      id: Date.now(),
      progress: 0,
      duration: defaultDuration, // Duration in minutes
      startTime: null
    };
    setBoxes([...boxes, newBox]);
  };

  const removeBox = (id) => {
    setBoxes(boxes.filter(box => box.id !== id));
    setActiveTimers(prev => {
      const newTimers = { ...prev };
      delete newTimers[id];
      return newTimers;
    });
  };

  const toggleTimer = (id) => {
    setActiveTimers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    
    // Set start time when timer begins
    if (!activeTimers[id]) {
      setBoxes(prev => prev.map(box => 
        box.id === id ? { ...box, startTime: Date.now() } : box
      ));
    }
  };

  const resetBox = (id) => {
    setBoxes(prev => prev.map(box => 
      box.id === id ? { ...box, progress: 0, startTime: null } : box
    ));
    setActiveTimers(prev => {
      const newTimers = { ...prev };
      delete newTimers[id];
      return newTimers;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBoxes(prev => prev.map(box => {
        if (activeTimers[box.id] && box.startTime) {
          const elapsed = (Date.now() - box.startTime) / 1000; // Convert to seconds
          const durationInSeconds = box.duration * 60; // Convert minutes to seconds
          const newProgress = Math.min(100, (elapsed / durationInSeconds) * 100);
          
          return {
            ...box,
            progress: newProgress
          };
        }
        return box;
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [activeTimers]);

  return (
    <div className="app">
      <div className="header">
        <h1>The Drippy Timer App</h1>
        <div className="controls">
          <div className="duration-control">
            <label htmlFor="defaultDuration">Duration (minutes):</label>
            <input
              id="defaultDuration"
              type="number"
              min="0.1"
              max="60"
              step="0.1"
              value={defaultDuration}
              onChange={(e) => setDefaultDuration(Number(e.target.value))}
            />
          </div>
          <button className="add-button" onClick={addBox}>
            Add Timer Box
          </button>
        </div>
      </div>

      <div className="boxes-container">
        {boxes.map(box => (
          <div key={box.id} className="timer-box">
            <div className="box-controls">
              <button 
                className={`timer-button ${activeTimers[box.id] ? 'active' : ''}`}
                onClick={() => toggleTimer(box.id)}
              >
                {activeTimers[box.id] ? '⏸️' : '▶️'}
              </button>
              <button 
                className="reset-button"
                onClick={() => resetBox(box.id)}
              >
                🔄
              </button>
              <button 
                className="remove-button"
                onClick={() => removeBox(box.id)}
              >
                ❌
              </button>
            </div>
            
            <div 
              className={`progress-container ${activeTimers[box.id] ? 'running' : ''}`}
              style={{ '--water-level': `${box.progress}%` }}
            >
              <div 
                className="water"
                style={{ 
                  height: `${box.progress}%`,
                  backgroundColor: `hsl(${120 - box.progress * 1.2}, 70%, 50%)`
                }}
              >
                <svg className="waves wave-back" viewBox="0 0 120 20" preserveAspectRatio="none">
                  <path d="M0,10 Q 15,0 30,10 T 60,10 T 90,10 T 120,10 V20 H0 Z"></path>
                  <path d="M0,10 Q 15,0 30,10 T 60,10 T 90,10 T 120,10 V20 H0 Z" transform="translate(120,0)"></path>
                </svg>
                <svg className="waves wave-front" viewBox="0 0 120 20" preserveAspectRatio="none">
                  <path d="M0,10 Q 15,0 30,10 T 60,10 T 90,10 T 120,10 V20 H0 Z"></path>
                  <path d="M0,10 Q 15,0 30,10 T 60,10 T 90,10 T 120,10 V20 H0 Z" transform="translate(120,0)"></path>
                </svg>
              </div>

              <div className="droplet" />
              <div className="splash" />
              <div className="progress-text">
                {Math.round(box.progress)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {boxes.length === 0 && (
        <div className="empty-state">
          <p>No timer boxes yet! Click "Add Timer Box" to get started.</p>
        </div>
      )}
    </div>
  );
}

export default App;
