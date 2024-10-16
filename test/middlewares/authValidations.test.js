import {
  validateAddress,
  validateSignature,
  handleValidationErrors,
} from "../../src/middlewares/authValidations.js";
import request from "supertest";
import express from "express";

const app = express();
app.use(express.json());

app.post(
  "/test",
  validateAddress,
  validateSignature,
  handleValidationErrors,
  (req, res) => {
    res
      .status(200)
      .json({ ok: true, status: 200, message: "Validation passed" });
  }
);

describe("Middleware Validation Tests", () => {
  it("should return 400 if address is missing", async () => {
    const response = await request(app).post("/test").send({
      signature:
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
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
      ])
    );
  });

  it("should return 400 if address is invalid", async () => {
    const response = await request(app).post("/test").send({
      address: "invalid_address",
      signature:
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        {
          location: "body",
          msg: "Invalid Ethereum address format",
          path: "address",
          type: "field",
          value: "invalid_address",
        },
      ])
    );
  });

  it("should return 400 if signature is missing", async () => {
    const response = await request(app)
      .post("/test")
      .send({ address: "0x1234567890abcdef1234567890abcdef12345678" });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
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
      ])
    );
  });

  it("should pass validation if both address and signature are valid", async () => {
    const response = await request(app).post("/test").send({
      address: "0x1234567890abcdef1234567890abcdef12345678",
      signature:
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ok: true,
      status: 200,
      message: "Validation passed",
    });
  });
});
