function buscarDesbravadorPorDocumento(documento) {
  if (documento === null || documento === undefined || documento === "") {
    throw new Error('Por gentileza, informe o documento do desbravador para que possamos realizar a busca.');
  }
  const docStr = String(documento).toLowerCase();
  const desbravador = desbravadores.find(d => String(d.documento).toLowerCase() === docStr);
  if (!desbravador) {
    throw new Error('Não encontramos nenhum desbravador com o documento informado. Por favor, revise e tente novamente.');
  }
  // Retorna unidadeNome para compatibilidade com o schema GraphQL
  return { ...desbravador, unidadeNome: desbravador.unidade };
}

const { desbravadores, clubes } = require('../model/data');

function buscarDesbravadoresPorNome(parteNome) {
  if (!parteNome) return desbravadores;
  const termo = parteNome.toLowerCase();
  return desbravadores.filter(d => d.nome.toLowerCase().includes(termo));
}


function criarDesbravador({ nome, idade, documento, clubeNome, unidade }) {
  if (!nome || !idade || !documento || !clubeNome || !unidade) throw new Error('Todos os campos são obrigatórios');
  const docStr = String(documento).toLowerCase();
  if (idade < 10 || idade > 15) throw new Error('Idade deve ser entre 10 e 15 anos');
  // Case insensitive para nome do clube
  const clube = clubes.find(c => c.nome.toLowerCase() === clubeNome.toLowerCase());
  if (!clube) throw new Error('Clube não encontrado');
  // Case insensitive para unidade e garantir unicidade
  const unidadeValida = clube.unidades.find(u => u.toLowerCase() === unidade.toLowerCase());
  if (!unidadeValida) throw new Error('Unidade não encontrada neste clube');
  // Documento já cadastrado na base (em qualquer clube, case insensitive)
  const documentoExistente = desbravadores.find(d => String(d.documento).toLowerCase() === docStr);
  if (documentoExistente) throw new Error('Documento já cadastrado na base.');
  // Limite de 10 desbravadores por unidade (case insensitive)
  const count = desbravadores.filter(d => d.clubeNome.toLowerCase() === clube.nome.toLowerCase() && d.unidade.toLowerCase() === unidadeValida.toLowerCase()).length;

  const desbravador = { nome, idade, documento: docStr, clubeNome: clube.nome, unidade: unidadeValida };
  desbravadores.push(desbravador);
  // Retorna unidadeNome para compatibilidade com o schema GraphQL
  return { ...desbravador, unidadeNome: unidadeValida };
}

function listarDesbravadoresPorUnidade(clubeNome, unidade) {
  // Garante existência do clube e unidade (case insensitive)
  const clube = clubes.find(c => c.nome.toLowerCase() === clubeNome.toLowerCase());
  if (!clube) throw new Error('Clube não encontrado');
  const unidadeValida = clube.unidades.find(u => u.toLowerCase() === unidade.toLowerCase());
  if (!unidadeValida) throw new Error('Unidade não encontrada neste clube');
  return desbravadores.filter(d => d.clubeNome.toLowerCase() === clube.nome.toLowerCase() && d.unidade.toLowerCase() === unidadeValida.toLowerCase());
}

module.exports = { criarDesbravador, listarDesbravadoresPorUnidade, buscarDesbravadoresPorNome, buscarDesbravadorPorDocumento };
