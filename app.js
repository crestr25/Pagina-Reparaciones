function Serial(num, len){
    var r = "" + num;
    while(r.length < len){
        r = "0" + r;
    }
    return "AB" + r
  
}



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

var Reparacion = require("./models/reparacion")
var Counter = require("./models/counter")
// var c = new Counter({})
// c.save()

app.get("/", function(req, res){
    res.render("landing")
});

app.get("/nueva", function(req, res){
    res.render("nueva");
});

app.post("/nueva", function(req, res){
    
    Counter.find({name: "counter"}, function(err, c){
        if(err) console.log(err)

        var serial = Serial(c[0].counter, 4)

        var r1 = new Reparacion({
            number: serial,
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
            
            Counter.findOneAndUpdate({name:c[0].name}, { $inc: { "counter" : 1 }},function(err,it){
                if(err) console.log(err)
    
                console.log(it)
            })

            console.log("Saved")
        })
    
    res.render("nueva")
    
    })

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
    var rep = {
        empresa: req.body.rep.empresa.toLowerCase(),
        email: req.body.rep.correo.toLowerCase(), 
        telefono: req.body.rep.telefono.toString().toLowerCase(),
        marca: req.body.rep.marca.toLowerCase(),
        descripcion: req.body.rep.descripcion.toLowerCase(),
        referencia: req.body.rep.referencia.toLowerCase(),
        item : req.body.rep.item.map(function(x){return x.map(function(x){return x.toLowerCase()}) })
    }
    Reparacion.findByIdAndUpdate(req.params.id, rep , function(err,rep){
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

app.get("reparaciones/historial", function(req, res){
    Reparacion.find({}, function(err, reparaciones){
        if(err){
            console.log(err)
        }
        res.render("archivo", {reparaciones: reparaciones})
    })
})

app.post("reparaciones/historial", function(req, res){
    res.send("oelo")
})


// PORT LISTENING
app.listen(port, function(){
    console.log("Magic Happens on port " + port)
})

