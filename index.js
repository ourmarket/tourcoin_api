import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { dbConnection } from "./src/config/database.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import authRoutes from "./src/routes/auth.js";
import lockRoutes from "./src/routes/lock.js";
import imagesRoutes from "./src/routes/images.js";
import allianceRoutes from "./src/routes/allianceRoutes.js";
import { apiLimiter } from "./src/middlewares/rateLimit.js";

// Configurar dotenv
config();

// Crear una instancia de express
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet()); // Seguridad adicional
/* app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", // Configurar el origen permitido
    credentials: true, // Permitir el uso de cookies
  })
); */
app.use(
  cors({
    origin: "*", // Configurar el origen permitido
    credentials: true, // Permitir el uso de cookies
  })
);

// ------------Conexión a la base de datos ------------
const connection = async () => {
  await dbConnection();
};
connection();

// -------------Rutas-----------
app.use("/api/auth", authRoutes);
app.use("/api/locks", apiLimiter, lockRoutes);
app.use("/api/alliances", apiLimiter, allianceRoutes);
app.use("/api/images", apiLimiter, imagesRoutes);

// Ruta para manejar errores 404
app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

export default app;
