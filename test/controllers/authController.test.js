// tests/authController.test.js
import request from "supertest"; // Para simular las solicitudes HTTP
import User from "../../src/models/User.js"; // Simular el modelo User
import app from "../../index.js"; // Tu servidor Express
import { dbConnection, disconnectDB } from "../../src/config/database.js";
import jwt from "jsonwebtoken";
import { ethers } from "ethers";
import { v4 as uuidv4 } from "uuid";

// Mock para User (simulando las funciones de mongoose)
jest.mock("../../src/models/User.js");
jest.mock("ethers");
jest.mock("uuid");
jest.mock("jsonwebtoken");

beforeAll(async () => {
  await dbConnection();
});

afterAll(async () => {
  await disconnectDB();
});

describe("Auth Controller - getNonce", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar mocks antes de cada test
  });

  it("debería devolver el nonce de un usuario existente", async () => {
    // Simulamos que el usuario ya existe en la base de datos
    const mockUser = {
      address: "0x89D3FFB70965729928A3F371F51AA53922CaB8c1",
      nonce: 12345,
    };
    User.findOne.mockResolvedValue(mockUser);

    // Simulamos una petición POST al endpoint de getNonce
    const response = await request(app)
      .post("/api/auth/nonce")
      .send({ address: "0x89D3FFB70965729928A3F371F51AA53922CaB8c1" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, status: 200, nonce: 12345 });
  });

  it("debería crear un nuevo usuario si no existe", async () => {
    // Simulamos que el usuario no existe
    User.findOne.mockResolvedValue(null);

    const mockNewUser = {
      address: "0x89D3FFB70965729928A3F371F51AA53922CaB8c1",
      nonce: 67890,
      save: jest.fn().mockResolvedValue(true),
    };

    // Simulamos la creación de un nuevo usuario
    User.mockImplementation(() => mockNewUser);

    const response = await request(app)
      .post("/api/auth/nonce")
      .send({ address: "0x89D3FFB70965729928A3F371F51AA53922CaB8c1" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, status: 200, nonce: 67890 });
    expect(mockNewUser.save).toHaveBeenCalled(); // Aseguramos que se guardó el usuario
  });

  it("debería devolver un error 400 si no se envía la dirección de wallet", async () => {
    const response = await request(app).post("/api/auth/nonce").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      status: 400,
      errors: [
        {
          location: "body",
          msg: "Address is required",
          path: "address",
          type: "field",
        },
        {
          location: "body",
          msg: "Address must be a string",
          path: "address",
          type: "field",
        },
        {
          location: "body",
          msg: "Invalid Ethereum address format",
          path: "address",
          type: "field",
        },
      ],
    });
  });

  it("debería manejar errores de servidor", async () => {
    // Simulamos un error al buscar el usuario
    User.findOne.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/api/auth/nonce")
      .send({ address: "0x89D3FFB70965729928A3F371F51AA53922CaB8c1" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Database error" });
  });
});

describe("Auth Controller - authenticateUser", () => {
  it("debería devolver un error 400 si no se envía la dirección de wallet o la firma", async () => {
    const response = await request(app).post("/api/auth/login").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      ok: false,
      status: 400,
      errors: [
        {
          location: "body",
          msg: "Address is required",
          path: "address",
          type: "field",
        },
        {
          location: "body",
          msg: "Address must be a string",
          path: "address",
          type: "field",
        },
        {
          location: "body",
          msg: "Invalid Ethereum address format",
          path: "address",
          type: "field",
        },
        {
          location: "body",
          msg: "Signature is required",
          path: "signature",
          type: "field",
        },
        {
          location: "body",
          msg: "Signature must be a string",
          path: "signature",
          type: "field",
        },
      ],
    });
  });

  it("debería devolver un error 404 si el usuario no existe", async () => {
    jest.spyOn(User, "findOne").mockResolvedValueOnce(null);

    const response = await request(app).post("/api/auth/login").send({
      address: "0x89D3FFB70965729928A3F371F51AA53922CaB8c2",
      signature: "fake-signature",
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      ok: false,
      status: 404,
      message: "User not found",
    });
  });

  it("debería devolver un error 401 si la firma es inválida", async () => {
    const mockUser = {
      address: "0x89D3FFB70965729928A3F371F51AA53922CaB8c1",
      nonce: 123456,
    };
    jest.spyOn(User, "findOne").mockResolvedValueOnce(mockUser);

    ethers.verifyMessage.mockReturnValueOnce(
      "0x89D3FFB70965729928A3F371F51AA53922CaB8c2"
    ); // Dirección incorrecta

    const response = await request(app).post("/api/auth/login").send({
      address: "0x89D3FFB70965729928A3F371F51AA53922CaB8c1",
      signature: "fake-signature",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      status: 401,
      message: "Invalid signature",
    });
  });

  it("debería autenticar correctamente al usuario y devolver los tokens", async () => {
    const mockUser = {
      address: "0x89D3FFB70965729928A3F371F51AA53922CaB8c1",
      nonce: 123456,
      role: "user",
      save: jest.fn(),
    };

    jest.spyOn(User, "findOne").mockResolvedValueOnce(mockUser);
    ethers.verifyMessage.mockReturnValueOnce(
      "0x89D3FFB70965729928A3F371F51AA53922CaB8c1"
    ); // Dirección correcta

    // Mocks de JWT y UUID
    uuidv4.mockReturnValue("mocked-uuid");
    jwt.sign.mockReturnValueOnce("mocked-access-token"); // Para el access token
    jwt.sign.mockReturnValueOnce("mocked-refresh-token"); // Para el refresh token

    const response = await request(app).post("/api/auth/login").send({
      address: "0x89D3FFB70965729928A3F371F51AA53922CaB8c1",
      signature: "valid-signature",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      accessToken: "mocked-access-token",
      refreshToken: "mocked-refresh-token",
    });
    expect(mockUser.save).toHaveBeenCalled();
  });

  it("debería manejar los errores del servidor", async () => {
    jest
      .spyOn(User, "findOne")
      .mockRejectedValueOnce(new Error("Database error"));

    const response = await request(app).post("/api/auth/login").send({
      address: "0x89D3FFB70965729928A3F371F51AA53922CaB8c1",
      signature: "fake-signature",
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Database error" });
  });
});

describe("Auth Controller - refreshToken", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar mocks antes de cada test
  });
  it("debería devolver un error 400 si no se envía el token de refresco", async () => {
    const response = await request(app).post("/api/auth/refresh").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Refresh token is required",
    });
  });

  it("debería devolver un error 403 si el token de refresco es inválido", async () => {
    // Simulamos que jwt.verify devuelve un error
    jwt.verify.mockImplementationOnce((token, secret, callback) => {
      callback(new Error("Invalid token"), null);
    });

    const response = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: "invalid-token" });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Invalid refresh token",
    });
  });

  it("debería devolver un error 403 si el usuario no existe o el token de refresco no coincide", async () => {
    // Simulamos que jwt.verify devuelve un usuario con una dirección
    jwt.verify.mockImplementationOnce((token, secret, callback) => {
      callback(null, { address: "0x89D3FFB70965729928A3F371F51AA53922CaB8c1" });
    });

    // Simulamos que el usuario no existe en la base de datos
    User.findOne.mockResolvedValueOnce(null);

    const response = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: "valid-token-but-user-not-found" });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Invalid refresh token",
    });
  });

  it("debería devolver un nuevo token de acceso si el token de refresco es válido", async () => {
    const mockUser = {
      address: "0x89D3FFB70965729928A3F371F51AA53922CaB8c1",
      role: "user",
      refreshToken: "valid-refresh-token",
    };

    // Simulamos que jwt.verify devuelve el usuario correcto
    jwt.verify.mockImplementationOnce((token, secret, callback) => {
      callback(null, { address: mockUser.address });
    });

    // Simulamos que el usuario existe y que el token de refresco coincide
    User.findOne.mockResolvedValueOnce(mockUser);

    // Simulamos la creación de un nuevo token de acceso
    jwt.sign.mockReturnValueOnce("new-access-token");

    const response = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: "valid-refresh-token" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      accessToken: "new-access-token",
    });
  });

  it("debería manejar los errores del servidor", async () => {
    console.log("Starting test for server error handling");

    jwt.verify.mockImplementationOnce((token, secret, callback) => {
      callback(null, { address: "" });
    });
    User.findOne.mockRejectedValueOnce(new Error("Database error"));

    const response = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: "valid-refresh-token" });

    console.log("Response status:", response.status);
    console.log("Response body:", response.body);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Database error",
    });
  });
});
