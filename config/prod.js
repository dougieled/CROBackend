// prod.js - production keys here
module.exports = {
  host: process.env.HOST,
  port: 3306,//process.env.PORT,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DATABASE,
  secret:process.env.SECRET
};