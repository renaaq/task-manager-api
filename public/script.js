async function loadTasks() {

    document.getElementById('tasks').innerHTML = '<li>Cargando...</li>';

    const response = await fetch('/api/tasks')

    if (!response.ok) {
        alert('error' + response.status);
        return;
    }

    const tasks = await response.json();

    const ul = document.getElementById("tasks");
    ul.innerHTML = ""


    console.log(tasks)

    tasks.forEach(task => {
        const li = document.createElement("li");

        li.className = task.completed ? 'completed' : '';  // CSS clase
        li.innerHTML = `${task.title} - ${task.description} 
    <span>${task.completed ? '✅' : '⭕'}</span>
    <button onclick="toggle(${task.id})">Toggle</button>
    <button onclick="deleteTask(${task.id})">Delete</button>`;

        ul.appendChild(li)
    });

}




async function addTask() {
    const title = document.getElementById("titleInput").value;
    const desc = document.getElementById("descInput").value;

    //POST A api/tasks
    await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: desc, user_id: 1 })
    });
    document.getElementById("titleInput").value = ""
    document.getElementById("descInput").value = ""
    loadTasks()
}


async function toggle(id) {
    // 1. GET /api/tasks/${id} → task actual
    const response = await fetch(`/api/tasks/${id}`);
    const data = await response.json()

    // 2. PUT /api/tasks/${id} con completed: !task.completed
    await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: data.title,
            description: data.description,
            completed: !data.completed
        })
    })
    loadTasks()
}



async function deleteTask(id) {
    // DELETE /api/tasks/${id}
    await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })
    loadTasks()
}

document.addEventListener('keypress', (e) => {
    if (e.key === "Enter") addTask();
})