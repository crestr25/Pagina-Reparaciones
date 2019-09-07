var express          = require("express");
var passport         = require("passport");
var LocalStrategy    = require("passport-local");
var bodyParser       = require("body-parser");
var methodOverride   = require("method-override");
var mongoose         = require("mongoose"); 
var app              = express();
var port             = 3000;
var Reparacion       = require("./models/reparacion")
var Counter          = require("./models/counter")
var User             = require("./models/user")

var reparacionRoutes = require("./routes/reparacion")
var indexRoutes      = require("./routes/index")

mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb://localhost:27017/reparaciones",{ useFindAndModify: false })


app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))


//Passport
app.use(require("express-session")({
    secret: "Alm4c3nB0mb452019*",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

app.use(indexRoutes);
app.use("/reparaciones", reparacionRoutes);

// var c = new Counter({})
// c.save()

app.get("/ensayo", function(req, res){
    res.render("reparaciones/ensayo")
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

// PORT LISTENING
app.listen(port, function(){
    console.log("Magic Happens on port " + port)
})



