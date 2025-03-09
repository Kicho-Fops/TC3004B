const request = require('supertest');
const express = require('express');


test("GET /users funciona y devuelve usuarios con estructura válida", async () => {
  const { body, statusCode } = await request(
    "https://jsonplaceholder.typicode.com"
  ).get("/users");
  expect(body).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
      }),
    ])
  );
  body.forEach((item) => {
    expect(item.email).toMatch(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    );
  });
});
