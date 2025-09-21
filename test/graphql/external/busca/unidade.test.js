const request = require('supertest');
const { expect } = require('chai');
const { loginGraphql } = require('../../../factory/requisicoes/login/login');

let token;

require('dotenv').config();

describe.only('Clube de Desbravadores - Testes External', () => {


    describe('Busca Unidade', () => {
        let buscaUnidadeDadosValidos = require('../../../fixture/requisicoes/busca/buscaUnidadeDadosValidos.fixture.json');
        let buscaUnidadeComErros = require('../../../fixture/requisicoes/busca/buscaUnidadeComErros.fixture.json');

        beforeEach(async () => {
            token = await loginGraphql();
        });

        it('Buscar unidade sem token', async () => {
            const respostaEsperada = require('../../../fixture/respostas/token/tokenAusente.fixture.json');
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .send(buscaUnidadeDadosValidos[0].buscaUnidade);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);

        });

        buscaUnidadeDadosValidos.forEach(teste => {
            it.only(`${teste.nomeDoTeste}`, async () => {
                const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                    .set('Authorization', `Bearer ${token}`)
                    .send(teste.buscaUnidade);
                expect(resposta.body).to.eql(teste.resultadoEsperado);
            });
        })

        it('Buscar com dados obrigatórios vazios (clube e unidade)', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/unidade/dadosNaoInformados.fixture.json');
            buscaUnidadeComErros.variables.unidade = '';
            buscaUnidadeComErros.variables.clubeNome = '';
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidadeComErros);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Buscar com dados obrigatórios vazios (clube)', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/unidade/dadosNaoInformados.fixture.json');
            delete buscaUnidadeComErros.variables.unidade;
            buscaUnidadeComErros.variables.clubeNome = '';
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidadeComErros);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Buscar com dados obrigatórios vazios (unidade)', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/unidade/dadosNaoInformados.fixture.json');
            buscaUnidadeComErros.variables.unidade = '';
            delete buscaUnidadeComErros.variables.clubeNome;
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidadeComErros);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Buscar com dados obrigatórios null (clube e unidade)', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/unidade/dadosNaoInformados.fixture.json');
            buscaUnidadeComErros.variables.unidade = null;
            buscaUnidadeComErros.variables.clubeNome = null;
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidadeComErros);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Buscar com dados obrigatórios null (clube)', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/unidade/dadosNaoInformados.fixture.json');
            delete buscaUnidadeComErros.variables.unidade;
            buscaUnidadeComErros.variables.clubeNome = null;
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidadeComErros);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Buscar com dados obrigatórios null (unidade)', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/unidade/dadosNaoInformados.fixture.json');
            buscaUnidadeComErros.variables.unidade = null;
            delete buscaUnidadeComErros.variables.clubeNome;
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidadeComErros);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

        it('Unidade não encontrada por unidade', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/unidade/unidadeNaoEncontrada.fixture.json');
            buscaUnidadeComErros.variables.unidade = 'nomeNaoEncontrado';
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidadeComErros);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });
        it('Unidade não encontrada por clube', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/unidade/unidadeNaoEncontrada.fixture.json');
            buscaUnidadeComErros.variables.clubeNome = 'nomeNaoEncontrado';
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidadeComErros);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });
        it('Unidade não encontrada por clube válido e unidade inexsitente', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/unidade/unidadeNaoEncontrada.fixture.json');
            buscaUnidadeComErros.variables.clubeNome = 'sacerdotes';
            buscaUnidadeComErros.variables.unidade = 'desconehcida';
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidadeComErros);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });
        it('Unidade não encontrada por unidade válida e clube inexsitente', async () => {
            const respostaEsperada = require('../../../fixture/respostas/busca/unidade/unidadeNaoEncontrada.fixture.json');
            buscaUnidadeComErros.variables.clubeNome = 'desconhecida';
            buscaUnidadeComErros.variables.unidade = 'melquisedeque';
            const resposta = await request(process.env.BASE_URL_GRAPHQL).post('')
                .set('Authorization', `Bearer ${token}`)
                .send(buscaUnidadeComErros);
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);
        });

    });
});



