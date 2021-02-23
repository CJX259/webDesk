const path = require("path");
const express = require("express");
const port = 82;
const app = express();
const staticPath = path.resolve(__dirname, "../public");

// app.use(express.json());
// 用于解析post的body
app.use(express.urlencoded({ extended: false }));

app.use(express.static(staticPath));

app.use("/api/project", require("./api/project"));
app.use("/api/txt", require('./api/txt'));

// 错误处理中间件
app.use(require("../utils/errMiddleware"));

app.listen(port, ()=>{
  console.log("监听端口:"+port);
});
exports.app = app;
