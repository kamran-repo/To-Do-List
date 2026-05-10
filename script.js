const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const categoryInput = document.getElementById("category");
const priorityInput = document.getElementById("priority");

const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/* =========================
   NOTIFICATION PERMISSION
========================= */

if ("Notification" in window) {
    Notification.requestPermission();
}

/* =========================
   SAVE TASKS
========================= */

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* =========================
   SHOW NOTIFICATION
========================= */

function showNotification(task) {

    if (Notification.permission === "granted") {

        new Notification("📌 Task Reminder", {
            body: `${task.text} is due today!`
        });
    }
}

/* =========================
   RENDER TASKS
========================= */

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

        /* Completed Styling */

        if (task.completed) {
            li.classList.add("completed");
        }

        /* Priority Styling */

        li.classList.add(task.priority.toLowerCase());

        li.innerHTML = `

            <div class="task-info">

                <span>${task.text}</span>

                <small class="task-date">
                    📅 Due: ${task.dueDate || "No date"}
                </small>

                <small class="task-category">
                    📂 Category: ${task.category}
                </small>

                <small class="priority priority-${task.priority.toLowerCase()}">
                    ${getPriorityEmoji(task.priority)} ${task.priority} Priority
                </small>

            </div>

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

        /* =========================
           COMPLETE TASK
        ========================= */

        li.querySelector(".complete-btn").addEventListener("click", () => {

            task.completed = !task.completed;

            saveTasks();

            renderTasks(filter);
        });

        /* =========================
           DELETE TASK
        ========================= */

        li.querySelector(".delete-btn").addEventListener("click", () => {

            tasks.splice(index, 1);

            saveTasks();

            renderTasks(filter);
        });

        /* =========================
           EDIT TASK
        ========================= */

        li.querySelector(".edit-btn").addEventListener("click", () => {

            const updatedText = prompt("Edit task:", task.text);

            if (updatedText !== null && updatedText.trim() !== "") {

                task.text = updatedText;

                saveTasks();

                renderTasks(filter);
            }
        });

        taskList.appendChild(li);

        /* =========================
           DUE DATE NOTIFICATION
        ========================= */

        const today = new Date().toISOString().split("T")[0];

        if (task.dueDate === today && !task.completed) {
            showNotification(task);
        }
    });
}

/* =========================
   PRIORITY EMOJI
========================= */

function getPriorityEmoji(priority) {

    switch(priority) {

        case "High":
            return "🔴";

        case "Medium":
            return "🟡";

        case "Low":
            return "🟢";

        default:
            return "";
    }
}

/* =========================
   ADD TASK
========================= */

addTaskBtn.addEventListener("click", () => {

    const text = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const category = categoryInput.value;
    const priority = priorityInput.value;

    if (text === "") {

        alert("Please enter a task");

        return;
    }

    tasks.push({
        text,
        dueDate,
        category,
        priority,
        completed: false
    });

    saveTasks();

    renderTasks();

    /* Clear Inputs */

    taskInput.value = "";
    dueDateInput.value = "";
});

/* =========================
   FILTER BUTTONS
========================= */

document.querySelectorAll(".filters button").forEach(button => {

    button.addEventListener("click", () => {

        const filter = button.dataset.filter;

        renderTasks(filter);
    });
});

/* =========================
   DARK MODE
========================= */

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");
});

/* =========================
   ENTER KEY SUPPORT
========================= */

taskInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {
        addTaskBtn.click();
    }
});

/* =========================
   INITIAL RENDER
========================= */

renderTasks();