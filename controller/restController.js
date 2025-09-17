const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../graphql/middleware/auth');
const userService = require('../service/userService');


/**
 * @swagger
 * /buscarClube:
 *   get:
 *     summary: Busca um clube por nome, podendo incluir desbravadores e unidades
 *     tags: [Clube]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do clube
 *       - in: query
 *         name: incluirDesbravadores
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Incluir desbravadores do clube
 *       - in: query
 *         name: incluirUnidades
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Incluir unidades do clube
 *     responses:
 *       200:
 *         description: Clube encontrado
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Clube não encontrado
 */
router.get('/buscarClube', jwtMiddleware.rest, require('./clubeController').buscarClube);

/**
 * @swagger
 * /buscarDesbravador:
 *   get:
 *     summary: Busca um desbravador por documento, podendo incluir clube e unidade
 *     tags: [Desbravador]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: documento
 *         schema:
 *           type: string
 *         required: true
 *         description: Documento do desbravador
 *       - in: query
 *         name: incluirClube
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Incluir dados do clube
 *       - in: query
 *         name: incluirUnidade
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Incluir nome da unidade
 *     responses:
 *       200:
 *         description: Desbravador encontrado
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Desbravador não encontrado
 */
router.get('/buscarDesbravador', jwtMiddleware.rest, require('./desbravadorController').buscarDesbravador);

/**
 * @swagger
 * /buscarUnidade:
 *   get:
 *     summary: Busca uma unidade por nome e clube, podendo incluir clube e desbravadores
 *     tags: [Unidade]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: clubeNome
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do clube
 *       - in: query
 *         name: unidade
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome da unidade
 *       - in: query
 *         name: incluirClube
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Incluir dados do clube
 *       - in: query
 *         name: incluirDesbravadores
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Incluir desbravadores da unidade
 *     responses:
 *       200:
 *         description: Unidade encontrada
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Unidade não encontrada
 */
router.get('/buscarUnidade', jwtMiddleware.rest, require('./clubeController').buscarUnidade);


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
 *               clubeNome:
 *                 type: string
 *               unidade:
 *                 type: string
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
 * /desbravadores:
 *   get:
 *     summary: Lista desbravadores de um clube e unidade
 *     tags: [Desbravador]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: clubeNome
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do clube
 *       - in: query
 *         name: unidade
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome da unidade
 *     responses:
 *       200:
 *         description: Lista de desbravadores
 *       401:
 *         description: Não autorizado
 */
router.get('/desbravadores', jwtMiddleware.rest, require('./desbravadorController').listarDesbravadoresPorUnidade);

module.exports = router;
