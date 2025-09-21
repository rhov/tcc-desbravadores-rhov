const request = require('supertest');
const { expect } = require('chai');
const { faker } = require('@faker-js/faker');

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

        it('Registrar usuário já existente', async () => {
            const usuario = require('../../../helpers/login/users.json');
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
            expect(resposta.body.errors[0].message).to.eql("Usuário já existe");


        });

        it('Registrar usuário com password vazio', async () => {
            const usuario = { username: faker.person.firstName(), password: "" };
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
            expect(resposta.body.errors[0].message).to.eql("Dados obrigatórios");
        });

        it('Registrar usuário com usuario vazio', async () => {
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .send({
                    query: `mutation Mutation($username: String!, $password: String!) {
                                registerUser(username: $username, password: $password) {
                                    id
                                    username
                                }
                            }`,
                    variables: {
                        username: "",
                        password: "usuario.password"
                    }

                });
            expect(resposta.body.errors[0].message).to.eql("Dados obrigatórios");
        });

        it('Realizar login com credenciais válidas', async () => {
            const usuario = require('../../../helpers/login/users.json');
            const login = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .send({
                    query: `mutation Mutation($username: String!, $password: String!) {
                                login(username: $username, password: $password) {
                                    token
                                }
                            }`,
                    variables: {
                        username: usuario.username,
                        password: usuario.password
                    }
                })

            expect(login.body.data.login.token).to.not.be.empty;

        });
        it('Realizar login com credenciais inválidas (username e password)', async () => {
            const usuario = { username: faker.person.firstName(), password: faker.person.jobTitle() };
            const login = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .send({
                    query: `mutation Mutation($username: String!, $password: String!) {
                                login(username: $username, password: $password) {
                                    token
                                }
                            }`,
                    variables: {
                        username: usuario.username,
                        password: usuario.password
                    }
                })

            expect(login.body.errors[0].message).to.eql("Credenciais inválidas");

        });
        it('Realizar login com credenciais inválidas (username)', async () => {
            const usuario = { username: faker.person.firstName(), password: "123" };
            const login = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .send({
                    query: `mutation Mutation($username: String!, $password: String!) {
                                login(username: $username, password: $password) {
                                    token
                                }
                            }`,
                    variables: {
                        username: usuario.username,
                        password: usuario.password
                    }
                })

            expect(login.body.errors[0].message).to.eql("Credenciais inválidas");

        });
        it('Realizar login com credenciais inválidas (password)', async () => {
            const login = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .send({
                    query: `mutation Mutation($username: String!, $password: String!) {
                                login(username: $username, password: $password) {
                                    token
                                }
                            }`,
                    variables: {
                        username: "rodrigo",
                        password: "1234"
                    }
                })

            expect(login.body.errors[0].message).to.eql("Credenciais inválidas");

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



