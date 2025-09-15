// tasks.js — versão revisada
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  const container = document.getElementById('tasks');
  container.innerHTML = '';

  tasks.forEach((task, index) => {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';

    // header
    const header = document.createElement('div');
    header.className = 'task-header';

    const title = document.createElement('h3');
    title.textContent = task.name;

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '▼';
    toggleBtn.className = 'toggle-btn';

    const deleteTaskButton = document.createElement('button');
    deleteTaskButton.textContent = '🗑️';
    deleteTaskButton.className = 'delete-task-btn';
    deleteTaskButton.title = 'Excluir tarefa';
    deleteTaskButton.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    header.appendChild(title);
    header.appendChild(toggleBtn);
    header.appendChild(deleteTaskButton);

    // detalhes
    const details = document.createElement('div');
    details.className = 'task-details';

    // ===== wrapper flex para input + botão =====
    const subtaskInputWrapper = document.createElement('div');
    subtaskInputWrapper.className = 'subtask-input-wrapper';

    const addSubtaskInput = document.createElement('input');
    addSubtaskInput.type = 'text';
    addSubtaskInput.placeholder = 'Nova subtarefa';
    addSubtaskInput.className = 'subtask-input';

    const addSubtaskButton = document.createElement('button');
    addSubtaskButton.textContent = '+';
    addSubtaskButton.className = 'subtask-add-btn';
    addSubtaskButton.title = 'Adicionar subtarefa';

    // clique do botão
    addSubtaskButton.addEventListener('click', () => {
      const value = addSubtaskInput.value.trim();
      if (value === '') return;
      if (task.subtasks.some((st) => st.text.toLowerCase() === value.toLowerCase())) {
        alert('⚠️ Essa subtarefa já existe!');
        return;
      }
      task.subtasks.push({ text: value, done: false });
      addSubtaskInput.value = '';
      saveTasks();
      renderTasks();
    });

    // Enter no input adiciona subtarefa
    addSubtaskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addSubtaskButton.click();
    });

    subtaskInputWrapper.appendChild(addSubtaskInput);
    subtaskInputWrapper.appendChild(addSubtaskButton);
    // ===== fim wrapper =====

    // subtasks list
    const subtasksDiv = document.createElement('div');
    subtasksDiv.className = 'subtasks';

    task.subtasks.forEach((subtask, subIndex) => {
      const subtaskDiv = document.createElement('div');
      subtaskDiv.className = 'subtask' + (subtask.done ? ' done' : '');
      subtaskDiv.textContent = subtask.text;
      subtaskDiv.addEventListener('click', () => {
        subtask.done = !subtask.done;
        saveTasks();
        renderTasks();
      });
      subtasksDiv.appendChild(subtaskDiv);
    });

    // notes
    const notes = document.createElement('textarea');
    notes.placeholder = 'Anotações...';
    notes.value = task.notes || '';
    notes.addEventListener('input', (e) => {
      task.notes = e.target.value;
      saveTasks();
    });

    // montar detalhes
    details.appendChild(subtaskInputWrapper);
    details.appendChild(subtasksDiv);
    details.appendChild(notes);

    // expand/collapse
    toggleBtn.addEventListener('click', () => {
      details.classList.toggle('show');
      toggleBtn.textContent = details.classList.contains('show') ? '▲' : '▼';
    });

    taskDiv.appendChild(header);
    taskDiv.appendChild(details);
    container.appendChild(taskDiv);

    // mensagem concluída
    if (task.subtasks.length > 0 && task.subtasks.every((st) => st.done)) {
      showTaskCompletedMessage(taskDiv, index);
    }
  });
}

function addTask() {
  const input = document.getElementById('newTaskInput');
  if (!input) return console.warn('Elemento #newTaskInput não encontrado.');
  const taskName = input.value.trim();
  if (taskName !== '') {
    tasks.push({ name: taskName, subtasks: [], notes: '' });
    input.value = '';
    saveTasks();
    renderTasks();
  }
}

function showTaskCompletedMessage(taskDiv, taskIndex) {
  if (taskDiv.querySelector('.completed-message')) return;

  const msg = document.createElement('div');
  msg.className = 'completed-message';
  msg.textContent = '🎉 Tarefa concluída!';
  taskDiv.appendChild(msg);

  setTimeout(() => {
    tasks[taskIndex].subtasks.forEach((st) => (st.done = false));
    saveTasks();
    renderTasks();
  }, 5000);
}

// inicializa quando DOM pronto (evita problemas se o <script> estiver no <head>)
document.addEventListener('DOMContentLoaded', () => {
  renderTasks();

  const addBtn = document.getElementById('addTaskBtn');
  if (addBtn) addBtn.addEventListener('click', addTask);

  const newTaskInput = document.getElementById('newTaskInput');
  if (newTaskInput) {
    newTaskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addTask();
    });
  }
});