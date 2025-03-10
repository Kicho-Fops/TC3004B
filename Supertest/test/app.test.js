const express = require("express");
const request = require("supertest");
const app = express();
const alumno = require("../routes/alumno");

app.use(express.json());
app.use("/", alumno);

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

test("Verifica que se puede actualizar alumno /PUT", async () => {
  const { body, statusCode } = await request(app).put("/alumno").send({
    id: 1,
    nombre: "Nick",
    paterno: "Piberius",
    materno: "Wilde",
    nacimiento: "1992-02-29",
  });
  expect(statusCode).toBe(200);

  // Verificar que el primer ID es el que acabamos de modificar
  const response = await request(app).get(`/alumno/1`);
  expect(response.body).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: 1,
        nombre: "Nick",
        paterno: "Piberius",
        materno: "Wilde",
        nacimiento: "1992-02-29",
      }),
    ])
  );
});

test("Verifica que se puede elminar alumno /DELETE", async () =>{

  const { body, statusCode } = await request(app).delete("/alumno/1");
  expect(statusCode).toBe(200);

})


test("Verifica como reacciona la API sin los datos correspondientes al crear alumno", async () =>{

  const { body, statusCode } = await request(app).post("/alumno").send({
    nombre: "Anges",
    paterno: "Jimenez",
    nacimiento: "2024-02-29",
  });
  console.log(body);
  expect(statusCode).toBe(400);

})

