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

// 只改名字
router.post('/updatename', asyncHandler(async (req, res) => {
  let { name, newName } = req.body;
  if (!name) {
    throw new Error('参数缺失');
  }
  try {
    const resp = await iconSer.updateIconByName(name, newName);
    return resp;
  } catch (error) {
    throw new Error(error);
  }
}))

router.get('/deleteicon', asyncHandler(async (req, res) => {
  let { name, type } = req.query;
  // 从name的后缀判断是什么文件类型
  if(!type && name.includes(txtType)){
    type = txtType;
  }
  if (!name||!type) {
    throw new Error("缺少参数");
  }
  try {
    let resp;
    if(type === needAddressType){
      resp = await projectSer.deleteProjectMap(name);
    }else if(type === txtType){
      // 文件的删除还没做好
      resp = await txtSer.deleteFile(name);
    }
    resp = await iconSer.deleteIconByName(name);
    return resp;
  } catch (error) {
    throw new Error(error);
  }
}))

module.exports = router;