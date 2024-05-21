// List of categories to pick from
    // clicking on category takes user to the tutorial:id
// Logout, login, sign up

// client/src/pages/Home.jsx
import React, { useState } from 'react';
import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';
import './Home.css';

function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="text-center">
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button className="btn btn-primary" onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>
        <p>
          Edit <code>src/pages/Home.jsx</code> and save to test HMR.
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more.
      </p>
    </div>
  );
}

export default Home;
