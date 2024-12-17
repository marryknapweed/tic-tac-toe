import React, { useEffect, useState } from 'react';
import { roomActions, trackUsersActions } from '../../utils/firestore';
import "./chatWindow.css"

export const ChatWindow = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      setInputValue('');
      const actions = await roomActions()
      await actions.updateLobbyMessages(roomId.roomId, inputValue)
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    
    // Get hours, minutes, and seconds
    const hours = String(date.getHours()).padStart(2, '0'); // Ensure two digits
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure two digits
    const seconds = String(date.getSeconds()).padStart(2, '0'); // Ensure two digits
    
    return `${hours}:${minutes}:${seconds}`; // Return formatted time
  };

  const awaitMessages = async () => {
    const actions = await trackUsersActions()
    const data = await actions.awaitForMessages(roomId.roomId, setMessages, true)
    console.log(data)
  }

  useEffect(() => {
    awaitMessages()
  }, [])

  return (
    <div className="chat-window">
        <div className='chat-header'>
            <h4>Lobby chat</h4>
        </div>
        <hr />
        <div className="chat-messages">
  {messages.map((message, index) => (
    <div key={index} className={
      localStorage.getItem("username") === message.username ? 'current-pl-message' : 'opponent-pl-message'}>
      <p className='msg-content'>{message.content}</p>
      <div className={
        localStorage.getItem("username") === message.username ? 'msg-add-content-current' : 'msg-add-content-opponent'
      }>
        <p className='msg-user'>From {message.username},</p>
        <p className='msg-timestamp'>{formatTime(message.timestamp)}</p>
      </div>
    </div>
  ))}
</div>
      <div className="chat-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};
