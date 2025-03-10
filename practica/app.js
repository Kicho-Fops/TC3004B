const express = require("express");
const mongoose = require("mongoose");
const todoRoutes = require("./routes/todo.route");
const app = express();
app.use(express.json());
const port = 3000;

const connectToDatabase = require('./server.js')

connectToDatabase()

// Rutas
app.use("/api/todos", todoRoutes);
// Ruta de salud
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


// Ruta de salud
app.get("/health2", (req, res) => {
  try {
      const connection = mongoose.connection;
  
      if (connection.readyState === 1) {
        const result = connection.db.command({ ping: 1 });
        if (result.ok === 1) {
          return { status: "up", message: "MongoDB connection is healthy" };
        } else {
          return { status: "down", message: "MongoDB connection is unhealthy" };
        }
      } else {
        return {
          status: "down",
          message: "Mongoose connection is not yet established",
        };
      }
    } catch (error) {
      return {
        status: "down",
        message: `Error during health check: ${error.message}`,
      };
    }
});
// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});
// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
});


module.exports = app;
