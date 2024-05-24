// client/src/pages/Home.jsx

import { Link } from 'react-router-dom';


function Home() {
  const categories = ["Category1", "Category2", "Category3"]; // Example categories

  return (
    <>
      <div className="container">
          <h1>instructify</h1>
          <p>Empowering Knowledge Sharing, <br></br> One Tutorial at a Time</p>
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
      </div>
    </>
  );
}

export default Home;
