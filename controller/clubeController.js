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

const buscarClube = (req, res) => {
  const { nome } = req.query;
  try {
    const result = clubeService.buscarClubePorNome(nome);
    // Para REST, desbravadores como array de objetos { nome }
    result.desbravadores = (result.desbravadores || []).map(n => ({ nome: n }));
    res.json(result);
  } catch (err) {
    if (err.message.includes('não encontramos') || err.message.toLowerCase().includes('inexistente')) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

const buscarUnidade = (req, res) => {
  const { clubeNome, unidade } = req.query;
  try {
    const result = clubeService.buscarUnidade(clubeNome, unidade);
    res.json(result);
  } catch (err) {
    if (err.message.toLowerCase().includes('inexistente')) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

module.exports = { criarClube, listarClubes, buscarClube, buscarUnidade };
