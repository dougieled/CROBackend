// prod.js - production keys here
module.exports = {
  host: process.env.HOST,
  port: process.env.MYPORT,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DATABASE,
  secret:process.env.SECRET
};