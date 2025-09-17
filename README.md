
# API Clubes de Desbravadores

API REST e GraphQL para gerenciamento de clubes de desbravadores, com autenticação JWT, documentação Swagger e estrutura modular pronta para testes automatizados.

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. O arquivo `.env` já está incluso:
   ```env
   BASE_URL_GRAPHQL=http://localhost:4000/graphql
   BASE_URL_REST=http://localhost:3000
   JWT_SECRET=supersecret
   ```
3. Inicie em modo desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse:
   - REST: http://localhost:3000
   - Swagger: http://localhost:3000/api-docs
   - GraphQL: http://localhost:3000/graphql

## Estrutura
- `controller/`: Endpoints REST
- `service/`: Regras de negócio
- `model/`: Dados em memória
- `graphql/`: API GraphQL (typeDefs, resolvers, middleware)
- `app.js`: Configuração dos apps
- `server.js`: Inicialização dos servidores

## Entidades e regras de negócio

### Clube
- `id`, `nome` (único)
- Um clube pode ter várias unidades

### Unidade
- `id`, `nome` (único por clube), `sexo` (`M` ou `F`), `clubeId`
- Máximo 10 desbravadores por unidade

### Desbravador
- `id`, `nome`, `idade` (10-15), `documento` (único por clube), `sexo` (igual ao da unidade), `unidadeId`

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

### Unidades
- `POST /unidades` — cria unidade
- `GET /unidades/:clubeId` — lista unidades do clube

### Desbravadores
- `POST /desbravadores` — cria desbravador
- `GET /desbravadores/:unidadeId` — lista desbravadores da unidade

## Exemplo de uso REST

```bash
# Registro e login
curl -X POST http://localhost:3000/register -H 'Content-Type: application/json' -d '{"username":"admin","password":"123456"}'
curl -X POST http://localhost:3000/login -H 'Content-Type: application/json' -d '{"username":"admin","password":"123456"}'

# Criar clube
curl -X POST http://localhost:3000/clubes -H 'Authorization: Bearer <token>' -H 'Content-Type: application/json' -d '{"nome":"Clube Alpha"}'

# Criar unidade
curl -X POST http://localhost:3000/unidades -H 'Authorization: Bearer <token>' -H 'Content-Type: application/json' -d '{"nome":"Unidade 1","sexo":"M","clubeId":1}'

# Criar desbravador
curl -X POST http://localhost:3000/desbravadores -H 'Authorization: Bearer <token>' -H 'Content-Type: application/json' -d '{"nome":"João","idade":12,"documento":"123456789","sexo":"M","unidadeId":1}'
```


## Exemplo de uso GraphQL

> **Atenção:** Apenas as mutations `login` e `registerUser` recebem username e password. Todas as demais mutations e queries protegidas exigem o token JWT no header:
> 
> `Authorization: Bearer <token>`

```graphql
# Login (gera token)
mutation {
  login(username: "admin", password: "123456") {
    token
    user { id username }
  }
}

# As mutations abaixo exigem JWT no header
mutation {
  criarClube(nome: "Clube Alpha") { id nome }
}

mutation {
  criarUnidade(nome: "Unidade 1", sexo: "M", clubeId: 1) { id nome sexo }
}

mutation {
  criarDesbravador(nome: "João", idade: 12, documento: "123456789", sexo: "M", unidadeId: 1) { id nome idade }
}

query {
  clubes { id nome unidades { id nome } }
}
```

## Testes
- Pronto para Mocha, Chai, Supertest, Sinon (implemente depois)

## Observações
- Dados são armazenados em memória (perdidos ao reiniciar)
- Estrutura modular e pronta para testes
- Documentação Swagger disponível em `/api-docs`
