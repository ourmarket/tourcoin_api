import { Router } from "express";
import {
  getNonce,
  authenticateUser,
  refreshToken,
} from "../controllers/auth.js";
import {
  validateAddress,
  validateSignature,
  handleValidationErrors,
} from "../middlewares/authValidations.js";
import { loginLimiter } from "../middlewares/rateLimit.js";

const authRoutes = Router();

/**
 * {{url}}/api/auth
 */

// Solicitar el nonce para firmar
authRoutes.post(
  "/nonce",
  validateAddress, // Validar que la dirección sea correcta
  handleValidationErrors, // Manejar errores de validación
  getNonce
);

// Autenticar usuario y generar JWT (incluyendo tokens de acceso y refresco)
authRoutes.post(
  "/login",
  [loginLimiter, validateAddress, validateSignature], // Validar la dirección y la firma
  handleValidationErrors, // Manejar errores de validación
  authenticateUser
);

// Refrescar el token de acceso usando un token de refresco válido
authRoutes.post("/refresh", refreshToken);

export default authRoutes;
