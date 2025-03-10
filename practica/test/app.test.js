// health test

const Todo = require("./../models/Todo");

const request = require("supertest");
const app = require("../app");

describe("Pruebas de la API", () => {
  test("GET /health debería devolver estado 200", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  test("POST /api/todos crea correctamente una nueva tarea con titulo valido", async () => {

    const response = await request(app).post("/api/todos/").send({
        title: "Nueva tarea2"
    })
    console.log(response.status)
    console.log(response.body)
    expect(response.status).toBe(201)
  })

  test("POST /api/todos lanza error una nueva tarea sin titulo", async () => {
    const response = await request(app).post("/api/todos/").send({});
    console.log(response.status);
    console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "El título es obligatorio" });
  });

  // https://medium.com/@adammalej/unit-tests-in-jest-with-supertest-and-mongodb-e4d56e918ce8
  test("GET Probar la obtencion de todas las tareas", async () => {
    const response = await request(app).get("/api/todos/");

    const body = response.body;
    console.log(body);

    expect(response.statusCode).toBe(200);

    // console.log(response)

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String),
          title: expect.any(String), // Accepts any title
          completed: expect.any(Boolean),
          createdAt: expect.any(String),
          __v: expect.any(Number),
          ...(response.body.description && { description: expect.any(String) }),
        }),
      ])
    );
  });

  test("GET tarea por ID", async () => {
    // Probamos con id 1
    const response = await request(app).post("/api/todos/").send({
      title: "Nueva tarea3",
      description: "Orales",
    });
    console.log(response.status);
    console.log(response.body);
    expect(response.status).toBe(201);
    id = response.body._id;

    const response2 = await request(app).get(`/api/todos/${id}`);

    expect(response2.statusCode).toBe(200);

    expect(response2.body).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        title: expect.any(String), // Accepts any title
        completed: expect.any(Boolean),
        createdAt: expect.any(String),
        __v: expect.any(Number),
        ...(response2.body.description && { description: expect.any(String) }),
      })
    );
  });

  test("GET error por tarea con Id invalido", async () => {
    const response2 = await request(app).get(`/api/todos/1`);

    expect(response2.statusCode).toBe(500);
    //expect(response2.body).toBe( {error: 'Cast to ObjectId failed for value "1" (type string) at path "_id" for model "Todo"'} )
    
  })


//   test("15. GET 404 por id no existente", async () => { // Este no se como hacerlo
//     const response2 = await request(app).get(`/api/todos/${" "}`);

//     console.log(response2.body)

//     expect(response2.statusCode).toBe(404);
//     //expect(response2.body).toBe( {error: 'Cast to ObjectId failed for value "1" (type string) at path "_id" for model "Todo"'} )
    
//   })
  
  test("PUT /api/todos/:id actualiza correctamente una tarea existente.", async () => {

    const response = await request(app).post("/api/todos/").send({
      title: "Nueva tarea4",
      description: "Orales",
    });
    console.log(response.status);
    console.log(response.body);
    expect(response.status).toBe(201);
    id = response.body._id;

    const response2 = await request(app).put(`/api/todos/${id}`).send({
      title: "tarea cambiada",
      description: "Cambiamos la tarea y la completamos",
      completed: true
    })

    expect(response2.statusCode).toBe(200);

    id2 = response2.body._id;

    const response3 = await request(app).get(`/api/todos/${id2}`);

    expect(response3.body).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        title: "tarea cambiada",
        completed: true,
        description: "Cambiamos la tarea y la completamos",
        createdAt: expect.any(String),
        __v: expect.any(Number),
      })
    );
  })


  test("DELETE /api/todos/:id elimina correctamente una tarea existente.", async () =>{

    
    const response = await request(app).get(`/api/todos/`)

    expect(response.status).toBe(200);
    // Estos 3, cortesia de chat GPT
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    const id = response.body[0]._id;

    // Eliminamos la tarea seleccionada

    const response2 = await request(app).delete(`/api/todos/${id}`)
    expect(response2.status).toBe(200)
    //expect(response2.body).toBe({ message: "Tarea eliminada correctamente"})

    // Intentamos buscar de nuevo la tarea para cerciorarnos que no existe

    const response3 = await request(app).get(`/api/todos/${id}`)

    expect(response3.status).toBe(404)
    
    //todo PREGUNTAR QUE SIGNIFICA SERIALIZES TO THE SAME STRING
    
    //expect(response3.body).toBe({ error: "Tarea no encontrada"})
  })

  test("GET /api/todos/search devuelve las tareas cuyos títulos coinciden con el término de búsqueda.", async () =>{

    const response = await request(app)
    .get(`/api/todos/search`)
    .query({ title: "Nueva tarea2" });

    expect(response.status).toBe(200)

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String),
          title: expect.any(String),
          completed: expect.any(Boolean),
          createdAt: expect.any(String),
          __v: expect.any(Number),
          ...(response.body.description && { description: expect.any(String) }),
        }),
      ])
    );
  })

  // La 20 ni la hago

  test("GET /api/todos/stats devuelve las estadísticas correctas de las tareas.", async () =>{
    const response = await request(app).get(`/api/todos/stats`)

    // Aqui estaria perfecto usar types, para saber que va a ser la respuesta, pero bueno, gaes del oficio

    expect(response.status).toBe(200)

    expect(response.body).toEqual(
      expect.objectContaining({
        total: expect.any(Number),
        completed: expect.any(Number),
        pending: expect.any(Number),
        completionRate: expect.any(Number)
      })
    );


  })



});
