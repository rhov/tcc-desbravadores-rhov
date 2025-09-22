const request = require('supertest');
const { users } = require('../../../../model/data');
const usuario = require('../../../helpers/login/users.json');
require('dotenv').config();

async function loginGraphql() {
    const login = await request(process.env.BASE_URL_GRAPHQL)
        .post('')
        .send({
            query: `mutation Mutation($username: String!, $password: String!) {
                                login(username: $username, password: $password) {
                                    token
                                }
                            }`,
            variables: {
                username: usuario.username,
                password: usuario.password
            }
        })
    return login.body.data.login.token;
};

module.exports = {loginGraphql};