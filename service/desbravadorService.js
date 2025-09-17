function buscarDesbravadoresPorNome(parteNome) {
  if (!parteNome) return desbravadores;
  const termo = parteNome.toLowerCase();
  return desbravadores.filter(d => d.nome.toLowerCase().includes(termo));
}
const { desbravadores, unidades, clubes } = require('../model/data');

function criarDesbravador({ nome, idade, documento, sexo, unidadeId }) {
  if (!nome || !idade || !documento || !sexo || !unidadeId) throw new Error('Todos os campos são obrigatórios');
  if (idade < 10 || idade > 15) throw new Error('Idade deve ser entre 10 e 15 anos');
  if (!['M', 'F'].includes(sexo)) throw new Error('Sexo deve ser M ou F');
  const unidade = unidades.find(u => u.id === unidadeId);
  if (!unidade) throw new Error('Unidade não encontrada');
  if (sexo !== unidade.sexo) throw new Error('Sexo do desbravador deve coincidir com o da unidade');
  // Documento único por clube
  const clubeId = unidade.clubeId;
  const documentosNoClube = desbravadores.filter(d => {
    const u = unidades.find(un => un.id === d.unidadeId);
    return u && u.clubeId === clubeId && d.documento === documento;
  });
  if (documentosNoClube.length > 0) throw new Error('Documento já cadastrado neste clube');
  // Limite de 10 desbravadores por unidade
  const count = desbravadores.filter(d => d.unidadeId === unidadeId).length;
  if (count >= 10) throw new Error('Unidade já possui 10 desbravadores');
  const desbravador = { id: desbravadores.length + 1, nome, idade, documento, sexo, unidadeId };
  desbravadores.push(desbravador);
  return desbravador;
}

function listarDesbravadoresPorUnidade(unidadeId) {
  return desbravadores.filter(d => d.unidadeId === unidadeId);
}

module.exports = { criarDesbravador, listarDesbravadoresPorUnidade, buscarDesbravadoresPorNome };
