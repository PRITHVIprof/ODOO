import { useEffect } from 'react';
import { useState } from 'react'

function App() {
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:1234/api/hello")
    .then(res => res.json())
    .then(data => setMsg(data.message));
  }, []);
  
  return (
    <h1>{msg}</h1>
  );
}

export default App;
