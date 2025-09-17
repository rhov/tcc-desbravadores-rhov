
// Dados em memória
const clubes = [];
const unidades = [];
const desbravadores = [];


// Usuários (exemplo)
const users = [];

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
};
