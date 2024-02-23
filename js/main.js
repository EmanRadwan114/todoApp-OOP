/*
steps:
   1. change theme 
   2. create task
   3. display the created task
   4. edit & update the selected task
   5. complete / activate task
   6. filter tasks
   7. display the number of completed & active tasks
   8. clear completed tasks
*/

import Task from "./task.js";

// * step 1
const todoSec = document.querySelector('main[data-theme="dark"]');
const img = document.querySelector("header img");
img.addEventListener("click", (e) => {
  if (todoSec.getAttribute("data-theme") == "dark") {
    todoSec.setAttribute("data-theme", "light");
    img.setAttribute("src", "./images/icon-moon.svg");
  } else {
    todoSec.setAttribute("data-theme", "dark");
    img.setAttribute("src", "./images/icon-sun.svg");
  }
});

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
const addTask = document.querySelector(".add");
const input = document.querySelector(".createTodo input");
const list = document.querySelector(".todosList ul");
const filterBtns = document.querySelectorAll(".filterBtns button");
const todoNum = document.querySelector(".todoNum");
let tasksContainer = [];
let createdTask, itemId;

if (localStorage.getItem("tasks")) {
  tasksContainer = JSON.parse(localStorage.getItem("tasks"));
  tasksContainer.map((task, indx) => {
    createdTask = new Task(task.content, task.id);
    const li = createdTask.displayTasks(list, task.content, task.id);
    if (task.status == "completed") {
      createdTask.completeTask(li, indx, tasksContainer);
    }
  });
}
const set = new Set();
addTask.addEventListener("click", function (e) {
  if (input.value) {
    // &set random id
    itemId = Math.floor(Math.random() * 1000);
    while (set.has(itemId)) {
      itemId = Math.floor(Math.random() * 1000);
    }
    set.add(itemId);
    // *step 2
    createdTask = new Task(input.value, itemId);
    createdTask.createTask(tasksContainer);

    // *step 3
    createdTask.displayTasks(list, input.value, itemId);
    todoNum.textContent = `${tasksContainer.length} items left`;
    input.value = "";
  }
});

// *step 4 & 5
// ^^^^edit
let todoId, todoStatus, todoItem, itemIndex;
list.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    todoId = e.target.getAttribute("data-id");
    createdTask.editTask(input, todoId, tasksContainer);
    todoStatus = tasksContainer.find((item, indx) => {
      itemIndex = indx;
      return item.id == todoId;
    }).status;
    todoItem = e.target.parentElement.parentElement;
  }

  // *step 5
  if (
    e.target.classList.contains("todoContent") ||
    e.target.classList.contains("circle") ||
    e.target.classList.contains("checkIcon")
  ) {
    let index;
    const id = e.target.parentElement.children[1].getAttribute("data-id");
    const selectedItem = tasksContainer.find((item, indx) => {
      index = indx;
      return item.id == id;
    });
    if (selectedItem.status == "active") {
      createdTask.completeTask(e.target.parentElement, index, tasksContainer);
    } else {
      createdTask.activateTask(e.target.parentElement, index, tasksContainer);
    }
  }
});

function styleBtn() {
  filterBtns.forEach((bt) => {
    bt.style.color = `var(--footerClr)`;
  });
}

// ^^^^update
const updateBtn = document.querySelector(".update");
updateBtn.addEventListener("click", () => {
  createdTask.updateTask(list, input, todoId, tasksContainer);
  if (todoStatus == "completed") {
    createdTask.status = "completed";
    createdTask.completeTask(todoItem, itemIndex, tasksContainer);
  }
  styleBtn();
  filterBtns[0].style.color = `rgb(58, 123, 253)`;
});

// *step 6 & 7

filterBtns.forEach((btn) => {
  filterBtns[0].style.color = `rgb(58, 123, 253)`;
  todoNum.textContent = `${list.children.length} items left`;

  btn.addEventListener("click", function (e) {
    styleBtn();
    e.target.style.color = "rgb(58, 123, 253)";
    list.textContent = "";
    tasksContainer.map((task, indx) => {
      let li;
      if (
        task.status == e.target.getAttribute("data-type") ||
        e.target.getAttribute("data-type") == "all"
      ) {
        createdTask = new Task(task.content, task.id);
        li = createdTask.displayTasks(list, task.content, task.id);
        if (task.status == "completed") {
          createdTask.completeTask(li, indx, tasksContainer);
        }
        todoNum.textContent = `${list.children.length} items left`;
      }
      if (
        e.target.getAttribute("data-type") == "completed" &&
        list.children.length == 0
      ) {
        todoNum.textContent = `0 items left`;
      }
    });
  });
});

// *step 8
const clearBtn = document.querySelector(".clearBtn");
clearBtn.addEventListener("click", () => {
  const newArr = createdTask.clearCompleted(tasksContainer, list);
  tasksContainer = newArr;
  styleBtn();
  filterBtns[0].style.color = `rgb(58, 123, 253)`;
  todoNum.textContent = `${list.children.length} items left`;
  console.log(tasksContainer);
});
