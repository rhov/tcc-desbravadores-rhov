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
  const { nome, incluirDesbravadores, incluirUnidades } = req.query;
  try {
    if (!nome) throw new Error('O parâmetro "nome" do clube é obrigatório.');
    const clube = clubeService.listarClubes().find(c => c.nome.toLowerCase() === nome.toLowerCase());
    if (!clube) return res.status(404).json({ error: 'Clube não encontrado' });
    res.json({
      ...clube,
      desbravadores: incluirDesbravadores === 'true' ? require('../model/data').desbravadores.filter(d => d.clubeNome.toLowerCase() === clube.nome.toLowerCase()) : [],
      unidades: incluirUnidades === 'true' ? clube.unidades : [],
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const buscarUnidade = (req, res) => {
  const { clubeNome, unidade, incluirClube, incluirDesbravadores } = req.query;
  try {
    if (!clubeNome || !unidade) throw new Error('Os parâmetros "clubeNome" e "unidade" são obrigatórios.');
    const clube = clubeService.listarClubes().find(c => c.nome.toLowerCase() === clubeNome.toLowerCase());
    if (!clube) return res.status(404).json({ error: 'Clube não encontrado' });
    const unidadeValida = clube.unidades.find(u => u.toLowerCase() === unidade.toLowerCase());
    if (!unidadeValida) return res.status(404).json({ error: 'Unidade não encontrada neste clube' });
    const desbravadores = require('../model/data').desbravadores;
    res.json({
      nome: unidadeValida,
      clube: incluirClube === 'true' ? clube : null,
      desbravadores: incluirDesbravadores === 'true' ? desbravadores.filter(d => d.clubeNome.toLowerCase() === clube.nome.toLowerCase() && d.unidade.toLowerCase() === unidadeValida.toLowerCase()) : [],
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { criarClube, listarClubes, buscarClube, buscarUnidade };
