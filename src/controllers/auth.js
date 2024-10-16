import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ethers } from "ethers";
import { v4 as uuidv4 } from "uuid";

export const getNonce = async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ message: "Wallet address is required" });
  }

  try {
    // Buscar el usuario por su dirección de wallet
    let user = await User.findOne({ address });

    // Si el usuario no existe, crear uno nuevo
    if (!user) {
      user = new User({ address });
      await user.save();
    }

    // Enviar el nonce para que el usuario lo firme
    return res.status(200).json({ ok: true, status: 200, nonce: user.nonce });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const authenticateUser = async (req, res) => {
  const { address, signature } = req.body;

  if (!address || !signature) {
    return res.status(400).json({
      ok: false,
      status: 400,
      message: "Address and signature are required",
    });
  }

  try {
    // Buscar el usuario por su dirección
    const user = await User.findOne({ address });

    if (!user) {
      return res
        .status(404)
        .json({ ok: false, status: 404, message: "User not found" });
    }

    // El mensaje que el usuario debe firmar es el nonce
    const message = `Nonce: ${user.nonce}`;

    // Verificar la firma usando ethers.js
    const recoveredAddress = ethers.verifyMessage(message, signature);

    // Si la dirección recuperada no coincide, la autenticación falla
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res
        .status(401)
        .json({ ok: false, status: 401, message: "Invalid signature" });
    }

    // Generar un nuevo nonce para la próxima autenticación
    user.nonce = Math.floor(Math.random() * 1000000);
    // Generar un nuevo token de refresco
    const newRefreshToken = uuidv4();
    user.refreshToken = newRefreshToken;
    user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expira en 7 días
    await user.save();

    // Generar un token de acceso JWT con una expiración corta (por ejemplo, 15 minutos)
    const accessToken = jwt.sign(
      { address: user.address, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Token de acceso expira en 15 minutos
    );

    // Generar un token JWT de refresco con una expiración más larga (por ejemplo, 7 días)
    const refreshToken = jwt.sign(
      { address: user.address },
      process.env.JWT_SECRET_REFRESH,
      { expiresIn: "7d" } // Token de refresco expira en 7 días
    );

    // Devolver el token JWT de acceso y el token JWT de refresco al cliente
    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    console.log("No refresh token provided");
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    console.log("Verifying refresh token");
    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESH,
      async (err, user) => {
        if (err) {
          console.log("Invalid refresh token");
          return res.status(403).json({ message: "Invalid refresh token" });
        }
        try {
          console.log("Found user address:", user.address);

          const foundUser = await User.findOne({ address: user.address });
          console.log("Found user:", foundUser);

          if (!foundUser || foundUser.refreshToken !== refreshToken) {
            console.log("Invalid refresh token or user not found");
            return res.status(403).json({ message: "Invalid refresh token" });
          }

          const newAccessToken = jwt.sign(
            { address: foundUser.address, role: foundUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
          );

          res.status(200).json({ accessToken: newAccessToken });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: error.message });
        }
      }
    );
  } catch (error) {
    console.log(error);
    console.log("Server error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
