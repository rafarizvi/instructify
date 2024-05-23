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
    author: Profile!
    category: Category
    comments: [Comment!]
  }

  type Category {
    _id: ID!
    name: String!
    tutorials: [Tutorial!]
  }

  type Comment {
    _id: ID!
    content: String!
    author: Profile!
    tutorial: Tutorial
  }

  type Query {
    profiles: [Profile]
    profile(_id: String): Profile
    tutorials: [Tutorial!]
    categories: [Category!]
    comments: [Comment!]
  }

  type Auth {
    token: ID!
    profile: Profile
  }

  type Mutation {
    addProfile(name: String!, email: String!, password: String!): Profile
    login(email: String!, password: String!): Auth
    addTutorial(profileId: ID!, title: String!, content: String!, category: String!): Tutorial
    removeTutorial(_id: ID!): Tutorial
    addComment(profileId: ID!, tutorialID: ID!, content: String!): Tutorial
    removeComment(_id: ID!): Comment
  }
`;

module.exports = typeDefs;


