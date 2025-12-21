import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { SharedArray } from 'k6/data';
import { login } from './helpers/loginHelper.js';
import * as faker from 'k6/x/faker';

const fakerData = new faker.Faker();
const BASE_URL = __ENV.BASE_URL_REST;


const tempoCriacaoClube = new Trend('tempo_criacao_clube');
const tempoBuscaUnidade = new Trend('tempo_busca_unidade');

const usuarios = new SharedArray('usuarios', function () {
    return JSON.parse(open('../data/usuarios.test.data.json'));
});

export const options = {
    vus: 10,
    stages: [
        { duration: '5s', target: 2 }, // ramp up
        { duration: '20s', target: 8 },
        { duration: '10s', target: 10 }, // peak load
        { duration: '1s', target: 0 },  // ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'], // 2 segundos para 95% das requisições
        'tempo_criacao_clube': ['p(95)<2000'],
        'tempo_busca_unidade': ['p(95)<2000'],
    },
};

export default function () {

    // DDT: referência ao usuário do SharedArray
    const usuario = usuarios[(__VU - 1) % usuarios.length];
    let token, nomeClube, unidadesClube;


    group('Login Usuário', function () {
        token = login(BASE_URL, usuario.username, usuario.password);
        check(token, {
            'Token existente': (t) => !!t
        });

        sleep(1);
    });

    group('Criar Clube', function () {
        nomeClube = `${fakerData.address.country()} ${fakerData.numbers.int64()}`;
        unidadesClube = [fakerData.address.city(), fakerData.address.state()];
        const payload = JSON.stringify({ nome: nomeClube, unidades: unidadesClube });

        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const res = http.post(`${BASE_URL}/clubes`, payload, headers);
        tempoCriacaoClube.add(res.timings.duration);
        const body = JSON.parse(res.body || '{}');
        const result = check(res, {
            'Clube criado com sucesso - Status: 201': (r) => r.status === 201,
            'Resposta do servidor igual ao enviado': () => body.nome === nomeClube && JSON.stringify(body.unidades) === JSON.stringify(unidadesClube)
        });
        if (!result) {
            console.error('Erro ao criar clube:', res.status, res.body);
        }
        sleep(1);
    });

    group('Buscar Unidade', function () {
        const unidade = unidadesClube[0];
        const url = `${BASE_URL}/buscarUnidade?clubeNome=${encodeURIComponent(nomeClube)}&unidade=${encodeURIComponent(unidade)}`;
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        const res = http.get(url, headers);
        const body = JSON.parse(res.body || '{}');
        const result = check(res, {
            'Busca da unidade realizada com sucesso, Status: 200': (r) => r.status === 200,
            'Unidade encontrada corretamente': () => Array.isArray(body) && body[0] && body[0].nome === unidade && body[0].clube === nomeClube
        });
        if (!result) {
            console.error('Erro ao buscar unidade:', res.status, res.body);
        }
        tempoBuscaUnidade.add(res.timings.duration);
        sleep(1);
    });



}
