# Author: Rodrigo Henrique
# Disciplina: 07 - Automação de Testes na Camada de Serviço (API)
# Professor: Julio de Lima
# TCC: Testes automatizados com API criada com IA generativa
# Tema da API: Clube de Desbravadores

# Update: Api atualizada para contemplar conceitos de Teste de Performance conforme TCC
# Disciplina: 09 - Teste de Performance 
# Professor: Julio de Lima

Os conceitos utilizados no teste de performance serão exibidos no começo do arquivo README.md, com explicações e exemplos reais do código.



## Conceitos de Teste de Performance Utilizados no TCC

### Thresholds
Thresholds são validações de limite de tempo que criamos após alinhamento com o time e que indicam valores aceitáveis para determinado endpoint por exemplo. No teste do endpoint de criação de clube, utilizamos 2 segundos como limite tolerável.
Arquivo: test/k6/rest/criarClube.test.js, linhas 27-31
```
thresholds: {
    http_req_duration: ['p(95)<2000'], // 2 segundos para 95% das requisições
    'tempo_criacao_clube': ['p(95)<2000'],
    'tempo_busca_unidade': ['p(95)<2000'],
}
```

### Checks
Checks são validações que garantem que a resposta da API está correta, como status esperado ou dados retornados.
Arquivo: test/k6/rest/criarClube.test.js, linhas 65-68
```
  const result = check(res, {
      'Clube criado com sucesso - Status: 201': (r) => r.status === 201,
      'Resposta do servidor igual ao enviado': () => body.nome === nomeClube && JSON.stringify(body.unidades) === JSON.stringify(unidadesClube)
  });
```

### Helpers
Helpers são funções auxiliares que centralizam lógicas comuns, como login.
Dessa forma sempre que for necessário um login não precisamos repetir o código, apenas chamamos a função.

Arquivo: test/k6/rest/helpers/loginHelper.js
```
export function login(baseUrl, username, password) { ... }
```


Arquivo: test/k6/rest/criarClube.test.js, linha 5 e 42
```
import { login } from './helpers/loginHelper.js';
```
token = login(BASE_URL, usuario.username, usuario.password);
```

### Trends
Trends são métricas customizadas para monitorar tempos de execução de operações específicas.
Arquivo: test/k6/rest/criarClube.test.js, linhas 10-11
```
const tempoCriacaoClube = new Trend('tempo_criacao_clube');
const tempoBuscaUnidade = new Trend('tempo_busca_unidade');
```

### Faker
O pacote k6/x/faker é utilizado para gerar dados dinâmicos e variados, como nomes de clubes e unidades, simulando cenários reais e evitando dados repetidos.
Arquivo: test/k6/rest/criarClube.test.js, linha 38
```
nomeClube = `${fakerData.address.country()} ${fakerData.numbers.int64()}`;
```

### Variável de Ambiente
O endereço da API é configurado via variável de ambiente BASE_URL_REST, permitindo flexibilidade na execução dos testes em diferentes ambientes.
Arquivo: test/k6/rest/criarClube.test.js, linha 8
```
const BASE_URL = __ENV.BASE_URL_REST;
```

### Stages
Stages definem a variação da carga durante o teste, simulando ramp up, pico e ramp down.
Arquivo: test/k6/rest/criarClube.test.js, linhas 14-17
```
stages: [
    { duration: '5s', target: 2 },
    { duration: '20s', target: 8 },
    { duration: '10s', target: 10 },
    { duration: '1s', target: 0 },
]
```

### Reaproveitamento de Resposta
Dados obtidos em uma requisição (como token de login ou nome do clube criado) são utilizados em etapas seguintes do teste, garantindo encadeamento e realismo.
Arquivo: test/k6/rest/criarClube.test.js, linhas 22-23 e 38-39
```
token = login(BASE_URL, usuario.username, usuario.password);
// ...
const payload = JSON.stringify({ nome: nomeClube, unidades: unidadesClube });
```

### Uso de Token de Autenticação
Todas as requisições protegidas enviam o token JWT no header Authorization, simulando o uso real da API.
Arquivo: test/k6/rest/criarClube.test.js, linhas 41 e 54
```
headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
}
```

### Data-Driven Testing
O teste utiliza o SharedArray para carregar múltiplos usuários de um arquivo JSON, permitindo testar diferentes perfis e cenários.
Arquivo: test/k6/rest/criarClube.test.js, linha 13
```
const usuarios = new SharedArray('usuarios', function () {
    return JSON.parse(open('../data/usuarios.test.data.json'));
});
```

### Groups
Groups organizam o teste em etapas lógicas, facilitando a leitura dos relatórios e a manutenção do código.
Arquivo: test/k6/rest/criarClube.test.js, linhas 20, 32, 49
```
group('Login Usuário', function () { ... })
group('Criar Clube', function () { ... })
group('Buscar Unidade', function () { ... })
```

### Exemplos reais do projeto

**Groups e Helpers**
O código abaixo está armazenado no arquivo `test/k6/rest/criarClube.test.js`, linhas 28-32, e demonstra o uso do conceito de Groups. Dentro dele, é feito uso de um Helper, a função de login importada de outro script:

```javascript
group('Login Usuário', function () {
  token = login(BASE_URL, usuario.username, usuario.password);
});
```

**Thresholds e Trends**
No início do arquivo de teste, são definidos thresholds e trends para monitorar o tempo das operações:

```javascript
const tempoCriacaoClube = new Trend('tempo_criacao_clube');
export const options = {
  thresholds: {
    'tempo_criacao_clube': ['p(95)<2000'],
  },
};
```

**Checks**
Após cada requisição, checks validam o status e o conteúdo da resposta:

```javascript
check(res, {
  'clube criado status 201': (r) => r.status === 201,
  'resposta igual ao enviado': () => body.nome === nomeClube
});
```

**Data-Driven Testing**
Usuários são carregados de um arquivo externo para simular diferentes perfis:

```javascript
const usuarios = new SharedArray('usuarios', function () {
  return JSON.parse(open('../data/usuarios.test.data.json'));
});
```

**Faker**
Geração dinâmica de dados para clubes e unidades:

```javascript
nomeClube = `${fakerData.address.country()} ${fakerData.numbers.int64()}`;
```

**Reaproveitamento de Resposta**
O token obtido no login é utilizado nas requisições seguintes:

```javascript
token = respostaLogin.json().token;
```

---

Essas práticas garantem que os testes sejam robustos, realistas e fáceis de manter, atendendo aos requisitos do TCC e às melhores práticas de automação de testes de performance.


---

## Comandos para Execução Rápida dos Testes de Performance

Para facilitar a execução dos testes de performance, utilize os scripts já configurados no projeto. Basta rodar os comandos abaixo no terminal, na raiz do projeto:

- Executar teste de criação de clube:
```
npm run k6-criarClube-local-test
```

- Executar todos os testes k6 do diretório:
```
npm run k6-test-local
```

- Executar teste de registro de usuários:
```
npm run k6-registerUsuarios-local-test
```

Esses comandos já estão prontos no arquivo package.json e permitem rodar os testes rapidamente, sem necessidade de configurar manualmente o k6.

---

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

---

## Comandos para Execução Rápida dos Testes de Performance

Para facilitar a execução dos testes de performance, utilize os scripts já configurados no projeto. Basta rodar os comandos abaixo no terminal, na raiz do projeto:

- Executar teste de criação de clube:
```
npm run k6-criarClube-local-test
```

- Executar todos os testes k6 do diretório:
```
npm run k6-test-local
```

- Executar teste de registro de usuários:
```
npm run k6-registerUsuarios-local-test
```

Esses comandos já estão prontos no arquivo package.json e permitem rodar os testes rapidamente, sem necessidade de configurar manualmente o k6.

