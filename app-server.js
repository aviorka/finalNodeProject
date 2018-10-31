
var express=require('express');
var filePersonData = require("fs")
var jsonData=require('./persons.json');
var parser = require("body-parser");
var jsonFile = "./persons.json"
var app=express();

app.use(parser.urlencoded({extended:true}));
app.use(parser.json());
app.use(express.static("./web"));

// WRITE TO FILE
function readPerson(){
    var file = filePersonData.readFileSync(jsonFile, "utf-8");
    var jsonDATA = JSON.parse(file);
    return jsonDATA;
}

// WRITE NEW PERSON TO FILE
function addPerson(person){
    var jsonDATA = readPerson();
    jsonDATA.persons.push(person);
    filePersonData.writeFileSync(jsonFile, JSON.stringify(jsonDATA));
}
// CHECK IF PERSON EXIST
function ifExist(newPerson){
    var jsonDATA = readPerson();
    for(var person of jsonDATA.persons){
        if(person.name.toLowerCase() == newPerson.name.toLowerCase())
        return  true;
    }
    return false;
}
// post to web
app.post("/api/newPerson", function(request, response) {
    var person =request.body;
    if(ifExist(person)){
        response.status(400);
    }else{
        response.status(201);
        addPerson(person);        
    }  
    response.send();           
});

app.get('/api/persons',(req,res)=>{
    res.status(200);
    var jsonDATA = readPerson();
    res.send(JSON.stringify(jsonDATA));
    
}); 


// listening to port 3500
app.listen(3500,
    ()=>{console.log("Server is listening to port 3500")});

