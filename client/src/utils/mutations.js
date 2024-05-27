import { gql } from '@apollo/client';

// Login using email and password
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      profile {
        _id
        name
        email
      }
    }
  }
`;

// Adding profile using name, password and email
export const ADD_PROFILE = gql`
  mutation addProfile($name: String!, $email: String!, $password: String!) {
    addProfile(name: $name, email: $email, password: $password) {
      token
      profile {
        _id
        name
        email
      }
    }
  }
`;

// Adding the ability to add a tutorial
export const ADD_TUTORIAL = gql`
  mutation addTutorial($title: String!, $content: String!, $category: String!) {
    addTutorial(title: $title, content: $content, category: $category) {
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
    }
  }
`;

// Ability to remove a tutorial based on its ID
export const REMOVE_TUTORIAL = gql`
  mutation removeTutorial($id: ID!) {
    removeTutorial(_id: $id) {
      _id
    }
  }
`;

// Ability to update a tutorial
export const UPDATE_TUTORIAL = gql`
  mutation updateTutorial($id: ID!, $title: String!, $category: String!, $content: String!) {
    updateTutorial(_id: $id, title: $title, category: $category, content: $content) {
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

// Ability to add a comment
export const ADD_COMMENT = gql`
  mutation addComment($profileId: ID!, $tutorialId: ID!, $content: String!) {
    addComment(profileId: $profileId, tutorialId: $tutorialId, content: $content) {
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

// Ability to remove a comment based on the ID
export const REMOVE_COMMENT = gql`
  mutation removeComment($id: ID!) {
    removeComment(_id: $id) {
      _id
      content
    }
  }
`;

// Ability to save a video and assign it to tutorials
export const SAVE_VIDEO_TO_TUTORIAL = gql`
  mutation SaveVideoToTutorial($title: String!, $videoId: String!, $thumbnail: String!) {
    saveVideoToTutorial(title: $title, videoId: $videoId, thumbnail: $thumbnail) {
      _id
      title
      videoId
      thumbnail
    }
  }
`;