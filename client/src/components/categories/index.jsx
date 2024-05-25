import { Link } from 'react-router-dom';

const CategoryList = ({ categories, title }) => {

  return (
    <div>
      <h3 className="text-primary">{title}</h3>
      <div className="flex-row justify-space-between my-4">
        {categories &&
          categories.map((category) => (
            <div key={category._id} className="col-12 col-xl-6">
              <div className="card mb-3">
                <Link
                  className="btn btn-block btn-squared btn-light text-dark category-link"
                  to={`/tutorial/${category.name.toLowerCase()}`}
                >
                <h4 className="card-header bg-dark text-light p-2 m-0">
                  {category.name} <br />
                </h4>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
export default CategoryList;
