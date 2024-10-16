import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limitar a 100 peticiones por IP
  message: "Too many requests from this IP, please try again later.",
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 30, // Limitar a 5 intentos de inicio de sesión por IP
  message: "Too many login attempts from this IP, please try again later.",
});
