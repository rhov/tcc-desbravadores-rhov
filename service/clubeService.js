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

function buscarClubesPorNome(parteNome) {
  if (!parteNome) return clubes;
  const termo = parteNome.toLowerCase();
  return clubes.filter(c => c.nome.toLowerCase().includes(termo));
}

module.exports = { criarClube, listarClubes, buscarClubesPorNome };
