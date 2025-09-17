const clubeService = require('../service/clubeService');

const criarClube = (req, res) => {
  try {
    const clube = clubeService.criarClube(req.body);
    res.status(201).json(clube);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const listarClubes = (req, res) => {
  res.json(clubeService.listarClubes());
};

module.exports = { criarClube, listarClubes };
