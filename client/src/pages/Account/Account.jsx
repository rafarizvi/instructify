import {
  useEffect,
  useState,
  useQuery,
  useMutation,
  QUERY_GET_SAVED_REMOVED_TUTORIALS,
  REMOVE_SAVED_TUTORIAL,
  Button,
  Auth,
  Link
} from './account.js'

import './assets/account.css'


const Account = () => {
  const { loading, data, refetch } = useQuery(QUERY_GET_SAVED_REMOVED_TUTORIALS);
  const [removeSavedTutorial] = useMutation(REMOVE_SAVED_TUTORIAL);

  const [changePassword, setChangePassword] = useState('');
  const [changeUsername, setChangeUsername] = useState('');
  const [changeEmail, setChangeEmail] = useState('');


  useEffect(() => {
    if (Auth.loggedIn()) {
      refetch();
    }
  }, [refetch]);

  if (loading) {
    return <div>Loading account...</div>;
  }

  // const profileId = Auth.loggedIn() ? Auth.getProfile().data._id : null;


  const profile = data.me;
  const profileId = profile._id;

  const handleRemoveTutorial = async (tutorialId) => {
    try {
      await removeSavedTutorial({
        variables: { tutorialId, profileId },
      });
      refetch();
    } catch (error) {
      console.error('There was a problem removing a tutorial', error);
    }
  };

  return (
    <div className='accountDiv'>
      <h3 className='savedTutorials'>Saved Tutorials</h3>
      {profile.savedTutorial.length ? (
        <ul>
          {profile.savedTutorial.map((tutorial) => (
            <p key={tutorial._id}>
              <Link to={`/tutorial/${tutorial._id}`}>{tutorial.title}</Link>
              <Button className="removeSavedTutorialBtAcct" onClick={() => handleRemoveTutorial(tutorial._id)}>Remove</Button>
            </p>
          ))}
        </ul>
      ) : (
        <p>You don't have any saved tutorials</p>
      )}

      <h2 className="text-center accountHeader">Account Information</h2>
      <p>Email: {profile?.name}</p>
      <div><Button onClick={() => setChangeUsername('Feature coming soon!')}>Change Username</Button> 
      <div>{changeUsername}</div>
      </div>

      <p>Email: {profile?.email}</p>
      <div><Button onClick={() => setChangeEmail('Feature coming soon!')}>Change Email</Button> 
      <div>{changeEmail}</div>
      </div>
      
      <p>Password</p>
      <div><Button onClick={() => setChangePassword('Feature coming soon!')}>Change Password</Button> 
      <div>{changePassword}</div>
      </div>

    </div>
  );
};

export default Account;