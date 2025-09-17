const unidadeService = require('../service/unidadeService');

const criarUnidade = (req, res) => {
  try {
    const unidade = unidadeService.criarUnidade(req.body);
    res.status(201).json(unidade);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const listarUnidadesPorClube = (req, res) => {
  const clubeId = parseInt(req.params.clubeId, 10);
  res.json(unidadeService.listarUnidadesPorClube(clubeId));
};

module.exports = { criarUnidade, listarUnidadesPorClube };
