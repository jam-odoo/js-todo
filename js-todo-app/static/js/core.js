//Local Storage Helper TodoList for Todo Application
//Fucntion to get the current stage of the todo item list object (json object)
function getLocalStorage(){
   return localStorage.todoList ? JSON.parse(localStorage.todoList) : [];
}
//Update the local storage state to done by given name.
function updateLocalStorage(name){
    var storedTodos = getLocalStorage();
    //loop through all item and find matching name. 
    //For duplicate names does not respect any index, first found will done.
    //TODO: make localStorage by Index to improve the duplicate item handling.
    for (item in  storedTodos){
        if (storedTodos[item].name === name){
            storedTodos[item].done = true;
        }
    }
    localStorage.todoList = JSON.stringify(storedTodos);
}
//Add given name to the todo item object list.
function addToLocalStorage(name){
    var storedTodos = getLocalStorage();
    storedTodos.push({"name": name, "done": false})
    localStorage.todoList = JSON.stringify(storedTodos);
}
//remove the give name from the todo item object list.
function popFromLocalStorage(name){
    var storedTodos = getLocalStorage();
    //find index make sure right index and splice it.
    for (item in  storedTodos){
        if (storedTodos[item].name === name){
            storedTodos.splice(item, 1);
        }
    }
    localStorage.todoList = JSON.stringify(storedTodos);
}
/*
Main Application function to hold the business logic.
It will read textbox todo list from html when started, and it will call the restoreState
to restore the previous todo item list if anything is stored. Also link the Add event 
for add item button.
*/

function todoApplication(){ 
    var addItemBtn = document.querySelector("#addtodoitem");
    var todoList = document.querySelector("#todolist");
    var itemValue = document.querySelector("#newtodoitem");

    //event handler to remove the item form localStorage and UI
    function unlinkItem(name) {
        var li = this.parentNode
        var node = li.firstElementChild.textContent
        if (li && node){
            todoList.removeChild(li);
            popFromLocalStorage(node)
        }
    }
    //event handler to set item to done in localStorage and UI
    function doneItem(){
        if (this.parentElement.firstChild){
            this.parentElement.firstChild.classList.add("completed");
            this.parentElement.setAttribute("data-done", "true");
            var node = this.parentNode.firstElementChild.textContent
            updateLocalStorage(node)
        }
        this.style.visibility = "hidden";
    }
    //helper function to prepare done and remove node.
    function prepareActionNode(class_name, text, action){
        var node = document.createElement('a');
        node.setAttribute("href", "#");
        node.setAttribute("class", class_name);
        node.innerHTML = text;
        node.addEventListener("click", action);
        return node
    }
    //add new item and stage to the todo list and localStorage
    function addItem(name, toLocalStore, done){
        var newNode = document.createElement('li');
        var nodeSpan = document.createElement('span');
        var doneNode = prepareActionNode("done-item", "done", doneItem);
        nodeSpan.innerHTML = name
        nodeSpan.setAttribute("data-done", "false");
        nodeSpan.setAttribute("id", "li-text-label");
        if(done){
            nodeSpan.setAttribute("class", "completed");
            doneNode.style.visibility = 'hidden';
        }
        newNode.setAttribute("id", "todolist-item");
        newNode.appendChild(nodeSpan);
        newNode.appendChild(prepareActionNode("unlink-item", "remove", unlinkItem));
        newNode.appendChild(doneNode);
        todoList.appendChild(newNode);
        //Extra condition to not add duplicate and crab again restore state addItem call.
        if (toLocalStore){
            addToLocalStorage(itemValue.value)
        }
    }
    //helper function to add new todo item list .
    function appendToList(event) {
        if (itemValue.value !== ''){
            addItem(itemValue.value, true, false);
        }
        itemValue.value = "";
        itemValue.focus();
        //NOTE: confuse about using that statements,
        // event.preventDefault();
    }
    // Restore state function on load
    function restoreState(){
        var items = getLocalStorage();
        for (item in items){
            if (items[item] !== '' || items[item] !== undefined){
                addItem(items[item].name, false, items[item].done)
            }
        }
    }
    document.onload = restoreState()
    addItemBtn.addEventListener("click", appendToList);
}
//Trigger main application to setup all and make it functional
todoApplication();