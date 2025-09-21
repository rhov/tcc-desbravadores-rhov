const desbravadorService = require('../service/desbravadorService');

const criarDesbravador = (req, res) => {
  try {
    const desbravador = desbravadorService.criarDesbravador(req.body);
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
    const result = desbravadorService.buscarDesbravadorPorDocumento(documento);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { criarDesbravador, listarDesbravadoresPorUnidade, buscarDesbravador };
