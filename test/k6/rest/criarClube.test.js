import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { SharedArray } from 'k6/data';
import { login } from './helpers/loginHelper.js';
import * as faker from 'k6/x/faker';

const fakerData = new faker.Faker();
const BASE_URL = __ENV.BASE_URL_REST;

const createClubTrend = new Trend('create_club_duration');

const users = new SharedArray('users', function () {
    return JSON.parse(open('../data/usuarios.test.data.json'));
});

export const options = {
    vus: 4,
    stages: [
        { duration: '1s', target: 1 }, // ramp up
        { duration: '11s', target: 4 }, // steady
        { duration: '1s', target: 0 },  // ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<3.000'],
        'create_club_duration': ['p(95)<3.000'],
    },
};

export default function () {

    // DDT: referência ao usuário do SharedArray
    const user = users[(__VU - 1) % users.length];
    let token;


    group('Login User', function () {
        token = login(BASE_URL, user.username, user.password);
        check(token, {
            'token exists': (t) => !!t
        });
        sleep(1);

    });

    group('Create club', function () {
        const payload = JSON.stringify(

            {
                nome: `${fakerData.address.country()}` + ` ${fakerData.numbers.int64()}`,
                unidades: [
                     fakerData.address.city(),    
                     fakerData.address.state(),
                ]
            }

        );
        
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }

        const res = http.post(`${BASE_URL}/clubes`, payload, headers);
        createClubTrend.add(res.timings.duration);
        const result = check(res, {
            'create club status 201': (r) => r.status === 201
        });
        if (!result) {
            console.error('Erro ao criar clube:', res.status, res.body);
        }
        sleep(1);
    });


    

}
