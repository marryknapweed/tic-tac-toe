import "./connectIndex.css"
import { roomActions, trackUsersActions } from "../../utils/firestore";
import { useState, useCallback, useEffect } from "react";
import { Timer } from "./timer";
import { useNavigate } from "react-router-dom";

export function ConnectRoom () {

    const [roomInput, setRoomInput] = useState("")
    const [isConnectedTo, setIsConnectedTo] = useState(false)
    const [connectedPerson, setConnectedPerson] = useState("")
    const [isStarted, setIsStarted] = useState(true)

    const title = isConnectedTo ? `Connected to ${connectedPerson} lobby` : "Please ask your friend for room id and write it below"
    const {timeRemaining, setTimeRemaining, uiElement} = Timer()
    const navigate = useNavigate()
    const username = localStorage.getItem("username")

    const handleSubmit = async e => {
        e.preventDefault();
    
        if (roomInput) {
        const actions = await roomActions();
        const data = await actions.connectRoom(roomInput.target.value, username); // Get the roomId
            if (data) {
                setIsConnectedTo(true)
                setConnectedPerson(data.player1)
            }
        }
      };

      const navigateToGame = useCallback(() => {
        navigate(`/game/online/${roomInput.target.value}`)
      }, [navigate, roomInput])
    
      const awaitForConnection = useCallback(async () => {
        if (isConnectedTo && connectedPerson) {
          const { awaitForStart } = await trackUsersActions();
          const unsubscribe = awaitForStart(roomInput.target.value, (state) => {
            setIsStarted(state);
          });
          return unsubscribe;
        }
      }, [isConnectedTo, connectedPerson]);

      useEffect(() => {
        awaitForConnection();
      }, [awaitForConnection]);

      useEffect(() => {
        if (isStarted && isConnectedTo && connectedPerson && timeRemaining === 0) {
          navigateToGame()
        }
      }, [isStarted, isConnectedTo, connectedPerson, timeRemaining, navigateToGame]);
    

    return (
    <div className="wrapper">
      <div className="wrap">
        <h2>{title}</h2>
        {isStarted && (
          uiElement()
        )}
        {
            !isConnectedTo && (
                <form onSubmit={handleSubmit} className="auth-form">
                <div className={`input-container`}>
                    <input
                      type="text"
                      placeholder="9dF5T"
                      onChange={setRoomInput}
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