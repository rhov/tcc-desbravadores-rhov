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
  const { documento, incluirClube, incluirUnidade } = req.query;
  try {
    if (!documento) throw new Error('O parâmetro "documento" do desbravador é obrigatório.');
    const desbravadores = require('../model/data').desbravadores;
    const clubes = require('../model/data').clubes;
    const desbravador = desbravadores.find(d => d.documento.toLowerCase() === documento.toLowerCase());
    if (!desbravador) return res.status(404).json({ error: 'Desbravador não encontrado' });
    res.json({
      ...desbravador,
      clube: incluirClube === 'true' ? clubes.find(c => c.nome.toLowerCase() === desbravador.clubeNome.toLowerCase()) : null,
      unidade: incluirUnidade === 'true' ? desbravador.unidade : desbravador.unidade,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { criarDesbravador, listarDesbravadoresPorUnidade, buscarDesbravador };
