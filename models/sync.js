require('./ProjectMap');
require("./icon");
const sequelize = require("./db");
sequelize.sync().then(_=>{
  console.log("模型同步成功");
}).catch(err=>{
  console.log("出错：",err);
})