import { Router } from "express";
import {
  getLocks,
  getLock,
  postLock,
  putLock,
  deleteLock,
} from "../controllers/lock.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { validateLock } from "../middlewares/validateLock.js"; // Middleware de validación
import { authenticateJWT } from "../middlewares/authenticateUser.js";

const lockRoutes = Router();

/**
 * {{url}}/api/lock
 */

// Obtener todas las Locks - Solo ADMIN
lockRoutes.get("/", authenticateJWT, authorizeRole(["ADMIN"]), getLocks);

// Obtener una Lock por id - Solo usuarios autenticados (USER o ADMIN)
lockRoutes.get(
  "/:id",
  authenticateJWT,
  authorizeRole(["USER", "ADMIN"]),
  getLock
);

// Crear una nueva Lock - Solo usuarios autenticados (USER o ADMIN) con validación
lockRoutes.post(
  "/",
  authenticateJWT,
  authorizeRole(["USER", "ADMIN"]),
  validateLock, // Validación de datos antes de la creación
  postLock
);

// Actualizar Lock - Solo usuarios autenticados (USER o ADMIN) con validación
lockRoutes.put(
  "/:id",
  authenticateJWT,
  authorizeRole(["USER", "ADMIN"]),
  validateLock, // Validación de datos antes de la actualización
  putLock
);

// Eliminar una Lock - Solo ADMIN
lockRoutes.delete(
  "/:id",
  authenticateJWT,
  authorizeRole(["ADMIN"]),
  deleteLock
);

export default lockRoutes;
