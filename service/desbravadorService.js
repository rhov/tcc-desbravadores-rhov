
const { desbravadores, clubes } = require('../model/data');

function buscarDesbravadoresPorNome(parteNome) {
  if (!parteNome) return desbravadores;
  const termo = parteNome.toLowerCase();
  return desbravadores.filter(d => d.nome.toLowerCase().includes(termo));
}


function criarDesbravador({ nome, idade, documento, sexo, clubeId, unidade }) {
  if (!nome || !idade || !documento || !sexo || !clubeId || !unidade) throw new Error('Todos os campos são obrigatórios');
  if (idade < 10 || idade > 15) throw new Error('Idade deve ser entre 10 e 15 anos');
  if (!['M', 'F'].includes(sexo)) throw new Error('Sexo deve ser M ou F');
  const clube = clubes.find(c => c.id === clubeId);
  if (!clube) throw new Error('Clube não encontrado');
  if (!clube.unidades.includes(unidade)) throw new Error('Unidade não encontrada neste clube');
  // Documento único por clube
  const documentosNoClube = desbravadores.filter(d => d.clubeId === clubeId && d.documento === documento);
  if (documentosNoClube.length > 0) throw new Error('Documento já cadastrado neste clube');
  // Limite de 10 desbravadores por unidade
  const count = desbravadores.filter(d => d.clubeId === clubeId && d.unidade === unidade).length;
  if (count >= 10) throw new Error('Unidade já possui 10 desbravadores');
  const desbravador = { id: desbravadores.length + 1, nome, idade, documento, sexo, clubeId, unidade };
  desbravadores.push(desbravador);
  return desbravador;
}

function listarDesbravadoresPorUnidade(clubeId, unidade) {
  return desbravadores.filter(d => d.clubeId === clubeId && d.unidade === unidade);
}

module.exports = { criarDesbravador, listarDesbravadoresPorUnidade, buscarDesbravadoresPorNome };
