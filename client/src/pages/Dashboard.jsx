// Viewing all tutorials by user
// Creating a tutorial
// Posting a tutorial
// Editing a tutorial
// Deleting a tutorial
// Logout
// import React, { useState } from 'react';
// import { useMutation } from '@apollo/client';
// import { ADD_TUTORIAL, REMOVE_TUTORIAL, ALL_TUTORIALS } from '../utils/mutations';
// import Auth from '../utils/auth'; 

// const Tutorial = () => {
//   const [formState, setFormState] = useState({
//     title: '',
//     description: '',
//     link: '',
//     user: '',
//   });

//   const [addTutorial] = useMutation(ADD_TUTORIAL, {
//     update(cache, { data: { addTutorial } }) {
//       try {
//         const { tutorials } = cache.readQuery({ query: ALL_TUTORIALS });
//         cache.writeQuery({
//           query: ALL_TUTORIALS,
//           data: { tutorials: [addTutorial, ...tutorials] },
//         });
//       } catch (e) {
//         console.error(e);
//       }
//     },
//   });

//   const [removeTutorial] = useMutation(REMOVE_TUTORIAL, {
//     update(cache, { data: { removeTutorial } }) {
//       try {
//         const { tutorials } = cache.readQuery({ query: ALL_TUTORIALS });
//         cache.writeQuery({
//           query: ALL_TUTORIALS,
//           data: { tutorials: tutorials.filter((tutorial) => tutorial._id !== removeTutorial._id) },
//         });
//       } catch (e) {
//         console.error(e);
//       }
//     },
//   });

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormState({
//       ...formState,
//       [name]: value,
//     });
//   };

//   const handleFormSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       await addTutorial({
//         variables: { ...formState },
//       });

//       setFormState({
//         title: '',
//         description: '',
//         link: '',
//         user: Auth.getProfile().data._id, // Assuming you store the user ID in Auth profile
//       });
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const handleDelete = async (tutorialId) => {
//     try {
//       await removeTutorial({
//         variables: { tutorialId },
//       });
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <div>
//       <h2>Manage Tutorials</h2>
//       <form onSubmit={handleFormSubmit}>
//         <input
//           className="form-input"
//           placeholder="Title"
//           name="title"
//           type="text"
//           value={formState.title}
//           onChange={handleChange}
//         />
//         <input
//           className="form-input"
//           placeholder="Description"
//           name="description"
//           type="text"
//           value={formState.description}
//           onChange={handleChange}
//         />
//         <input
//           className="form-input"
//           placeholder="Link"
//           name="link"
//           type="text"
//           value={formState.link}
//           onChange={handleChange}
//         />
//         <button className="btn btn-block btn-info" style={{ cursor: 'pointer' }} type="submit">
//           Add Tutorial
//         </button>
//       </form>
//       {/* Example list of tutorials for displaying and deletion */}
//       <div>
//         {/* Replace with actual tutorial data */}
//         {data && data.tutorials.map((tutorial) => (
//           <div key={tutorial._id}>
//             <h3>{tutorial.title}</h3>
//             <button onClick={() => handleDelete(tutorial._id)}>Delete</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Tutorial;
