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
    return JSON.parse(open('../data/usuarios.test.data.json'));
});

export const options = {
    vus: 1,
    stages: [
        { duration: '1s', target: 1 }, // ramp up
        { duration: '1s', target: 1 }, // steady
        { duration: '1s', target: 0 },  // ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'],
        'get_users_duration': ['p(95)<2000'],
    },
};

export default function () {

    // DDT: referência ao usuário do SharedArray
    const user = users[(__VU - 1) % users.length];
    console.log(`VU: ${__VU} - Usando usuário de índice: ${user.username}`);

    let token;

    
    group('Login User', function () {
        token = login(BASE_URL, user.username, user.password);
        check(token, {
            'token exists': (t) => !!t
        });
        
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
    

    sleep(1);

}
