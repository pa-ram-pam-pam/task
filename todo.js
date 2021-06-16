let activeFilter = "all";

const todoList = new TodoList();

showTaskList();

document.getElementById('add').addEventListener('click', add);
document.querySelector("#allFilter").addEventListener('click', filterByAll, false);
document.querySelector("#activeFilter").addEventListener('click', filterByActive, false);
document.querySelector("#completedFilter").addEventListener('click', filterByCompleted, false);
document.querySelector("#selectAll").addEventListener('click', selectAll, false);
document.querySelector("#deselectAll").addEventListener('click', deselectAll, false);
document.querySelector("#completedRemove").addEventListener('click', completedRemove, false);

function TodoList() {
    const tasks = new Map();
    let current_id = 0;
    const addTask = function (task) {
        task.id = current_id
        tasks.set(current_id, task);
        current_id += 1;
        return task;
    }
    addTask({description: 'create todo list', completed: false});
    addTask({description: 'add filtering by priority', completed: false});
    addTask({description: 'use rest api backend', completed: false});

    return {
        complete_task: function (task_id) {
            task = tasks.get(parseInt(task_id));
            task.completed = true;
        },
        uncomplete_task: function (task_id) {
            task = tasks.get(parseInt(task_id));
            task.completed = false;
        },
        edit_task: function (task_id, description) {
            task = tasks.get(parseInt(task_id));
            task.description = description;
        },
        get_task: function (task_id) {
            return tasks.get(task_id);
        },
        add_task: function (task) {
            return addTask(task);
        },
        remove_task: function (task_id) {
            return tasks.delete(parseInt(task_id));
        },
        all_tasks: function () {
            return tasks.values();
        },
    }
}

function selectAll() {
    const inputs = $("input[type=checkbox]");

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].checked = true;
        todoList.complete_task(inputs[i].id);
        showTaskList();
    }
}

function deselectAll() {
    const inputs = $("input[type=checkbox]");

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].checked = false;
        todoList.uncomplete_task(inputs[i].id);
    }
    showTaskList();
}


function completedRemove() {
    const inputs = $("input[type=checkbox]");

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].checked == true) {
            todoList.remove_task(inputs[i].id)
        }
        showTaskList();
    }
}


function changeStatus(task_id) {
    const task = todoList.get_task(task_id);

    if (task.completed == true) {
        todoList.uncomplete_task(task_id)
    } else {
        todoList.complete_task(task_id)
    }
    showTaskList();
}

function taskList() {

    function isTaskCompleted(task_id) {
        const task = todoList.get_task(task_id);
        return task.completed;
    }

    function checkedProperty(task_id) {
        if (isTaskCompleted(task_id)) {
            return "checked=\"true\"";
        } else {
            return "";
        }
    }

    function changeLabel() {
        const id = this.getAttribute('id')
        const description = $('label[id="' + id + '"]').val();
        $('label[id="' + id + '"]').hide();
        $('.edit-input[id="' + id + '"]').show().focus();
        // return true;
    }

    function labelChanged() {
        const id = this.getAttribute('id');
        const description = $('.edit-input[id=' + id + ']').val();

        todoList.edit_task(id, description);
        showTaskList();
        // return false;
    }

    let html = '';
    for (let todo of todoList.all_tasks()) {
        const onclick = `onClick=changeStatus(${todo.id})`;
        const checked = checkedProperty(todo.id);
        console.log(todo)
         html +=
            `<div class="input-group style">
                    <span class="input-group">
                        <input type="checkbox" id="${todo.id} " ${onclick} ${checked}>
                            <label for="checkbox" id="${todo.id}" class="edit">${todo.description}</label>
                        <input class="edit-input" id="${todo.id}"/>
                    </span>
                    <span class="input-group-btn">
                        <button aria-label="Close" class="close remove" id="${todo.id}">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </span>
                 </div>`
    }

    document.getElementById('todos').innerHTML = html;

    const buttons = document.getElementsByClassName('remove');
    const edit = document.getElementsByClassName('edit');
    const edit_inputs = document.getElementsByClassName('edit-input');

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', remove);
    }
    ;

    for (let i = 0; i < edit.length; i++) {
        edit[i].addEventListener('dblclick', changeLabel);
        edit[i].addEventListener('touchmove', changeLabel);
    }
    ;

    for (let i = 0; i < edit_inputs.length; i++) {
        edit_inputs[i].addEventListener('focusout', labelChanged);
    }
    ;
}

function showTaskList() {

    taskList();
    filterTasksBy(activeFilter);
    calculateCounter();

    function calculateCounter() {
        const $counter = $('#counter');
        const $inputs = $("input[type=checkbox]")
        const $inputsCh = $inputs.filter(':checked');
        const tempArray = [$inputsCh.length, $inputs.length];
        const informationText = tempArray[1] - tempArray[0];
        $counter.html(informationText);
    }

    function filterTasksBy () {
        if (activeFilter == "all") {
            filterByAll();
        } else if (activeFilter == "active") {
            filterByActive();
        } else {
            filterByCompleted();
        }
    }
}

// Фильтры
function filterByAll() {
    activeFilter = "all";
    const inputs = $("input[type=checkbox]");
    $('#allFilter').addClass("active");
    $('#completedFilter').removeClass("active");
    $('#activeFilter').removeClass("active");
    return inputs.parents().show();
}

function filterByActive() {
    activeFilter = "active";
    const $inputs = $("div input[type=checkbox]");
    const $inputsCh = $inputs.filter(":checked");
    const $inputsNotCh = $inputs.filter(":not(:checked)");
    const $parentInputs = $inputsCh.parent();
    $('#activeFilter').addClass("active");
    $('#allFilter').removeClass("active");
    $('#completedFilter').removeClass("active");
    return ($parentInputs.hide(), $inputsNotCh.parents().show());
    showTaskList();
}

function filterByCompleted() {
    activeFilter = "completed";
    const $inputs = $("div input[type=checkbox]");
    const $inputsCh = $inputs.filter(":checked");
    const $inputsNotCh = $inputs.filter(":not(:checked)");
    $parentInputs = $inputsNotCh.parent();
    $('#completedFilter').addClass("active");
    $('#allFilter').removeClass("active");
    $('#activeFilter').removeClass("active");
    return ($parentInputs.hide(), $inputsCh.parents().show());
    showTaskList();
}

// Добавить / удалить
function add(ev) {
    ev.preventDefault()
    const description = document.getElementById('task').value;
    todoList.add_task({'description': description, 'completed': false});
    showTaskList();
    // return true;
}

function remove() {
    const id = this.getAttribute('id');

    todoList.remove_task(id);
    showTaskList();
    // return false;
}