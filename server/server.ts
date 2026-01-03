import express from "express";
import path from "path";
import { db } from "./config/connection";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import cors from "cors";
import schema from "./schemas";
import { authMiddleware } from "./utils/auth";

// Destructure typeDefs and resolvers from the imported schema
const { typeDefs, resolvers } = schema;

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Serve up static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/dist")));
}

const startApolloServer = async () => {
  try {
    await server.start();

    // Apply the Apollo GraphQL middleware and set the path to /graphql
    app.use(
      "/graphql",
      cors(),
      express.json(),
      expressMiddleware(server, {
        context: authMiddleware,
      })
    );

    // Wildcard route to serve index.html for any non-API requests
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
    });

    // Connect to the database and then start the server
    db.once("open", () => {
      app.listen(PORT, () => {
        console.log(`🌍 Now listening on localhost:${PORT}`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
      });
    });
  } catch (err) {
    console.error(err);
  }
};

startApolloServer();
