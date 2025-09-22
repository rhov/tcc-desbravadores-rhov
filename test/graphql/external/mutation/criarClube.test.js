const request = require('supertest');
const { expect } = require('chai');
const { loginGraphql } = require('../../../factory/requisicoes/login/login');
let criarClube = require('../../../fixture/requisicoes/mutation/criarClube/clubeDadosErro.fixture.json');
let token;

require('dotenv').config();


describe('Clube de Desbravadores - Testes External', () => {
    beforeEach(async () => {
        token = await loginGraphql();
    });



    describe('Criar Clube', () => {


        it('Criar Clube de Desbravadores com dados válidos', async () => {
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

        criarClube.forEach(teste => {
            it(`${teste.nomeDoTeste}`, async () => {
                const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                    .set('Authorization', `Bearer ${token}`)
                    .send(teste.criarClube);
                expect(resposta.body.errors[0].message).to.eql(teste.resultadoEsperado);
            });
        })

    });
});



