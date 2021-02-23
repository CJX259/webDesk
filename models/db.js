const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('webDesk', "root", "123456",{
  host: "127.0.0.1",
  dialect: "mysql",
  port: "3306",
  logging: false,
});
sequelize.authenticate();
module.exports = sequelize;