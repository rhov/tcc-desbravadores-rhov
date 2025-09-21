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
    if (nome === undefined || nome === null || nome === '') throw new Error('Por favor, informe o nome do clube para realizar a busca.');
    const clube = clubeService.listarClubes().find(c => c.nome.toLowerCase() === nome.toLowerCase());
    if (!clube) return res.status(404).json({ error: 'Nenhum clube foi encontrado com o nome informado.' });
    const listaDesbravadores = require('../model/data').desbravadores
      .filter(d => d.clubeNome.toLowerCase() === clube.nome.toLowerCase())
      .map(d => ({ nome: d.nome }));
    res.json({
      id: clube.id,
      nome: clube.nome,
      unidades: clube.unidades || [],
      desbravadores: listaDesbravadores,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const buscarUnidade = (req, res) => {
  const { clubeNome, unidade } = req.query;
  try {
    if (clubeNome === undefined || clubeNome === null || clubeNome === '') throw new Error('Por favor, informe o nome do clube para buscar as unidades.');
    const clube = clubeService.listarClubes().find(c => c.nome.toLowerCase() === clubeNome.toLowerCase());
    if (!clube) return res.status(404).json({ error: 'Nenhum clube foi encontrado com o nome informado.' });
    const desbravadores = require('../model/data').desbravadores;
    if (!unidade) {
      // Retorna todas as unidades do clube
      const unidades = (clube.unidades || []).map(u => ({
        nome: u,
        clube: clube.nome,
        desbravadores: desbravadores
          .filter(d => d.clubeNome.toLowerCase() === clube.nome.toLowerCase() && d.unidade.toLowerCase() === u.toLowerCase())
          .map(d => d.nome),
      }));
      return res.json(unidades);
    } else {
      // Busca unidade específica no clube
      const unidadeValida = clube.unidades.find(u => u.toLowerCase() === unidade.toLowerCase());
      if (!unidadeValida) return res.status(404).json({ error: 'Nenhuma unidade foi encontrada com o nome informado neste clube.' });
      const listaDesbravadores = desbravadores
        .filter(d => d.clubeNome.toLowerCase() === clube.nome.toLowerCase() && d.unidade.toLowerCase() === unidadeValida.toLowerCase())
        .map(d => d.nome);
      return res.json([{
        nome: unidadeValida,
        clube: clube.nome,
        desbravadores: listaDesbravadores,
      }]);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { criarClube, listarClubes, buscarClube, buscarUnidade };
