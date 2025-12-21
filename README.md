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

O projeto utiliza diversos conceitos fundamentais de automação de testes de performance. Abaixo, cada conceito é explicado e exemplificado com trechos reais do código.

| Conceito                | Explicação e Exemplo                                                                 |
|-------------------------|------------------------------------------------------------------------------------|
| Thresholds              | Thresholds são limites de desempenho definidos para as métricas dos testes. No arquivo `test/k6/rest/criarClube.test.js`, linhas 17-22, são definidos thresholds para tempo de criação de clube, busca de unidade e duração das requisições. Por exemplo: <br> `tempo_criacao_clube: ['p(95)<2000']` exige que 95% das criações de clube ocorram em menos de 2 segundos. |
| Checks                  | Checks validam se as respostas das requisições atendem critérios esperados. No mesmo arquivo, linhas 44-47, há checks para status, existência de token e se a resposta da API corresponde ao que foi enviado. Exemplo: <br> `check(res, { 'clube criado status 201': (r) => r.status === 201 })` |
| Helpers                 | Helpers são funções auxiliares que centralizam lógicas comuns, como login. O arquivo `test/k6/rest/helpers/loginHelper.js` contém a função `login`, que realiza autenticação e retorna o objeto de resposta para uso nos testes. |
| Trends                  | Trends são métricas customizadas para monitorar tempos de execução de operações específicas. No arquivo de teste, as variáveis `tempoCriacaoClube` e `tempoBuscaUnidade` registram o tempo de cada operação, permitindo análise detalhada de performance. |
| Faker                   | O pacote `k6/x/faker` é utilizado para gerar dados dinâmicos e variados, como nomes de clubes e unidades, simulando cenários reais e evitando dados repetidos. Exemplo: <br> `nomeClube = fakerData.address.country() + ' ' + fakerData.numbers.int64()` |
| Variável de Ambiente    | O endereço da API é configurado via variável de ambiente `BASE_URL_REST`, permitindo flexibilidade na execução dos testes em diferentes ambientes. |
| Stages                  | Stages definem a variação da carga durante o teste, simulando ramp up, pico e ramp down. No arquivo de teste, as linhas 13-16 configuram diferentes estágios de usuários virtuais. |
| Reaproveitamento de Resposta | Dados obtidos em uma requisição (como token de login ou nome do clube criado) são utilizados em etapas seguintes do teste, garantindo encadeamento e realismo. Exemplo: o token obtido no login é usado para autenticar as próximas requisições. |
| Uso de Token de Autenticação | Todas as requisições protegidas enviam o token JWT no header `Authorization`, simulando o uso real da API. |
| Data-Driven Testing     | O teste utiliza o `SharedArray` para carregar múltiplos usuários de um arquivo JSON, permitindo testar diferentes perfis e cenários. |
| Groups                  | Groups organizam o teste em etapas lógicas, facilitando a leitura dos relatórios e a manutenção do código. Exemplo: <br> `group('Criar Clube', function () { ... })` |

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

