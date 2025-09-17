const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    username: String!
  }


  type Unidade {
    id: ID!
    nome: String!
    sexo: String!
  }

  type Clube {
    id: ID!
    nome: String!
    unidades: [Unidade!]!
  }

  type Desbravador {
    id: ID!
    nome: String!
    idade: Int!
    documento: String!
    sexo: String!
    clube: Clube!
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

    buscarUnidades(clubeId: ID!, nome: String!): [Unidade!]!

    desbravadores(clubeId: ID!, unidadeId: ID!): [Desbravador!]!
    desbravador(id: ID!): Desbravador
    buscarDesbravadores(nome: String!): [Desbravador!]!
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload!
    registerUser(username: String!, password: String!): AuthPayload!

    # As mutations abaixo são protegidas por JWT (token no header)
    criarClube(nome: String!, unidades: [NovaUnidadeInput!]): Clube!
    criarDesbravador(nome: String!, idade: Int!, documento: String!, sexo: String!, clubeId: ID!, unidadeId: ID!): Desbravador!
  }

  input NovaUnidadeInput {
    nome: String!
    sexo: String!
  }
`;
