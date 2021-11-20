function Todo(userInput){
    this.id = this.generateRandomId();
    this.value = userInput;
    this.checked = false;
}


Todo.prototype.generateRandomId = function() {
    return Math.floor(Math.random() * 1000000);
}

export default Todo;

