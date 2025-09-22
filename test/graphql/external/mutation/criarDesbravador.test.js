const request = require('supertest');
const { expect } = require('chai');
const { faker } = require('@faker-js/faker');
const { loginGraphql } = require('../../../factory/requisicoes/login/login');
let criarDbv = require('../../../fixture/requisicoes/mutation/criarDesbravador/dbvComDadosValidos.fixture.json');
let token;

require('dotenv').config();


describe('Clube de Desbravadores - Testes External', () => {
    beforeEach(async () => {
        token = await loginGraphql();
    });

    describe.only('Criar Desbravador', () => {
       
            criarDbv.forEach(teste => {
                it(`${teste.nomeDoTeste}`, async () => {
                    const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                        .set('Authorization', `Bearer ${token}`)
                        .send(teste.criarDesbravador);
                        console.log(teste.criarDesbravador);
                    expect(resposta.body).to.eql(teste.resultadoEsperado);
                });
            })
            /*    
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



