/* import mongoose from "mongoose";

const { Schema, model } = mongoose;

const LockSchema = new Schema(
  {
    lockId: { type: Number },
    userWallet: { type: String },
    lockAddress: { type: String },
    amount: { type: Number },
    interest: { type: Number },
    durationText: { type: String },
    durationCode: { type: Number },
    unlockDate: { type: Date },
    state: { type: Boolean, default: true },
  },
  { timestamps: true }
);

LockSchema.methods.toJSON = function () {
  const { __v, ...lock } = this.toObject();
  return lock;
};

export default model("Lock", LockSchema); */
import mongoose from "mongoose";
import validator from "validator"; // Paquete para validación adicional

const { Schema, model } = mongoose;

const LockSchema = new Schema(
  {
    lockId: {
      type: Number,
      required: true,
      min: [1, "El lockId debe ser un número positivo."],
    },
    userWallet: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^0x[a-fA-F0-9]{40}$/.test(v); // Formato de dirección Ethereum
        },
        message: (props) =>
          `${props.value} no es una dirección válida de wallet.`,
      },
    },
    lockAddress: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^0x[a-fA-F0-9]{40}$/.test(v); // Validar formato de dirección Ethereum
        },
        message: (props) =>
          `${props.value} no es una dirección válida de contrato.`,
      },
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "El valor del monto debe ser mayor o igual a 0."],
    },
    interest: {
      type: Number,
      required: true,
      min: [0, "El interés debe ser un número positivo."],
    },
    durationText: {
      type: String,
      required: true,
      trim: true, // Elimina espacios al inicio y al final
      validate: {
        validator: function (v) {
          return validator.isLength(v, { min: 1 });
        },
        message: "La duración no puede estar vacía.",
      },
    },
    durationCode: {
      type: Number,
      required: true,
      min: [1, "El código de duración debe ser un número positivo."],
    },
    unlockDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return v > new Date(); // La fecha de desbloqueo debe ser futura
        },
        message: "La fecha de desbloqueo debe ser futura.",
      },
    },
    state: { type: Boolean, default: true },
  },
  { timestamps: true }
);

LockSchema.methods.toJSON = function () {
  const { __v, ...lock } = this.toObject();
  return lock;
};

export default model("Lock", LockSchema);
