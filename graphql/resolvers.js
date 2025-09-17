
const userService = require('../service/userService');
// const transferService = require('../service/transferService');
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

    clubes: (parent, args, context) => {
      jwtMiddleware.graphql(context.req);
      return clubeService.listarClubes();
    },
    buscarClubes: (parent, { nome }, context) => {
      jwtMiddleware.graphql(context.req);
      if (!nome) throw new Error('O parâmetro "nome" é obrigatório para busca de clubes.');
      return clubeService.buscarClubesPorNome(nome);
    },
    clube: (parent, { id }, context) => {
      jwtMiddleware.graphql(context.req);
      if (id == null) throw new Error('O parâmetro "id" do clube é obrigatório.');
      const clube = clubes.find(c => c.id == id);
      if (!clube) throw new Error('Clube não encontrado para o id informado.');
      return clube;
    },
    buscarUnidades: (parent, { clubeId, nome }, context) => {
      jwtMiddleware.graphql(context.req);
      if (!clubeId || !nome) throw new Error('Os parâmetros "clubeId" e "nome" são obrigatórios para busca de unidades.');
      return clubeService.buscarUnidadesPorNome(Number(clubeId), nome);
    },
    desbravadores: (parent, { clubeId, unidade }, context) => {
      jwtMiddleware.graphql(context.req);
      if (!clubeId || !unidade) throw new Error('Os parâmetros "clubeId" e "unidade" são obrigatórios para listar desbravadores.');
      return desbravadorService.listarDesbravadoresPorUnidade(Number(clubeId), unidade);
    },
    buscarDesbravadores: (parent, { nome }, context) => {
      jwtMiddleware.graphql(context.req);
      if (!nome) throw new Error('O parâmetro "nome" é obrigatório para busca de desbravadores.');
      return desbravadorService.buscarDesbravadoresPorNome(nome);
    },
    desbravador: (parent, { id }, context) => {
      jwtMiddleware.graphql(context.req);
      if (id == null) throw new Error('O parâmetro "id" do desbravador é obrigatório.');
      const desbravador = desbravadores.find(d => d.id == id);
      if (!desbravador) throw new Error('Desbravador não encontrado para o id informado.');
      return desbravador;
    },
  },
  Mutation: {
    login: (parent, { username, password }) => userService.loginGraphQL(username, password),
    registerUser: (parent, { username, password }) => userService.registerGraphQL(username, password),

    criarClube: (parent, { nome, unidades }, context) => {
      jwtMiddleware.graphql(context.req);
      return clubeService.criarClube({ nome, unidades });
    },
    criarDesbravador: (parent, { nome, idade, documento, sexo, clubeId, unidade }, context) => {
      jwtMiddleware.graphql(context.req);
      return desbravadorService.criarDesbravador({ nome, idade, documento, sexo, clubeId: Number(clubeId), unidade });
    },
  },
  Clube: {
    unidades: (parent) => parent.unidades || [],
  },
  Desbravador: {
    clube: (parent) => clubes.find(c => c.id === parent.clubeId),
    unidade: (parent) => parent.unidade,
  },
};
