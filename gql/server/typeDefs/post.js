const {gql} = require('apollo-server-express');

module.exports = gql` 

    type Post{
        id: ID!,
        title: String!,
        description:String!
    }    
    type Query{
        totalPosts: Int!
        allPost: [Post!]!
    }
    #input type
    input PostInput{
        id:ID!
        title:String!
        description:String!
    }
    #mutations
    type Mutation{
        newPost(title: String!, description: String!): Post!
    }
    `; // creating this to merge mutliple typedefs into one for apollo server