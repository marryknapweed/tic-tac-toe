import React, { useEffect, useState } from "react";
import "./index.css";

export function Timer({ remainingTime, onTimerEnd }) {
  const [progress, setProgress] = useState(100); // Начальная ширина прогресс-бара

  useEffect(() => {
    if (remainingTime <= 0) {
      if (onTimerEnd) {
        onTimerEnd();
      }
      return;
    }

    // Вычисляем процент оставшегося времени
    const progressPercentage = (remainingTime / 5) * 100;
    setProgress(progressPercentage);

    const timer = setInterval(() => {
      if (remainingTime > 0) {
        remainingTime -= 1;
        setProgress((remainingTime / 5) * 100); // Обновляем прогресс
      }
    }, 1000);

    return () => clearInterval(timer); // очищаем интервал при размонтировании компонента
  }, [remainingTime, onTimerEnd]);

  return (
    <div className="timer">
      <div
        className="timer-progress"
        style={{
          width: `${progress}%`,
          backgroundColor: progress > 20 ? "#4caf50" : "#ff0000",
        }}
      ></div>
      <div className="timer-text">Оставшееся время: {remainingTime} сек</div>
    </div>
  );
}
