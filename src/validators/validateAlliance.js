import { body } from "express-validator";

// Validación para crear o actualizar una Alianza
export const validateAlliance = [
  body("allianceId")
    .isUUID(4)
    .withMessage("El ID de la alianza debe ser un UUID válido (v4)")
    .notEmpty()
    .withMessage("El ID de la alianza es requerido"),

  body("localization")
    .isObject()
    .withMessage("Localization debe ser un objeto"),

  body("localization.es.title")
    .isString()
    .withMessage("El título en español debe ser una cadena de texto")
    .notEmpty()
    .withMessage("El título en español es requerido"),

  body("localization.en.title")
    .isString()
    .withMessage("El título en inglés debe ser una cadena de texto")
    .notEmpty()
    .withMessage("El título en inglés es requerido"),

  body("localization.pt.title")
    .isString()
    .withMessage("El título en portugués debe ser una cadena de texto")
    .notEmpty()
    .withMessage("El título en portugués es requerido"),

  body("lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("La latitud debe estar entre -90 y 90")
    .notEmpty()
    .withMessage("La latitud es requerida"),

  body("lng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("La longitud debe estar entre -180 y 180")
    .notEmpty()
    .withMessage("La longitud es requerida"),

  body("category")
    .isString()
    .withMessage("La categoría debe ser una cadena de texto")
    .notEmpty()
    .withMessage("La categoría es requerida"),

  body("state")
    .optional()
    .isBoolean()
    .withMessage("El estado debe ser un valor booleano"),

  body("images")
    .optional()
    .isArray()
    .withMessage("Las imágenes deben ser un arreglo de URLs")
    .custom((images) => {
      images.forEach((image) => {
        if (typeof image !== "string") {
          throw new Error("Cada imagen debe ser una URL válida");
        }
      });
      return true;
    }),
];
