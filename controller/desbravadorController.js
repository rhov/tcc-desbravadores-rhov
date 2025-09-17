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
  const unidadeId = parseInt(req.params.unidadeId, 10);
  res.json(desbravadorService.listarDesbravadoresPorUnidade(unidadeId));
};

module.exports = { criarDesbravador, listarDesbravadoresPorUnidade };
