const express = require('express'); // importing express
const { ApolloServer } = require('apollo-server-express');
const http = require('http');
const path = require('path');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const mongoose = require('mongoose');
require('dotenv').config(); // able to use environment variables from .env file

// Express server
const app = express(); // express = request response handler
 // db

 const db = async () => {
    try{
        const success = await mongoose.connect(process.env.DATABASE_CLOUD,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("db connected");

    }
    catch(error){
        console.log("db connection error",error);
    }
 }

// execute database function
db();
const typesArray = loadFilesSync(path.join(__dirname,'./typeDefs')); // path to all typedefs files
const resolversArray = loadFilesSync(path.join(__dirname,'./resolvers'));
const typeDefs = mergeTypeDefs(typesArray);
const resolvers = mergeResolvers(resolversArray);
// ! meaning this variable cannot be empty


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
