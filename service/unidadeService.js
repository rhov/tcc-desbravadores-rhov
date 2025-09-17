const { unidades, clubes, desbravadores } = require('../model/data');

function criarUnidade({ nome, sexo, clubeId }) {
  if (!nome || !sexo || !clubeId) throw new Error('Todos os campos são obrigatórios');
  if (!['M', 'F'].includes(sexo)) throw new Error('Sexo deve ser M ou F');
  const clube = clubes.find(c => c.id === clubeId);
  if (!clube) throw new Error('Clube não encontrado');
  if (unidades.find(u => u.nome.toLowerCase() === nome.toLowerCase() && u.clubeId === clubeId)) {
    throw new Error('Nome da unidade já existe neste clube');
  }
  const unidade = { id: unidades.length + 1, nome, sexo, clubeId };
  unidades.push(unidade);
  return unidade;
}

function listarUnidadesPorClube(clubeId) {
  return unidades.filter(u => u.clubeId === clubeId);
}

function contarDesbravadoresNaUnidade(unidadeId) {
  return desbravadores.filter(d => d.unidadeId === unidadeId).length;
}

module.exports = { criarUnidade, listarUnidadesPorClube, contarDesbravadoresNaUnidade };
