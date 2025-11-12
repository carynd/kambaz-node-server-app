let todos = [
  { id: 1, title: "Task 1", completed: false, description: "First task" },
  { id: 2, title: "Task 2", completed: true, description: "Second task" },
  { id: 3, title: "Task 3", completed: false, description: "Third task" },
  { id: 4, title: "Task 4", completed: true, description: "Fourth task" },
];

export default function WorkingWithArrays(app) {
  // ============= CALLBACK FUNCTIONS =============

  // 5.2.4.1: Retrieve all todos (with optional filtering by completed status)
  const getTodos = (req, res) => {
    const { completed } = req.query;
    if (completed !== undefined) {
      const completedBool = completed === "true";
      const completedTodos = todos.filter((t) => t.completed === completedBool);
      res.json(completedTodos);
      return;
    }
    res.json(todos);
  };

  // 5.2.4.2: Retrieve a todo by its ID
  const getTodoById = (req, res) => {
    const { id } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    res.json(todo);
  };

  // 5.2.4.4: Create a new todo (GET version - for practice)
  const createNewTodo = (req, res) => {
    const newTodo = {
      id: new Date().getTime(),
      title: "New Task",
      completed: false,
    };
    todos.push(newTodo);
    res.json(todos);
  };

  // 5.2.4.4: Create a new todo (POST version - proper HTTP method)
  const postNewTodo = (req, res) => {
    const newTodo = { ...req.body, id: new Date().getTime() };
    todos.push(newTodo);
    res.json(newTodo);
  };

  // 5.2.4.5: Remove a todo (GET version - for practice)
  const removeTodo = (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    todos.splice(todoIndex, 1);
    res.json(todos);
  };

  // 5.2.4.5: Delete a todo (DELETE version - proper HTTP method with error handling)
  const deleteTodo = (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    if (todoIndex === -1) {
      res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
      return;
    }
    todos.splice(todoIndex, 1);
    res.sendStatus(200);
  };

  // 5.2.4.6: Update a todo title (GET version - for practice)
  const updateTodoTitle = (req, res) => {
    const { id, title } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    todo.title = title;
    res.json(todos);
  };

  // 5.2.4.6: Update a todo (PUT version - proper HTTP method with error handling)
  const updateTodo = (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    if (todoIndex === -1) {
      res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
      return;
    }
    todos = todos.map((t) => {
      if (t.id === parseInt(id)) {
        return { ...t, ...req.body };
      }
      return t;
    });
    res.sendStatus(200);
  };

  // 5.2.4.7: Update todo completed property (GET version - for practice)
  const updateTodoCompleted = (req, res) => {
    const { id, completed } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    todo.completed = completed === "true";
    res.json(todos);
  };

  // 5.2.4.7: Update todo description property (GET version - for practice)
  const updateTodoDescription = (req, res) => {
    const { id, description } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    todo.description = description;
    res.json(todos);
  };

  // ============= ROUTE DEFINITIONS =============

  // 5.2.4.1: GET all todos (with optional filtering by completed status)
  app.get("/lab5/todos", getTodos);

  // 5.2.4.2: GET todo by ID
  app.get("/lab5/todos/:id", getTodoById);

  // 5.2.4.4: CREATE routes
  app.get("/lab5/todos/create", createNewTodo);  // GET version (for practice)
  app.post("/lab5/todos", postNewTodo);           // POST version (proper HTTP method)

  // 5.2.4.5: DELETE routes
  app.get("/lab5/todos/:id/delete", removeTodo);  // GET version (for practice)
  app.delete("/lab5/todos/:id", deleteTodo);      // DELETE version (proper HTTP method)

  // 5.2.4.6: UPDATE routes
  app.get("/lab5/todos/:id/title/:title", updateTodoTitle);  // GET version (for practice)
  app.put("/lab5/todos/:id", updateTodo);                     // PUT version (proper HTTP method)

  // 5.2.4.7: UPDATE specific properties (for practice)
  app.get("/lab5/todos/:id/completed/:completed", updateTodoCompleted);
  app.get("/lab5/todos/:id/description/:description", updateTodoDescription);
};

