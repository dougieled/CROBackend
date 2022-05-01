const express = require('express')
const router = express.Router()
const Joi = require('joi')

var multer = require('multer')
var upload = multer({ dest: 'tmp/csv/' })

const validateRequest = require('_middleware/validate-request')
const authorize = require('_middleware/authorize')
const transactionService = require('./transaction.service')

// routes
router.post('/', authorize(), createSchema, create)
router.post('/BatchUpload', authorize(), upload.single('file'), batchUpload)
router.get('/', authorize(), getAll)
router.get('/GetAllDeposits', authorize(), getAllDeposits)
router.get('/GetAllTransactions', authorize(), getAllTransactions)
router.put('/:id', authorize(), updateSchema, update)
router.delete('/Delete/:id', authorize(), _delete)
router.get('/GetById/:id', authorize(), getById)
router.get('/MyRecords', authorize(), getMyRecords)
router.get('/MyTransactions', authorize(), getMyTransactions)
router.get('/MyDeposits', authorize(), getMyDeposits)
router.delete('/ResetTransactions',authorize(), resetMyTransactions)

module.exports = router

function createSchema(req, res, next) {
  const schema = Joi.object({
    timestamp: Joi.date().required(),
    description: Joi.string().required(),
    amount: Joi.number().precision(2),
    isDeposit: Joi.boolean(),
    nativeCurrency: Joi.string(),
  })
  validateRequest(req, next, schema)
}

function create(req, res, next) {
  transactionService
    .create(req, res)
    .then(() => res.json({ message: 'Transaction Creation successful' }))
    .catch(next)
}

function batchUpload(req, res, next) {
  transactionService
    .batchUpload(req, res)
    .then(() => res.json({ message: 'Transaction Creation successful' }))
    .catch(next)
}

function getAll(req, res, next) {
  transactionService
    .getAll()
    .then((transactions) => res.json(transactions))
    .catch(next)
}
function getAllDeposits(req, res, next) {
  transactionService
    .getAllDeposits()
    .then((transactions) => res.json(transactions))
    .catch(next)
}
function getAllTransactions(req, res, next) {
  transactionService
    .getAllTransactions()
    .then((transactions) => res.json(transactions))
    .catch(next)
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    timestamp: Joi.date().required(),
    description: Joi.string().required(),
    amount: Joi.number().precision(2),
    nativeCurrency: Joi.string(),
    isDeposit: Joi.boolean(),
  })
  validateRequest(req, next, schema)
}

function update(req, res, next) {
  transactionService
    .update(req.params.id, req.body)
    .then((transaction) => res.json(transaction))
    .catch(next)
}

function _delete(req, res, next) {
  transactionService
    .delete(req.params.id, req)
    .then(() => res.json({ message: 'Transaction deleted successfully' }))
    .catch(next)
}
function getById(req, res, next) {
  transactionService
    .getById(req.params.id)
    .then((transaction) => res.json(transaction))
    .catch(next)
}
function getMyRecords(req, res, next) {
  transactionService
    .getMyRecords(req)
    .then((transactions) => res.json(transactions))
    .catch(next)
}
function getMyDeposits(req, res, next) {
  transactionService
    .getMyDeposits(req)
    .then((transactions) => res.json(transactions))
    .catch(next)
}
function getMyTransactions(req, res, next) {
  transactionService
    .getMyTransactions(req)
    .then((transactions) => res.json(transactions))
    .catch(next)
}
function resetMyTransactions(req, res, next) {
    transactionService
      .resetMyTransactions(req)
      .then(() => res.json({ message: 'Transactions deleted successfully' }))
      .catch(next)
  }
