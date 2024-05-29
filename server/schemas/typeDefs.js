const typeDefs = `#graphql

  type Profile {
    _id: ID!
    name: String!
    email: String!
    password: String!
    tutorials: [Tutorial!]
    comments: [Comment!]
  }

  type Tutorial {
    _id: ID!
    title: String!
    content: String!
    videoId: String!
    thumbnail: String!
    author: Profile!
    category: Category
    comments: [Comment!]
    videos: [Video!]!
  }

  type Category {
    _id: ID!
    name: String!
    tutorials: [Tutorial!]
  }

  type Comment {
    _id: ID!
    content: String!
    #had to make profile nullable due to issues. Will add back -tb
    author: Profile
    tutorial: Tutorial
  }

  type Query {
    profiles: [Profile!]
    profile(_id: String): Profile
    me: Profile
    tutorials: [Tutorial!]
    tutorial(_id: ID!): Tutorial
    categories: [Category!]
    comments: [Comment!]
  }

  type Auth {
    token: ID!
    profile: Profile
  }

  type Video {
    _id: ID!
    title: String!
    videoId: String!
    thumbnail: String!
  }

  type Mutation {
    addProfile(name: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addTutorial(title: String!, content: String!, category: String!): Tutorial
    removeTutorial(_id: ID!): Tutorial
    updateTutorial(_id: ID!, title: String, content: String, category: String): Tutorial
    # added profile ID to comments
    addComment(profileId: ID!, tutorialId: ID!, content: String!): Comment
    removeComment(_id: ID!): Comment
    updateComment(_id: ID!, content: String): Comment
    saveVideoToTutorial(title: String!, videoId: String!, thumbnail: String!, tutorialId:ID!): Tutorial
    removeVideoFromTutorial(tutorialId: ID!, videoId: ID!): Tutorial
}
`;

module.exports = typeDefs;

