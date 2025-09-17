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
