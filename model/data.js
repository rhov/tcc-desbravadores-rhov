
// Dados em memória
// Clube: { id, nome, unidades: [String] }
// Desbravador: { nome, idade, documento, clubeNome, unidade }
const clubes = [
  {
    id: 1,
    nome: "Sacerdotes",
    unidades: [
      "Melquisedeque",
      "Pedra de Onix",
      "Candelabro de Ouro",
      "Shekinah"
    ]
  }
];

const desbravadores = [
  // Melquisedeque (masculina)
  { nome: "Nycollas", idade: 13, documento: "001", clubeNome: "Sacerdotes", unidade: "Melquisedeque" },
  { nome: "Gabriel", idade: 14, documento: "002", clubeNome: "Sacerdotes", unidade: "Melquisedeque" },
  { nome: "Dyllan", idade: 12, documento: "003", clubeNome: "Sacerdotes", unidade: "Melquisedeque" },
  { nome: "Denilson", idade: 15, documento: "004", clubeNome: "Sacerdotes", unidade: "Melquisedeque" },
  // Pedra de Onix (masculina)
  { nome: "Moisés", idade: 13, documento: "005", clubeNome: "Sacerdotes", unidade: "Pedra de Onix" },
  { nome: "Lucas", idade: 14, documento: "006", clubeNome: "Sacerdotes", unidade: "Pedra de Onix" },
  { nome: "Pedro", idade: 12, documento: "007", clubeNome: "Sacerdotes", unidade: "Pedra de Onix" },
  { nome: "Samuel", idade: 15, documento: "008", clubeNome: "Sacerdotes", unidade: "Pedra de Onix" },
  // Candelabro de Ouro (feminina)
  { nome: "Victoria", idade: 13, documento: "009", clubeNome: "Sacerdotes", unidade: "Candelabro de Ouro" },
  { nome: "Bia", idade: 14, documento: "010", clubeNome: "Sacerdotes", unidade: "Candelabro de Ouro" },
  { nome: "Ana", idade: 12, documento: "011", clubeNome: "Sacerdotes", unidade: "Candelabro de Ouro" },
  { nome: "Larissa", idade: 15, documento: "012", clubeNome: "Sacerdotes", unidade: "Candelabro de Ouro" },
  // Shekinah (feminina)
  { nome: "Carine", idade: 13, documento: "013", clubeNome: "Sacerdotes", unidade: "Shekinah" },
  { nome: "Juliana", idade: 14, documento: "014", clubeNome: "Sacerdotes", unidade: "Shekinah" },
  { nome: "Beatriz", idade: 12, documento: "015", clubeNome: "Sacerdotes", unidade: "Shekinah" },
  { nome: "Marina", idade: 15, documento: "016", clubeNome: "Sacerdotes", unidade: "Shekinah" }
];
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
