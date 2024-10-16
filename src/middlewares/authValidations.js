import { check, validationResult } from "express-validator";

// Validación de la dirección de Ethereum
const validateAddress = check("address")
  .exists({ checkFalsy: true })
  .withMessage("Address is required")
  .isString()
  .withMessage("Address must be a string")
  .matches(/^0x[a-fA-F0-9]{40}$/)
  .withMessage("Invalid Ethereum address format");

// Validación de la firma
const validateSignature = check("signature")
  .exists({ checkFalsy: true })
  .withMessage("Signature is required")
  .isString()
  .withMessage("Signature must be a string");

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      status: 400,
      errors: errors.array(),
    });
  }
  next();
};

// Exportar las validaciones y el middleware de errores
export { validateAddress, validateSignature, handleValidationErrors };
