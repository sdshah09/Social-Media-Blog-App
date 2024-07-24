const { gql } = require("apollo-server-express");

module.exports = gql`
  #scalar type
  scalar DateTime
  type UserCreateResponse {
    username: String!
    email: String!
  }

  type Image {
    url: String
    public_id: String
  }

  type User {
    _id: ID!
    username: String
    name: String
    email: String
    images: [Image]
    about: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  #input type
  input ImageInput {
    url: String
    public_id: String
  }

  #input type
  input UserUpdateInput {
    username: String
    name: String
    images: [ImageInput]
    about: String
  }
  type Query {
    profile: User!
  }
  type Mutation {
    userCreate(email: String!): UserCreateResponse!
    userUpdate(input: UserUpdateInput): User!
  }

  type Query {
    me: String!
  }
`; // creating this to merge mutliple typedefs into one for apollo server
