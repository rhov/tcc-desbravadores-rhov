const request = require('supertest');
const { expect } = require('chai');
const { loginGraphql } = require('../../../factory/requisicoes/login/login');

let token;

require('dotenv').config();

describe('Clube de Desbravadores - Testes External', () => {


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


    });
});



