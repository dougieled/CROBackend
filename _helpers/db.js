const keys = require('../config/keys');

const mysql = require('mysql2/promise')
const { Sequelize } = require('sequelize')

module.exports = db = {}
initialize()

async function initialize() {
  const { host, port, user, password, database } = keys;
  console.log(host,port,user,password)
  const connection = await mysql.createConnection({ host, port, user, password })
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\`;`
  )

  // connect to db
  const sequelize = new Sequelize(
    database,
    user,
    password,
    {
      host: host,
      dialect: 'mysql',

      dialectOptions: {
        //useUTC: true, //for reading from database
      },
      //timezone: '+00:00'
    }
  )

  // init models and add them to the exported db object
  db.User = require('../users/user.model')(sequelize)
  db.Transaction = require('../transactions/transaction.model')(sequelize)

  // sync all models with database
  await sequelize.sync()
}
