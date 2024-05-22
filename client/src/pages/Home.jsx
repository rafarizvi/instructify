// client/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';

function Home() {
  const categories = [];

  return (
    <div className="container">
      <header className="header">
        <h1>Instructify</h1>
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

        <section className="auth-buttons">
          <button className="btn btn-secondary">Login</button>
          <button className="btn btn-secondary">Sign Up</button>
          <button className="btn btn-secondary">Logout</button>
        </section>
      </main>

      <footer className="footer">
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more.
        </p>
      </footer>
    </div>
  );
}

export default Home;
