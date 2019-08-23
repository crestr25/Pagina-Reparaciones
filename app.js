var express = require("express");
var app = express()
var port = 3000

var bodyParser = require("body-parser")

var methodOverride = require("method-override")

var mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb://localhost:27017/reparaciones",{ useFindAndModify: false })


app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.set("view engine", "ejs");

var reparacionesSchema = new mongoose.Schema({
    number: Number,
    fecha: String,
    empresa: String,
    correo: String,
    telefono: String,
    marca: String,
    referencia: String,
    descripcion: String,
    item: [[{type: String}]]
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
});

app.post("/nueva", function(req, res){
    var r1 = new Reparacion({
        number: 3,
        fecha: req.body.fecha,
        empresa: req.body.empresa,
        email: req.body.email,
        telefono: req.body.telefono.toString(),
        marca: req.body.marca,
        descripcion: req.body.descripcion,
        referencia: req.body.referencia
    })
    
    r1.save(function(err){
        if(err) console.log(err)

        console.log("Saved")
    })
    
    res.render("nueva")
    
})

app.get("/reparaciones", function(req, res){
    Reparacion.find({}, function(err, reparaciones){
        if(err){
            console.log(err)
        }
        res.render("index", {reparaciones: reparaciones})
    })
})

app.get("/reparaciones/:id", function(req, res){
    
    Reparacion.findById(req.params.id, function(err, reparacion){
        if(err) console.log(err);

        res.render("show", {reparacion: reparacion})
    })
})

app.get("/reparaciones/:id/editar", function(req, res){
    Reparacion.findById(req.params.id, function(err, reparacion){
        if(err) console.log(err);
        res.render("edit", {reparacion: JSON.stringify(reparacion) })
        // res.render("edit", {reparacion: reparacion})
    })
})


app.put("/reparaciones/:id", function(req, res){
    // console.log(req.body)
    // console.log("===================")
    Reparacion.findByIdAndUpdate(req.params.id, req.body.rep , function(err,rep){
        if(err){
            console.log(err)
        }    
        // console.log(rep)
        res.redirect("/reparaciones")
    })
})

app.get("/ensayo", function(req, res){
    res.render("ensayo.ejs")
})

app.post("/ensayo", function(req, res){
    console.log(req.body.item)
    res.render("ensayo")
})

// PORT LISTENING
app.listen(port, function(){
    console.log("Magic Happens on port " + port)
})


