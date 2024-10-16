import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

// Configurar dotenv
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ruta para manejar la subida de múltiples imágenes
export const uploadImages = async (req, res) => {
  try {
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

    res.status(200).json({ urls: uploadedImages }); // Devuelve las URLs de las imágenes subidas
  } catch (error) {
    res.status(500).json({ message: "Error uploading images", error });
  }
};
