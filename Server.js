const http =require('http'); 
const express= require('express');
const FILE = require('./GetFile');
const app= express();
const fs = require('fs');

const server= http.createServer(app);
var PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname));


app.get("/", (req,res)=>{
    res.sendFile("./Homepage.html",{ root: __dirname });
});

app.post("/sendDATA",(req,res)=>{
    FILE(req.body.code,req.body.pass).then((title)=>{
        var str="";
        var tit=title.replace(/[^a-zA-Z ]/g, "");
        if(req.body.pass=="") str=__dirname+`/Hentai.pdf`; 
        else{ str=__dirname+`/Encrypted.pdf`; tit=tit+" ENCRYPTED";}
        setTimeout(function(){
            res.download(str,tit+`.pdf`,function(err){
                if(err) console.log(err);
                fs.unlinkSync(str);
            });
        },1000);
    }).catch((err)=>{
        if(err=="More than 30") res.sendFile("./Warning.html",{ root: __dirname });
        else if(err=="Not Found") res.sendFile("./Error.html",{ root: __dirname });
        console.error("Error : "+err);
    });
});

server.listen(PORT, function(){
    console.log("Server is Running on Port : "+PORT);
});
