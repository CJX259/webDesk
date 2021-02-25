const Icon = require("../models/icon");

module.exports.addIcon = async function (name, type) {
  if (name && type) {
    try {
      await Icon.create({ name, type });
      return {
        err: false,
        msg: "创建成功"
      }
    } catch (error) {
      console.log(error);
      return {
        err: true,
        msg: error
      }
    }
  } else {
    return {
      err: true,
      msg: "参数缺失"
    }
  }
}
// module.exports.updateNameById = async function (id, name) {
//   try {
//     await Icon.update({name: name}, {
//       where: {
//         id: id
//       }
//     });
//     return {
//       err: false,
//       msg: "创建成功"
//     }
//   } catch (error) {
//     return {
//       err: true,
//       msg: error
//     }
//   }
// }
module.exports.updateIconByName = async function (name,newName, newType){
  try{
    const resp = await Icon.update({name: newName, type: newType} ,{
      where: {
        name: name
      }
    });
    return {
      err: false,
      msg : resp
    }
  }catch(error){
    return {
      err: true,
      msg: error
    }
  }

}
module.exports.getAllIcon = async function (){
  try{
    const resp = await Icon.findAll();
    return JSON.parse(JSON.stringify(resp));
  }catch(error){
    return {
      err : true,
      msg: error
    }
  }
}

module.exports.deleteIconByName = async function (name) {
  try{
    const resp = await Icon.destroy({
      where: {
        name : name
      }
    });
    return{
      err: false,
      msg: resp
    }
  }catch(error){
    return {
      err: true,
      msg: error
    }
  }
}