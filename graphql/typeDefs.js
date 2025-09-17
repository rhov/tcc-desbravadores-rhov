const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    username: String!
  }


  type Clube {
    id: ID!
    nome: String!
    unidades: [String!]!
  }

  type Desbravador {
    id: ID!
    nome: String!
    idade: Int!
    documento: String!
    sexo: String!
    clube: Clube!
    unidade: String!
  }



  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!

    clubes: [Clube!]!
    clube(id: ID!): Clube
    buscarClubes(nome: String!): [Clube!]!

  buscarUnidades(clubeId: ID!, nome: String!): [String!]!

  desbravadores(clubeId: ID!, unidade: String!): [Desbravador!]!
    desbravador(id: ID!): Desbravador
    buscarDesbravadores(nome: String!): [Desbravador!]!
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload!
    registerUser(username: String!, password: String!): AuthPayload!

    # As mutations abaixo são protegidas por JWT (token no header)
    criarClube(nome: String!, unidades: [String!]): Clube!
    criarDesbravador(nome: String!, idade: Int!, documento: String!, sexo: String!, clubeId: ID!, unidade: String!): Desbravador!
  }
`;
