/* process.env.NODE_ENV = "test";
import chai, { expect, use } from "chai";
import sinon from "sinon";
import chaiHttp from "chai-http";
import app from "../index.js";
import Lock from "../src/models/lock.js";

chai.use(chaiHttp);

describe("Lock Controller", () => {
  let lockStub;

  beforeEach(() => {
    lockStub = sinon.stub(Lock, "find");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("GET /api/locks", () => {
    it("Debería obtener una lista de locks", (done) => {
      const fakeLocks = [
        { id: 1, name: "Lock 1" },
        { id: 2, name: "Lock 2" },
      ];
      lockStub.returns(fakeLocks);

      chai
        .request(app)
        .get("/api/locks")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.ok).to.be.true;
          expect(res.body.data.locks).to.be.an("array").that.has.lengthOf(2);
          done();
        });
    });

    it("Debería manejar errores de servidor", (done) => {
      lockStub.throws(new Error("Error en el servidor"));

      chai
        .request(app)
        .get("/api/locks")
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.ok).to.be.false;
          expect(res.body.msg).to.equal("Error en el servidor");
          done();
        });
    });
  });

  describe("GET /api/locks/:id", () => {
    it("Debería obtener un lock por ID", (done) => {
      const fakeLock = { id: 1, name: "Lock 1" };
      sinon.stub(Lock, "findById").returns(fakeLock);

      chai
        .request(app)
        .get("/api/locks/1")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.ok).to.be.true;
          expect(res.body.data.lock).to.be.an("object");
          expect(res.body.data.lock.name).to.equal("Lock 1");
          done();
        });
    });

    it("Debería manejar errores de servidor al obtener un lock por ID", (done) => {
      sinon.stub(Lock, "findById").throws(new Error("Error al obtener lock"));

      chai
        .request(app)
        .get("/api/locks/1")
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.ok).to.be.false;
          expect(res.body.msg).to.equal("Error al obtener lock");
          done();
        });
    });
  });

  describe("POST /api/locks", () => {
    it("Debería crear un nuevo lock", (done) => {
      const fakeLock = { id: 1, name: "Nuevo Lock" };
      sinon.stub(Lock.prototype, "save").returns(fakeLock);

      chai
        .request(app)
        .post("/api/locks")
        .send({ name: "Nuevo Lock" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.ok).to.be.true;
          expect(res.body.data.lock).to.be.an("object");
          expect(res.body.data.lock.name).to.equal("Nuevo Lock");
          done();
        });
    });

    it("Debería manejar errores al crear un lock", (done) => {
      sinon.stub(Lock.prototype, "save").throws(new Error("Error al guardar"));

      chai
        .request(app)
        .post("/api/locks")
        .send({ name: "Nuevo Lock" })
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.ok).to.be.false;
          expect(res.body.msg).to.equal("Error al guardar");
          done();
        });
    });
  });

  describe("PUT /api/locks/:id", () => {
    it("Debería actualizar un lock", (done) => {
      const fakeLock = { id: 1, name: "Lock Actualizado" };
      sinon.stub(Lock, "findByIdAndUpdate").returns(fakeLock);

      chai
        .request(app)
        .put("/api/locks/1")
        .send({ name: "Lock Actualizado" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.ok).to.be.true;
          expect(res.body.data.lock).to.be.an("object");
          expect(res.body.data.lock.name).to.equal("Lock Actualizado");
          done();
        });
    });

    it("Debería manejar errores al actualizar un lock", (done) => {
      sinon
        .stub(Lock, "findByIdAndUpdate")
        .throws(new Error("Error al actualizar"));

      chai
        .request(app)
        .put("/api/locks/1")
        .send({ name: "Lock Actualizado" })
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.ok).to.be.false;
          expect(res.body.msg).to.equal("Error al actualizar");
          done();
        });
    });
  });

  describe("DELETE /api/locks/:id", () => {
    it("Debería eliminar (desactivar) un lock", (done) => {
      sinon.stub(Lock, "findByIdAndUpdate").returns({ id: 1, state: false });

      chai
        .request(app)
        .delete("/api/locks/1")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.ok).to.be.true;
          expect(res.body.msg).to.equal("Delete Lock");
          done();
        });
    });

    it("Debería manejar errores al eliminar un lock", (done) => {
      sinon
        .stub(Lock, "findByIdAndUpdate")
        .throws(new Error("Error al eliminar"));

      chai
        .request(app)
        .delete("/api/locks/1")
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.ok).to.be.false;
          expect(res.body.msg).to.equal("Error al eliminar");
          done();
        });
    });
  });
});
 */

// Importar dependencias
import request from "supertest";
import mongoose from "mongoose";
import app from "../../index.js"; // Asegúrate de usar la ruta correcta a tu archivo principal

jest.mock("mongoose", () => {
  return {
    connect: jest.fn().mockResolvedValue(true), // Mockea el método connect para simular la conexión exitosa
    Schema: jest.fn(() => ({
      methods: {},
    })),
    model: jest.fn(() => ({
      find: jest.fn().mockResolvedValue([{ lockId: 1, userWallet: "0x123" }]),
      findById: jest.fn().mockResolvedValue({ lockId: 1, userWallet: "0x123" }),
      create: jest
        .fn()
        .mockResolvedValue({ lockId: 2, userWallet: "0x123546" }),
      findByIdAndUpdate: jest
        .fn()
        .mockResolvedValue({ lockId: 1, userWallet: "0x123" }),
      findByIdAndDelete: jest
        .fn()
        .mockResolvedValue({ lockId: 1, userWallet: "0x123" }),
    })),
  };
});

describe("Lock Controller", () => {
  it("Debería devolver un array de locks", async () => {
    const response = await request(app).get("/api/locks");

    expect(response.status).toBe(200);
    expect(response.body.data.locks).toHaveLength(1);
    expect(response.body.data.locks[0].userWallet).toBe("0x123");
  });

  it("Debería devolver un lock por id", async () => {
    const response = await request(app).get("/api/locks/1");
    expect(response.status).toBe(200);
    expect(response.body.data.lock.userWallet).toBe("0x123");
  });

  it("Debería crear un nuevo lock", async () => {
    const response = await request(app).post("/api/locks").send({
      lockId: 2,
      userWallet: "0x123546",
    });

    expect(response.status).toBe(200);
    expect(response.body.data.lock.userWallet).toBe("0x123546");
  });

  it("Debería actualizar un lock por id", async () => {
    const response = await request(app).put("/api/locks/1").send({
      userWallet: "Updated Lock",
    });
    expect(response.status).toBe(200);
    expect(response.body.data.lock.userWallet).toBe("Test Lock Updated");
  });

  it("Debería eliminar un lock por id", async () => {
    const response = await request(app).delete("/api/locks/1");
    expect(response.status).toBe(200);
    expect(response.body.msg).toBe("Delete Lock");
  });
});
