const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../model/data');

const secret = process.env.JWT_SECRET || 'supersecret';

function registerUserService(username, password) {
  if (!username || !password) throw new Error('Dados obrigatórios');
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) throw new Error('Usuário já existe');
  const hash = bcrypt.hashSync(password, 8);
  const user = { id: users.length + 1, username, password: hash };
  users.push(user);
  return { id: user.id, username: user.username };
}

function register(req, res) {
  try {
    const { username, password } = req.body;
    const result = registerUserService(username, password);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function loginUserService(username, password) {
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password)) throw new Error('Credenciais inválidas');
  const token = jwt.sign({ id: user.id, username: user.username }, secret);
  return { token, username: user.username };
}

function login(req, res) {
  try {
    const { username, password } = req.body;
    const result = loginUserService(username, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

function getUsers(req, res) {
  res.json(users.map(u => ({ id: u.id, username: u.username })));
}

// Métodos GraphQL usam os mesmos services
function registerGraphQL(username, password) {
  return registerUserService(username, password);
}

function loginGraphQL(username, password) {
  return loginUserService(username, password);
}

function getUsersGraphQL() {
  return users.map(u => ({ id: u.id, username: u.username }));
}

module.exports = { register, login, getUsers, registerGraphQL, loginGraphQL, getUsersGraphQL };
