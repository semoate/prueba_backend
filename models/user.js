const mongoose = require("mongoose");

const DireccionSchema = new mongoose.Schema({
  calle: { type: String, required: true },
  ciudad: { type: String, required: true },
  pais: { type: String, required: true },
  codigo_postal: { type: String, required: true },
});

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: [true, "el nombre es requerido"] },
  email: {
    type: String,
    required: [true, "el correo es requerido"],
    unique: true, // No permite emails duplicados
    match: [/.+@.+\..+/, "el correo no es valido"], //  Validación del email
  },
  edad: { type: Number, min: 0 }, // No permite edades negativas
  fecha_creacion: { type: Date, default: Date.now },
  direcciones: {
    type: [DireccionSchema], // Valida que sea un array de objetos con el esquema correcto
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: "Debes proporcionar al menos una dirección válida.",
    },
  },
});

module.exports = mongoose.model("User", UsuarioSchema);
