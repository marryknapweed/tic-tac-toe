import { useState, useEffect } from 'react';
import "./timer.css"

export function Timer(customText = '') {
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [start, setStart] = useState(false)
  const text = customText ? `${customText} ${timeRemaining} seconds` : `Game starts in ${timeRemaining} seconds`
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
        <h4>{text}</h4>
      </div>
    )
  }

  return {
    timeRemaining, setTimeRemaining, uiElement, start, setStart
  }
}