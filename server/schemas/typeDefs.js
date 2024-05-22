const typeDefs = `#graphql

  type Profile {
    _id: ID!
    name: String!
    email: String!
    password: String!
    tutorials: [Tutorial!]
    comments: [Comment!]
  }

  type Tutorial{
    _id: ID!
    title: String!
    content: String!
    author: User!
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
    profile(_id: String): Profile
    tutorials: [Tutorial!]
    categories: [Category!]
    comments: [Comment!]
    }

  type Auth {
    token: ID!
    profile: Profile
  }

  type Mutations {
    # Adding a user profile using their name, email and password using authentication -tb
    addProfile(name: String!, email: String!, password: String!) Auth
    # Logging user in by using their email and password, using authentication -tb
    login(email: String!, password: String!) Auth
    # Adding a new tutorial using its title, content and category where the content and category is required -tb
    addTutorial(profileId: ID!, title: String!, content: String!, category: String!): Tutorial
    # removing a tutorial based on its ID -tb
    removeTutorial: (_id: ID!): Tutorial
    # Adding a comment from a users profile ID, on a single tutorial using its ID, where the content is required -tb
    addComment(profileId: ID!, tutorialID: ID!, content: String!): Tutorial
    # Removing a comment based on it's ID -tb
    removeComment(_id: ID!):Comment
  }
`;

module.exports = typeDefs;

