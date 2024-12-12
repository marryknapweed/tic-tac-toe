import { useState, useEffect } from 'react';

export function Timer() {
  const [timeRemaining, setTimeRemaining] = useState(5);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (timeRemaining > 0) {
        setTimeRemaining(timeRemaining - 1);
      } else {
        clearInterval(intervalId);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeRemaining]);

  const uiElement = () => {
    return (
        <div>
        <p>Game starts in {timeRemaining} seconds</p>
      </div>
    )
  }

  return {
    timeRemaining, setTimeRemaining, uiElement
  }
}