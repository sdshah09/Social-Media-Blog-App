const express = require("express"); // importing express
const { ApolloServer } = require("apollo-server-express");
const http = require("http");
const path = require("path");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");

require("dotenv").config(); // able to use environment variables from .env file
const { authCheckMiddleware } = require("./helpers/auth"); // Ensure this is the correct path and named import

// Express server
const app = express(); // express = request response handler
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

// db
const db = async () => {
  try {
    const success = await mongoose.connect(process.env.DATABASE, {
      useUnifiedTopology: true,
    });
    console.log("db connected");
  } catch (error) {
    console.log("db connection error", error);
  }
};

// Execute database function
db();

const typesArray = loadFilesSync(path.join(__dirname, "./typeDefs")); // path to all typedefs files
const resolversArray = loadFilesSync(path.join(__dirname, "./resolvers"));
const typeDefs = mergeTypeDefs(typesArray);
const resolvers = mergeResolvers(resolversArray);

// Create a GraphQL server
async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }), // Ensure context is passed correctly
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  const httpserver = http.createServer(app); // This will work with REST as well as GraphQL

  // REST endpoint
  app.get("/rest", authCheckMiddleware,(req, res) => {
    // REST is an endpoint
    res.json({
      data: "Shaswat Shah",
    });
  });

  // cloudinar config
  cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
  })
  app.post("/uploadimages", authCheckMiddleware,(req, res) => {
    cloudinary.uploader.upload(
      req.body.image,
      (result) => {
        res.send({
          url: result.url,
          public_id: result.public_id,
        });
      },
      {
        public_id: `${Date.now()}`, // public name
        resource_type: "auto", //JPEG,PNG
      }
    );
  });

  // remove image
  app.post("/removeimage", (req, res) => {
    let image_id = req.body.public_id;
    cloudinary.uploader.destroy(image_id, (error, result) => {
      if (error) return res.json({ success: false, error });
      res.send("ok");
    });
  });
  // Port
  // nodemon makes the changes in real-time and whenever we make changes we don't need to restart the server
  // When we make changes in env file we make sure to restart the server
  httpserver.listen(process.env.PORT, function () {
    console.log(`server is ready at http://localhost:${process.env.PORT}`);
    console.log(
      `graphql server is ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
    );
  });
}

// Start the server
startServer();
