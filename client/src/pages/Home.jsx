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

      </main>

      <footer className="footer">

      </footer>
    </div>
  );
}

export default Home;
