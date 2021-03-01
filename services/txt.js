const path = require('path');
const fs = require('fs');
// const Icon = require('../models/icon');
const basePath = path.resolve(__dirname, "../public");
const { txtType } = require('../utils/value');
module.exports.readTxt = async function (filename) {
  const check = checkFilename(filename);
  if (check.err) {
    return check;
  }
  try {
    const resp = await fs.readFileSync(path.resolve(basePath, filename), {
      encoding: 'utf-8'
    });
    return {
      err: false,
      msg: resp
    };
  } catch (err) {
    return {
      err: true,
      msg: err
    };
  }
}

// 创建文件,前提是文件不存在
module.exports.openFile = async function (filename) {
  const check = checkFilename(filename);
  if (check.err) {
    return check;
  }
  let resp = await this.readTxt(filename);
  if (resp.err) {
    // 不存在该文件,才能创建
    try {
      resp = await fs.writeFileSync(path.resolve(basePath, filename), "", {
        encoding: 'utf-8',
      });
      // 往数据库中添加数据
      // await Icon.create({ name: filename, type: txtType })
      return {
        err: false,
        msg: "创建成功"
      };
    } catch (error) {
      return {
        err: true,
        msg: error
      }
    }
  } else {
    return {
      err: true,
      msg: "文件已存在"
    }
  }
}

//  前提是文件已存在
module.exports.writeFile = async function (filename, content) {
  const check = checkFilename(filename);
  if (check.err) {
    return check;
  }
  let resp = await this.readTxt(filename);
  if (resp.err) {
    // 文件不存在
    return {
      err: true,
      msg: "文件不存在"
    }

  } else {
    resp = fs.writeFileSync(path.resolve(basePath, filename), content, {
      encoding: 'utf-8'
    });
    return {
      err: false,
      msg: "写入成功"
    }
  }
}
module.exports.deleteFile = async function (filename){
  const check = checkFilename(filename);
  if(check.err){
    return check;
  }
  try{
    let resp = await fs.unlinkSync(path.resolve(basePath, filename));
    return {
      err: false,
      msg: resp,
    }
  }catch(error){
    return{
      err: true,
      msg : error
    }
  }
}

module.exports.rename = async function (oldName, newName){
  let check = checkFilename(oldName);
  if(check.err){
    return check;
  }
  check = checkFilename(newName);
  if(check.err){
    return check;
  }
  const oldPath = path.resolve(basePath, oldName);
  const newPath = path.resolve(basePath, newName);
  try{
    const resp = await fs.renameSync(oldPath, newPath);
    return {
      err: false,
      msg: resp
    }
  }catch(err){
    return {
      err: true,
      msg: err
    }
  }
}
//检查filename参数
function checkFilename(filename) {
  if (!filename) {
    return {
      err: true,
      msg: "缺少文件名"
    }
  }
  if (!filename.includes(txtType)) {
    return {
      err: true,
      msg: "缺少.txt"
    }
  }
  return {
    err: false
  }
}