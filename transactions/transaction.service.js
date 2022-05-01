const db = require('_helpers/db')
var fs = require('fs')
var csv = require('fast-csv')
var moment = require('moment')

module.exports = {
  getById,
  getAll,
  getAllDeposits,
  getAllTransactions,
  create,
  batchUpload,
  update,
  getMyRecords,
  getMyTransactions,
  getMyDeposits,
  delete: _delete,
  resetMyTransactions
}

async function getById(id) {
  return await getTransaction(id)
}
async function getAll() {
  return await db.Transaction.findAll()
}
async function getAllDeposits() {
  return await db.Transaction.findAll({
    where: {
      isDeposit: true,
    },
  })
}
async function getAllTransactions() {
  return await db.Transaction.findAll({
    where: {
      isDeposit: false,
    },
  })
}

async function create(params) {
  // save transaction
  await db.Transaction.create(params)
}

async function batchUpload(req, res) {
  // save transaction
  let allTransactionsInDB = await getAll()

  //TEST
  let csvstream = csv
    .parseFile(req.file.path, { headers: true })
    .on('data', function (data) {
      csvstream.pause()
      let userId = req.user.id
      let dto = mapExcelToSchema(data, userId)
      let doesTransactionAlreadyExist =
        allTransactionsInDB.filter(
          (x) =>
            moment(x.timestamp).isSame(moment(dto.timestamp)) &&
            x.description === dto.description &&
            parseFloat(x.amount) === parseFloat(dto.amount) &&
            x.userId === userId
        ).length > 0
      //Checks if transaction exists already && checks if date is valid
      if (!doesTransactionAlreadyExist) {
        ;(async () => create(dto))()
      }
      csvstream.resume()
    })
    .on('end', function () {
      console.log('We are done!')
      fs.unlinkSync(req.file.path) // remove temp file
    })
    .on('error', function (error) {
      console.log(error)
    })
}

async function update(id, params) {
  const transaction = await getTransaction(id)
  if (transaction.id !== parseInt(id)) {
    throw 'Unable to update transaction as the ID is different to original ID'
  }

  // copy params to transaction and save
  Object.assign(transaction, params)
  await transaction.save()

  return transaction.get()
}

async function _delete(id, req) {
  const transaction = await getTransaction(id)
  if (transaction.userId === req.user.id) {
    await transaction.destroy()
  }else{
    throw 'User who does not own the Transaction is attempting to delete the Transaction'
  }
}
async function resetMyTransactions(req) {
    return await db.Transaction.destroy({ where: { userId: req.user.id }})
}
async function getMyRecords(req) {
  return await db.Transaction.findAll({
    where: {
      userId: req.user.id,
    },
  })
}
async function getMyDeposits(req) {
  return await db.Transaction.findAll({
    where: {
      isDeposit: true,
      userId: req.user.id,
    },
  })
}
async function getMyTransactions(req) {
  return await db.Transaction.findAll({
    where: {
      isDeposit: false,
      userId: req.user.id,
    },
  })
}

// helper functions

async function getTransaction(id) {
  const transaction = await db.Transaction.findByPk(id)
  if (!transaction) throw 'Transaction not found'
  return transaction
}
function mapExcelToSchema(data, userId) {
  let dto = {
    timestamp: data['Timestamp (UTC)'], //mySqlDateTimeFormat,
    description: data['Transaction Description'],
    amount: data['Native Amount'],
    nativeCurrency: data['Native Currency'],
    isDeposit: data['Native Amount'] > 0,
    userId: userId,
  }
  return dto
}
