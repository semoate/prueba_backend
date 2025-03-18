const express = require("express");
const mongoose = require("mongoose");
const Usuario = require("../models/user");
const router = express.Router();

/**
 *  Función de validación de usuario
 */
const validarUsuario = (data) => {
  const errores = [];

  if (!data.nombre) errores.push("El campo 'nombre' es obligatorio.");
  if (!data.email) errores.push("El campo 'email' es obligatorio.");
  if (
    !data.direcciones ||
    !Array.isArray(data.direcciones) ||
    data.direcciones.length === 0
  ) {
    errores.push(
      "El campo 'direcciones' debe ser un array con al menos una dirección."
    );
  }

  return errores;
};

/**
 *  POST /usuarios → Crea un usuario con validaciones.
 */
router.post("/", async (req, res) => {
  try {
    const errores = validarUsuario(req.body);
    if (errores.length > 0)
      return res.status(400).json({ success: false, error: errores });

    // Validación de email único
    const usuarioExistente = await Usuario.findOne({ email: req.body.email });
    if (usuarioExistente) {
      return res
        .status(400)
        .json({ success: false, error: "El email ya está registrado" });
    }

    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.status(201).json({ success: true, data: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 *  GET /usuarios → Obtiene usuarios con paginación.
 */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const usuarios = await Usuario.find().skip(skip).limit(limit);
    const totalUsuarios = await Usuario.countDocuments();

    res.json({
      success: true,
      totalUsuarios,
      totalPaginas: Math.ceil(totalUsuarios / limit),
      paginaActual: page,
      data: usuarios,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
/**
 *  GET /usuarios/buscar?ciudad=Lima → Busca usuarios por ciudad en su dirección.
 */
router.get("/buscar", async (req, res) => {
  try {
    const { ciudad } = req.query;
    if (!ciudad) {
      return res.status(400).json({
        success: false,
        error: "Debes proporcionar una ciudad para buscar.",
      });
    }

    const ciudadNormalizada =
      ciudad.charAt(0).toUpperCase() + ciudad.slice(1).toLowerCase();
    const usuarios = await Usuario.find({
      "direcciones.ciudad": new RegExp(`^${ciudadNormalizada}$`, "i"),
    });

    if (usuarios.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No se encontraron usuarios en esa ciudad.",
      });
    }

    res.json({ success: true, data: usuarios });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 *  GET /usuarios/:id → Obtiene un usuario por ID.
 */
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, error: "ID de usuario inválido" });
    }

    const usuario = await Usuario.findById(req.params.id);
    if (!usuario)
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });

    res.json({ success: true, data: usuario });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 *  PUT /usuarios/:id → Actualiza un usuario por su ID con validaciones.
 */
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, error: "ID de usuario inválido" });
    }

    const errores = validarUsuario(req.body);
    if (errores.length > 0)
      return res.status(400).json({ success: false, error: errores });

    const usuarioExistente = await Usuario.findById(req.params.id);
    if (!usuarioExistente)
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });

    // Verificar si el email se está cambiando y ya existe
    if (req.body.email !== usuarioExistente.email) {
      const emailExistente = await Usuario.findOne({ email: req.body.email });
      if (emailExistente)
        return res
          .status(400)
          .json({ success: false, error: "El email ya está registrado" });
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({ success: true, data: usuarioActualizado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 *  DELETE /usuarios/:id → Elimina un usuario por su ID.
 */
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, error: "ID de usuario inválido" });
    }

    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado)
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });

    res.json({ success: true, message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
