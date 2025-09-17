const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    username: String!
  }

  type Clube {
    id: ID!
    nome: String!
    unidades: [Unidade!]!
  }

  type Unidade {
    id: ID!
    nome: String!
    sexo: String!
    clube: Clube!
    desbravadores: [Desbravador!]!
  }

  type Desbravador {
    id: ID!
    nome: String!
    idade: Int!
    documento: String!
    sexo: String!
    unidade: Unidade!
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

    unidades(clubeId: ID!): [Unidade!]!
    unidade(id: ID!): Unidade
    buscarUnidades(nome: String!): [Unidade!]!

    desbravadores(unidadeId: ID!): [Desbravador!]!
    desbravador(id: ID!): Desbravador
    buscarDesbravadores(nome: String!): [Desbravador!]!
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload!
    registerUser(username: String!, password: String!): AuthPayload!

    # As mutations abaixo são protegidas por JWT (token no header)
    criarClube(nome: String!): Clube!
    criarUnidade(nome: String!, sexo: String!, clubeId: ID!): Unidade!
    criarDesbravador(nome: String!, idade: Int!, documento: String!, sexo: String!, unidadeId: ID!): Desbravador!
  }
`;
