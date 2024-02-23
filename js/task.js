export default class Task {
  constructor(content, id) {
    this.content = content;
    this.status = "active";
    this.id = id;
  }

  createTask(arr) {
    arr.push(this);
    localStorage.setItem("tasks", JSON.stringify(arr));
  }

  displayTasks(list, content, id) {
    const li = document.createElement("li");
    li.innerHTML = `<div class="circle">
    <img
      src="./images/icon-check.svg"
      alt="check icon"
      class="checkIcon"
    />
  </div>
  <p class="todoContent" data-id='${id}'>${content}</p>
  <div class="control">
    <p class="edit" data-id='${id}'>Edit</p>
    <img
      src="./images/icon-cross.svg"
      alt="cross icon"
      class="crossIcon"
      data-id='${id}'
    />
  </div>`;

    list.appendChild(li);
    return li;
  }

  editTask(input, id, arr) {
    const taskId = id;
    const item = arr.find((task) => {
      return task.id == +taskId;
    });
    input.value = item.content;
    input.parentElement.children[0].style.display = "none";
    input.parentElement.children[1].style.display = "block";
  }

  updateTask(list, input, id, arr) {
    list.textContent = "";
    arr.map((task, indx) => {
      if (task.id == id) {
        task.content = input.value;
      }
      const li = this.displayTasks(list, task.content, task.id);
      if (task.status == "completed") {
        this.completeTask(li, indx, arr);
      }
    });

    localStorage.setItem("tasks", JSON.stringify(arr));
    input.parentElement.children[0].style.display = "block";
    input.parentElement.children[1].style.display = "none";
    input.value = "";
  }

  completeTask(task, indx, arr) {
    task.children[1].style.textDecoration = "line-through";
    arr[indx].status = "completed";
    localStorage.setItem("tasks", JSON.stringify(arr));
    task.children[0].style.cssText = `background-image:linear-gradient(
        150deg,
        rgb(58, 123, 253) 0%,
        rgb(87, 221, 255) 30%,
        rgb(192, 88, 243) 90%
      );`;
    task.children[0].children[0].style.display = "block";
  }

  activateTask(task, indx, arr) {
    task.children[1].style.textDecoration = "none";
    arr[indx].status = "active";
    localStorage.setItem("tasks", JSON.stringify(arr));
    task.children[0].style.cssText = `background-image:none`;
    task.children[0].children[0].style.display = "none";
  }

  clearCompleted(arr, list) {
    arr = arr.filter((item) => {
      return item.status != "completed";
    });
    localStorage.setItem("tasks", JSON.stringify(arr));
    list.textContent = ``;
    arr.map((task) => {
      this.displayTasks(list, task.content, task.id);
    });
    return arr;
  }

  deleteTask(arr, id, list) {
    arr = arr.filter((item) => {
      return item.id != id;
    });
    localStorage.setItem("tasks", JSON.stringify(arr));
    console.log(arr);
    list.textContent = ``;
    arr.forEach((item, indx) => {
      const li = this.displayTasks(list, item.content, item.id);
      if (item.status == "completed") {
        this.completeTask(li, indx, arr);
      }
      console.log(item);
    });
    return arr;
  }
}
