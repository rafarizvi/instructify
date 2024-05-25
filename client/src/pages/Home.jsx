// client/src/pages/Home.jsx

// import { Link } from 'react-router-dom';

import { useQuery } from '@apollo/client';

import CategoryList from '../components/categories';

import { QUERY_CATEGORIES } from '../utils/queries'


const Home = () => {
  const { loading, data } = useQuery(QUERY_CATEGORIES);
  const categories = data?.categories || [];
  console.log(categories);

  return (
    <main>
      <div className="flex-row justify-center">
        <div className="col-12 col-md-10 my-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <CategoryList
              categories={categories}
              title="Categories"
              all="View all"
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;

// function Home() {
//   const categories = ["Category1", "Category2", "Category3"]; // Example categories

//   return (
//     <>
//       <div className="container">
//           <h1>instructify</h1>
//           <p>Empowering Knowledge Sharing, <br></br> One Tutorial at a Time</p>
//         <main className="main-content">
//           <section className="categories">
//             <h2>Categories</h2>
//             <ul className="categories-list">
//               {categories.map((category, index) => (
//                 <li key={index}>
//                   <Link to={`/tutorial/${category.toLowerCase()}`} className="category-link">
//                     {category}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </section>
//         </main>
//       </div>
//     </>
//   );
// }

// export default Home;
