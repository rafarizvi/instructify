import { gql } from '@apollo/client';

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

export const REMOVE_TUTORIAL = gql`
  mutation removeTutorial($id: ID!) {
    removeTutorial(_id: $id) {
      _id
    }
  }
`;

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

export const REMOVE_COMMENT = gql`
  mutation removeComment($id: ID!) {
    removeComment(_id: $id) {
      _id
      content
    }
  }
`;

export const SAVE_VIDEO_TO_TUTORIAL = gql`
  mutation SaveVideoToTutorial($title: String!, $videoId: String!, $thumbnail: String!, $tutorialId: ID!) {
    saveVideoToTutorial(title: $title, videoId: $videoId, thumbnail: $thumbnail, tutorialId: $tutorialId) {
      _id
      title
      videos {
        _id
        title
        videoId
        thumbnail
      }
    }
  }
`;

export const REMOVE_VIDEO_FROM_TUTORIAL = gql`
  mutation removeVideoFromTutorial($tutorialId: ID!, $videoId: ID!) {
    removeVideoFromTutorial(tutorialId: $tutorialId, videoId: $videoId) {
      _id
      title
      videos {
        _id
        title
        videoId
        thumbnail
      }
    }
  }
`;

export const LIKE_TUTORIAL = gql`
  mutation LikeTutorial($tutorialId: ID!, $profileId: ID!) {
    likeTutorial(tutorialId: $tutorialId, profileId: $profileId) {
      _id
      likes {
        _id
        name
      }
      dislikes {
        _id
        name
      }
    }
  }
`;

export const DISLIKE_TUTORIAL = gql`
  mutation DislikeTutorial($tutorialId: ID!, $profileId: ID!) {
    dislikeTutorial(tutorialId: $tutorialId, profileId: $profileId) {
      _id
      likes {
        _id
        name
      }
      dislikes {
        _id
        name
      }
    }
  }
`;

export const GIVE_DONATION = gql`
  mutation GiveDonation($amount: Float!) {
    giveDonation(amount: $amount) {
      session
    }
  }
`;

export const QUERY_TUTORIALS = gql`
  query tutorials {
    tutorials {
      _id
      title
      content
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
      likes {
        _id
        name
      }
      dislikes {
        _id
        name
      }
    }
  }
`;

export const QUERY_GET_TUTORIAL_LIKES_DISLIKES = gql`
  query GetTutorialLikesDislikes($tutorialId: ID!) {
    tutorial(_id: $tutorialId) {
      _id
      likes {
        _id
        name
      }
      dislikes {
        _id
        name
      }
    }
  }
`;
