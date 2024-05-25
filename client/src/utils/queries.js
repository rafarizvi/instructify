import { gql } from '@apollo/client';

// Query to get profile details along with associated tutorials, categories, and comments
export const GET_PROFILE = gql`
  query getProfile($profileId: ID!) {
    profile(_id: $profileId) {
      _id
      name
      email
      tutorials {
        _id
        title
        content
        author {
          _id
          name
          email
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
            email
          }
        }
      }
    }
  }
`;

// Query to get all tutorials along with associated authors, categories, and comments
export const ALL_TUTORIALS = gql`
  query getTutorials {
    tutorials {
      _id
      title
      content
      author {
        _id
        name
        email
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
          email
        }
      }
    }
  }
`;

// Query to get all categories along with associated tutorials, authors, and comments
export const GET_CATEGORIES = gql`
  query getCategories {
    categories {
      _id
      name
      tutorials {
        _id
        title
        content
        author {
          _id
          name
          email
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
            email
          }
        }
      }
    }
  }
`;

// Query to get all comments along with associated authors and tutorials
export const GET_COMMENTS = gql`
  query getComments {
    comments {
      _id
      content
      author {
        _id
        name
        email
      }
      tutorial {
        _id
        title
        content
        author {
          _id
          name
          email
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
            email
          }
        }
      }
    }
  }
`;
