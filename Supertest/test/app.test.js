const express = require("express");
const request = require("supertest");
const app = express();
const alumno = require("../routes/alumno");

app.use(express.json());
app.use("/", alumno);

test("GET /alumno funciona y devuelve alumnos con estructura válida", async () => {
  const { body, statusCode } = await request(app).get("/alumno");

  expect(body).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        nombre: expect.any(String),
        paterno: expect.any(String),
        materno: expect.any(String),
        nacimiento: expect.any(String),
      }),
    ])
  );

  expect(new Date(body.nacimiento)).toBeInstanceOf(Date);
  expect(statusCode).toBe(200);
});

test("POST /alumno funciona y almacena un registro", async () => {
  const { body, statusCode } = await request(app).post("/alumno").send({
    nombre: "Desiree",
    paterno: "Espinoza",
    materno: "Contreras",
    nacimiento: "2024-02-29",
  });
  expect(statusCode).toBe(200);
  expect(body.affectedRows).toBe(1);
});

test("Verifica que se inserta un alumno y se puede obtener", async () => {
  const { body, statusCode } = await request(app).post("/alumno").send({
    nombre: "Hugo",
    paterno: "Alejandres",
    materno: "Sánchez",
    nacimiento: "2024-02-29",
  });
  console.log(body);
  expect(statusCode).toBe(200);
  expect(body.affectedRows).toBe(1);
  const response = await request(app).get(`/alumno/${body.insertId}`);
  expect(response.body).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: body.insertId,
        nombre: expect.any(String),
        paterno: expect.any(String),
        materno: expect.any(String),
        nacimiento: expect.any(String),
      }),
    ])
  );
  expect(new Date(body.nacimiento)).toBeInstanceOf(Date);
});
