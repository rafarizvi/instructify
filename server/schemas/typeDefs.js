const typeDefs = `#graphql
  type Profile {
    _id: ID!
    name: String!
    email: String!
    password: String!
    tutorials: [Tutorial!]
    comments: [Comment!]
    images: [Image!]
  }

  type Tutorial {
    _id: ID!
    title: String!
    content: String!
    author: Profile
    category: Category
    comments: [Comment!]
    images: [Image!]
    videos: [Video!]!
    createdAt: String!
  }

  type Category {
    _id: ID!
    name: String!
    tutorials: [Tutorial!]
  }

  type Comment {
    _id: ID!
    content: String!
    author: Profile
    tutorial: Tutorial
    createdAt: String!
  }

  type Image {
    _id: ID!
    link: String!
    author: Profile
    tutorial: Tutorial
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

  type Checkout {
  session: ID
  }

  type Query {
    profiles: [Profile!]
    profile(_id: String): Profile
    me: Profile
    tutorials: [Tutorial!]
    tutorial(_id: ID!): Tutorial
    categories: [Category!]
    comments: [Comment!]

    images: [Image!]
  }

  type Mutation {
    addProfile(name: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addTutorial(title: String!, content: String!, category: String!): Tutorial
    removeTutorial(_id: ID!): Tutorial
    updateTutorial(_id: ID!, title: String, content: String, category: String): Tutorial
    addComment(profileId: ID!, tutorialId: ID!, content: String!): Comment
    removeComment(_id: ID!): Comment
    updateComment(_id: ID!, content: String): Comment
    saveVideoToTutorial(title: String!, videoId: String!, thumbnail: String!, tutorialId: ID!): Tutorial
    removeVideoFromTutorial(tutorialId: ID!, videoId: ID!): Tutorial
    giveDonation(amount: Float!): Checkout

    addImage(profileId: ID!, tutorialId: ID!, link: String!): Image
    removeImage(_id: ID!): Image
}
`;

module.exports = typeDefs;
