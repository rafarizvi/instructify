const typeDefs = `#graphql

type User{
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
  author: User!
  tutorial: Tutorial
}

type Query {
    user(_id: String!): User
    tutorials: [Tutorial!]
    categories: [Category!]
    comments: [Comment!]
  }

type Mutation {
  createUser(name: String!, email: String!, password: String!): User
  createTutorial(title: String!, content: String!): Tutorial
  createCategory(name: String!): Category
  createComment(content: String!): Comment
}
`;

module.exports = typeDefs;

