const request = require('supertest');
const { expect } = require('chai');
const { loginGraphql } = require('../../../factory/requisicoes/login/login');

let token;

require('dotenv').config();

describe.only('Clube de Desbravadores - Testes External', () => {
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

        it('Buscar todas as unidades de um clube com dados válidos ', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/unidade/dadosValidosClube.fixture.json');
            delete buscaUnidade.variables.unidade;
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidade);
            expect(resposta.body).to.eql(respostaEsperada);
        });

        it('Buscar com dados obrigatórios vazios (clube e unidade)', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/unidade/dadosNaoInformados.fixture.json');
            buscaUnidade.variables.unidade = '';
            buscaUnidade.variables.clubeNome = '';
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidade);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Buscar com dados obrigatórios vazios (clube)', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/unidade/dadosNaoInformados.fixture.json');
            delete buscaUnidade.variables.unidade;
            buscaUnidade.variables.clubeNome = '';
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidade);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Buscar com dados obrigatórios vazios (unidade)', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/unidade/dadosNaoInformados.fixture.json');
            buscaUnidade.variables.unidade = '';
            delete buscaUnidade.variables.clubeNome;
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidade);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Buscar com dados obrigatórios null (clube e unidade)', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/unidade/dadosNaoInformados.fixture.json');
            buscaUnidade.variables.unidade = null;
            buscaUnidade.variables.clubeNome = null;
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidade);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Buscar com dados obrigatórios null (clube)', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/unidade/dadosNaoInformados.fixture.json');
            delete buscaUnidade.variables.unidade;
            buscaUnidade.variables.clubeNome = null;
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidade);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Buscar com dados obrigatórios null (unidade)', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/unidade/dadosNaoInformados.fixture.json');
            buscaUnidade.variables.unidade = null;
            delete buscaUnidade.variables.clubeNome;
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidade);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Buscar clube  inexistente', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/clube/nomeNaoEncontrado.json');
            buscaUnidade.variables.nome = 'nomeNaoEncontrado';
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidade);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

    });
});



