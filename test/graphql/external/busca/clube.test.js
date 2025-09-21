const request = require('supertest');
const { expect } = require('chai');
const { loginGraphql } = require('../../../factory/requisicoes/login/login');
const { buscarClube } = require('../../../../controller/clubeController');
let token;

require('dotenv').config();

describe('Clube de Desbravadores - Testes External', () => {
    beforeEach(async () => {
        token = await loginGraphql();
        buscaClube = require('../../../fixture/requisicoes/busca/buscaClube.fixture.json');
    });

    describe('Busca Clube', () => {

        it('Buscar clube sem token', async () => {
            const respostaEsperada = require('../../../fixture/respostas/token/tokenAusente.fixture.json');
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .send(buscaClube);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Buscar clube com dados válidos', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/clube/dadosValidos.fixture.json');
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaClube);
            expect(resposta.body).to.eql(respostaEsperada);
        });

        it('Buscar clube com nome vazio', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/clube/nomeNaoInformado.fixture.json');
            buscaClube.variables.nome = '';
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaClube);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Buscar clube com nome null', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/clube/valorNull.fixture.json');
            buscaClube.variables.nome = null;
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaClube);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Buscar clube  inexistente', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/clube/nomeNaoEncontrado.json');
            buscaClube.variables.nome = 'nomeNaoEncontrado';
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaClube);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

    });
});



