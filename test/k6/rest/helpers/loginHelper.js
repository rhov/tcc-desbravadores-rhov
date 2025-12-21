import http from 'k6/http';
import { check } from 'k6';

export function login(baseUrl, email, password) {
    const url = `${baseUrl}/login`;
    const payload = JSON.stringify({ email, password });
    const params = { headers: { 'Content-Type': 'application/json' } };
    const res = http.post(url, payload, params);
    check(res, { 'login status 200': (r) => r.status === 200 });
    // O token agora está diretamente no objeto retornado
       return res.json().token;
}
