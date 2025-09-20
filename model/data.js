
// Dados em memória
// Clube: { id, nome, unidades: [String] }
// Desbravador: { nome, idade, documento, clubeNome, unidade }
const clubes = [];
const desbravadores = [];
const bcrypt = require('bcryptjs');
const users = [{
  id: 1,
  username: "rodrigo",
  password: bcrypt.hashSync("123", 8) // senha: 123
}];

module.exports = {
  clubes,
  desbravadores,
  users,
};
