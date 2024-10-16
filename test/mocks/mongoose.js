// tests/mocks/mongoose.js
const mongoose = {
  model: jest.fn(() => ({
    find: jest.fn().mockResolvedValue([]), // Devuelve un array vacío
    findById: jest.fn().mockResolvedValue(null), // Devuelve null si no se encuentra el ID
    save: jest.fn().mockResolvedValue({
      _id: "mocked_id",
      field1: "mocked_value",
    }), // Simula la creación de un nuevo documento
    findByIdAndUpdate: jest.fn().mockResolvedValue({
      _id: "mocked_id",
      field1: "updated_value",
    }), // Simula una actualización exitosa
    findByIdAndUpdate: jest.fn().mockResolvedValue({ state: false }), // Simula la eliminación de un documento
  })),
};

export default mongoose;
