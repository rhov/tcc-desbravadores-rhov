const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../graphql/middleware/auth');
const userService = require('../service/userService');
// const transferService = require('../service/transferService');

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/register', userService.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', userService.login);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       401:
 *         description: Não autorizado
 */
router.get('/users', jwtMiddleware.rest, userService.getUsers);




// --- Clubes ---
/**
 * @swagger
 * /clubes:
 *   post:
 *     summary: Cria um novo clube
 *     tags: [Clube]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       201:
 *         description: Clube criado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post('/clubes', jwtMiddleware.rest, require('./clubeController').criarClube);

/**
 * @swagger
 * /clubes:
 *   get:
 *     summary: Lista todos os clubes
 *     tags: [Clube]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clubes
 *       401:
 *         description: Não autorizado
 */
router.get('/clubes', jwtMiddleware.rest, require('./clubeController').listarClubes);

// --- Unidades ---
/**
 * @swagger
 * /unidades:
 *   post:
 *     summary: Cria uma nova unidade
 *     tags: [Unidade]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               sexo:
 *                 type: string
 *               clubeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Unidade criada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post('/unidades', jwtMiddleware.rest, require('./unidadeController').criarUnidade);

/**
 * @swagger
 * /unidades/{clubeId}:
 *   get:
 *     summary: Lista unidades de um clube
 *     tags: [Unidade]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubeId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do clube
 *     responses:
 *       200:
 *         description: Lista de unidades
 *       401:
 *         description: Não autorizado
 */
router.get('/unidades/:clubeId', jwtMiddleware.rest, require('./unidadeController').listarUnidadesPorClube);

// --- Desbravadores ---
/**
 * @swagger
 * /desbravadores:
 *   post:
 *     summary: Cria um novo desbravador
 *     tags: [Desbravador]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               idade:
 *                 type: integer
 *               documento:
 *                 type: string
 *               sexo:
 *                 type: string
 *               unidadeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Desbravador criado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post('/desbravadores', jwtMiddleware.rest, require('./desbravadorController').criarDesbravador);

/**
 * @swagger
 * /desbravadores/{unidadeId}:
 *   get:
 *     summary: Lista desbravadores de uma unidade
 *     tags: [Desbravador]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: unidadeId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da unidade
 *     responses:
 *       200:
 *         description: Lista de desbravadores
 *       401:
 *         description: Não autorizado
 */
router.get('/desbravadores/:unidadeId', jwtMiddleware.rest, require('./desbravadorController').listarDesbravadoresPorUnidade);

module.exports = router;
