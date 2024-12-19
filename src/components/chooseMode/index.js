import './index.css';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export function ChooseGameMode() {

    const pahts = {
        AI: "/game/AI",
        Online: "/game/chooseOnlineMode"
    };

    const title = "Please, choose the gamemode";
    const buttonText_online = "Play online";
    const buttonText_AI = "Play with AI";
    const navigate = useNavigate();

    const handleButtonClick = (mode) => {
        return navigate(pahts[mode]);
    };

      const isUser = () => {
        const role = localStorage.getItem("role");
        if (role === 'user') {
          return true;
        } else {
          navigate("/history");
          return false; // Return false if not admin
        }
      };
    
        useEffect(() => {
          isUser()
        }, []); // Add navigate to the dependency arra
      

    return (
        <div className='choose-wrapper'>
            <div className='choose'>
                <h2>{title}</h2>
                <div className='buttons-group'>
                    <button 
                        type="button" 
                        className="auth-button" 
                        onClick={() => handleButtonClick('Online')}
                    >
                        {buttonText_online}
                    </button>
                    <button 
                        type="button" 
                        className="auth-button" 
                        onClick={() => handleButtonClick('AI')}
                    >
                        {buttonText_AI}
                    </button>
                </div>
            </div>
        </div>
    );
}