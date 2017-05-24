var express = require("express")
var mongo = require("mongodb").MongoClient
var urlValidator = require("valid-url")

var dbUri = "mongodb://" + process.env.IP + ":27017/mydb"
var app = express()

app.get("/new/:url(*)", (req, res) => {
    var url = req.params.url
    var payload = {}
    
    //connect to db
    mongo.connect(dbUri, (err, db) => {
        
        if(err){
            console.log("something went wrong with db conn: " + err)
            db.close()
        
        } else{ 
            
            //check if url has already been shortened
            db.collection("urls")
            .findOne( { longform: url } , (err, doc) => {
                if (err) console.warn(err)
                else if(doc){ //it exists, so return the standard o/p
                    
                    console.log("url exists")
                    payload.original_url = url
                    payload.short_url = req.hostname + "/" + doc.shortform
                    res.send(JSON.stringify(payload))
                    db.close()
                        
                } else{
                        
                    //check if valid url or not
                    if(urlValidator.isUri(url)){
                        
                        //insert new doc
                        var count
                        db.collection("urls").count( (err, docCount) => {
                            
                            if(err) console.warn(err)
                            else{
                                count = isNaN(docCount) ? 0 : docCount
                                var newUrl = {
                                    "longform": url, "shortform": (count + 1).toString()
                                } 
                                
                                payload.short_url = req.hostname + "/"
                                db.collection("urls").insert(newUrl, {safe: true}, 
                                (err, doc) => {
                                    if(err) console.warn(err)
                                    else{
                                        payload.original_url = url
                                        payload.short_url += doc.ops[0].shortform 
                                        res.send(JSON.stringify(payload))
                                        db.close()
                                    }
                                })
                            }
                        })
                        
                    }
                    else{ 
                        res.end("Invalid Url")
                        db.close()
                    }
                    
                }
                
            })
        
        }
    
    })   
           
})

app.get("/:query", (req, res) => {
    var queryStr = req.params.query
    var payload = {}
    
    //connect to db
    mongo.connect(dbUri, (err, db) => {
        
        if(err){
            console.log("something went wrong with db conn: " + err)
            db.close()
        
        } else{ 
        
            //fetch the original url 
            db.collection("urls")
            .findOne( { shortform : queryStr }, (err, doc) => {
                
                if (err) console.warn(err)
                else if(doc) res.redirect(doc.longform) 
                else res.end("Invalid query!")    
                db.close()
                
            })
           
        }
    })
})

app.listen( 8080, () => { console.log("listening on port 8080") } )