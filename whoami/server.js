var express = require('express')
var app = express()

app.get('/whoami', (req, res) => {
  
  var payload = {}
  payload.ip = req.header('x-forwarded-for') || req.connection.remoteAddress
  payload.lang = req.headers["accept-language"].split(",")[0]
  payload.software = req.headers["user-agent"].split(/[\(\)]/)[1].trim()
  res.send(JSON.stringify(payload))
  
})

app.listen(8080, () => { console.log("listening on port 8080") } )

