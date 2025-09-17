const app = require('./app');
const http = require('http');

const REST_PORT = process.env.REST_PORT || 3000;
const GRAPHQL_PORT = process.env.GRAPHQL_PORT || 4000;

// REST server

const { exec } = require('child_process');
http.createServer(app).listen(REST_PORT, () => {
  console.log(`REST API rodando em http://localhost:${REST_PORT}`);
  console.log(`Swagger em http://localhost:${REST_PORT}/api-docs`);
  console.log(`GraphQL em http://localhost:${REST_PORT}/graphql`);
 // exec('open -a "Google Chrome" http://localhost:' + REST_PORT);
  // exec('open -a "Google Chrome" http://localhost:' + REST_PORT + '/api-docs');
  //exec('open -a "Google Chrome" http://localhost:' + REST_PORT + '/graphql');
});

// GraphQL server (Apollo já está embutido no Express)
// Basta acessar /graphql na mesma porta do REST
