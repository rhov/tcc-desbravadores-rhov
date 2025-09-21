const request = require('supertest');
const { expect } = require('chai');
const { query } = require('express');
const { loginGraphql } = require('../../factory/requisicoes/login/login');
let token;

require('dotenv').config();

describe('Clube de Desbravadores', () => {
    beforeEach(async () => {
        token = await loginGraphql();
    });

    describe('Busca Desbravador', () => {
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
        })
        it('Buscar desbravador sem informar o número do documento', async () => {
            const respostaEsperada = require('../../fixture/respostas/buscaDesbravadorSemInformarONumeroDoDocumento.json');
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
                        documento: ""
                    }
                });
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);     
        })

        it('Buscar desbravador com número do documento inexistente', async () => {
            const respostaEsperada = require('../../fixture/respostas/buscarDesbravadorComNumeroDoDocumentoInexistente.json');
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
                        documento: "documentoNaoEncontrado"
                    }
                });
            expect(resposta.body.errors[0].message).to.equals(respostaEsperada.message);     
        })
    });
});


/**
 *     buscarDesbravador: (parent, { documento }, context) => {
      jwtMiddleware.graphql(context.req);
      if (!documento) throw new Error('Por gentileza, informe o documento do desbravador para que possamos realizar a busca.');
      const docStr = String(documento).toLowerCase();
      const desbravador = desbravadores.find(d => String(d.documento).toLowerCase() === docStr);
      if (!desbravador) throw new Error('Não encontramos nenhum desbravador com o documento informado. Por favor, revise e tente novamente.');
      return {
        nome: desbravador.nome,
        idade: desbravador.idade,
        documento: desbravador.documento,
        clubeNome: desbravador.clubeNome,
        unidadeNome: desbravador.unidade,
      };
    },
 * 
 */