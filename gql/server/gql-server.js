const { ApolloServer } = require('apollo-server');
const { query } = require('express');
require('dotenv').config()

//graphql server
// tyoes query/mutation / subscrition type

const typeDefs = `
    type Query{
    totalPosts: Int! 
    }
    ` // ! meaning this variable cannnot be empty

// resolvers

const resolvers = {
    Query: {
        totalPosts: ()=> 42
    }
}

// create a graphql server

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
});

apolloServer.listen(process.env.PORT,function() {
    console.log(`server is ready at http://localhost:${process.env.PORT}`)
    
});