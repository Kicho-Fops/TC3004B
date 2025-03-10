const pool = require('../helpers/mysql-config')

const getAlumno = (req, res) => {
    const sql = "SELECT * FROM alumno";
    pool.query(sql, (err, results, fields) => {
        if(err)
            res.json(err)
        res.json(results)
    })
}

const getAlumnoById = (req, res) => {
    const { id } = req.params
    const sql = "SELECT * FROM alumno where id=?";
    pool.query(sql, [id] ,(err, results, fields) => {
        if(err)
            res.json(err)
        res.json(results)
    })
}

const saveAlumno = (req, res) => {
    const {nombre, paterno, materno, nacimiento} = req.body
    //validar que el body tiene los atributos que se requieren

    if(!nombre | !paterno | !materno | !nacimiento)
        return res.status(400).json({ message: "Informacion incompleta" });


    const sql = `INSERT INTO alumno(nombre, paterno, materno, nacimiento)
                 VALUES(?,?,?,?)`;
    pool.query(sql, [nombre, paterno, materno, nacimiento], (err, results, fields) => {
        if(err)
            res.json(err)
        res.json(results)
    })
}

const updateAlumno = (req, res) => {
    const {id, nombre, paterno, materno, nacimiento} = req.body
    //validar que el body tiene los atributos que se requieren
    const sql = `UPDATE alumno SET nombre=?, paterno=?, 
                 materno=?, nacimiento=? WHERE id=?`;
    pool.query(sql, [nombre, paterno, materno, nacimiento, id], (err, results, fields) => {
        if(err)
            res.json(err)
        if(results.affectedRows > 0)
            res.json({ mensaje: "Registro actualizado"})
        else
            res.json({ mensaje: "Algo pasó!" })
    })
}

const deleteAlumno = (req, res) => {

    const { id } = req.params
    const sql = "DELETE from alumno WHERE id=?";
    pool.query(sql, [id] ,(err, results, fields) => {
        if(err)
            res.json(err)
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json(results)
    })

}

module.exports = { getAlumno, updateAlumno, saveAlumno, getAlumnoById, deleteAlumno }