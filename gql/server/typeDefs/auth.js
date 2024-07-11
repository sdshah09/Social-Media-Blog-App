const {gql} = require('apollo-server-express');

module.exports = gql` 
    type Query{
        me: String!
    }
    `; // creating this to merge mutliple typedefs into one for apollo server