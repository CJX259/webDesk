const express = require('express');
const txtSer = require('../../services/txt');
const router = express.Router();
const { asyncHandler } = require('../../utils/sendResult');

router.get("/read", asyncHandler(async (req, res) => {
  const resp = await txtSer.readTxt(req.query.filename);
  if(resp.err){
    throw new Error(resp.msg);
  }
  return resp;
}));

router.get('/open', asyncHandler(async (req, res) => {
  const resp = await txtSer.openFile(req.query.filename);
  if(resp && resp.err){
    throw new Error(resp.msg);
  }
  return resp;
}))

router.post('/write', asyncHandler(async (req, res) =>{
  const resp = await txtSer.writeFile(req.body.filename, req.body.content);
  if(resp && resp.err){
    throw new Error(resp.msg);
  }
  return resp;   
}))

// router.get('/delete', )
module.exports = router;