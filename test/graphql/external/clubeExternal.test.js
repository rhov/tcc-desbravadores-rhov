const request = require('supertest');
const { expect } = require('chai');
const { query } = require('express');
const {loginGraphql} = require('../../factory/requisicoes/login/login');
let token;

require('dotenv').config();

describe('Desbravador', () => {
    beforeEach(async ()  => {
        token = await loginGraphql();        
    });

    it('buscaDesbravador', async () => {
        const respostaEsperada = require('../../fixture/respostas/buscaDesbravador.json');
        const resposta = await request(process.env.BASE_URL_GRAPHQL)
            .post('')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `query BuscarDesbravador($documento: String!) {
                    buscarDesbravador(documento: $documento) {
                        nome
                        idade
                        documento
                        clubeNome
                        unidadeNome
                    }
                }`,
                variables: {
                    documento: "005"
                }
            });
        expect(resposta.body).to.eql(respostaEsperada);
        //console.log(resposta.body);
    })
});