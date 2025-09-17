
const userService = require('../service/userService');
// const transferService = require('../service/transferService');
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

    clubes: (parent, args, context) => {
      jwtMiddleware.graphql(context.req);
      return clubeService.listarClubes();
    },
    clube: (parent, { id }, context) => {
      jwtMiddleware.graphql(context.req);
      if (id == null) throw new Error('O parâmetro "id" do clube é obrigatório.');
      const clube = clubes.find(c => c.id == id);
      if (!clube) throw new Error('Clube não encontrado para o id informado.');
      return clube;
    },
    unidades: (parent, { clubeId }, context) => {
      jwtMiddleware.graphql(context.req);
      if (clubeId == null) throw new Error('O parâmetro "clubeId" é obrigatório para listar unidades.');
      return unidadeService.listarUnidadesPorClube(Number(clubeId));
    },
    unidade: (parent, { id }, context) => {
      jwtMiddleware.graphql(context.req);
      if (id == null) throw new Error('O parâmetro "id" da unidade é obrigatório.');
      const unidade = unidades.find(u => u.id == id);
      if (!unidade) throw new Error('Unidade não encontrada para o id informado.');
      return unidade;
    },
    desbravadores: (parent, { unidadeId }, context) => {
      jwtMiddleware.graphql(context.req);
      if (unidadeId == null) throw new Error('O parâmetro "unidadeId" é obrigatório para listar desbravadores.');
      return desbravadorService.listarDesbravadoresPorUnidade(Number(unidadeId));
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
