const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const count = document.querySelector("#todo-count");
const emptyState = document.querySelector("#empty-state");
const clearCompletedButton = document.querySelector("#clear-completed");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  list.replaceChildren();

  todos.forEach((todo) => {
    const item = document.createElement("li");
    const checkbox = document.createElement("input");
    const text = document.createElement("span");
    const deleteButton = document.createElement("button");

    item.className = `todo-item${todo.completed ? " completed" : ""}`;
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `Tandai ${todo.text} selesai`);
    text.textContent = todo.text;
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `Hapus ${todo.text}`);

    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    deleteButton.addEventListener("click", () => {
      todos = todos.filter((item) => item.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  const remaining = todos.filter((todo) => !todo.completed).length;
  count.textContent = `${remaining} tugas tersisa`;
  emptyState.hidden = todos.length > 0;
  clearCompletedButton.hidden = !todos.some((todo) => todo.completed);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) return;

  todos.push({
    id: crypto.randomUUID(),
    text,
    completed: false
  });

  saveTodos();
  renderTodos();
  form.reset();
  input.focus();
});

clearCompletedButton.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
});

renderTodos();
