const ProjectMap = require('../models/ProjectMap');

async function addProjectMap(name, address){
  if(arguments.length !== 2){
    throw new TypeError("缺少参数");
  }
  try{
    const resp = await ProjectMap.create({name, address});
    return JSON.parse(JSON.stringify(resp));
  }catch(err){
    throw new Error(err);
  }
}
async function deleteProjectMap(name) {
  try{
    const resp = await ProjectMap.destroy({
      where: {
        name : name,
      }
    });
    return JSON.parse(JSON.stringify(resp));
  }catch(err){
    throw new Error(err);
  }
}
async function getProjectMap(){
  try{
    const resp = await ProjectMap.findAll();
    return JSON.parse(JSON.stringify(resp));
  }catch(err){
    throw new Error(err);
  }
}

async function getAddressByName(name){
  try{
    const resp = await ProjectMap.findAll({
      where: {
        name: name
      }
    });
  }catch(err){
    throw new Error(err);
  }
}
module.exports = {
  addProjectMap,
  getProjectMap,
  deleteProjectMap,
  getAddressByName
}