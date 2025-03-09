describe('Verificacion de pruebas', () => {
    test('Suma de dos numeros', () => { 
        expect(1+1).toBe(2); 
        expect(1+1).not.toBe(4);
    });
    test('Multiplicacion de dos numero', () => { expect(2*3).toBe(6); });
    test('Asignacion a un objeto', () => {
        const data = { nombre: 'Hugo' };
        data['apellido'] = 'Sanchez';
        expect(data)
        .toEqual({ nombre: 'Hugo', apellido: 'Sanchez' });
    });
    test('Verificacion de una variable indefinida', () => {
        const n = undefined;
        expect(n).not.toBeNull();
        expect(n).not.toBeDefined();
        expect(n).toBeUndefined();
        expect(n).not.toBeTruthy();
        expect(n).toBeFalsy();

        // const z = 1;
        // expect(z).not.toBeTruthy();
        // expect(z).toBeFalsy();
    });
    test('Comparacion de 2 numeros', () => {
        const a = 5;
        const b = 10;
        expect(b).toBeGreaterThan(a);
        expect(b-a).toBeGreaterThanOrEqual(a);
        expect(b-a).toBe(a);
        expect(b-a).toEqual(a);
        expect(a/b).toBeCloseTo(0.5);
    });

    test('Verifica empate entre valor y patron', () => {
        const cadena = 'Esta es una cadena o Cadena';
        expect(cadena).toMatch(/^E/);
        expect(cadena).toMatch(/a$/);
        expect(cadena).toMatch(/[cC]adena/);
    });

    test('Verifica que un elemento se encientre en e arreglo', () => {
        const arreglo = ['resistencia', 'led', 'diodo', 'integrado'];
        expect(arreglo).toContain('led');
        expect(new Set(arreglo)).toContain('resistencia');

        const mapa = new Map();
        mapa.set('resistencia', '4k');
        mapa.set('led', 'bicolor');
        mapa.set('diodo', 'fotoresistencia');
        expect(mapa.has('led')).toBe(true); // mapa.has es un metodo de Map
    });

    const persona = {
        nombre: 'Hugo',
        edad: 30
    };

    test('Verifica que una persona tenga un nombre y edad', () => { 
     
        expect(persona).toEqual(
            expect.objectContaining({
            nombre: expect.any(String),
            edad: expect.any(Number)
        })
    );

    });


    test('Verifica que el arreglo contenga un string', () => {
        const arreglo = ['resistencia', 'led', 'diodo', 'integrado'];
        expect(arreglo).toEqual(
            expect.arrayContaining([
                expect.any(String)
            ])
        );
    });

    test('Verifica que los objetos del arreglo tengan una estructura', () => {
        
        const personas = [
            { nombre: 'Hugo', edad: 30 },
            { nombre: 'Pedro', edad: 40 },
            { nombre: 'Juan', edad: 50 }
        ];

        expect(personas).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    nombre: expect.any(String),
                    edad: expect.any(Number)
                })
            ])
        );

    })

    test('Verifica que una funcion lance una excepcion', () => {
        const funcion = () => {
            throw new Error('Algo salio mal');
        }
        
        expect(() => funcion()).toThrow();
        expect(() => funcion()).toThrow(Error);

        expect(() => funcion()).toThrow('Algo salio mal');
        expect(() => funcion()).toThrow(/mal/);
    });

}); 