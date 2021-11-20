
function View(rootElement, listners) {
    this.root = rootElement;
    this.deleteTodo = listners.delTodo;
    this.toggleTodo = listners.toggleTodo;
    this.editTodo = listners.editTodo;
    this.switchTodos = listners.switchTodos;
}


View.prototype.render = function(todos){
    this.clear();
    const fragment = document.createDocumentFragment();
    let listItems = [];
        todos.forEach(function(todo, index) {
            const li = document.createElement('li');

            const input = document.createElement('input');
            const div = document.createElement("div");
            div.classList.add("draggable");
    
    
            li.classList.add('todo');
            div.setAttribute("draggable", "true");
            li.setAttribute("data-index", index);
            div.setAttribute("id", index)
            if(todo.checked){
                li.classList.add("completed")
            }
   
    
            input.type = "checkbox";
            input.checked = todo.checked;
            input.addEventListener('click', function() {
                li.classList.toggle("completed")
                this.toggleTodo(todo.id);
            }.bind(this))
    
            const p = document.createElement('p');
            p.insertAdjacentText('afterbegin', todo.text)
            p.addEventListener('click', function() {
                this.toggleTodo(todo.id);
                li.classList.toggle("completed")
                input.checked = !input.checked;
            }.bind(this))
    
            const button = document.createElement('button');
            button.classList.add("del-btn");
            button.insertAdjacentText("afterbegin", "Del");
            button.addEventListener("click", function() {
                const delFunc =  this.deleteTodo;

                this.createModalWindow().then(function() {
                    delFunc(todo.id);
                    const wrapper = document.getElementById("mdl-wrapper");
                    wrapper.replaceChildren()
                }).catch(function(e) {
                    const wrapper = document.getElementById("mdl-wrapper");
                    wrapper.replaceChildren()
                });
            }.bind(this));
    
    
            const buttonEdit = document.createElement('button')
            buttonEdit.classList.add("edit-btn")
            buttonEdit.insertAdjacentText("afterbegin", "Edit")
            buttonEdit.addEventListener("click", function() {
               this.makeNewTodoInput(todo, div);

            }.bind(this))

            
            div.appendChild(input);
            div.appendChild(p);
            div.appendChild(button);
            div.appendChild(buttonEdit);
            li.appendChild(div)
            
            fragment.appendChild(li);
            listItems.push(li)
    
            this.root.appendChild(fragment);

        }.bind(this))

    this.addListeners(listItems);


}  



View.prototype.addListeners = function(todoList) {
    let dragStartIndex;
    const todos = document.querySelectorAll(".draggable")
    const todoListDragble = document.querySelectorAll(".todo-list li")
    
    let listItems = todoList;

    function dragStart() {
        dragStartIndex = +this.closest("li").getAttribute("data-index")
    }

    function dragEnter() {
        this.classList.add("over")
        this.firstChild.classList.add("over")
    }
    function dragLeave() {
        this.classList.remove("over")
        this.firstChild.classList.remove("over")
    }
    function dragOver(e) {
        e.preventDefault();
    }

    let switchReference =  this.switchTodos;

    function swapItems(fromIndex, toIndex) {
        const divOne = listItems[fromIndex].querySelector(".draggable")
        const divTwo = listItems[toIndex].querySelector(".draggable");
        let idOne = +divOne.id;
        let idTwo = +divTwo.id


        listItems[fromIndex].appendChild(divTwo);
        listItems[toIndex].appendChild(divOne);

        switchReference(idOne, idTwo, listItems)
    }


    function dragDrop() {

        const dragEndIndex = +this.getAttribute("data-index")
        swapItems(dragStartIndex, dragEndIndex);
        this.classList.remove("over")
        this.firstChild.classList.remove("over")
    }

    
   

    todos.forEach(function(todo) {
        todo.addEventListener("dragstart", dragStart)
    })

    todoListDragble.forEach(function(item) {
        item.addEventListener("dragover", dragOver);
        item.addEventListener("drop", dragDrop);
        item.addEventListener("dragenter", dragEnter);
        item.addEventListener("dragleave", dragLeave)
    }.bind(this))


}



View.prototype.clear = function() {
    this.root.replaceChildren();
}


View.prototype.createModalWindow = function(todoId) {
    const main = document.getElementById("main-window");

    const wrapper = document.getElementById("mdl-wrapper");
    wrapper.replaceChildren()


    const modal = document.createElement("div");
    modal.classList.add("modal-window");

    const icon = document.createElement("div");
    icon.classList.add("win-icon");

    const h1 = document.createElement("h1");
    h1.insertAdjacentText("afterbegin", "Are you sure?")

    const modalBtns = document.createElement("div");
    modalBtns.classList.add("modal-btns")

    const deleteBtn = document.createElement("button");
    deleteBtn.insertAdjacentText("afterbegin", "Delete")
    deleteBtn.classList.add("modal-btn");
    deleteBtn.classList.add("delete");

    const declineBtn = document.createElement("button");
    declineBtn.classList.add("modal-btn");
    declineBtn.classList.add("decline");
    declineBtn.insertAdjacentText("afterbegin", "Decline")

    modalBtns.appendChild(deleteBtn);
    modalBtns.appendChild(declineBtn);

    icon.appendChild(h1);
    icon.appendChild(modalBtns);


    wrapper.appendChild(modal);
    wrapper.appendChild(icon)

    return new Promise(function(resolve, reject) {
        deleteBtn.addEventListener("click", function() {
            resolve()
        })
        declineBtn.addEventListener("click", function() {
            reject()
        })
    })

}



View.prototype.makeNewTodoInput = function(todo, parentNode) {
    let newInput = document.createElement("input");
    let editForm = document.createElement("form");
    newInput.setAttribute("type", "text")
    newInput.setAttribute("id", "editInput");
    newInput.classList.add("edit-field");
    newInput.value = todo.text;
    editForm.appendChild(newInput);
    
   let [, p] = [...parentNode.getElementsByTagName("*")];
   parentNode.replaceChild(editForm, p);
   newInput.focus()

   let timeOutId = setTimeout(function() {
    document.body.addEventListener("click", function(e) {
        p.textContent = todo.text
        editForm.replaceWith(p)
        clearTimeout(timeOutId)
        document.body.removeEventListener("click", console.log('removed'))
    })
   }, 0)
   
   editForm.addEventListener("submit", function(e) {
    document.body.removeEventListener("click", console.log('removed'))
    clearTimeout(timeOutId)
    const inputValue = document.getElementById("editInput").value;
    const text = inputValue.trim();
        if(text){
            e.preventDefault()
            this.editTodo(inputValue, todo.id)
        } else {
            this.deleteTodo(todo.id);
            e.preventDefault()
        }
    }.bind(this))
  
}

export default View;






