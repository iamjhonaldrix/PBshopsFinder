import { useState, useEffect } from 'react'
import Navigator from './Nav.jsx'
import Body from './Body.jsx';
import Footer from './Footer.jsx';

import './App.css'

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Navigator />
      <Body />
      <Footer />
    </>
  );
}

export default App