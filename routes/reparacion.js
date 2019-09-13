var express    = require("express");
var router     = express.Router();
var Counter    = require("../models/counter");
var Reparacion = require("../models/reparacion");
var email      = require('emailjs');
var middleware = require("../middleware")
var server = email.server.connect({
    user: 'ingenieria.medellin@almacenbombas.com',
    password: 'ing+Medellin.01',
    host: 'mail.almacenbombas.com',
    ssl: true
  });


router.get("/nueva", middleware.isLoggedIn,function(req, res){
    res.render("reparaciones/nueva");
});

router.post("/nueva", function(req, res){
    
    Counter.find({name: "counter"}, function(err, c){
        if(err) console.log(err)

        var serial = Serial(c[0].counter, 4)

        var r1 = new Reparacion({
            number: serial,
            fecha: req.body.fecha,
            empresa: req.body.empresa,
            correo: req.body.email,
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
    
    res.render("reparaciones/nueva")
    
    })

})

router.get("/", function(req, res){
    Reparacion.find({estado:{$ne: "Archivado"}},function(err, reparaciones){
        if(err){
            console.log(err)
        }
        res.render("reparaciones/index", {reparaciones: reparaciones})
    })
})

router.get("/historial", function(req, res){
    Reparacion.find({estado:"Archivado"}, function(err, reparaciones){
        if(err){
            console.log(err)
        }
        res.render("reparaciones/archivo", {reparaciones: reparaciones})
    })
})

router.get("/:id", function(req, res){
    
    Reparacion.findById(req.params.id, function(err, reparacion){
        if(err) console.log(err);

        res.render("reparaciones/show", {reparacion: JSON.stringify(reparacion)})
    })
})

router.get("/:id/editar", function(req, res){
    Reparacion.findById(req.params.id, function(err, reparacion){
        if(err) console.log(err);
        res.render("reparaciones/edit", {reparacion: JSON.stringify(reparacion) })
        // res.render("edit", {reparacion: reparacion})
    })
})


router.put("/:id", function(req, res){
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
        res.redirect("/reparaciones")
    })
})

router.post("/:id/historial", function(req, res){
    console.log(req.params.id)
    
      
      server.send({
        text: 'Hey howdy',
        from: 'NodeJS',
        to: '<crestr25@gmail.com>',
        cc: '',
        subject: 'Greetings'
      }, function (err, message) {
        console.log(err || message);
      });
    Reparacion.findByIdAndUpdate(req.params.id, {estado : "Esperando Aprobacion"} , function(err,rep){
        if(err){
            console.log(err)
        }    
        res.redirect("/reparaciones")
    })
})

router.post("/:id/terminar", function(req, res){
    console.log(req.params.id)
    Reparacion.findByIdAndUpdate(req.params.id, {estado : "Archivado"} , function(err,rep){
        if(err){
            console.log(err)
        }    
        res.redirect("/reparaciones")
    })
})

router.delete("/:id", function(req, res){
    Reparacion.findByIdAndRemove(req.params.id, function(err){
        if(err) console.log(err)
        res.redirect("/reparaciones")
    })
})

function Serial(num, len){
    var r = "" + num;
    while(r.length < len){
        r = "0" + r;
    }
    return "AB" + r
  
}



module.exports = router;