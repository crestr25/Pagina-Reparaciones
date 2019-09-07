var express = require("express");
var router  = express.Router();

router.get("/lista", function(req, res){
    res.render("lista/index")
})

module.exports = router;