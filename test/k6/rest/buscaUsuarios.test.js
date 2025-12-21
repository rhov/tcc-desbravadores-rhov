import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { SharedArray } from 'k6/data';
import { login } from './helpers/loginHelper.js';
import * as faker from 'k6/x/faker';
const fakePeople = new faker.Faker();
const BASE_URL = __ENV.BASE_URL_REST;

const getUsersTrend = new Trend('get_users_duration');

const users = new SharedArray('users', function () {
    return JSON.parse(open('../../data/buscaUsuarios.test.json'));
});

export const options = {
    vus: 10,
    stages: [
        { duration: '1s', target: 10 }, // ramp up
        { duration: '3s', target: 10 }, // steady
        { duration: '1s', target: 0 },  // ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'],
        'get_users_duration': ['p(95)<2000'],
    },
};

export default function () {

    // DDT: referência ao usuário do SharedArray
    const userIdx = (__VU - 1) % users.length;
    const userRef = users[userIdx];

    // Gerar dados únicos para registro
    const username = fakePeople.person.email(); // pode ser email para garantir unicidade
    const password = fakePeople.internet.password();

    let token;

    group('Register User', function () {
        const payload = JSON.stringify({
            username,
            password
        });
        console.log(payload)
        const res = http.post(`${BASE_URL}/register`, payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        check(res, {
            'register status 201': (r) => r.status === 201
        });
        sleep(1);
    });

    /*
    group('Login User', function () {
        token = login(BASE_URL, email, password);
        check(token, {
            'token exists': (t) => !!t
        });
        sleep(1);
    });
    

    group('Get Users', function () {
        const res = http.get(`${BASE_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        getUsersTrend.add(res.timings.duration);
        check(res, {
            'get users status 200': (r) => r.status === 200
        });
        sleep(1);
    });
    */
}
