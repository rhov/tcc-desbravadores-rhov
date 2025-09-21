
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
  ## Principais tecnologias e pacotes utilizados

  - express
  - apollo-server-express
  - bcryptjs
  - jsonwebtoken
  - dotenv
  - swagger-jsdoc
  - swagger-ui-express
  - mocha, chai, mochawesome, supertest, sinon (testes)

  ## Principais ajustes e boas práticas implementadas

  - APIs REST e GraphQL padronizadas: regras de negócio centralizadas em services únicos, sem duplicidade de lógica.
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

  # Login (retorno: token, username)
### Clube
  # Criar clube (retorno: id, nome, unidades)
- `id`, `nome` (único)
  # Criar desbravador
  curl -X POST http://localhost:3000/desbravadores -H 'Authorization: Bearer <token>' -H 'Content-Type: application/json' -d '{"nome":"João","idade":12,"documento":123456,"clubeNome":"Clube Alpha","unidade":"Unidade 1"}'
  ```
- Um clube pode ter várias unidades

### Desbravador
- `nome`, `idade` (10-15), `documento` (único por clube, numérico, min 6 dígitos), `clubeNome`, `unidade` (string)

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

## Exemplo de uso REST

```bash
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
mutation {
  ## Testes
  - Pronto para Mocha, Chai, Supertest, Sinon (automatizados)
}
  ## Observações
  - Dados são armazenados em memória (perdidos ao reiniciar)
  - Estrutura modular e pronta para testes
  - Documentação Swagger disponível em `/api-docs`
  criarDesbravador(nome: "João", idade: 12, documento: 123456, clubeNome: "Clube Alpha", unidade: "Unidade 1") { nome idade documento clubeNome unidade }
}

query {
  clubes { nome unidades }
}
```

## Testes
- Pronto para Mocha, Chai, Supertest, Sinon (implemente depois)

## Observações
- Dados são armazenados em memória (perdidos ao reiniciar)
- Estrutura modular e pronta para testes
- Documentação Swagger disponível em `/api-docs`
