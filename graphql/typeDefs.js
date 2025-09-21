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
    desbravadores: [String!]!
  }

  type Desbravador {
    nome: String!
    idade: Int!
    documento: String!
    clubeNome: String!
    unidadeNome: String!
  }
  type Unidade {
    nome: String!
    clube: String!
    desbravadores: [String!]!
  }



  type AuthPayload {
    token: String!
    user: User!
  }

  type RegisterPayload {
    id: ID!
    username: String!
  }

  type Query {
    users: [User!]!
  buscarClube(nome: String!): Clube
  buscarDesbravador(documento: String!): Desbravador
  buscarUnidade(clubeNome: String, unidade: String): [Unidade!]!
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload!
    registerUser(username: String!, password: String!): RegisterPayload!

    # As mutations abaixo são protegidas por JWT (token no header)
    criarClube(nome: String!, unidades: [String!]): Clube!
  criarDesbravador(nome: String!, idade: Int!, documento: String!, clubeNome: String!, unidade: String!): Desbravador!
  }
`;
