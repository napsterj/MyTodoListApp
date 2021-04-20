// Declarations
const form = document.querySelector("form");
const inputTaskName = document.querySelector("#name");
const inputComments = document.querySelector("#comments");
const inputExecutingDate = document.querySelector("#exeDate");
const todos = document.querySelector("#todos");

// Create class for task
class Todos {
    constructor(taskName, comments, executingDate) {
      this.taskId = 0;
      this.taskName = taskName;
      this.comments = comments;
      this.executingDate = executingDate;
      this.createdDate = new Date(Date.now()).toLocaleString();
    }
  
    // Add task method
    addTodo(todo) {
      this.removeEmptyRow();
      todo.taskId = todos.children.length + 1;
      this.addTasktoStore(todo);
      this.createMarkUp(todo);
    }
  
    // Generating the data rows
    createMarkUp(todo) {
      const tr = document.createElement("tr");
      tr.className =
        (todos.children.length + 1) % 2 === 0
          ? "table-primary"
          : "table-secondary";
      tr.innerHTML = `<td style='display:none'><small>${todo.taskId}</small></td>
                          <td><small>${todo.taskName}</small></td>
                          <td><small>${todo.comments}</small></td>
                          <td><small><strong>${todo.executingDate}</strong></small></td>
                          <td><small>${todo.createdDate}</small></td>
                          <td><button class='btn btn-danger btn-sm delete'>Remove</button></td>`;
      todos.appendChild(tr);
    }
  
    // Get all task method
    getAllTask() {
      let updatedTodos = this.getAllTaskFromStore();
      updatedTodos = JSON.parse(updatedTodos);
      
      if (updatedTodos !== null && updatedTodos.length > 0) {
        updatedTodos.forEach((todo) => this.createMarkUp(todo));
      } else {
        this.addEmptyRow();
      }
    }
  
    // Add message when no records
    addEmptyRow() {
      const emptyTR = document.createElement("tr");
      const td = document.createElement("td");
      td.setAttribute("colspan", "6");
      td.innerText = "No pending tasks found";
      emptyTR.appendChild(td);
      emptyTR.id = "empty";
      emptyTR.className = "table-warning text-center";
      todos.appendChild(emptyTR);
    }
  
    // Remove empty row
    removeEmptyRow() {
      const tr = document.querySelector("#empty");
      if (tr) {
        tr.remove();
      }
    }
  
    // Remove task method
    async removeTask(element) {
      if (element.classList.contains("delete")) {
        const taskId =
          element.parentElement.parentElement.firstElementChild.innerText;
  
        //remove the element from UI only after it is removed from localStorage
        await this.removeTaskFromStore(taskId);
        element.parentElement.parentElement.remove();
  
        if (todos.children.length === 0) {
          this.addEmptyRow();
        }
      }
    }
  
    // Add task to store
    async addTasktoStore(todo) {
      let todos = await this.getAllTaskFromStore();
      todos = todos === null ? [] : JSON.parse(todos);
      todos = [...todos, { ...todo }];
      localStorage.setItem("todos", JSON.stringify(todos));
      await this.displayRelevantMessage(true);
    }
  
    // Show added or removed messages
    displayRelevantMessage(isAdded) {
      
      
      const span = document.querySelector("#message");
      span.className = "badge badge-primary mb-3";
      span.innerText = `Task ${isAdded ? "added" : "removed"} successfully`;
  
      //hide message after 3 seconds
      setTimeout(() => (span.className = "hide"), 3000);
    }
  
    // Display error messages
    displayValidationErrors() {
      const spanError = document.querySelector("#errors");
      const errorMessage = inputTaskName.value === "" ? "Task name" : "Task date";
      spanError.classList = "badge badge-danger text-center mb-2";
      spanError.innerText = errorMessage + " is required field.";
  
      //hide message after 3 seconds
      setTimeout(() => (spanError.className = "hide"), 3000);
    }
  
    // Get all task from store
    getAllTaskFromStore() {
      let todos = localStorage.getItem("todos");
      return todos;
    }
  
    // Remove task from store
    async removeTaskFromStore(taskId) {
      let todos = this.getAllTaskFromStore();
      todos = JSON.parse(todos);
      todos = todos.filter((todo) => {
        return todo.taskId !== Number(taskId);
      });
      localStorage.setItem("todos", JSON.stringify(todos));
      await this.displayRelevantMessage(false);
    }
  
    // Clear the controls
   static clearControls() {
      inputTaskName.value = "";
      inputComments.value = "";
      inputExecutingDate.value = "";
  
      return new Todos("", "", "");
    }
  }

//Instance object before initialization
let todo = new Todos("", "", "");;

document.querySelector("#todos").addEventListener("click", (e) => {  
  todo.removeTask(e.target);
});

// When page is loaded
document.addEventListener("DOMContentLoaded", () => {  
  todo.getAllTask();  
});

// Form submit to add the new task
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputTaskName.value === "" || inputExecutingDate.value === "") {
    todo.displayValidationErrors();
  } else {
    const todo = new Todos(
      inputTaskName.value,
      inputComments.value,
      inputExecutingDate.value
    );
    todo.addTodo(todo);
    Todos.clearControls();
  }
});


