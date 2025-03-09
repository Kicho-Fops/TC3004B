const express = require('express')
const app = express()
const alumno = require('./routes/alumno')
const port = process.env.PORT || 3000 

app.use(express.json())
app.use('/', alumno)

//Función callback
app.listen(port, () => {
    console.log(`Conectado al puerto ${port}`)
})