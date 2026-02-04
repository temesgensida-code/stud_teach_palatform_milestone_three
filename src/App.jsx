import React from 'react';
import AudioChat from './components/AudioChat';
import './App.css'; // Optional for styling

function App() {
  // In a real app, this ID could come from the URL (e.g., /room/123)
  const TEST_ROOM_ID = "main-lobby";

  return (
    <div className="App">
      <header className="App-header">
        <h1>webRTC milestone</h1>
      </header>

      <main style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <AudioChat roomId={TEST_ROOM_ID} />
      </main>
      
      <footer style={{ marginTop: '100px', fontSize: '0.8rem', color: '#666' }}>
        Status: Secure P2P Connection
      </footer>
    </div>
  );
}

export default App;