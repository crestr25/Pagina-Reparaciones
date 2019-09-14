var mongoose = require("mongoose")

var reparacionesSchema = new mongoose.Schema({
    serie: String,
    fecha: String,
    marca: String,
    referencia: String,
    descripcion: String,
    item: [[{type: String}]],
    estado: { type: String, default: "En Proceso" },
    // empresa: {
        
    // }
})

module.exports = mongoose.model("Reparacion", reparacionesSchema)
