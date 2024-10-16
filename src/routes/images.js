import { Router } from "express";
import { uploadImages } from "../controllers/images.js";
import { authenticateJWT } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import multer from "multer";

const routes = Router();

// Configurar almacenamiento en memoria con multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * {{url}}/api/images
 */

// Subir imágenes - Solo ADMIN
routes.post(
  "/upload",
  /*  authenticateJWT, */
  /* authorizeRole(["ADMIN"]), */
  upload.array("images", 5),
  uploadImages
);

export default routes;
