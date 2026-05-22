import { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Connect to the backend server running on port 5000
const socket = io('https://chat-backend-production-7f48.up.railway.app');

function App() {
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    // Listen for incoming messages from the backend
    socket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data]);
    });

    return () => socket.off('receive_message');
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      const messageData = {
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: socket.id 
      };

      // Emit message to backend
      socket.emit('send_message', messageData);
      setMessage('');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '500px', margin: 'auto' }}>
      <h2>🌐 Global Chat Room</h2>
      
      {/* Message Display Panel */}
      <div style={{ border: '1px solid #ccc', height: '350px', overflowY: 'auto', padding: '10px', marginBottom: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        {messageList.map((msg, index) => (
          <div key={index} style={{ margin: '10px 0', textAlign: msg.sender === socket.id ? 'right' : 'left' }}>
            <div style={{ display: 'inline-block', padding: '8px 12px', borderRadius: '10px', backgroundColor: msg.sender === socket.id ? '#007bff' : '#e9ecef', color: msg.sender === socket.id ? 'white' : 'black' }}>
              <p style={{ margin: 0 }}>{msg.text}</p>
              <small style={{ fontSize: '10px', opacity: 0.7 }}>{msg.time}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type a message..." 
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Send</button>
      </form>
    </div>
  );
}

export default App;