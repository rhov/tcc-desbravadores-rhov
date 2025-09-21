const request = require('supertest');
const { expect } = require('chai');
const { loginGraphql } = require('../../../factory/requisicoes/login/login');

let token;

require('dotenv').config();

describe('Clube de Desbravadores - Testes External', () => {
    beforeEach(async () => {
        token = await loginGraphql();
        buscaUnidade = require('../../../fixture/requisicoes/busca/buscaUnidade.fixture.json');
    });

    describe('Busca Unidade', () => {

        it('Buscar unidade sem token', async () => {
            const respostaEsperada = require('../../../fixture/respostas/token/tokenAusente.fixture.json');
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .send(buscaUnidade);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Buscar unidade (Unidade e Clube) com dados válidos ', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/unidade/dadosValidosUnidadeClube.fixture.json');
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidade);
            expect(resposta.body).to.eql(respostaEsperada);
        });

        it('Buscar unidade (Unidade) com dados válidos ', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/unidade/dadosValidosUnidade.fixture.json');
            delete buscaUnidade.variables.clubeNome;
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidade);
            expect(resposta.body).to.eql(respostaEsperada);
        });

        it.only('Buscar todas as unidades de um clube com dados válidos ', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/unidade/dadosValidosClube.fixture.json');
            delete buscaUnidade.variables.unidade;
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidade);
            expect(resposta.body).to.eql(respostaEsperada);
        });

        it('Buscar clube com nome vazio', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/clube/nomeNaoInformado.fixture.json');
            buscaClube.variables.nome = '';
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidade);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Buscar clube com nome null', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/clube/valorNull.fixture.json');
            buscaClube.variables.nome = null;
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidade);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Buscar clube  inexistente', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/clube/nomeNaoEncontrado.json');
            buscaClube.variables.nome = 'nomeNaoEncontrado';
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidade);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

    });
});



