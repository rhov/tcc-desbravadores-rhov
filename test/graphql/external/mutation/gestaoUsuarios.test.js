const request = require('supertest');
const { expect } = require('chai');
const { faker } = require('@faker-js/faker');

require('dotenv').config();

describe('Clube de Desbravadores - Testes External', () => {


    describe('Gestão de Usuários', () => {

        it.only('Registrar usuário', async () => {
            const respostaEsperada = require('../../../fixture/respostas/token/tokenAusente.fixture.json');
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
                        "username": usuario.username,
                        "password": usuario.password
                    }

                });
            expect(resposta.body.data.registerUser.username).to.eql(usuario.username);
          

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



