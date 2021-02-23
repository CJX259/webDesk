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
module.exports.updateNameById = async function (id, name) {
  try {
    await Icon.update({name: name}, {
      where: {
        id: id
      }
    });
    return {
      err: false,
      msg: "创建成功"
    }
  } catch (error) {
    return {
      err: true,
      msg: error
    }
  }
}