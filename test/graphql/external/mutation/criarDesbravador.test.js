const request = require('supertest');
const { expect } = require('chai');
const { faker } = require('@faker-js/faker');
const { loginGraphql } = require('../../../factory/requisicoes/login/login');
let criarDbv = require('../../../fixture/requisicoes/mutation/criarDesbravador/dbvDadosValidos.fixture.json');
let criarDbvValidacoes = require('../../../fixture/requisicoes/mutation/criarDesbravador/dbvDadosErro.fixture.json');
let token;

require('dotenv').config();


describe('Clube de Desbravadores - Testes External', () => {
    beforeEach(async () => {
        token = await loginGraphql();
    });

    describe('Criar Desbravador', () => {

        criarDbv.forEach(teste => {
            it(`${teste.nomeDoTeste}`, async () => {
                const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                    .set('Authorization', `Bearer ${token}`)
                    .send(teste.criarDesbravador);
                expect(resposta.body).to.eql(teste.resultadoEsperado);
            });
        })

        criarDbvValidacoes.forEach(teste => {
            it(`${teste.nomeDoTeste}`, async () => {
                const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                    .set('Authorization', `Bearer ${token}`)
                    .send(teste.criarDesbravador);
                expect(resposta.body.errors[0].message).to.eql(teste.resultadoEsperado);
            });
        })



    });
});



