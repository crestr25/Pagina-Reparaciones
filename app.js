var express = require("express");
var app = express()
var port = 3000

var bodyParser = require("body-parser")

var mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb://localhost/reparaciones")

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs");

var reparacionesSchema = new mongoose.Schema({
    fecha: String,
    empresa: String,
    correo: String,
    telefono: String,
    marca: String,
    referencia: String,
    descripcion: String
})

var Reparacion = mongoose.model("Reparacion", reparacionesSchema)

// ROUTES

// "/"
app.get("/", function(req, res){
    res.render("landing")
});

// "/NUEVA" GET, POST
app.get("/nueva", function(req, res){
    res.render("nueva");
})

app.post("/nueva", function(req, res){
    res.render("nueva")
    console.log(req.body.fecha)
    console.log(req.body.empresa)
    console.log(req.body.correo)
    console.log(req.body.telefono.toString())
    console.log(req.body.marca)
    console.log(req.body.descripcion)
    console.log(req.body.referencia)
})

// "/CONSULTAR" GET, POST
app.get("/consulta", function(req, res){
    res.render("consulta");
})


// PORT LISTENING
app.listen(port, function(){
    console.log("Magic Happens on port " + port)
})