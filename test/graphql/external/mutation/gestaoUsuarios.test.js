const request = require('supertest');
const { expect } = require('chai');
const { faker } = require('@faker-js/faker');
let criarUsuarioErros = require('../../../fixture/requisicoes/mutation/usuarios/criarLoginErro.fixture.json');
let realizarLoginErros = require('../../../fixture/requisicoes/mutation/usuarios/realizarLoginErro.fixture.json');
require('dotenv').config();

describe('Clube de Desbravadores - Testes External', () => {


    describe('Gestão de Usuários', () => {

        it('Registrar usuário', async () => {
            const usuario = { username: faker.person.firstName(), password: "123" };
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .send({
                    query: `mutation Mutation($username: String!, $password: String!) {
                                registerUser(username: $username, password: $password) {
                                    id
                                    username
                                }
                            }`,
                    variables: {
                        username: usuario.username,
                        password: usuario.password
                    }

                });
            expect(resposta.body.data.registerUser.username).to.eql(usuario.username);


        });

        criarUsuarioErros.forEach(teste => {
            it(`${teste.nomeDoTeste}`, async () => {
                const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                    .send(teste.registerUser);
                expect(resposta.body.errors[0].message).to.eql(teste.resultadoEsperado);
            });
        });

        realizarLoginErros.forEach(teste => {
            it.only(`${teste.nomeDoTeste}`, async () => {
                const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                    .send(teste.login);
                expect(resposta.body.errors[0].message).to.eql(teste.resultadoEsperado);
            });
        });

    });
});



