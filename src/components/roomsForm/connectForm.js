import "./connectIndex.css"
import { roomActions } from "../../utils/firestore";
import { useState } from "react";

export function ConnectRoom () {

    const [roomInput, setRoomInput] = useState("")
    const [isConnectedTo, setIsConnectedTo] = useState(false)
    const [connectedPerson, setConnectedPerson] = useState("")

    const title = isConnectedTo ? `Connected to ${connectedPerson} lobby` : "Please ask your friend for room id and write it below"
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

    return (
    <div className="wrapper">
      <div className="wrap">
        <h2>{title}</h2>
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