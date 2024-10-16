// Middleware para verificar el rol del usuario
export const authorizeRole = (roles) => {
  return (req, res, next) => {
    // Verificar si req.user está definido (asegurarse de que el usuario está autenticado)
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user data found" });
    }

    // Verificar si el rol del usuario está en la lista de roles permitidos
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient permissions" });
    }

    next(); // Si todo está bien, continuar
  };
};
