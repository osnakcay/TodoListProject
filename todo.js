// I choose all the elements
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners() { // All event listeners
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearTodos);
}

function clearTodos(e) {
    if (confirm("Are you sure you want to delete them all?")) {
        // Delete from UI
        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
        showAlert("success", "All todos have been deleted...")
    }
}

function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");
    listItems.forEach(function (listItem) {
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue) === -1) {
            // Could not find
            listItem.setAttribute("style", "display : none !important");
        }
        else {
            listItem.setAttribute("style", "display : block");
        }
    })
}

function deleteTodo(e) {
    if (e.target.className === "fa fa-remove") {
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success", "Todo has been successfully deleted...");
    }
}

function deleteTodoFromStorage(deletetodo, index) {
    let todos = getTodosFromStorage();
    todos.forEach(function (todo) {
        if (todo === deletetodo) {
            todos.splice(index, 1);  // Deleting values from Array
        }
    });

    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI() {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo) {
        addTodoToUI(todo);
    })
}

function addTodo(e) {
    const newTodo = todoInput.value.trim();

    if (newTodo == "") {
       
        showAlert("danger", "Didn't enter todo.Please enter a todo!");
    }
    else if (controller(newTodo)){
        showAlert("danger","This todo already exists!")
    }
    else {
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success", "Todo successfully added.");
    }

    e.preventDefault();
    todoInput.value = "";
}

function controller(todo){
    answer = false;
    const list = document.querySelectorAll(".list-group-item");
    list.forEach(function(e){
        if (e.textContent === todo){
            answer = true;
        }
    })
    return answer;
}

function getTodosFromStorage() { // Will take all the todos from the storage
    let todos;

    if (localStorage.getItem("todos") === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function addTodoToStorage(newTodo) {
    let todos = getTodosFromStorage();
    todos.push(newTodo);

    localStorage.setItem("todos", JSON.stringify(todos));
}

function showAlert(type, message) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;

    alert.textContent = message;

    firstCardBody.appendChild(alert);

    // setTimeout metod
    setTimeout(function () {
        alert.remove();
    }, 2000);

}

function addTodoToUI(newTodo) { // Will add string value as list item to UI
    // Creating a List Item
    const listItem = document.createElement("li");
    // Creating a link
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    listItem.className = "list-group-item d-flex justify-content-between";

    // Adding Text Node
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    // Adding a List Item to Todo List
    todoList.appendChild(listItem);
}