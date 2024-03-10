document.addEventListener('DOMContentLoaded', () => {
    // Load tasks from local storage
    // loadTasks();
});

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev, status) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const task = document.getElementById(data);
    const tasksContainer = ev.target.closest('.tasks');
    tasksContainer.appendChild(task);

    // Update status in local storage
    updateLocalStorage(data, status);
}

function newTask(status) {
    const title = prompt("Enter task title:");
    if (title) {
        const taskId = `task-${Date.now()}`;
        const task = createTaskElement(taskId, title);
        document.getElementById(`tasks-${status}`).appendChild(task);

        // Update status in local storage
        updateLocalStorage(taskId, status);
    }
}

function createTaskElement(id, title) {
    const task = document.createElement('div');
    task.id = id;
    task.className = 'task';
    task.draggable = true;
    task.setAttribute('ondragstart', 'drag(event)');
    task.innerText = title;
    task.addEventListener('click', () => editTask(id));

    return task;
}

function editTask(id) {
    const newTitle = prompt("Enter new title:");
    if (newTitle) {
        const task = document.getElementById(id);
        task.innerText = newTitle;

        // Update title in local storage
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks[id].title = newTitle;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function updateLocalStorage(taskId, status) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    tasks[taskId] = { status };
    localStorage.setItem('tasks', JSON.stringify(tasks));

    updateCounts();
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    Object.keys(tasks).forEach(taskId => {
        const { status } = tasks[taskId];
        const task = createTaskElement(taskId, taskId);
        document.getElementById(`tasks-${status}`).appendChild(task);
    });

    updateCounts();
}

function updateCounts() {
    const statuses = ['todo', 'inprogress', 'done'];
    statuses.forEach(status => {
        const count = document.getElementById(`tasks-${status}`).childElementCount;
        document.getElementById(`${status}`).querySelector('h2').innerText = `${status.charAt(0).toUpperCase() + status.slice(1)} (${count})`;
    });
}
