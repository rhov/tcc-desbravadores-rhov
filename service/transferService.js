const { transfers } = require('../model/data');

function transfer(req, res) {
  const { from, to, amount } = req.body;
  if (!from || !to || typeof amount !== 'number') return res.status(400).json({ error: 'Dados obrigatórios' });
  const transfer = { id: transfers.length + 1, from, to, amount };
  transfers.push(transfer);
  res.status(201).json(transfer);
}

function getTransfers(req, res) {
  res.json(transfers);
}

// Métodos GraphQL
function transferGraphQL(from, to, amount) {
  if (!from || !to || typeof amount !== 'number') throw new Error('Dados obrigatórios');
  const transfer = { id: transfers.length + 1, from, to, amount };
  transfers.push(transfer);
  return transfer;
}

function getTransfersGraphQL() {
  return transfers;
}

module.exports = { transfer, getTransfers, transferGraphQL, getTransfersGraphQL };
