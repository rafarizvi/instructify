// client/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';

function Home() {
  const categories = ["Category1", "Category2", "Category3"]; // Example categories

  return (
    <React.Fragment>
      <div className="container">
        <header className="header">
          <h1>instructify</h1>
          <p>Empowering Knowledge Sharing, <br></br> One Tutorial at a Time</p>
        </header>

        <main className="main-content">
          <section className="categories">
            <h2>Categories</h2>
            <ul className="categories-list">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link to={`/tutorial/${category.toLowerCase()}`} className="category-link">
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </main>

        <footer className="footer">
          <div>
            <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more about the technologies used to build this application.
          </p>
        </footer>
      </div>
    </React.Fragment>
  );
}

export default Home;
