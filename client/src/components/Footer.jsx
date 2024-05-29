import React from 'react';
import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <p className="read-the-docs">
        Click on the logos below to learn more about some of the tools used to develop Instructify.
      </p>
      <p> 
        <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </p>
    </footer>
  );
};

export default Footer;