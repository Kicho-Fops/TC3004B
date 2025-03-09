const { findUserById, deleteUserById } = require("../helpers/funciones");
describe("Funciones del archivo funciones.js", () => {
  const arreglo = [
    { nombre: "Tony", id: 1 },
    { nombre: "Caro", id: 2 },
    { nombre: "Luis", id: 3 },
  ];
  test("Verificando que findUserById devuelve un usuario correctamente", () => {
    expect(findUserById(arreglo, 2)).toEqual({ nombre: "Caro", id: 2 });
  });
  test("Verificando que deleteUserById elimine un objeto", () => {
    const resultado = deleteUserById(arreglo, 3).length;
    expect(arreglo.length - 1).toBe(resultado);
    expect(deleteUserById(arreglo, 3)).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ nombre: "Luis", id: 3 }),
      ])
    );
  });
});
