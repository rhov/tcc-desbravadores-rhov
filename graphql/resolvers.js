
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
    buscarClube: (parent, { nome, incluirDesbravadores, incluirUnidades }, context) => {
      jwtMiddleware.graphql(context.req);
      if (!nome) throw new Error('O parâmetro "nome" do clube é obrigatório.');
      const clube = clubes.find(c => c.nome.toLowerCase() === nome.toLowerCase());
      if (!clube) throw new Error('Clube não encontrado para o nome informado.');
      const listaDesbravadores = desbravadores
        .filter(d => d.clubeNome.toLowerCase() === clube.nome.toLowerCase())
        .map(d => d.nome);
      return {
        id: clube.id,
        nome: clube.nome,
        unidades: clube.unidades || [],
        desbravadores: listaDesbravadores,
      };
    },
    buscarDesbravador: (parent, { documento, incluirClube, incluirUnidade }, context) => {
      jwtMiddleware.graphql(context.req);
      if (!documento) throw new Error('O parâmetro "documento" do desbravador é obrigatório.');
      const docStr = String(documento).toLowerCase();
      const desbravador = desbravadores.find(d => String(d.documento).toLowerCase() === docStr);
      if (!desbravador) throw new Error('Desbravador não encontrado para o documento informado.');
      return {
        ...desbravador,
        clube: desbravador.clubeNome,
        unidade: desbravador.unidade,
      };
    },
    buscarUnidade: (parent, { clubeNome, unidade, incluirClube, incluirDesbravadores }, context) => {
      jwtMiddleware.graphql(context.req);
      if (!clubeNome) throw new Error('O parâmetro "clubeNome" é obrigatório.');
      const clube = clubes.find(c => c.nome.toLowerCase() === clubeNome.toLowerCase());
      if (!clube) throw new Error('Clube não encontrado');
      if (!unidade) {
        // Retorna todas as unidades do clube
        return (clube.unidades || []).map(u => ({
          nome: u,
          clube: clube.nome,
          desbravadores: desbravadores
            .filter(d => d.clubeNome.toLowerCase() === clube.nome.toLowerCase() && d.unidade.toLowerCase() === u.toLowerCase())
            .map(d => d.nome),
        }));
      } else {
        // Busca unidade específica no clube
        const unidadeValida = clube.unidades.find(u => u.toLowerCase() === unidade.toLowerCase());
        if (!unidadeValida) throw new Error('Unidade não encontrada neste clube');
        return [{
          nome: unidadeValida,
          clube: clube.nome,
          desbravadores: desbravadores
            .filter(d => d.clubeNome.toLowerCase() === clube.nome.toLowerCase() && d.unidade.toLowerCase() === unidadeValida.toLowerCase())
            .map(d => d.nome),
        }];
      }
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
  Desbravador: {
    clube: (parent) => {
      const { clubes } = require('../model/data');
      if (!parent.clubeNome) return null;
      return clubes.find(c => c.nome.toLowerCase() === parent.clubeNome.toLowerCase()) || null;
    },
    unidade: (parent) => parent.unidade,
  },
  Unidade: {
    clube: (parent) => parent.clube || null,
    desbravadores: (parent) => parent.desbravadores || [],
  },
};
