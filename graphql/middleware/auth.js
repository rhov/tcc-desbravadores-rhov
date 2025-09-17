const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'supersecret';

function rest(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token inválido' });
  try {
    req.user = jwt.verify(token, secret);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

function graphql(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) throw new Error('Token não fornecido');
  const token = authHeader.split(' ')[1];
  if (!token) throw new Error('Token inválido');
  try {
    req.user = jwt.verify(token, secret);
  } catch (err) {
    throw new Error('Token inválido');
  }
}

function graphqlContext(req) {
  return { req };
}

module.exports = { rest, graphql, graphqlContext };
