import Todo from "../models/Todo.js";
import View from "../view/index.js";

const listElement = document.querySelector("ul.todo-list");

function App() {

    this.todos = this.getLocalStorage();
    this.todoList = [...this.todos];
    this.listners = {
        delTodo: (function(id) {
            this.deleteTodo(id);
        }).bind(this),
        toggleTodo: (function(id) {
            this.toggleTodo(id)
        }).bind(this),
        editTodo: (function(textToEdit, id) {
            this.editTodo(textToEdit, id);
        }).bind(this)
    };

    this.view = new View(listElement, this.listners)
}


App.prototype.getLocalStorage = function() {
    let reference = localStorage.getItem("todoList")
    return JSON.parse(reference)

}


App.prototype.init = function() {


    const form = document.querySelector("form"); 

    const section = document.querySelector(".footer-section")

    if(this.todoList.length){
        section.style.display = "block";
    } else {
        section.style.display = "none";
    }
    
    this.showBtnAllClear()

    this.LocalStorageSetItem(this.todoList, "all")


    form.addEventListener("submit", function(e) {
        const inputValue = document.getElementById("userInput").value;
        // const text = inputValue.replace(/\s+/g, '')
        const text = inputValue.trim();
        if(text){
            console.log("input: ", text.length, text.trim().length)
            e.target.reset()
            e.preventDefault()
            this.addTodo(text);
        } else {
            e.preventDefault()
            e.target.reset()
        }
        if(this.todoList.length){
            section.style.display = "block";
        } else {
            section.style.display = "none";
        }
    
        console.log(this.todoList);
    }.bind(this))

    this.clickFilters()

}


App.prototype.LocalStorageSetItem = function(list, flag) {
    localStorage.setItem("todoList", JSON.stringify(list))
    this.view.render(list, flag);
}


App.prototype.addTodo = function(inputValue) {
    const todoInst = new Todo(inputValue);
    const todo = {
        id: todoInst.id,
        text: todoInst.value,
        checked: todoInst.checked
    }
    this.todoList.unshift(todo)
    this.LocalStorageSetItem(this.todoList, "all")
   
}


App.prototype.deleteTodo = function(todoId) {
    const section = document.querySelector(".footer-section")
    this.todoList = this.todoList.filter(function(todo) {
        return todo.id !== todoId;
    })

    if(this.todoList.length === 0) {
        section.style.display = "none";
    }
    this.showBtnAllClear();
    this.LocalStorageSetItem(this.todoList, "all")
}


// doesn't work in right way
App.prototype.toggleTodo = function(todoId) {


    let newList = this.todoList.map(function(todo) {
        if(todo.id === todoId){
            let obj = {
                ...todo,
                checked: !todo.checked
            }
            console.log('checked obj', obj)
            return obj
        } else {
            console.log("another todo", todo)
            return todo;
        }
    })
    this.todoList = newList;
    this.showBtnAllClear();
    this.LocalStorageSetItem(this.todoList, "all")
    
}


App.prototype.editTodo = function(textToEdit, todoId) {
    this.todoList = this.todoList.map(function(todo) {
        if(todo.id === todoId){
            let obj = {
                id: todo.id,
                text: textToEdit.trim(),
                checked: todo.checked
            }
            console.log(obj)
            return obj
        } else {
            console.log(todo)
            return todo
        }
    })
    this.LocalStorageSetItem(this.todoList, "all")
}


App.prototype.clickFilters = function(){
    const filterBtns = document.querySelector("ul.filters");
    filterBtns.addEventListener("click", function(e) {
        // console.log(e.target.classList[0])
        if(e.target.classList[0] === "left-btn") {
            let notCompletedTasks = this.showActive();
            return this.LocalStorageSetItem(notCompletedTasks, "not-completed");
        } else if(e.target.classList[0] === "center-btn") {
            let allTodos = this.showAll();
            return this.LocalStorageSetItem(allTodos, "all");
        } else if (e.target.classList[0] === "right-btn") {
            let completedTodos = this.showCompleted();
            return this.LocalStorageSetItem(completedTodos, "completed");
        }

    }.bind(this))

}


App.prototype.clearAllComplete = function() {

    this.todoList = this.todoList.filter(function(todo) {
        return !todo.checked
    })

    this.LocalStorageSetItem(this.todoList, "all")
}

App.prototype.showBtnAllClear = function() {
    const section = document.querySelector(".footer-section")
    let oneChecked = this.todoList.some(function(todo) {
        return todo.checked
    })
    const clearAllBtn = document.getElementById("bottom-btn");
    if(oneChecked) {
        clearAllBtn.style.display = "block";
        clearAllBtn.addEventListener("click", function() {
            this.clearAllComplete()
            clearAllBtn.style.display = "none";
            if(this.todoList.length) {
                section.style.display = "block"
            } else {
                section.style.display = "none"
            }

        }.bind(this))
    } else {
        clearAllBtn.style.display = "none";
    }
}

App.prototype.showActive = function() {
    return this.todoList.filter(function(todo) {
        return !todo.checked;
    })
}

App.prototype.showAll = function() {
    let allTodos = this.todoList;
    return allTodos;
}

App.prototype.showCompleted = function() {
    return this.todoList.filter(function(todo) {
        return todo.checked;
    })
}

export default App;