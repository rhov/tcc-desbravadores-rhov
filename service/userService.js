const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../model/data');

const secret = process.env.JWT_SECRET || 'supersecret';

function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Dados obrigatórios' });
  if (users.find(u => u.username === username)) return res.status(400).json({ error: 'Usuário já existe' });
  const hash = bcrypt.hashSync(password, 8);
  const user = { id: users.length + 1, username, password: hash };
  users.push(user);
  res.status(201).json({ id: user.id, username: user.username });
}

function login(req, res) {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Credenciais inválidas' });
  const token = jwt.sign({ id: user.id, username: user.username }, secret);
  res.json({ token, user: { id: user.id, username: user.username } });
}

function getUsers(req, res) {
  res.json(users.map(u => ({ id: u.id, username: u.username })));
}

// Métodos GraphQL
function registerGraphQL(username, password) {
  if (!username || !password) throw new Error('Dados obrigatórios');
  if (users.find(u => u.username === username)) throw new Error('Usuário já existe');
  const hash = bcrypt.hashSync(password, 8);
  const user = { id: users.length + 1, username, password: hash };
  users.push(user);
  return { id: user.id, username: user.username };
}

function loginGraphQL(username, password) {
  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) throw new Error('Credenciais inválidas');
  const token = jwt.sign({ id: user.id, username: user.username }, secret);
  return { token, user: { id: user.id, username: user.username } };
}

function getUsersGraphQL() {
  return users.map(u => ({ id: u.id, username: u.username }));
}

module.exports = { register, login, getUsers, registerGraphQL, loginGraphQL, getUsersGraphQL };
