import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    address: {
      type: String, // Dirección de la wallet.
      required: true,
      unique: true, // La dirección debe ser única.
      validate: {
        validator: function (v) {
          return /^0x[a-fA-F0-9]{40}$/.test(v); // Validar formato de dirección Ethereum
        },
        message: (props) => `${props.value} is not a valid Ethereum address!`,
      },
    },
    nonce: {
      type: Number, // Nonce para autenticación mediante firma.
      default: () => Math.floor(Math.random() * 1000000), // Nonce aleatorio.
      required: true,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"], // Solo dos roles posibles.
      default: "USER", // Rol por defecto es 'USER'.
    },
    refreshToken: {
      type: String, // Token de refresco JWT.
      default: null, // Valor por defecto es null.
    },
    refreshTokenExpiresAt: {
      type: Date, // Fecha de expiración del token de refresco.
      default: null, // Valor por defecto es null.
    },
    state: {
      type: Boolean,
      default: true, // Indica si el usuario está activo.
    },
  },
  { timestamps: true }
);

// Ocultar el campo '__v' y cualquier dato sensible al serializar el objeto usuario.
UserSchema.methods.toJSON = function () {
  const { __v, ...user } = this.toObject();
  return user;
};

// Método para generar un nuevo nonce aleatorio
UserSchema.methods.generateNewNonce = function () {
  this.nonce = Math.floor(Math.random() * 1000000);
  return this.nonce;
};

export default model("User", UserSchema);
