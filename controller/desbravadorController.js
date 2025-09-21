const desbravadorService = require('../service/desbravadorService');

const criarDesbravador = (req, res) => {
  try {
    const { documento, ...rest } = req.body;
    if (documento === undefined || documento === null || documento === '') throw new Error('Por favor, informe o documento do desbravador para realizar o cadastro.');
    const docStr = String(documento).toLowerCase();
    const desbravador = desbravadorService.criarDesbravador({ ...rest, documento: docStr });
    res.status(201).json(desbravador);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const listarDesbravadoresPorUnidade = (req, res) => {
  const { clubeNome, unidade } = req.query;
  try {
    const lista = desbravadorService.listarDesbravadoresPorUnidade(clubeNome, unidade);
    res.json(lista);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const buscarDesbravador = (req, res) => {
  const { documento } = req.query;
  try {
    if (documento === undefined || documento === null || documento === '') throw new Error('Por favor, informe o documento do desbravador para realizar a busca.');
    const docStr = String(documento).toLowerCase();
    const desbravadores = require('../model/data').desbravadores;
    const desbravador = desbravadores.find(d => String(d.documento).toLowerCase() === docStr);
    if (!desbravador) return res.status(404).json({ error: 'Nenhum desbravador foi encontrado com o documento informado.' });
    res.json({
      nome: desbravador.nome,
      idade: desbravador.idade,
      documento: desbravador.documento,
      clubeNome: desbravador.clubeNome,
      unidadeNome: desbravador.unidade,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { criarDesbravador, listarDesbravadoresPorUnidade, buscarDesbravador };
