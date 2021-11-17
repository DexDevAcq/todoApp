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
    return (JSON.parse(localStorage.getItem("todoList"))) || []

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

    this.LocalStorageSetItem(this.todoList)


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


App.prototype.LocalStorageSetItem = function(list) {
    localStorage.setItem("todoList", JSON.stringify(list))
    this.view.render(list);
}


App.prototype.addTodo = function(inputValue) {
    const todoInst = new Todo(inputValue);
    const todo = {
        id: todoInst.id,
        text: todoInst.value,
        checked: todoInst.checked
    }
    this.todoList.unshift(todo)
    this.LocalStorageSetItem(this.todoList)
   
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
    this.LocalStorageSetItem(this.todoList)
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
    this.LocalStorageSetItem(this.todoList)
    
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
    this.LocalStorageSetItem(this.todoList)
}


App.prototype.clickFilters = function(){
    const filterBtns = document.querySelector("ul.filters");
    filterBtns.addEventListener("click", function(e) {
        let filteredList = [];
        if(e.target.classList[0] === "left-btn") {
            let activeList = this.showActive();
            filteredList = [...activeList]
        } else if(e.target.classList[0] === "center-btn") {
            console.log('all')
            filteredList = this.showAll();
        } else if (e.target.classList[0] === "right-btn") {
            console.log('comp')
            let completedList =  this.showCompleted();
            filteredList = [...completedList]
        }

        return this.view.render(filteredList);

    }.bind(this))

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

            this.view.createModalWindow().then(function() {
                this.clearAllComplete()
                clearAllBtn.style.display = "none";
                if(this.todoList.length) {
                    section.style.display = "block"
                } else {
                    section.style.display = "none"
                }
                const wrapper = document.getElementById("mdl-wrapper");
                wrapper.replaceChildren()
            }.bind(this)).catch(function(e) {
                console.log(e)
                const wrapper = document.getElementById("mdl-wrapper");
                wrapper.replaceChildren()
            });

        }.bind(this))
    } else {
        clearAllBtn.style.display = "none";
    }
}



export default App;