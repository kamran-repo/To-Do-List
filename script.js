const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "all") {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        if (filter === "completed") {
            return task.completed;
        }

        if (filter === "pending") {
            return !task.completed;
        }

        return true;
    });

    filteredTasks.forEach((task, index) => {

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span>${task.text}</span>

            <div class="task-buttons">

                <button class="complete-btn">
                    ✓
                </button>

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>

            </div>
        `;

        // Complete Task
        li.querySelector(".complete-btn").addEventListener("click", () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks(filter);
        });

        // Delete Task
        li.querySelector(".delete-btn").addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks(filter);
        });

        // Edit Task
        li.querySelector(".edit-btn").addEventListener("click", () => {

            const updatedTask = prompt("Edit task:", task.text);

            if (updatedTask !== null && updatedTask.trim() !== "") {
                task.text = updatedTask;
                saveTasks();
                renderTasks(filter);
            }
        });

        taskList.appendChild(li);
    });
}

// Add Task
addTaskBtn.addEventListener("click", () => {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task");
        return;
    }

    tasks.push({
        text,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
});

// Filter Buttons
document.querySelectorAll(".filters button").forEach(button => {

    button.addEventListener("click", () => {

        const filter = button.dataset.filter;

        renderTasks(filter);
    });
});

// Dark Mode Toggle
themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");
});

// Initial Render
renderTasks();