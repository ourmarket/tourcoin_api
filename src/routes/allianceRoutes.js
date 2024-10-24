import express from "express";
import {
  createAlliance,
  getAlliances,
  getAllianceById,
  updateAlliance,
  deleteAlliance,
  getAlliancesOutstanding,
  searchAlliances,
} from "../controllers/alliance.js";

import { validateAlliance } from "../validators/validateAlliance.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import multer from "multer";

const router = express.Router();

// Configurar almacenamiento en memoria con multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Crear una nueva alianza con validación
router.post(
  "/",
  /*   validateAlliance,
  validateRequest, */
  upload.array("images", 5),
  createAlliance
);

// Obtener todas las alianzas
router.get("/", getAlliances);

// Obtener todas las alianzas destacadas
router.get("/outstanding", getAlliancesOutstanding);

// Buscador de alianzas
router.get("/search", searchAlliances);

// Obtener una alianza por ID
router.get("/:id", getAllianceById);

// Actualizar una alianza por ID con validación
router.put("/:id", validateAlliance, validateRequest, updateAlliance);

// Eliminar una alianza por ID
router.delete("/:id", deleteAlliance);

export default router;
