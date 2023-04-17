// Get DOM elements
const peopleList = document.getElementById("people");
const todoList = document.getElementById("todos");
const addTodoForm = document.getElementById("add-todo-form");
const taskInput = document.getElementById("task");
const deadlineInput = document.getElementById("deadline");
const personInput = document.getElementById("person");

// Display all persons
function displayPersons() {
  fetch("http://localhost:3000/api/person")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((person) => {
        const li = document.createElement("li");
        li.textContent = person.firstname + " " + person.lastname;
        li.addEventListener("click", () => displayTodos(person.id));
        peopleList.appendChild(li);
      });
    });
}

// Display all todos of a person
function displayTodos(personId) {
  fetch(`http://localhost:3000/api/todo/${personId}`)
    .then((response) => response.json())
    .then((data) => {
      // Clear todo list
      todoList.innerHTML = "";

      // Display todos
      data.forEach((todo) => {
        const li = document.createElement("li");
        li.textContent = todo.task + " (" + todo.deadline + ")";
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => editTodoForm(todo));
        li.appendChild(editButton);
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () =>
          deleteTodoConfirm(todo.id)
        );
        li.appendChild(deleteButton);
        todoList.appendChild(li);
      });

      // Display add todo form
      addTodoForm.style.display = "block";
      taskInput.value = "";
      deadlineInput.value = "";
      personInput.value = personId;
    });
}

// Edit todo form
function editTodoForm(todo) {
  taskInput.value = todo.task;
  deadlineInput.value = todo.deadline;
  personInput.value = todo.personId;
  addTodoForm.removeEventListener("submit", addTodo);
  addTodoForm.addEventListener("submit", () => updateTodo(todo.id));
}

// Update todo
function updateTodo(todoId) {
  const task = taskInput.value;
  const deadline = deadlineInput.value;
  const personId = personInput.value;

  fetch(`http://localhost:3000/api/todo/${todoId}`, {
    method: "PUT",
    body: JSON.stringify({ task, deadline, personId }),
    headers: { "Content-Type": "application/json" },
  }).then(() => {
    addTodoForm.removeEventListener("submit", updateTodo);
    addTodoForm.addEventListener("submit", addTodo);
    addTodoForm.style.display = "none";
    displayTodos(personId);
  });
}

// Delete todo confirmation
function deleteTodoConfirm(todoId) {
  const result = confirm("Are you sure you want to delete this todo?");
  if (result) {
    deleteTodo(todoId);
  }
}

// Delete todo
function deleteTodo(todoId) {
  fetch(`http://localhost:3000/api/todo/${todoId}`, { method: "DELETE" }).then(
    () => {
      displayTodos(personInput.value);
    }
  );
}

// Add todo form
addTodoForm.addEventListener("submit", addTodo);

// Add todo
function addTodo(event) {
  event.preventDefault();

  const task = taskInput.value;
  const deadline = deadlineInput.value;
  const personId = personInput.value;
  console.table(task, personId, deadline);
  fetch("http://localhost:3000/api/todo", {
    method: "POST",
    body: JSON.stringify({ task, deadline, personId }),
    headers: { "Content-Type": "application/json" },
  })
    .then(() => {
      taskInput.value = "";
      deadlineInput.value = "";
    })
    .catch((error) => console.error(error));
}
displayPersons();
