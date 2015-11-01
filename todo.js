//Local Storage Getter Setter for storing TodoList
function getFromLocalStorage(){
   return localStorage.todoList ? JSON.parse(localStorage.todoList) : [];
}
function addToLocalStorage(name){
    var storedTodos = getFromLocalStorage();
    storedTodos.push(name)
    localStorage.todoList = JSON.stringify(storedTodos);
}
function popFromLocalStorage(name){
    var storedTodos = getFromLocalStorage();
    //find index make sure right index and splice it.
    var idx = storedTodos.indexOf(name);
    if (idx > -1) {
        storedTodos.splice(idx, 1);
    }
    localStorage.todoList = JSON.stringify(storedTodos);
}

function todoApplication(){ 
    var addItemBtn = document.querySelector("#addtodoitem");
    var todoList = document.querySelector("#todolist");
    var itemValue = document.querySelector("#newtodoitem");

    function unlinkItem(name) {
        var li = this.parentNode
        var node = li.firstElementChild.textContent
        if (li && node){
            todoList.removeChild(li);
            popFromLocalStorage(node)
        }
    }
    function doneItem(){
        if (this.parentElement.firstChild){
            this.parentElement.firstChild.classList.add("completed");
        }
        this.style.visibility = "hidden";
    }

    function prepareActionNode(class_name, text, action){
        var node = document.createElement('a');
        node.setAttribute("href", "#");
        node.setAttribute("class", class_name);
        node.innerHTML = text;
        node.addEventListener("click", action);
        return node
    }

    function addItem(name, toLocalStore){
        var newNode = document.createElement('li');
        var nodeSpan = document.createElement('span');
        nodeSpan.innerHTML = name
        nodeSpan.setAttribute("class", "li-text-label");
        nodeSpan.setAttribute("id", "li-text-label");
        newNode.setAttribute("id", "todolist-item");
        newNode.appendChild(nodeSpan);
        newNode.appendChild(prepareActionNode("unlink-item", "remove", unlinkItem));
        newNode.appendChild(prepareActionNode("done-item", "done", doneItem));
        todoList.appendChild(newNode);
        //Extra condition to not add duplicate and crab again 
        //restore state addItem call.
        if (toLocalStore){
            addToLocalStorage(itemValue.value)
        }
    }

    function appendToList(event) {
        if (itemValue.value !== ''){
            addItem(itemValue.value, true);
        }
        itemValue.value = "";
        itemValue.focus();
        // event.preventDefault();
    }

    // Restore state function on load
    function restoreState(){
        var items = getFromLocalStorage();
        for (item in items){
            if (items[item] !== '' || items[item] !== undefined){
                addItem(items[item], false)
            }
        }
    }
    document.onload = restoreState()
    addItemBtn.addEventListener("click", appendToList);
}
todoApplication();