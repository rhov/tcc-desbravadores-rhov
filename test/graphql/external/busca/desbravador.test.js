const request = require('supertest');
const { expect } = require('chai');
const { loginGraphql } = require('../../../factory/requisicoes/login/login');
let buscaDbvValidacoes = require('../../../fixture/requisicoes/busca/buscaDbvErros.fixture.json');
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


        buscaDbvValidacoes.forEach(teste => {
            it(`${teste.nomeDoTeste}`, async () => {
                const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                    .set('Authorization', `Bearer ${token}`)
                    .send(teste.buscarDesbravador);
                expect(resposta.body.errors[0].message).to.eql(teste.resultadoEsperado);
            });
        })

 
    });


});

