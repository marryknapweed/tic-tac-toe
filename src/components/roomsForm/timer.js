import { useState, useEffect } from 'react';
import "./timer.css";

export function useTimer(customText = '') {
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [start, setStart] = useState(false);
  const text = customText ? `${customText} ${timeRemaining} seconds` : `Game starts in ${timeRemaining} seconds`;

  useEffect(() => {
    if (start) {
      const intervalId = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(intervalId);
            return 0; // Ensure it doesn't go negative
          }
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [start]);

  const uiElement = () => (
    <div className='timer-to-game'>
      <h4>{text}</h4>
    </div>
  );

  return {
    timeRemaining,
    setTimeRemaining,
    uiElement,
    start,
    setStart
  };
}