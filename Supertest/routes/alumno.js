const express = require('express')
const router = express.Router()
const { getAlumno, updateAlumno, saveAlumno, getAlumnoById } = require('../controllers/alumno.controller') 

router.get('/alumno', getAlumno)
router.get('/alumno/:id', getAlumnoById)
router.put('/alumno', updateAlumno)
router.post('/alumno', saveAlumno)

module.exports = router;