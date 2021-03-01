const e = require("express");
const express = require("express");
const router = express.Router();
const iconSer = require("../../services/icon");
const projectSer = require('../../services/projectMap');
const txtSer = require("../../services/txt");
const { asyncHandler } = require("../../utils/sendResult");
const { needAddressType, txtType } = require('../../utils/value');

router.get('/geticon', asyncHandler(async (req, res) => {
  try {
    const resp = await iconSer.getAllIcon();
    return resp;
  } catch (error) {
    throw new Error(error);
  }
}))

// 添加图标，还需要调用对应的type的server添加进数据库

router.post('/addicon', asyncHandler(async (req, res) => {
  let { name, type } = req.body;
  let address;
  if (type === needAddressType) {
    address = req.body.address;
    if (!address) {
      throw new Error("缺少参数address");
    }
  }
  if (!name || !type) {
    throw new Error('参数缺失');
  }
  try {
    let resp;
    // 是需要address，则给该表注入数据
    if (address) {
      resp = await projectSer.addProjectMap(name, address);
    } else if (type === txtType) {
      // 是txt，则创建文件
      resp = await txtSer.openFile(name);
    }
    resp = await iconSer.addIcon(name, type);
    return resp;
  } catch (err) {
    throw new Error(err);
  }
}))

// 只改名字和地址
router.post('/updateicon', asyncHandler(async (req, res) => {
  let { name, newName, address } = req.body;
  if (!name) {
    throw new Error('参数缺失');
  }
  try {
    let resp;
    resp = await iconSer.updateIconByName(name, newName);
    if (!name.includes('.txt') && address) {
      resp = await projectSer.updateProjectMap(name, newName, address ? address : "");
    }else if(name.includes('.txt')){
      resp = await txtSer.rename(name, newName);
    }
    return resp;
  } catch (error) {
    throw new Error(error);
  }
}))

router.get('/deleteicon', asyncHandler(async (req, res) => {
  let { name, type } = req.query;
  // 从name的后缀判断是什么文件类型
  if (!type && name.includes(txtType)) {
    type = txtType;
  }
  if (!name || !type) {
    throw new Error("缺少参数");
  }
  try {
    let resp;
    if (type === needAddressType) {
      resp = await projectSer.deleteProjectMap(name);
    } else if (type === txtType) {
      resp = await txtSer.deleteFile(name);
    }
    resp = await iconSer.deleteIconByName(name);
    return resp;
  } catch (error) {
    throw new Error(error);
  }
}))

module.exports = router;