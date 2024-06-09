    import { 
      useEffect,
      useQuery, 
      useMutation,
      QUERY_GET_SAVED_REMOVED_TUTORIALS,
      REMOVE_SAVED_TUTORIAL,
      Auth,
      Link
      } from './index'
    
    
      const Account = () => {
        const { loading, data, refetch } = useQuery(QUERY_GET_SAVED_REMOVED_TUTORIALS);
        const [removeSavedTutorial] = useMutation(REMOVE_SAVED_TUTORIAL);
      
        useEffect(() => {
          if (Auth.loggedIn()) {
            refetch();
          }
        }, [refetch]);
      
        if (loading) {
          return <div>Loading account...</div>;
        }
      
        const profile = data?.me;
        const profileId = profile?._id;
      
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
          <div>
            <h3>Saved Tutorials</h3>
            {profile?.savedTutorial?.length ? (
              <ul>
                {profile.savedTutorial.map((tutorial) => (
                  <li key={tutorial._id}>
                    <Link to={`/tutorial/${tutorial._id}`}>{tutorial.title}</Link>
                    <button onClick={() => handleRemoveTutorial(tutorial._id)}>Remove</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No saved tutorials!</p>
            )}
            <h2 className="text-center accountHeader">Account Information</h2>
            <p>Name: {profile?.name}</p>
            <p>Email: {profile?.email}</p>
          </div>
        );
      };
      
      export default Account;