import { useEffect, useState } from "react";
import { roomActions, trackUsersActions } from "../../utils/firestore";
import { doc } from "firebase/firestore";

export function HostRoom() {

  const [roomId, setRoomId] = useState("Generating...")
  const [docId, setDocId] = useState("")
  const [connectedPlayer, setConnectedPlayer] = useState('')
  const title = `Your's room id is: ${roomId}`

  useEffect(async () => {
  const actions = await roomActions();
  const username = localStorage.getItem("username")
  const roomId = await actions.createRoom(username).then((data) => {setRoomId(data.roomId), setDocId(data.docId)}); // Get the roomId
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (roomId !== "Generating...") {
        const dbActions = await trackUsersActions(); // Await the promise to get the object
        const unsubscribe = dbActions.awaitForConnect(docId, setConnectedPlayer); // Now this should work

        // Cleanup function to unsubscribe from the listener
        return () => {
          unsubscribe();
        };
      }
    };

    fetchData(); // Call the async function
  }, [roomId]);

    return (
<div className="auth-wrapper">
      <div className="auth">
        <h2>{title}</h2>
        {connectedPlayer && <p>Second player is connected - {connectedPlayer}</p>}
        {!connectedPlayer && <p>Waiting for the second player...</p>}
        </div>
          </div>
    );
  }