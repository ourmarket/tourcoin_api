import { check, validationResult } from "express-validator";

// Validaciones para crear y actualizar bloqueos
const validateLock = [
  check("lockId")
    .isNumeric()
    .withMessage("El lockId debe ser un número.")
    .not()
    .isEmpty()
    .withMessage("El lockId es obligatorio."),

  check("userWallet")
    .isString()
    .withMessage("La wallet debe ser una cadena de texto.")
    .isLength({ min: 42, max: 42 })
    .withMessage("La dirección de wallet debe tener 42 caracteres.")
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage("Dirección de wallet no válida."),

  check("lockAddress")
    .isString()
    .withMessage("La dirección del contrato debe ser una cadena de texto.")
    .isLength({ min: 42, max: 42 })
    .withMessage("La dirección del contrato debe tener 42 caracteres.")
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage("Dirección de contrato no válida."),

  check("amount")
    .isFloat({ gt: 0 })
    .withMessage("La cantidad debe ser mayor a 0."),

  check("interest")
    .isFloat({ gt: 0 })
    .withMessage("El interés debe ser mayor a 0."),

  check("durationText")
    .isString()
    .withMessage("El texto de duración debe ser una cadena de texto.")
    .not()
    .isEmpty()
    .withMessage("El texto de duración no puede estar vacío."),

  check("durationCode")
    .isNumeric()
    .withMessage("El código de duración debe ser un número.")
    .not()
    .isEmpty()
    .withMessage("El código de duración es obligatorio."),

  check("unlockDate")
    .isISO8601()
    .toDate()
    .withMessage("La fecha de desbloqueo debe ser una fecha válida.")
    .custom((value) => value > new Date())
    .withMessage("La fecha de desbloqueo debe ser futura."),

  // Middleware para manejar los errores
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export { validateLock };
