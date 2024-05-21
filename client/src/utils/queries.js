const typeDefs = `#graphql
  type Profile {
    _id: ID!
    name: String!
    email: String!
    password: String!
  }

  type Tutorial {
    id: ID!
    title: String!
    content: String!
    author: User!
    category: String!
  } 

  type Comment {
    id: ID!
    content: String!
    author: User!
    tutorial: Tutorial!
    }

  type Auth {
    token: ID!
    profile: Profile
  }
  
  type Query {
    getProfile: Profile
    getAllTutorials: [Tutorial]
    getTutorial(id: ID!): Tutorial
    getAllTutorialsByCategory(category: String!): [Tutorial]
  }
`

module.exports = typeDefs;
