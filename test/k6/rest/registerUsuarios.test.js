import http from 'k6/http';
import { check, sleep } from 'k6';
import * as faker from 'k6/x/faker';

const BASE_URL = __ENV.BASE_URL_REST;
const fakePeople = new faker.Faker();

export const options = {
    vus: 10,
    stages: [
        { duration: '1s', target: 1 },
        { duration: '8s', target: 10 },
        { duration: '1s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'],
    },
};

export default function () {
    const username = fakePeople.person.email();
    const password = fakePeople.internet.password();
    const payload = JSON.stringify({ username, password });
    const res = http.post(`${BASE_URL}/register`, payload, {
        headers: { 'Content-Type': 'application/json' }
    });
    check(res, {
        'register status 201': (r) => r.status === 201
    });
        sleep(1);
}
