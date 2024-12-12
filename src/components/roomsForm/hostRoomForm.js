import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { roomActions, trackUsersActions } from "../../utils/firestore";
import { Timer } from "./timer";

export function HostRoom() {
  const [roomId, setRoomId] = useState("Generating...")
  const [docId, setDocId] = useState("")
  const [connectedPlayer, setConnectedPlayer] = useState(null)
  const [isStarted, setIsStarted] = useState(true)

  const navigate = useNavigate()
  const title = `Your's room id is: ${roomId}`
  const {timeRemaining, setTimeRemaining, uiElement} = Timer()

  const navigateToGame = useCallback(() => {
    navigate(`/game/online/${roomId}`)
  }, [navigate, roomId])

  const createRoom = useCallback(async () => {
    const actions = await roomActions();
    const username = localStorage.getItem("username")
    const { roomId: newRoomId, docId: newDocId } = await actions.createRoom(username);
    setRoomId(newRoomId);
    setDocId(newDocId);
  }, [])

  const awaitForConnection = useCallback(async () => {
    if (roomId !== "Generating..." && docId) {
      const { awaitForConnect } = await trackUsersActions();
      const unsubscribe = awaitForConnect(docId, (player) => {
        setConnectedPlayer(player);
      });
      return unsubscribe;
    }
  }, [roomId, docId]);

  useEffect(() => {
    createRoom();
  }, [createRoom]);

  useEffect(() => {
    awaitForConnection();
  }, [awaitForConnection]);

  useEffect(() => {
    if (connectedPlayer && isStarted && timeRemaining === 0) {
      navigateToGame()
    }
  }, [connectedPlayer, isStarted, timeRemaining, navigateToGame]);

  return (
    <div className="auth-wrapper">
      <div className="auth">
        <h2>{title}</h2>
        {connectedPlayer && <p>Second player is connected - {connectedPlayer}</p>}
        {connectedPlayer && <button type="submit" className="auth-button">Start the game!</button>}
        {isStarted && uiElement()}
        {!connectedPlayer && <p>Waiting for the second player...</p>}
      </div>
    </div>
  )
}