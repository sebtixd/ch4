document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateProgress();
    checkDeadlines();
    setInterval(checkDeadlines, 60 * 1000);
  });
  
  function addTask() {
    const text = document.getElementById("taskInput").value.trim();
    const desc = document.getElementById("taskDescription").value.trim();
    const category = document.getElementById("choix").value;
    const date = document.getElementById("taskDate").value;
  
    if (!text) return;
  
    const task = {
      id: Date.now(),
      text,
      desc,
      category,
      date,
      completed: false
    };
  
    saveTask(task);
    renderTask(task);
    document.getElementById("taskInput").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskDate").value = "";
  }
  
  function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  function getTasks() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  }
  
  function renderTask(task) {
    const li = document.createElement("li");
    li.classList.add(task.category.toLowerCase());
    if (task.completed) li.classList.add("checked");
  
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));
  
    const label = document.createElement("label");
    label.textContent = task.text;
  
    const spanDesc = document.createElement("span");
    spanDesc.textContent = ` — ${task.desc}`;
  
    const spanDate = document.createElement("span");
    spanDate.classList.add("date");
    spanDate.textContent = ` (${task.date})`;
  
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Supprimer";
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
  
    li.append(checkbox, label, spanDesc, spanDate, deleteBtn);
    document.getElementById("taskList").appendChild(li);
  }
  
  function toggleTaskCompletion(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    task.completed = !task.completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateProgress();
    checkDeadlines();
  }
  
  function deleteTask(taskId) {
    let tasks = getTasks();
    tasks = tasks.filter(t => t.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.getElementById("taskList").innerHTML = '';
    tasks.forEach(renderTask);
    updateProgress();
    checkDeadlines();
  }
  
  function updateProgress() {
    const tasks = getTasks();
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const progressBar = document.getElementById("taskProgress");
    progressBar.max = total;
    progressBar.value = completed;
  }
  
  function checkDeadlines() {
    const now = Date.now();
    const tasks = getTasks();
    tasks.forEach(task => {
      const li = document.querySelector(`li[data-id="${task.id}"]`);
      const dueDate = new Date(task.date).getTime();
      li.classList.remove('overdue', 'upcoming');
      if (dueDate < now && !task.completed) {
        li.classList.add('overdue');
      } else if (dueDate - now <= 24 * 60 * 60 * 1000 && !task.completed) {
        li.classList.add('upcoming');
      }
    });
  }
  
  function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(renderTask);
  }
  