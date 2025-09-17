const desbravadorService = require('../service/desbravadorService');

const criarDesbravador = (req, res) => {
  try {
    const { documento, ...rest } = req.body;
    const docNum = Number(documento);
    if (!Number.isInteger(docNum) || docNum < 100000) {
      return res.status(400).json({ error: 'O campo documento deve ser um número inteiro com pelo menos 6 dígitos' });
    }
    const desbravador = desbravadorService.criarDesbravador({ ...rest, documento: docNum });
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
    const docNum = Number(documento);
    if (!Number.isInteger(docNum) || docNum < 100000) {
      return res.status(400).json({ error: 'O campo documento deve ser um número inteiro com pelo menos 6 dígitos' });
    }
    const desbravadores = require('../model/data').desbravadores;
    const clubes = require('../model/data').clubes;
    const desbravador = desbravadores.find(d => d.documento === docNum);
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
