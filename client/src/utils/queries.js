import { gql } from '@apollo/client';

// All tutorials 
export const QUERY_TUTORIALS = gql`
query Tutorials {
  tutorials {
    title
    _id
    content
    author {
      name
      _id
    }
    category {
      name
      _id
    }
    comments {
      content
      author {
        name
        _id
      }
    }
  }
}
`;

// All categories
export const QUERY_CATEGORIES = gql`
query Categories {
  categories {
    name
    _id
  }
}
`;

export const QUERY_PROFILE_ID = gql`
query Profile($id: String) {
  profile(_id: $id) {
    name
    tutorials {
      title
      content
      category {
        _id
        name
      }
      comments {
        content
        author {
          name
          _id
        }
      }
    }
  }
}
`;
