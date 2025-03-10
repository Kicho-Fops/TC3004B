const { default: mongoose } = require("mongoose");
const Todo = require("./../models/Todo");

// Obtener todas las tareas
exports.getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una tarea por ID
exports.getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: "El título es obligatorio" });
    }
    const newTodo = new Todo({
      title,
      description,
      completed: false,
    });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una tarea
exports.updateTodo = async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (completed !== undefined) updates.completed = completed;

    const todo = await Todo.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una tarea
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    res.status(200).json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Marcar una tarea como completada
exports.completeTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );
    if (!todo) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar tareas por título
exports.searchTodos = async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res
        .status(400)
        .json({ error: "El parámetro de búsqueda es requerido" });
    }
    const todos = await Todo.find({
      title: { $regex: title, $options: "i" },
    });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Estadísticas de tareas
exports.getTodoStats = async (req, res) => {
  try {
    const totalTodos = await Todo.countDocuments();
    const completedTodos = await Todo.countDocuments({ completed: true });
    const pendingTodos = totalTodos - completedTodos;
    res.status(200).json({
      total: totalTodos,
      completed: completedTodos,
      pending: pendingTodos,
      completionRate: totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Hay una libreria llamada mongo-healthcheck pero lo vamos a hacer de manera manual

// Revision de salud del sistema
exports.getDBHealth = async (req, res) => {
  try {
    const connection = mongoose.connection;

    if (connection.readyState === 1) {
      const result = await connection.db.command({ ping: 1 });
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
};
