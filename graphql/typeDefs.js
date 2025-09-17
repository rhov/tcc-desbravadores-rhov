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
    desbravadores: [Desbravador!]!
  }

  type Desbravador {
    nome: String!
    idade: Int!
    documento: String!
    clube: Clube
    unidade: String!
  }
  type Unidade {
    nome: String!
    clube: Clube
    desbravadores: [Desbravador!]!
  }



  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!
    buscarClube(nome: String!, incluirDesbravadores: Boolean, incluirUnidades: Boolean): Clube
    buscarDesbravador(documento: String!, incluirClube: Boolean, incluirUnidade: Boolean): Desbravador
    buscarUnidade(clubeNome: String!, unidade: String!, incluirClube: Boolean, incluirDesbravadores: Boolean): Unidade
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload!
    registerUser(username: String!, password: String!): AuthPayload!

    # As mutations abaixo são protegidas por JWT (token no header)
    criarClube(nome: String!, unidades: [String!]): Clube!
    criarDesbravador(nome: String!, idade: Int!, documento: String!, sexo: String!, clubeId: ID!, unidade: String!): Desbravador!
  }
`;
