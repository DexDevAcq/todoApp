
function View(rootElement, listners) {
    this.root = rootElement;
    this.deleteTodo = listners.delTodo;
    this.toggleTodo = listners.toggleTodo;
    this.editTodo = listners.editTodo;
}



View.prototype.render = function(todos, flag){
    this.clear();
    const fragment = document.createDocumentFragment();
    if(flag === "completed") {
        todos.forEach(function(todo) {

            const li = document.createElement("li");
            const input = document.createElement("input");
    
            // li.addEventListener("click", function() {
            //     this.toggleTodo(todo.id);
            // }.bind(this))
    
            li.classList.add("todo");
            li.classList.add("completed");
    
    
            input.type = "checkbox";
            input.checked = true;
            input.addEventListener("click", function() {
                li.classList.toggle("completed")
                this.toggleTodo(todo.id);
            }.bind(this))
    
            const p = document.createElement("p");
            p.insertAdjacentText("afterbegin", todo.text)
            p.addEventListener("click", function() {
                this.toggleTodo(todo.id);
                li.classList.toggle("completed")
                input.checked = !input.checked;
            }.bind(this))
    
            const button = document.createElement("button");
            button.classList.add("del-btn");
            button.insertAdjacentText("afterbegin", "Del");
            button.addEventListener("click", function() {
                this.deleteTodo(todo.id);
            }.bind(this));
    
    
            const buttonEdit = document.createElement("button")
            buttonEdit.classList.add("edit-btn")
            buttonEdit.insertAdjacentText("afterbegin", "Edit")
            buttonEdit.addEventListener("click", function() {
                this.makeNewTodoInput(todo, li);
            }.bind(this))
            
            li.appendChild(input);
            li.appendChild(p);
            li.appendChild(button);
            li.appendChild(buttonEdit);
            
            fragment.appendChild(li);
    
            this.root.appendChild(fragment);
        }.bind(this))

    } else if (flag === "all") {
        todos.forEach(function(todo) {

            const li = document.createElement('li');
            const input = document.createElement('input');
    
            // li.addEventListener("click", function() {
            //     this.toggleTodo(todo.id);
            // }.bind(this))
    
            li.classList.add('todo');
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
                this.deleteTodo(todo.id);
            }.bind(this));
    
    
            const buttonEdit = document.createElement('button')
            buttonEdit.classList.add("edit-btn")
            buttonEdit.insertAdjacentText("afterbegin", "Edit")
            buttonEdit.addEventListener("click", function() {
               this.makeNewTodoInput(todo, li);

            }.bind(this))

            
            li.appendChild(input);
            li.appendChild(p);
            li.appendChild(button);
            li.appendChild(buttonEdit);
            
            fragment.appendChild(li);
    
            this.root.appendChild(fragment);
        }.bind(this))
    } else {
        todos.forEach(function(todo) {

            const li = document.createElement('li');
            const input = document.createElement('input');
    
            // li.addEventListener("click", function() {
            //     this.toggleTodo(todo.id);
            // }.bind(this))
    
            li.classList.add('todo');
    
    
            input.type = "checkbox";
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
                this.deleteTodo(todo.id);
            }.bind(this));
    
    
            const buttonEdit = document.createElement('button')
            buttonEdit.classList.add("edit-btn")
            buttonEdit.insertAdjacentText("afterbegin", "Edit")
            buttonEdit.addEventListener("click", function() {
                this.makeNewTodoInput(todo, li);
            }.bind(this))
            
            li.appendChild(input);
            li.appendChild(p);
            li.appendChild(button);
            li.appendChild(buttonEdit);
            
            fragment.appendChild(li);
    
            this.root.appendChild(fragment);
        }.bind(this))
    }
    
}  

View.prototype.clear = function() {
    this.root.replaceChildren();
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
   editForm.addEventListener("submit", function(e) {
    const inputValue = document.getElementById("editInput").value;
    const text = inputValue.trim();
        if(text){
            console.log("input: ", text)
            e.preventDefault()
            this.editTodo(inputValue, todo.id)
        } else {
            this.deleteTodo(todo.id);
            e.preventDefault()
        }
    }.bind(this))
   console.log(editForm);
}

export default View;