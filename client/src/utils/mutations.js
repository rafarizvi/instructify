import { gql } from '@apollo/client';

// Login using email and password
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        name
        email
      }
    }
  }
`;

// Query to get all tutorials
export const ALL_TUTORIALS = gql`
  query getAllTutorials {
    tutorials {
      _id
      title
      description
      link
      author {
        _id
        name
      }
    }
  }
`;

// Adding profile using name, password and email
export const ADD_PROFILE = gql`
  mutation addProfile($name: String!, $email: String!, $password: String!) {
    addProfile(name: $name, email: $email, password: $password) {
      token
      userProfile {
        _id
        name
        email
      }
    }
  }
`;

// Adding the ability to add a tutorial. Using users ID, along with title, the content, and the category it belongs to
export const ADD_TUTORIAL = gql`
  mutation addTutorial($title: String!, $content: String!, $category: String!) {
    addTutorial(title: $title, content: $content, category: $category) {
      _id
      title
      content
      category {
        _id
        name
      }
    }
  }
`;

// Ability to remove a tutorial based on its ID
export const REMOVE_TUTORIAL = gql`
  mutation removeTutorial($_id: ID!) {
    removeTutorial(_id: $_id) {
      _id
    }
  }
`;

// Ability to add a comment, going off the users information as well and the tutorial they are commenting on
export const ADD_COMMENT = gql`
  mutation addComment($tutorialId: ID!, $content: String!) {
    addComment(tutorialId: $tutorialId, content: $content) {
      _id
      content
      author {
        _id
        name
      }
      tutorial {
        _id
        title
      }
    }
  }
`;

// Ability to remove comment based on the ID
export const REMOVE_COMMENT = gql`
  mutation removeComment($_id: ID!) {
    removeComment(_id: $_id) {
      _id
      content
    }
  }
`;
