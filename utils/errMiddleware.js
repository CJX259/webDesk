const { getErr } = require("./sendResult");

module.exports = (err, req, res, next)=>{
  if(err){
    res.status(500).send(getErr(err instanceof Error ? err.message: err, 500));
    return null;
  }else{
    next();
  }
}