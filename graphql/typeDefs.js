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

  type Transfer {
    id: ID!
    from: String!
    to: String!
    amount: Float!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!
    transfers: [Transfer!]!
    clubes: [Clube!]!
    clube(id: ID!): Clube
    unidades(clubeId: ID!): [Unidade!]!
    unidade(id: ID!): Unidade
    desbravadores(unidadeId: ID!): [Desbravador!]!
    desbravador(id: ID!): Desbravador
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload!
    registerUser(username: String!, password: String!): AuthPayload!
    transfer(from: String!, to: String!, amount: Float!): Transfer!

    criarClube(nome: String!): Clube!
    criarUnidade(nome: String!, sexo: String!, clubeId: ID!): Unidade!
    criarDesbravador(nome: String!, idade: Int!, documento: String!, sexo: String!, unidadeId: ID!): Desbravador!
  }
`;
