import { gql } from '@apollo/client';

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

export const GET_TUTORIALS = gql`
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


