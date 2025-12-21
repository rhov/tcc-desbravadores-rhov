import http from 'k6/http';
import { check } from 'k6';

export function login(baseUrl, username, password) {
    const url = `${baseUrl}/login`;
    const payload = JSON.stringify({ username, password });
    
    const params = { headers: { 'Content-Type': 'application/json' } };
    const res = http.post(url, payload, params);
    
    if (!res) {
        console.error('Erro ao fazer login:', res.status, res.body);
    }
    check(res, { 'Helper check - login status 200': (r) => r.status === 200 });
    return res.json().token;

}
