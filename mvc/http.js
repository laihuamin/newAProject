const http = require('http')
// http
http.createServer((req, res) => {
    console.log(req)
    res.end('hello world')
  }).listen(8888)
