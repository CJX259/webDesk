const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Icon = sequelize.define("Icon", {
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
    createdAt: false,
    updatedAt: false
});
module.exports = Icon;