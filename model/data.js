
// Dados em memória
const clubes = [];
const unidades = [];
const desbravadores = [];

// Usuários e transferências (exemplo, pode ser removido depois)
const users = [];
const transfers = [];

/*
Regras de negócio:
- Clube: { id, nome }
- Unidade: { id, nome, sexo, clubeId }
- Desbravador: { id, nome, idade, documento, sexo, unidadeId }
*/

module.exports = {
	clubes,
	unidades,
	desbravadores,
	users,
	transfers,
};
