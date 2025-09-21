const clubeService = require('../service/clubeService');

const criarClube = (req, res) => {
  try {
    const clube = clubeService.criarClube(req.body);
    // Retorna apenas id, nome e unidades
    res.status(201).json({
      id: clube.id,
      nome: clube.nome,
      unidades: clube.unidades || [],
    });
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
    const result = clubeService.buscarClubePorNomeGraphQL(nome);
    // Para REST, desbravadores como array de objetos { nome }
    result.desbravadores = (result.desbravadores || []).map(n => ({ nome: n }));
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const buscarUnidade = (req, res) => {
  const { clubeNome, unidade } = req.query;
  try {
    const result = clubeService.buscarUnidadeGraphQL(clubeNome, unidade);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { criarClube, listarClubes, buscarClube, buscarUnidade };
