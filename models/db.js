const { Sequelize } = require('sequelize');
const dbConf = require('../db.json');
const sequelize = new Sequelize('webDesk', dbConf.user, dbConf.password,{
  host: dbConf.host,
  dialect: "mysql",
  port: dbConf.port,
  logging: false,
});
sequelize.authenticate();
module.exports = sequelize;