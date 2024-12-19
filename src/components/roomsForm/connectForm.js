import "./connectIndex.css"
import { roomActions, trackUsersActions } from "../../utils/firestore";
import { useState, useCallback, useEffect } from "react";
import { useTimer as Timer } from "./timer";
import { useNavigate } from "react-router-dom";

export function ConnectRoom () {
    const [roomInput, setRoomInput] = useState("")
    const [isConnectedTo, setIsConnectedTo] = useState(false)
    const [connectedPerson, setConnectedPerson] = useState("")
    const [isStarted, setIsStarted] = useState(false)

    const title = isConnectedTo ? `Connected to ${connectedPerson} lobby` : "Please ask your friend for room id and write it below"
    const {timeRemaining, setTimeRemaining, uiElement, setStart} = Timer()
    const navigate = useNavigate()
    const username = localStorage.getItem("username")

    const handleSubmit = async e => {
        e.preventDefault();
    
        if (roomInput) {
            const actions = await roomActions();
            const userId = localStorage.getItem("id")
            const data = await actions.connectRoom(roomInput, username, userId); // Get the roomId
            if (data) {
                setIsConnectedTo(true)
                setConnectedPerson(data.player1)
                await awaitForConnection(); // Call awaitForConnection here
            }
        }
    };

    const navigateToGame = useCallback(() => {
        navigate(`/game/online/${roomInput}`)
    }, [navigate, roomInput])
    
    const awaitForConnection = async () => {
        console.log("called first")
        const userActions = await trackUsersActions();
        try {
          userActions.awaitForGameStart(roomInput, setIsStarted, true);
        } catch (error) {
            console.error("Error getting game status: ", error);
        }
    }
    
    useEffect(() => {
        if (isStarted) {
          setStart(true)
        } // This will log the updated value of isStarted
    }, [isStarted]);

    useEffect(() => {
        if (isStarted && isConnectedTo && connectedPerson && timeRemaining === 0) {
            navigateToGame()
        }
    }, [isStarted, isConnectedTo, connectedPerson, timeRemaining, navigateToGame]);

    const generateData = () => {
      if (isConnectedTo) {
        if (!isStarted) {
          return "Waiting for host game start"
        } else {
          return uiElement()
        }
      } else {
        return ""
      }
    }
    
    return (
        <div className="wrapper">
            <div className="wrap">
                <h2>{title}</h2>
                {generateData()}
                {
                    !isConnectedTo && (
                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className={`input-container`}>
                                <input
                                    type="text"
                                    placeholder="9dF5T"
                                    onChange={e => setRoomInput(e.target.value)} // Update this line
                                />
                            </div>
                            <button type="submit" className="auth-button">
                                Submit
                            </button>
                        </form>
                    )
                }
            </div>
        </div>
    )
}