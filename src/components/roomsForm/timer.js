import { useState, useEffect } from 'react';
import "./timer.css"

export function Timer() {
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [start, setStart] = useState(false)

  useEffect(() => {
    if (start) {
      const intervalId = setInterval(() => {
        if (timeRemaining > 0) {
          setTimeRemaining(timeRemaining - 1);
        } else {
          clearInterval(intervalId);
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [start, timeRemaining]);

  const uiElement = () => {
    return (
        <div className='timer-to-game'>
        <h4>Game starts in {timeRemaining} seconds</h4>
      </div>
    )
  }

  return {
    timeRemaining, setTimeRemaining, uiElement, start, setStart
  }
}