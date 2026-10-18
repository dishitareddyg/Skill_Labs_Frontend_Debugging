// TaskForge - task data, rendering and event handling.
// The `tasks` array is the source of truth for the whole app.

// ---------- Application state ----------
const tasks = [
  { id: 1, title: "Review lecture notes", priority: "Medium", completed: false },
  { id: 2, title: "Submit lab report", priority: "High", completed: true },
  { id: 3, title: "Plan weekend study group", priority: "Low", completed: false },
  { id: 4, title: "Reply to project teammates", priority: "Medium", completed: false },
  { id: 5, title: "Read chapter on arrays", priority: "Low", completed: true }
];
let nextId = 6;              // Next unique ID to give a new task
let searchQuery = "";        // Current text in the search box
let statusFilter = "all";    // "all", "pending" or "completed"
let completedCount = tasks.filter(function (task) { return task.completed; }).length;

// ---------- DOM references ----------
const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const priorityInput = document.getElementById("task-priority");
const formMessage = document.getElementById("form-message");
const searchInput = document.getElementById("search-input");
const statusSelect = document.getElementById("status-filter");
const taskListElement = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const totalCountElement = document.getElementById("total-count");
const pendingCountElement = document.getElementById("pending-count");
const completedCountElement = document.getElementById("completed-count");

// ---------- Task operations (data only) ----------

// Create a new task object and store it in the tasks array.
function addTask(title, priority) {
  const newTask = { id: nextId, title: title, priority: priority, completed: false };
  nextId = nextId + 1;
  tasks.push(newTask);
}

// Switch a task between pending and completed.
function toggleTask(taskId) {
  const task = tasks.find(function (item) { return item.id === taskId; });
  if (!task) { return; }
  task.completed = !task.completed;
  if (task.completed) {
    completedCount = completedCount + 1;
  }
}

// Remove a task from the tasks array.
function deleteTask(taskId) {
  tasks.splice(taskId, 1);
}

// Work out which tasks should currently be shown.
function getVisibleTasks() {
  const query = searchQuery.trim().toLowerCase();

  if (statusFilter === "pending") {
    return tasks.filter(function (task) { return !task.completed; });
  }
  if (statusFilter === "completed") {
    return tasks.filter(function (task) { return task.completed; });
  }
  return tasks.filter(function (task) {
    return task.title.toLowerCase().includes(query);
  });
}

// ---------- Rendering (DOM only) ----------

// Update the three summary cards.
function updateSummary() {
  const pending = tasks.filter(function (task) { return !task.completed; }).length;
  totalCountElement.textContent = tasks.length;
  pendingCountElement.textContent = pending;
  completedCountElement.textContent = completedCount;
}

// Build one list item for a task.
function createTaskElement(task) {
  const item = document.createElement("li");
  item.className = "task-item" + (task.completed ? " is-completed" : "");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.dataset.id = task.id;
  checkbox.dataset.action = "toggle";
  checkbox.setAttribute("aria-label", "Mark \u201C" + task.title + "\u201D as complete");

  const main = document.createElement("div");
  main.className = "task-main";
  const title = document.createElement("div");
  title.className = "task-title";
  title.textContent = task.title;
  const status = document.createElement("div");
  status.className = "task-status";
  status.textContent = task.completed ? "Completed" : "Pending";
  main.appendChild(title);
  main.appendChild(status);

  const badge = document.createElement("span");
  badge.className = "badge badge-" + task.priority.toLowerCase();
  badge.textContent = task.priority + " priority";

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "btn btn-delete";
  deleteButton.dataset.id = task.id;
  deleteButton.dataset.action = "delete";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", "Delete task \u201C" + task.title + "\u201D");

  item.appendChild(checkbox);
  item.appendChild(main);
  item.appendChild(badge);
  item.appendChild(deleteButton);
  return item;
}

// Redraw the task list and the empty state.
function renderTasks() {
  const visibleTasks = getVisibleTasks();
  taskListElement.innerHTML = "";
  visibleTasks.forEach(function (task) {
    taskListElement.appendChild(createTaskElement(task));
  });

  if (visibleTasks.length === 0) {
    emptyState.hidden = false;
    emptyState.textContent = tasks.length === 0
      ? "No tasks yet. Add your first task above."
      : "No tasks match your search or filter. Try a different search or status.";
  } else {
    emptyState.hidden = true;
  }
}

function showFormMessage(message) {
  formMessage.textContent = message;
}

// ---------- Event listeners ----------

// Add a task when the form is submitted.
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const title = titleInput.value.trim();

  if (title === "") {
    showFormMessage("Enter a task title before adding it.");
    titleInput.focus();
    return;
  }

  addTask(title, priorityInput.value);
  taskForm.reset();
  showFormMessage("");
  updateSummary();
  titleInput.focus();
});

// Mark complete / pending.
taskListElement.addEventListener("change", function (event) {
  const checkbox = event.target.closest('[data-action="toggle"]');
  if (!checkbox) { return; }
  toggleTask(Number(checkbox.dataset.id));
  renderTasks();
  updateSummary();
});

// Delete a task.
taskListElement.addEventListener("click", function (event) {
  const button = event.target.closest('[data-action="delete"]');
  if (!button) { return; }
  deleteTask(Number(button.dataset.id));
  renderTasks();
  updateSummary();
});

// Search as the user types.
searchInput.addEventListener("input", function () {
  searchQuery = searchInput.value;
  renderTasks();
});

// Change the status filter.
statusSelect.addEventListener("change", function () {
  statusFilter = statusSelect.value;
  renderTasks();
});

// ---------- Start the app ----------
renderTasks();
updateSummary();
