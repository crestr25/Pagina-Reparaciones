var express = require("express");
var router = express.Router();
var passport = require("passport");
var mongoose = require("mongoose");
var User = require("../models/user");
var Empresa = require("../models/empresa");

router.get("/", function (req, res) {
    res.render("landing")
});

router.get("/perfil", function (req, res) {
    console.log(req)
    res.render("profile");
});

router.post("/perfil", function (req, res) {

    var r1 = new Empresa({
        nit: req.body.nit,
        nombre: req.body.nombre.toLowerCase(),
        correo: req.body.correo.toLowerCase(),
        telefono: req.body.telefono,
        direccion: req.body.direccion.toLowerCase()
    })
    // console.log(r1)

    var rep = Empresa.find({ nombre: r1.nombre }, function (err, i) {
        if (err) console.log(err)
        if (i.length == 0) {
            r1.save(function (err) {
                console.log(err)
            })
        } else {
            console.log("si hay")
        }
    })

    res.redirect("/perfil")
});

//AUTHENTICATION ROUTES

router.get("/register", function (req, res) {
    res.render("register");
})

router.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err)
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/")
        })
    })
})

router.get("/login", function (req, res) {
    res.render("login")
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/reparaciones",
    failureRedirect: "/login"
}), function () { })

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/")
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}

module.exports = router;