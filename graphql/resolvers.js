
const userService = require('../service/userService');
const transferService = require('../service/transferService');
const jwtMiddleware = require('./middleware/auth');
const clubeService = require('../service/clubeService');
const unidadeService = require('../service/unidadeService');
const desbravadorService = require('../service/desbravadorService');
const { clubes, unidades, desbravadores } = require('../model/data');

module.exports = {
  Query: {
    users: (parent, args, context) => {
      jwtMiddleware.graphql(context.req);
      return userService.getUsersGraphQL();
    },
    transfers: (parent, args, context) => {
      jwtMiddleware.graphql(context.req);
      return transferService.getTransfersGraphQL();
    },
    clubes: (parent, args, context) => {
      jwtMiddleware.graphql(context.req);
      return clubeService.listarClubes();
    },
    clube: (parent, { id }, context) => {
      jwtMiddleware.graphql(context.req);
      return clubes.find(c => c.id == id) || null;
    },
    unidades: (parent, { clubeId }, context) => {
      jwtMiddleware.graphql(context.req);
      return unidadeService.listarUnidadesPorClube(Number(clubeId));
    },
    unidade: (parent, { id }, context) => {
      jwtMiddleware.graphql(context.req);
      return unidades.find(u => u.id == id) || null;
    },
    desbravadores: (parent, { unidadeId }, context) => {
      jwtMiddleware.graphql(context.req);
      return desbravadorService.listarDesbravadoresPorUnidade(Number(unidadeId));
    },
    desbravador: (parent, { id }, context) => {
      jwtMiddleware.graphql(context.req);
      return desbravadores.find(d => d.id == id) || null;
    },
  },
  Mutation: {
    login: (parent, { username, password }) => userService.loginGraphQL(username, password),
    registerUser: (parent, { username, password }) => userService.registerGraphQL(username, password),
    transfer: (parent, { from, to, amount }, context) => {
      jwtMiddleware.graphql(context.req);
      return transferService.transferGraphQL(from, to, amount);
    },
    criarClube: (parent, { nome }, context) => {
      jwtMiddleware.graphql(context.req);
      return clubeService.criarClube({ nome });
    },
    criarUnidade: (parent, { nome, sexo, clubeId }, context) => {
      jwtMiddleware.graphql(context.req);
      return unidadeService.criarUnidade({ nome, sexo, clubeId: Number(clubeId) });
    },
    criarDesbravador: (parent, { nome, idade, documento, sexo, unidadeId }, context) => {
      jwtMiddleware.graphql(context.req);
      return desbravadorService.criarDesbravador({ nome, idade, documento, sexo, unidadeId: Number(unidadeId) });
    },
  },
  Clube: {
    unidades: (parent) => unidades.filter(u => u.clubeId === parent.id),
  },
  Unidade: {
    clube: (parent) => clubes.find(c => c.id === parent.clubeId),
    desbravadores: (parent) => desbravadores.filter(d => d.unidadeId === parent.id),
  },
  Desbravador: {
    unidade: (parent) => unidades.find(u => u.id === parent.unidadeId),
  },
};
