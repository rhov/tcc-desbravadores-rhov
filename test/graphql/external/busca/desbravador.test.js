const request = require('supertest');
const { expect } = require('chai');
const { loginGraphql } = require('../../../factory/requisicoes/login/login');
let token;

require('dotenv').config();

describe('Clube de Desbravadores - Testes External', () => {
    beforeEach(async () => {
        token = await loginGraphql();
    });

    describe('Busca Desbravador', () => {

        it('Busca sem token', async () => {
            const respostaEsperada = require('../../../fixture/respostas/token/tokenAusente.fixture.json');
            const resposta = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .send({
                    query: `query BuscarDesbravador($documento: String!) {
                    buscarDesbravador(documento: $documento) {
                        nome
                        idade
                        documento
                        clubeNome
                        unidadeNome
                    }
                }`,
                    variables: {
                        documento: "005"
                    }
                });
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Buscar desbravador com dados válidos', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/desbravador/dadosValidos.fixture.json');
            const resposta = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    query: `query BuscarDesbravador($documento: String!) {
                    buscarDesbravador(documento: $documento) {
                        nome
                        idade
                        documento
                        clubeNome
                        unidadeNome
                    }
                }`,
                    variables: {
                        documento: "005"
                    }
                });
            expect(resposta.body).to.eql(respostaEsperada);
        });

        it('Buscar desbravador sem informar o número do documento', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/desbravador/documentoNaoInformado.fixture.json');
            const resposta = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    query: `query BuscarDesbravador($documento: String!) {
                    buscarDesbravador(documento: $documento) {
                        nome
                        idade
                        documento
                        clubeNome
                        unidadeNome
                    }
                }`,
                    variables: {
                        documento: ""
                    }
                });
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Buscar desbravador com valor null', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/desbravador/ValorNull.fixture.json');
            const resposta = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    query: `query BuscarDesbravador($documento: String!) {
                    buscarDesbravador(documento: $documento) {
                        nome
                        idade
                        documento
                        clubeNome
                        unidadeNome
                    }
                }`,
                    variables: {
                        documento: null
                    }
                });
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Buscar desbravador com número do documento inexistente', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/desbravador/documentoInexistente.fixture.json');
            const resposta = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    query: `query BuscarDesbravador($documento: String!) {
                    buscarDesbravador(documento: $documento) {
                        nome
                        idade
                        documento
                        clubeNome
                        unidadeNome
                    }
                }`,
                    variables: {
                        documento: "documentoNaoEncontrado"
                    }
                });
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        })
    });

    
});

