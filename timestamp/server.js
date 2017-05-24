var express = require('express')
var app = express()

var months = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];

function unix2natural(timestamp){
  
  var date = new Date(timestamp * 1000)
  var month = months[date.getMonth()]
  var day = date.getDate()
  var year = date.getFullYear()
  
  return month + " " + day + ", " + year
}

app.get('/:timestamp', (req, res) => {
  
  var timestamp = req.params.timestamp
  timestamp = isNaN(timestamp) ? timestamp : Number(timestamp)
  var date = new Date(timestamp).getTime()
  var payLoad = { "unix": null, "natural": null }
  
  //check if the timestamp is a valid date
  //0 is true, false otherwise
  if(date > 0){
    payLoad.unix = isNaN(timestamp) ? date/1000 : timestamp
    payLoad.natural = isNaN(timestamp) ? timestamp : unix2natural(timestamp)
  }
  res.send(JSON.stringify(payLoad))

})

app.listen(8080, () => { console.log("listening on port 8080") } )

