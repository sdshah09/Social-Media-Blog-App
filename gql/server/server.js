const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { createServer } = require('http');
const path = require("path");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
const { PubSub } = require("graphql-subscriptions");
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { useServer } = require('graphql-ws/lib/use/ws');
const { WebSocketServer } = require('ws');

require("dotenv").config();
const { authCheckMiddleware } = require("./helpers/auth");

const app = express();
const pubsub = new PubSub();

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

const db = async () => {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useUnifiedTopology: true,
    });
    console.log("db connected");
  } catch (error) {
    console.log("db connection error", error);
  }
};

db();

const typesArray = loadFilesSync(path.join(__dirname, "./typeDefs"));
const resolversArray = loadFilesSync(path.join(__dirname, "./resolvers"));
const typeDefs = mergeTypeDefs(typesArray);
const resolvers = mergeResolvers(resolversArray);

const schema = makeExecutableSchema({ typeDefs, resolvers });

async function startServer() {
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res, pubsub }),
    plugins: [{
      serverWillStart: async () => {
        return {
          async drainServer() {
            wsServer.close();
          }
        }
      }
    }],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: true });

  app.get("/rest", authCheckMiddleware, (req, res) => {
    res.json({ data: "Shaswat Shah" });
  });

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  app.post("/uploadimages", authCheckMiddleware, (req, res) => {
    cloudinary.uploader.upload(
      req.body.image,
      (result) => {
        res.send({
          url: result.secure_url,
          public_id: result.public_id,
        });
      },
      {
        public_id: `${Date.now()}`,
        resource_type: "auto",
      }
    );
  });

  app.post("/removeimage", (req, res) => {
    let image_id = req.body.public_id;
    cloudinary.uploader.destroy(image_id, (error, result) => {
      if (error) return res.json({ success: false, error });
      res.send("ok");
    });
  });

  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  useServer({
    schema,
    context: () => ({ pubsub }),
    onConnect: () => {
      console.log("WebSocket connection established");
    },
  }, wsServer);

  httpServer.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`);
  });
}

startServer();
