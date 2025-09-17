const { clubes } = require('../model/data');

function criarClube({ nome }) {
  if (!nome) throw new Error('Nome do clube é obrigatório');
  if (clubes.find(c => c.nome.toLowerCase() === nome.toLowerCase())) {
    throw new Error('Nome do clube já existe');
  }
  const clube = { id: clubes.length + 1, nome };
  clubes.push(clube);
  return clube;
}

function listarClubes() {
  return clubes;
}

module.exports = { criarClube, listarClubes };
