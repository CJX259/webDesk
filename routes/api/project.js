const express = require('express');
const projectSer = require("../../services/projectMap");
const { asyncHandler } = require("../../utils/sendResult");
const router = express.Router();

router.get("/getmap", asyncHandler(async (req, res) => {
  const result = await projectSer.getProjectMap();
  return result;
}));

// 添加和删除，晚点添加cookie判断
// 进行操作的时候，前端判断密码,毕竟账号登录不是此项目的主要部分

router.post("/addmap", asyncHandler(async (req, res) => {
  let {name, address} = req.body;
  if(name && address) {
    const result = await projectSer.addProjectMap(name, address);
    return result;
  }else{
    throw new Error("参数缺失");
  }
}))
router.get("/deletemap", asyncHandler(async (req,res)=>{
  let {name} = req.query;
  if(name){
    const result = await projectSer.deleteProjectMap(name);
    return result;
  }else{
    throw new Error("参数缺失");
  }
}))
module.exports = router;