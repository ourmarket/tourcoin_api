import Alliance from "../models/alliances.js";
import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

// Configurar dotenv
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Crear una nueva alianza
export const createAlliance = async (req, res) => {
  try {
    console.log(req.files);
    console.log(req.body);
    // Verificar si hay archivos para subir
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No se subieron archivos." });
    }

    // Subir imágenes a Cloudinary
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        // Subir cada archivo desde el buffer a Cloudinary
        const stream = cloudinary.uploader.upload_stream(
          { folder: "tourCoin" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url); // Devuelve la URL de la imagen subida
            }
          }
        );
        stream.end(file.buffer); // Sube el archivo desde el buffer
      });
    });

    // Esperar a que todas las imágenes se suban
    const uploadedImages = await Promise.all(uploadPromises);

    // Crear una nueva alianza con los datos de req.body y las URLs de las imágenes
    const data = JSON.parse(req.body.data);

    const newAlliance = new Alliance({
      ...data,
      images: uploadedImages,
    });

    // Guardar la nueva alianza en la base de datos
    const savedAlliance = await newAlliance.save();

    // Enviar la alianza guardada como respuesta
    res.status(201).json({
      ok: true,
      status: 201,
      alliance: savedAlliance,
    });
  } catch (error) {
    console.error("Error creando la alianza:", error);
    res.status(400).json({
      ok: false,
      status: 400,
      message: error.message,
    });
  }
};

// Obtener todas las alianzas
export const getAlliances = async (req, res) => {
  try {
    const alliances = await Alliance.find();
    res.status(200).json(alliances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una alianza por ID
export const getAllianceById = async (req, res) => {
  try {
    const alliance = await Alliance.findById(req.params.id);
    if (!alliance) {
      return res.status(404).json({ message: "Alianza no encontrada" });
    }
    res.status(200).json(alliance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una alianza por ID
export const updateAlliance = async (req, res) => {
  try {
    const updatedAlliance = await Alliance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAlliance) {
      return res.status(404).json({ message: "Alianza no encontrada" });
    }
    res.status(200).json(updatedAlliance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar una alianza por ID
export const deleteAlliance = async (req, res) => {
  try {
    const deletedAlliance = await Alliance.findByIdAndUpdate(
      req.params.id,
      { state: false },
      { new: true }
    );
    if (!deletedAlliance) {
      return res.status(404).json({ message: "Alianza no encontrada" });
    }
    res.status(200).json({ message: "Alianza eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
