import Todo from "../models/Todo.js";
import View from "../view/index.js";

const listElement = document.querySelector("ul.todo-list");

function App() {

    this.renderState = this.getLocalStorageState();
    this.compList = [...this.getLocalStorageCompletedList()];
    this.actList = [...this.getLocalStorageActiveList()]
    this.todoList = [...this.getLocalStorageTodos()];
    this.listners = {
        delTodo: (function(id) {
            this.deleteTodo(id);
        }).bind(this),
        toggleTodo: (function(id) {
            this.toggleTodo(id)
        }).bind(this),
        editTodo: (function(textToEdit, id) {
            this.editTodo(textToEdit, id);
        }).bind(this),
        switchTodos: (function(firstIndex, secondIndex, list) {
            this.switchTodos(firstIndex, secondIndex, list)
        }).bind(this)
    };

    this.view = new View(listElement, this.listners)
}

App.prototype.switchTodos = function(fId, sId) {
    

    function swap(input, index_A, index_B) {
        let temp = input[index_A];

        input[index_A] = input[index_B];
        input[index_B] = temp;

        return input
    }

    let kekList;
    let allList = swap(this.todoList, fId, sId)
    let swappedCompletList = swap(this.compList, fId, sId)
    let swappedActiveList = swap(this.actList, fId, sId)

    this.LocalStorageSetItemAndRender()


}
App.prototype.getLocalStorageCompletedList = function() { 
    return (JSON.parse(localStorage.getItem("completedList"))) || []

}

App.prototype.getLocalStorageActiveList = function() { 
    return (JSON.parse(localStorage.getItem("activeList"))) || []

}



App.prototype.getLocalStorageTodos = function() { 
    return (JSON.parse(localStorage.getItem("todoList"))) || []

}

App.prototype.getLocalStorageState = function() {
    return (JSON.parse(localStorage.getItem("renderState"))) || "All"
}


App.prototype.init = function() {


    const form = document.querySelector("form"); 

    const section = document.querySelector(".footer-section")

    if(this.todoList.length){
        section.style.display = "block";
    } else {
        section.style.display = "none";
    }
    
    this.showBtnAllClear();
    this.makeAllChecked();

    this.LocalStorageSetItemAndRender()


    form.addEventListener("submit", function(e) {
        const inputValue = document.getElementById("userInput").value;
        const text = inputValue.trim();
        if(text){
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
    
    }.bind(this))

    this.clickFilters()

}


App.prototype.showActive = function() {
    return  this.todoList.filter(function(todo) {
        return !todo.checked;
    })
}

App.prototype.showAll = function() {
    let allTodos = this.todoList;
    return allTodos;
}

App.prototype.showCompleted = function() {
    return  this.todoList.filter(function(todo) {
        return todo.checked;
    })
}


App.prototype.LocalStorageSetItemAndRender = function() {
    let completedList = this.showCompleted();
    let activeList = this.showActive();
    let allTodos = this.showAll();
    let listToRender = [];
    if(this.renderState === "Active") {
        listToRender = [...activeList];
    } else if (this.renderState === "Completed") {
        listToRender = [...completedList];
    } else {
        listToRender = [...allTodos]
    }
    
    localStorage.setItem("renderState", JSON.stringify(this.renderState))
    localStorage.setItem("todoList", JSON.stringify(allTodos))
    localStorage.setItem("completedList", JSON.stringify(completedList))
    localStorage.setItem("activeList", JSON.stringify(activeList))

    this.view.render(listToRender);
}


App.prototype.addTodo = function(inputValue) {
    const todoInst = new Todo(inputValue);
    const todo = {
        id: todoInst.id,
        text: todoInst.value,
        checked: todoInst.checked
    }
    this.todoList.unshift(todo)
    this.LocalStorageSetItemAndRender()
   
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
    this.LocalStorageSetItemAndRender()
}


App.prototype.toggleTodo = function(todoId) {


    let newList = this.todoList.map(function(todo) {
        if(todo.id === todoId){
            let obj = {
                ...todo,
                checked: !todo.checked
            }
            return obj
        } else {
            return todo;
        }
    })
    this.todoList = newList;
    this.showBtnAllClear();
    this.LocalStorageSetItemAndRender()
    
}


App.prototype.editTodo = function(textToEdit, todoId) {
    this.todoList = this.todoList.map(function(todo) {
        if(todo.id === todoId){
            let obj = {
                id: todo.id,
                text: textToEdit.trim(),
                checked: todo.checked
            }
            return obj
        } else {
            return todo
        }
    })
    this.LocalStorageSetItemAndRender()
}


App.prototype.clickFilters = function(){
    const filterBtns = document.querySelector("ul.filters");
    filterBtns.addEventListener("click", function(e) {
        if(e.target.classList[0] === "left-btn") {
            this.renderState = "Active"
        } else if(e.target.classList[0] === "center-btn") {
            this.renderState = "All"
        } else if (e.target.classList[0] === "right-btn") {
            this.renderState = "Completed"
        }

        this.LocalStorageSetItemAndRender()

    }.bind(this))

}



App.prototype.makeAllChecked = function() {
    let checkAllBtn = document.getElementById("all-complete");

    checkAllBtn.addEventListener("click",  function() {
        let newList = this.todoList.map(function(todo) {
            return {
                ...todo,
                checked: true
            }
        })

        this.todoList = newList;
        this.showBtnAllClear();
        this.LocalStorageSetItemAndRender();

    }.bind(this))
}

App.prototype.clearAllComplete = function() {

    this.todoList = this.todoList.filter(function(todo) {
        return !todo.checked
    })

    this.LocalStorageSetItemAndRender()
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
                const wrapper = document.getElementById("mdl-wrapper");
                wrapper.replaceChildren()
            });

        }.bind(this))
    } else {
        clearAllBtn.style.display = "none";
    }
}



export default App;