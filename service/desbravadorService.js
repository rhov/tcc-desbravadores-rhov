
const { desbravadores, clubes } = require('../model/data');

function buscarDesbravadoresPorNome(parteNome) {
  if (!parteNome) return desbravadores;
  const termo = parteNome.toLowerCase();
  return desbravadores.filter(d => d.nome.toLowerCase().includes(termo));
}


function criarDesbravador({ nome, idade, documento, clubeNome, unidade }) {
  if (!nome || !idade || documento == null || !clubeNome || !unidade) throw new Error('Todos os campos são obrigatórios');
  if (typeof documento !== 'number' || !Number.isInteger(documento) || documento < 100000) throw new Error('O campo documento deve ser um número inteiro com pelo menos 6 dígitos');
  if (idade < 10 || idade > 15) throw new Error('Idade deve ser entre 10 e 15 anos');
  // Case insensitive para nome do clube
  const clube = clubes.find(c => c.nome.toLowerCase() === clubeNome.toLowerCase());
  if (!clube) throw new Error('Clube não encontrado');
  // Case insensitive para unidade e garantir unicidade
  const unidadeValida = clube.unidades.find(u => u.toLowerCase() === unidade.toLowerCase());
  if (!unidadeValida) throw new Error('Unidade não encontrada neste clube');
  // Documento único no sistema (não pode estar em mais de um clube)
  const documentoExistente = desbravadores.find(d => d.documento === documento);
  if (documentoExistente) throw new Error('Desbravador já cadastrado em outro clube. Um desbravador só pode estar em um clube.');
  // Limite de 10 desbravadores por unidade (case insensitive)
  const count = desbravadores.filter(d => d.clubeNome.toLowerCase() === clube.nome.toLowerCase() && d.unidade.toLowerCase() === unidadeValida.toLowerCase()).length;
  if (count >= 10) throw new Error('Unidade já possui 10 desbravadores');
  const desbravador = { nome, idade, documento, clubeNome: clube.nome, unidade: unidadeValida };
  desbravadores.push(desbravador);
  return desbravador;
}

function listarDesbravadoresPorUnidade(clubeNome, unidade) {
  // Garante existência do clube e unidade (case insensitive)
  const clube = clubes.find(c => c.nome.toLowerCase() === clubeNome.toLowerCase());
  if (!clube) throw new Error('Clube não encontrado');
  const unidadeValida = clube.unidades.find(u => u.toLowerCase() === unidade.toLowerCase());
  if (!unidadeValida) throw new Error('Unidade não encontrada neste clube');
  return desbravadores.filter(d => d.clubeNome.toLowerCase() === clube.nome.toLowerCase() && d.unidade.toLowerCase() === unidadeValida.toLowerCase());
}

module.exports = { criarDesbravador, listarDesbravadoresPorUnidade, buscarDesbravadoresPorNome };
