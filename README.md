# Author: Rodrigo Henrique
# Disciplina: 07 - Automação de Testes na Camada de Serviço (API)
# Professor: Julio de Lima
# TCC: Testes automatizados com API criada com IA generativa
# Tema da API: Clube de Desbravadores

# API Clubes de Desbravadores

API REST e GraphQL para gerenciamento de clubes de desbravadores, com autenticação JWT, documentação Swagger e estrutura modular pronta para testes automatizados.

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. O arquivo `.env` já está incluso:
   ```env
   BASE_URL_GRAPHQL=http://localhost:3000/graphql
   BASE_URL_REST=http://localhost:3000
   JWT_SECRET=supersecret
   ```
3. Inicie em modo desenvolvimento:
   ```bash
   npm run dev
   ```

## Principais tecnologias e pacotes utilizados

- express
- apollo-server-express
- bcryptjs
- jsonwebtoken
- dotenv
- swagger-jsdoc
- swagger-ui-express
- mocha, chai, mochawesome, supertest, sinon (testes)

## Boas práticas e padrões implementados

- APIs REST e GraphQL padronizadas: regras de negócio centralizadas em services únicos, sem duplicidade de lógica.
- Mensagens de erro padronizadas e retornadas diretamente nos testes (sem dependência de arquivos de fixture para erros).
- Cadastro de usuário: retorna apenas `id` e `username` (sem token, sem objeto aninhado).
- Login: retorna apenas `token` e `username`.
- Username case-insensitive: login e cadastro aceitam maiúsculas/minúsculas.
- Criar clube: retorna apenas `id`, `nome` e `unidades` (lista de nomes).
- Autenticação JWT obrigatória para rotas protegidas.
- Swagger disponível em `/api-docs`.
- Testes automatizados prontos para Mocha, Chai, Supertest, Sinon.
- Dados em memória (perdidos ao reiniciar).

## Exemplo de uso REST

```bash
# Registro (retorno: id, username)
curl -X POST http://localhost:3000/register -H 'Content-Type: application/json' -d '{"username":"admin","password":"123456"}'

# Login (retorno: token, username)
curl -X POST http://localhost:3000/login -H 'Content-Type: application/json' -d '{"username":"admin","password":"123456"}'

# Criar clube (retorno: id, nome, unidades)
curl -X POST http://localhost:3000/clubes -H 'Authorization: Bearer <token>' -H 'Content-Type: application/json' -d '{"nome":"Clube Alpha","unidades":["Unidade 1"]}'

# Criar desbravador
curl -X POST http://localhost:3000/desbravadores -H 'Authorization: Bearer <token>' -H 'Content-Type: application/json' -d '{"nome":"João","idade":12,"documento":123456,"clubeNome":"Clube Alpha","unidade":"Unidade 1"}'
```

- Um clube pode ter várias unidades

## Exemplo de uso GraphQL

> **Atenção:** Apenas as mutations `login` e `registerUser` recebem username e password. Todas as demais mutations e queries protegidas exigem o token JWT no header:
> 
> `Authorization: Bearer <token>`

```graphql
# Registro (retorno: id, username)
mutation {
  registerUser(username: "admin", password: "123456") {
    id
    username
  }
}

# Login (retorno: token, username)
mutation {
  login(username: "admin", password: "123456") {
    token
    username
  }
}

# Criar clube (retorno: id, nome, unidades)
mutation {
  criarClube(nome: "Clube Alpha") {
    id
    nome
    unidades
  }
}

# Criar desbravador
mutation {
  criarDesbravador(nome: "João", idade: 12, documento: 123456, clubeNome: "Clube Alpha", unidade: "Unidade 1") {
    nome
    idade
    documento
    clubeNome
    unidadeNome
  }
}

# Listar clubes
query {
  clubes {
    id
    nome
    unidades
  }
}
```

## Autenticação
- JWT obrigatório para todas as rotas protegidas (REST e GraphQL)
- Envie o token no header: `Authorization: Bearer <token>`

## Endpoints REST principais

### Auth
- `POST /register` — registra usuário
- `POST /login` — login

### Clubes
- `POST /clubes` — cria clube
- `GET /clubes` — lista clubes

### Desbravadores
- `POST /desbravadores` — cria desbravador
- `GET /desbravadores` — lista desbravadores (pode filtrar por clube e unidade)

## Testes
- Pronto para Mocha, Chai, Supertest
- Mensagens de erro esperadas são validadas diretamente no teste, sem dependência de arquivos de fixture para erros.

## Observações
- Dados são armazenados em memória (perdidos ao reiniciar)
- Estrutura modular e pronta para testes
- Documentação Swagger disponível em `/api-docs`
