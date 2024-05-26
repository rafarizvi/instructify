import { Link } from 'react-router-dom';

import './Categories.css';

const CategoryList = ({ categories, title, all }) => {

  return (
    <div>
      <div className="col-12">
        <h1 className="mb-4 text-center">{title}</h1>
        <p className="lead text-center">Empowering Knowledge Sharing,<br /> One Tutorial at a Time</p>
      </div>

      <div className="catDiv">
        <Link className="btn btn-squared text-dark category-link"
          to={'/all'}>
          <h4 className="bg-dark text-light p-2 m-0 catBtn">{all}</h4>
        </Link>
      </div>

      <div className='catDiv'>
        {categories &&
          categories.map((category) => (
            <div key={category._id}>
              <Link
                className="btn btn-squared category-link"
                to={`/${category.name.toLowerCase()}`}
              >
                <h4 className="bg-dark text-light p-2 m-0 catBtn">
                  {category.name} <br />
                </h4>
              </Link>
            </div>
          ))}
      </div>
    </div>

  );
};
export default CategoryList;


