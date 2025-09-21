
const userService = require('../service/userService');

const jwtMiddleware = require('./middleware/auth');
const clubeService = require('../service/clubeService');
const desbravadorService = require('../service/desbravadorService');
const { clubes, desbravadores } = require('../model/data');

module.exports = {
  Query: {
    users: (parent, args, context) => {
      jwtMiddleware.graphql(context.req);
      return userService.getUsersGraphQL();
    },
    buscarClube: (parent, { nome }, context) => {
      jwtMiddleware.graphql(context.req);
      return clubeService.buscarClubePorNomeGraphQL(nome);
    },
    buscarDesbravador: (parent, { documento }, context) => {
      jwtMiddleware.graphql(context.req);
      return desbravadorService.buscarDesbravadorPorDocumentoGraphQL(documento);
    },
    buscarUnidade: (parent, { clubeNome, unidade }, context) => {
      jwtMiddleware.graphql(context.req);
      return clubeService.buscarUnidadeGraphQL(clubeNome, unidade);
    },
  },
  Mutation: {
    login: (parent, { username, password }) => userService.loginGraphQL(username, password),
    registerUser: (parent, { username, password }) => userService.registerGraphQL(username, password),

    criarClube: (parent, { nome, unidades }, context) => {
      jwtMiddleware.graphql(context.req);
      const clube = clubeService.criarClube({ nome, unidades });
      // Retorna apenas id, nome e unidades
      return {
        id: clube.id,
        nome: clube.nome,
        unidades: clube.unidades || [],
      };
    },
    criarDesbravador: (parent, { nome, idade, documento, clubeNome, unidade }, context) => {
      jwtMiddleware.graphql(context.req);
      return desbravadorService.criarDesbravador({ nome, idade, documento, clubeNome, unidade });
    },
  },
  Clube: {
    unidades: (parent) => parent.unidades || [],
    desbravadores: (parent) => parent.desbravadores || [],
  },
  // Desbravador não precisa de resolver customizado para clube: retorna apenas string
  Unidade: {
    clube: (parent) => parent.clube || null,
    desbravadores: (parent) => parent.desbravadores || [],
  },
};
