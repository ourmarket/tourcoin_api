import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware para autenticar JWT y manejar el refresco de tokens
export const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  try {
    // Verificar el token de acceso
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // Si el token está expirado, intentamos refrescarlo
      const refreshToken = req.headers["x-refresh-token"];

      if (!refreshToken) return res.sendStatus(403);

      try {
        // Verificar el token de refresco
        const refreshTokenData = jwt.verify(
          refreshToken,
          process.env.JWT_SECRET_REFRESH
        );
        const user = await User.findOne({ address: refreshTokenData.address });

        if (!user || user.refreshToken !== refreshToken)
          return res.sendStatus(403);

        // Generar un nuevo token de acceso
        const newAccessToken = jwt.sign(
          { address: user.address, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "15m" } // Nueva expiración del token de acceso
        );

        res.setHeader("x-access-token", newAccessToken); // Opcional: Enviar el nuevo token de acceso en la respuesta
        req.user = refreshTokenData; // Usar datos del token de refresco
        return next();
      } catch (err) {
        return res.sendStatus(403);
      }
    } else {
      return res.sendStatus(403);
    }
  }
};
