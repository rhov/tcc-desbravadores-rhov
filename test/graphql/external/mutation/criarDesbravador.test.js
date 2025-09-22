const request = require('supertest');
const { expect } = require('chai');
const { faker } = require('@faker-js/faker');
const { loginGraphql } = require('../../../factory/requisicoes/login/login');
let token;

require('dotenv').config();


describe('Clube de Desbravadores - Testes External', () => {
    beforeEach(async () => {
        token = await loginGraphql();
    });



    describe('Criar Desbravador', () => {


        it('Criar Desbravador com dados válidos', async () => {
            const respostaEsperada = { nome: "Pantera Negra", unidades: ["Lince", "Tigre"] };
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    query: `mutation CriarClube($nome: String!, $unidades: [String!]) {
                                criarClube(nome: $nome, unidades: $unidades) {
                                    id
                                    nome
                                    unidades
                                }
                            }`,
                    variables: {
                        nome: "Pantera Negra",
                        unidades: ["Lince", "Tigre"]
                    }

                });
            expect(resposta.body.data.criarClube.nome).to.eql(respostaEsperada.nome);
            expect(resposta.body.data.criarClube.unidades).to.eql(respostaEsperada.unidades);


        });

        it('Registrar clube com dados faltando (unidades)', async () => {
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    query: `mutation CriarClube($nome: String!, $unidades: [String!]) {
                                criarClube(nome: $nome, unidades: $unidades) {
                                    id
                                    nome
                                    unidades
                                }
                            }`,
                    variables: {
                        nome: "Paineiras",
                        unidades: null
                    }
                });
            expect(resposta.body.errors[0].message).to.eql("Obrigatório informar os campos nome e unidades (ao menos uma)!");

        });

        it('Registrar clube com dados faltando (nome vazio)', async () => {
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    query: `mutation CriarClube($nome: String!, $unidades: [String!]) {
                                criarClube(nome: $nome, unidades: $unidades) {
                                    id
                                    nome
                                    unidades
                                }
                            }`,
                    variables: {
                        nome: "",
                        unidades: "Corcovado"
                    }
                });
            expect(resposta.body.errors[0].message).to.eql("Obrigatório informar os campos nome e unidades (ao menos uma)!");

        });

        it('Registrar clube com duas unidades iguais', async () => {
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    query: `mutation CriarClube($nome: String!, $unidades: [String!]) {
                                criarClube(nome: $nome, unidades: $unidades) {
                                    id
                                    nome
                                    unidades
                                }
                            }`,
                    variables: {
                        nome: "Paineiras",
                        unidades: ["Corcovado", "Corcovado"]
                    }
                });
            expect(resposta.body.errors[0].message).to.eql("Não pode haver duas unidades com o mesmo nome no mesmo clube");

        });


        /*
                buscaUnidadeDadosValidos.forEach(teste => {
                    it(`${teste.nomeDoTeste}`, async () => {
                        const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                            .set('Authorization', `Bearer ${token}`)
                            .send(teste.buscaUnidade);
                        expect(resposta.body).to.eql(teste.resultadoEsperado);
                    });
                })
        
                buscaUnidadeComErros.forEach(teste => {
                    it(`${teste.nomeDoTeste}`, async () => {
                        const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                            .set('Authorization', `Bearer ${token}`)
                            .send(teste.buscaUnidade);
                        expect(resposta.body.errors[0].message).to.eql(teste.resultadoEsperado);
                    });
                })
        */

    });
});



