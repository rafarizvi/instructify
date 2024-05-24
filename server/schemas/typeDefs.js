const typeDefs = `#graphql

  type Profile {
    _id: ID!
    name: String!
    email: String!
    password: String!
    tutorial: [Tutorial!]
    comments: [Comment!]
  }

  type Tutorial {
    _id: ID!
    title: String!
    content: String!
    author: Profile!
    category: Category
    comments: [Comment!]
  }

  type Category {
    _id: ID!
    name: String!
    tutorial: [Tutorial!]
  }

  type Comment {
    _id: ID!
    content: String!
    author: Profile!
    tutorial: Tutorial
  }

  type Query {
    profile(_id: String): Profile
    tutorial: [Tutorial!]
    categories: [Category!]
    comments: [Comment!]
  }

  type Auth {
    token: ID!
    profile: Profile
  }

  type Mutation {
    addProfile(name: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addTutorial(profileId: ID!, title: String!, content: String!, category: String!): Tutorial
    removeTutorial(_id: ID!): Tutorial
    addComment(profileId: ID!, tutorialId: ID!, content: String!): Tutorial
    removeComment(_id: ID!): Comment
  }
`;

module.exports = typeDefs;

