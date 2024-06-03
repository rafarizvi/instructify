import { gql } from '@apollo/client';

// All tutorials 
export const QUERY_TUTORIALS = gql`
  query Tutorials {
    tutorials {
      _id
      title
      content
      createdAt
      author {
        _id
        name
      }
      category {
        _id
        name
      }
      comments {
        _id
        content
        createdAt
        author {
          _id
          name
        }
      }
      videos {
        _id
        title
        videoId
      }
    }
  }
`;

// All categories
export const GET_CATEGORIES = gql`
  query Categories {
    categories {
      _id
      name
    }
  }
`;

export const QUERY_PROFILE_ID = gql`
  query Profile($id: String) {
    profile(_id: $id) {
      name
      tutorials {
        _id
        title
        content
        createdAt
        category {
          _id
          name
        }
        comments {
          content
          author {
            _id
            name
          }
        }
      }
    }
  }
`;

export const QUERY_USER_TUTORIALS = gql`
  query Me {
    me {
      _id
      name
      email
      tutorials {
        _id
        title
        content
        createdAt
        category {
          _id
          name
        }
        videos {
          _id
          title
          videoId
        }
      }
    }
  }
`;

export const QUERY_ALL_TUTORIALS = gql`
  query AllTutorials {
    tutorials {
      _id
      title
      content
      createdAt
      author {
        _id
        name
      }
      category {
        _id
        name
      }
    }
  }
`;

// Pulling all info for a single tutorial, including the comments + category
export const QUERY_GET_TUTORIAL_DETAILS = gql`
  query GetSingleTutorial($tutorialId: ID!) {
    tutorial(_id: $tutorialId) {
      _id
      title
      content
      createdAt
      author {
        _id
        name
      }
      category {
        _id
        name
      }
      comments {
        _id
        content
        author {
          _id
          name
        }
      }
      videos {
        _id
        title
        videoId
        thumbnail
      }
    }
  }
`;

// Adding query to retrieve all comments based on a single tutorial
export const QUERY_GET_TUTORIAL_COMMENTS = gql`
  query GetTutorialComments($tutorialId: ID!) {
    tutorial(_id: $tutorialId) {
      _id
      comments {
        _id
        content
        createdAt
        author {
          _id
          name
        }
      }
    }
  }
`;
