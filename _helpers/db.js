const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = process.env.PORT?config.database:config.databaseLocal;
    let connectionConfig = {
      host:process.env.HOST?process.env.HOST:host,
      port:process.env.PORT?process.env.PORT:port,
      user:process.env.DBUSER?process.env.DBUSER:user,
      password:process.env.DBPASSWORD?process.env.DBPASSWORD:password,
      database:process.env.DATABASE?process.env.DATABASE:database
    }

    const connection = await mysql.createConnection(connectionConfig);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${connectionConfig.database}\`;`);

    // connect to db
      const sequelize = new Sequelize(connectionConfig.database, connectionConfig.user, connectionConfig.password, {
        host: connectionConfig.host,
        dialect:'mysql',
        
        dialectOptions: {
          //useUTC: true, //for reading from database
        },
        //timezone: '+00:00'
    });

    // init models and add them to the exported db object
    db.User = require('../users/user.model')(sequelize);
    db.Transaction = require('../transactions/transaction.model')(sequelize);

    // sync all models with database
    await sequelize.sync();
}