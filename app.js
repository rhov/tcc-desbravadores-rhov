require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const jwtMiddleware = require('./graphql/middleware/auth');
const restRoutes = require('./controller/restController');

const app = express();
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Clubes de Desbravadores',
      version: '1.0.0',
      description: 'Documentação da API REST para clubes de desbravadores',
    },
    servers: [
      { url: process.env.BASE_URL_REST || 'http://localhost:3000' },
    ],
  },
  apis: ['./controller/*.js'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// REST routes
app.use('/', restRoutes);

// Apollo Server setup
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => jwtMiddleware.graphqlContext(req),
});

async function startApollo() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });
}

startApollo();

module.exports = app;
