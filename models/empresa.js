var mongoose = require("mongoose");

var empresaSchema = new mongoose.Schema({
    nit:       String,
    nombre:    String,
    correo:    String,
    telefono:  String,
    direccion: String,
    reparaciones: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reparacion"
        }
    ]

})

module.exports = mongoose.model("Empresa", empresaSchema);