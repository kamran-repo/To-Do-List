const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const categoryInput = document.getElementById("category");
const priorityInput = document.getElementById("priority");

const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const themeToggle = document.getElementById("themeToggle");

const searchInput = document.getElementById("searchInput");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

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
   RENDER TASKS
========================= */

function renderTasks(filter = currentFilter, searchText = "") {

    currentFilter = filter;

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        const matchesFilter = (

            (filter === "completed" && task.completed) ||

            (filter === "pending" && !task.completed) ||

            (filter === "all")
        );

        const matchesSearch = task.text
            .toLowerCase()
            .includes(searchText.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    /* No Tasks Message */

    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <p style="text-align:center; padding:20px;">
                No tasks found
            </p>
        `;

        return;
    }

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
                    ${getPriorityEmoji(task.priority)}
                    ${task.priority} Priority
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

            renderTasks(currentFilter, searchInput.value);
        });

        /* =========================
           DELETE TASK
        ========================= */

        li.querySelector(".delete-btn").addEventListener("click", () => {

            tasks.splice(index, 1);

            saveTasks();

            renderTasks(currentFilter, searchInput.value);
        });

        /* =========================
           EDIT TASK
        ========================= */

        li.querySelector(".edit-btn").addEventListener("click", () => {

            const updatedText = prompt(
                "Edit task:",
                task.text
            );

            if (
                updatedText !== null &&
                updatedText.trim() !== ""
            ) {

                task.text = updatedText;

                saveTasks();

                renderTasks(currentFilter, searchInput.value);
            }
        });

        taskList.appendChild(li);

        /* =========================
           DUE DATE NOTIFICATION
        ========================= */

        const today = new Date()
            .toISOString()
            .split("T")[0];

        if (
            task.dueDate === today &&
            !task.completed
        ) {
            showNotification(task);
        }
    });
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

    renderTasks(currentFilter, searchInput.value);

    /* Clear Inputs */

    taskInput.value = "";
    dueDateInput.value = "";
});

/* =========================
   FILTER BUTTONS
========================= */

document.querySelectorAll(".filters button").forEach(button => {

    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter;

        renderTasks(
            currentFilter,
            searchInput.value
        );
    });
});

/* =========================
   SEARCH TASKS
========================= */

searchInput.addEventListener("input", () => {

    renderTasks(
        currentFilter,
        searchInput.value
    );
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