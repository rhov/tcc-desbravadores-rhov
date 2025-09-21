const { clubes } = require('../model/data');


function criarClube({ nome, unidades }) {
  if (!nome) throw new Error('Nome do clube é obrigatório');
  if (clubes.find(c => c.nome.toLowerCase() === nome.toLowerCase())) {
    throw new Error('Nome do clube já existe');
  }
  // Unidades é opcional, mas se vier, valida duplicidade de nome (case insensitive)
  let unidadesValidadas = [];
  if (unidades && Array.isArray(unidades)) {
    const nomesOriginais = unidades.map(u => (typeof u === 'string' ? u : u.nome));
    const nomesLower = nomesOriginais.map(n => n.toLowerCase());
    const nomesDuplicados = nomesLower.filter((n, i) => nomesLower.indexOf(n) !== i);
    if (nomesDuplicados.length > 0) {
      throw new Error('Não pode haver duas unidades com o mesmo nome no mesmo clube');
    }
    unidadesValidadas = nomesOriginais;
  }
  const clube = { id: clubes.length + 1, nome, unidades: unidadesValidadas };
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

function buscarUnidadesPorNome(clubeId, parteNome) {
  const clube = clubes.find(c => c.id === clubeId);
  if (!clube) throw new Error('Clube não encontrado');
  if (!parteNome) return clube.unidades;
  const termo = parteNome.toLowerCase();
  return clube.unidades.filter(nome => nome.toLowerCase().includes(termo));
}

module.exports = { criarClube, listarClubes, buscarClubesPorNome, buscarUnidadesPorNome };
// Busca clube por nome (única função para REST e GraphQL)
function buscarClubePorNome(nome) {
  if (!nome) throw new Error('Por gentileza, informe o nome do clube para que possamos realizar a busca.');
  const clube = clubes.find(c => c.nome.toLowerCase() === nome.toLowerCase());
  if (!clube) throw new Error('Não encontramos nenhum clube com o nome informado. Por favor, revise e tente novamente.');
  const { desbravadores } = require('../model/data');
  const listaDesbravadores = desbravadores
    .filter(d => d.clubeNome.toLowerCase() === clube.nome.toLowerCase())
    .map(d => d.nome);
  return {
    id: clube.id,
    nome: clube.nome,
    unidades: clube.unidades || [],
    desbravadores: listaDesbravadores,
  };
}

// Busca unidade (única função para REST e GraphQL)
function buscarUnidade(clubeNome, unidade) {
  if (!clubeNome) throw new Error('Por gentileza, informe o nome do clube para que possamos buscar as unidades.');
  const clube = clubes.find(c => c.nome.toLowerCase() === clubeNome.toLowerCase());
  if (!clube) throw new Error('Não encontramos nenhum clube com o nome informado. Por favor, revise e tente novamente.');
  const { desbravadores } = require('../model/data');
  if (!unidade) {
    return (clube.unidades || []).map(u => ({
      nome: u,
      clube: clube.nome,
      desbravadores: desbravadores
        .filter(d => d.clubeNome.toLowerCase() === clube.nome.toLowerCase() && d.unidade.toLowerCase() === u.toLowerCase())
        .map(d => d.nome),
    }));
  } else {
    const unidadeValida = clube.unidades.find(u => u.toLowerCase() === unidade.toLowerCase());
    if (!unidadeValida) throw new Error('Não encontramos nenhuma unidade com o nome informado neste clube. Por favor, revise e tente novamente.');
    return [{
      nome: unidadeValida,
      clube: clube.nome,
      desbravadores: desbravadores
        .filter(d => d.clubeNome.toLowerCase() === clube.nome.toLowerCase() && d.unidade.toLowerCase() === unidadeValida.toLowerCase())
        .map(d => d.nome),
    }];
  }
}

module.exports = { criarClube, listarClubes, buscarClubesPorNome, buscarUnidadesPorNome, buscarClubePorNome, buscarUnidade };
