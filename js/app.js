// Declarations 
const form = document.querySelector('form');
const inputTaskName = document.querySelector('#name');
const inputComments = document.querySelector('#comments');
const inputExecutingDate = document.querySelector('#exeDate');
const todos = document.querySelector('#todos');


document.querySelector('#todos').addEventListener('click', (e) => {    
    Todos.removeTask(e.target);    
});

// When page is loaded
document.addEventListener('DOMContentLoaded', () => {
    Todos.getAllTask();
    inputExecutingDate.setAttribute('placeholder', 'dd/mm/yyyy');
});

// Form submit to add the new task
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(inputTaskName.value === '' || inputExecutingDate.value === '') {        
        Todos.displayValidationErrors();
    } 
    else {
        const todo = new Todos(inputTaskName.value, inputComments.value, inputExecutingDate.value);    
        Todos.addTodo(todo);        
        Todos.clearControls();   
   }
})

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
static addTodo(todo){    
    this.removeEmptyRow();    
    todo.taskId = todos.children.length + 1;     
    this.addTasktoStore(todo);                 
    this.createMarkUp(todo);    
}

// Generating the data rows
static createMarkUp(todo) {        
    const tr = document.createElement('tr');
    tr.className = ((todos.children.length + 1) % 2 === 0) ? 'table-primary' : 'table-secondary';            
    tr.innerHTML = `<td style='display:none'><small>${todo.taskId}</small></td>
                        <td><small>${todo.taskName}</small></td>
                        <td><small>${todo.comments}</small></td>
                        <td><small><strong>${todo.executingDate}</strong></small></td>
                        <td><small>${todo.createdDate}</small></td>
                        <td><button class='btn btn-danger btn-sm delete'>Remove</button></td>`;
    todos.appendChild(tr);
}

// Get all task method
static getAllTask() {          
   let updatedTodos = this.getAllTaskFromStore();   
   updatedTodos = JSON.parse(updatedTodos);       
             
   if(updatedTodos.length > 0){      
      updatedTodos.forEach((todo)=>  this.createMarkUp(todo));       
   } else   {
       this.addEmptyRow()
   }
}

// Add message when no records
static addEmptyRow() {
    const emptyTR = document.createElement('tr');
    const td = document.createElement('td');
    td.setAttribute('colspan','6');
    td.innerText = 'No pending tasks found';    
    emptyTR.appendChild(td);    
    emptyTR.id = 'empty';
    emptyTR.className = 'table-light text-center'
    todos.appendChild(emptyTR);
}

// Remove empty row
static removeEmptyRow() {
    const tr = document.querySelector('#empty');    
    if(tr) {
       tr.remove();
    }
}

// Remove task method
static removeTask(element){        
    if(element.classList.contains('delete')){        
        const taskId = element.parentElement.parentElement.firstElementChild.innerText;        
        this.removeTaskFromStore(taskId);             
        element.parentElement.parentElement.remove();      
        if(todos.children.length === 0) {
            this.addEmptyRow();
        }  
    }
}

// Add task to store
static addTasktoStore(todo) {    
    let todos = this.getAllTaskFromStore();                  
    todos = todos === null ? [] : JSON.parse(todos);     
    todos = [...todos, {...todo}];    
    localStorage.setItem('todos', JSON.stringify(todos));    
    this.displayRelevantMessage(true);
}

// Show added or removed messages 
static displayRelevantMessage(isAdded) {
    const divMessage = document.querySelector('#message');    
    divMessage.className = 'alert alert-dismissible alert-primary text-center';    
    divMessage.innerText = `Task ${isAdded ? 'added' : 'removed'} successfully`;
    
    //hide message after 3 seconds
    setTimeout(()=> divMessage.className = 'hide', 3000);
}

// Display error messages
static displayValidationErrors() {
    const divError = document.querySelector('#errors');
    const errorMessage = (inputTaskName.value === '') ? 'Task name' : 'Task date';   
    divError.classList = 'alert alert-dismissible alert-danger text-center';
    divError.innerText = errorMessage + ' is required field.';

    //hide message after 3 seconds
    setTimeout(()=> divError.className = 'hide', 3000);
}

// Get all task from store
static getAllTaskFromStore() {
    let todos = localStorage.getItem('todos');       
    return todos;
}

// Remove task from store
static removeTaskFromStore(taskId) {
    let todos = this.getAllTaskFromStore();
    todos = JSON.parse(todos);       
    todos = todos.filter((todo) => {        
        return todo.taskId !== Number(taskId);
    });   
   localStorage.setItem('todos', JSON.stringify(todos));       
   this.displayRelevantMessage(false);
}

// Clear the controls 
static clearControls(){
    inputTaskName.value = '';
    inputComments.value = '';
    inputExecutingDate.value = '';
    
    return new Todos('','','');
}
}