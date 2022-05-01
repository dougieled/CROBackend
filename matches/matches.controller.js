const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const matchService = require('./match.service');

// routes
router.post('/', authorize(),createSchema, create);
router.get('/', authorize(), getAll);
router.get('/MyMatches', authorize(), getMyMatches);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        competition: Joi.string().required(),
        teamAName: Joi.string().required(),
        teamAGoals: Joi.number(),
        teamAPoints: Joi.number(),
        teamBName: Joi.string().empty(''),
        teamBGoals: Joi.number(),
        teamBPoints: Joi.number(),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    matchService.create(req,req.body)
        .then(() => res.json({ message: 'Match Creation successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    matchService.getAll()
        .then(users => res.json(users))
        .catch(next);
}
function getMyMatches(req, res, next) {
    matchService.getMyMatches(req)
        .then(users => res.json(users))
        .catch(next);
}

function getById(req, res, next) {
    matchService.getById(req.params.id)
        .then(match => res.json(match))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        competition: Joi.string().empty(''),
        teamAName: Joi.string().empty(''),
        teamAGoals: Joi.number(),
        teamAPoints: Joi.number(),
        teamBName: Joi.string().empty(''),
        teamBGoals: Joi.number(),
        teamBPoints: Joi.number(),
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    matchService.update(req, req.params.id, req.body)
        .then(match => res.json(match))
        .catch(next)
}

function _delete(req, res, next) {
    matchService.delete(req.params.id)
        .then(() => res.json({ message: 'Match deleted successfully' }))
        .catch(next);
}