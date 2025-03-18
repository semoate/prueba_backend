require("dotenv").config(); // Cargar variables de entorno al inicio

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const usersRoutes = require("./routes/users"); // Asegúrate de que la ruta sea correcta

const app = express();

app.use(express.json()); //  Middleware para parsear JSON
app.use(cors()); //  Permitir CORS
app.use("/usuarios", usersRoutes); //  usa la ruta de usuarios

//  Conexion a MongoDB con la variables de entorno ubicada en .env
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" Conectado a MongoDB"))
  .catch((err) => console.error(" Error al conectar a MongoDB:", err));

//  Iniciar el servidor con variable de entorno
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send(" Servidor funcionando!"); // para verificar que el servidor este on en http://localhost:3000/
});
