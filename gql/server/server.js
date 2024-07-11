const express = require('express'); // importing express
const { ApolloServer } = require('apollo-server-express');
const http = require('http');
require('dotenv').config(); // able to use environment variables from .env file

// Express server
const app = express(); // express = request response handler

const typeDefs = `
    type Query {
        totalPosts: Int!
    }
`; // ! meaning this variable cannot be empty

// Resolvers
const resolvers = {
    Query: {
        totalPosts: () => 42
    }
};

// Create a GraphQL server
async function startServer() {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    const httpserver = http.createServer(app); // This will work with REST as well as GraphQL

    // REST endpoint
    app.get('/rest', function (req, res) { // REST is an endpoint
        res.json({
            data: 'Shaswat Shah'
        });
    });

    // Port
    // nodemon makes the changes in real-time and whenever we make changes we don't need to restart the server
    // When we make changes in env file we make sure to restart the server
    app.listen(process.env.PORT, function () {
        console.log(`server is ready at http://localhost:${process.env.PORT}`);
        console.log(`graphql server is ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`);
    });
}

// Start the server
startServer();
