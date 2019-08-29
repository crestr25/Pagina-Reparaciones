var mongoose = require("mongoose")

var reparacionesSchema = new mongoose.Schema({
    number: String,
    fecha: String,
    empresa: String,
    correo: String,
    telefono: String,
    marca: String,
    referencia: String,
    descripcion: String,
    item: [[{type: String}]],
    estado: { type: String, default: "En Proceso" },
    counter: String
})

module.exports = mongoose.model("Reparacion", reparacionesSchema)
