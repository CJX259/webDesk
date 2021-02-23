const { DataTypes } = require('sequelize');
const sequelize = require("./db");

const ProjectMap = sequelize.define("Project", {
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  createdAt: false,
  updatedAt: false
});
module.exports = ProjectMap;
