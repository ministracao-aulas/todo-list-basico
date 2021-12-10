
function uuidv4()
{
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function getItemId(element)
{
    return element.dataset.itemTarget;
}

function genRandId()
{
    return uuidv4().replaceAll('-', '_');
}

function isJson(str)
{
    if (typeof str != "string")
        return false;

    try
    {
        JSON.parse(str);
    } catch (e)
    {
        return false;
    }
    return true;
}

function addTodoItem(todo_item_data = {})
{
    if (todo_item_data && typeof todo_item_data != "object")
        return;

    var rand_id = genRandId();

    if (!rand_id || rand_id.length < 4) return;

    var todo_container = document.querySelector('[todo-item-container]');
    if (!todo_container) return;

    var initial_data = {
        title: (typeof todo_item_data.title == "string") ? todo_item_data.title : "Meu item",
        done: (typeof todo_item_data.done == "boolean") ? todo_item_data.done : false
    };

    var remove_todo_item = document.createElement('button');
    remove_todo_item.setAttribute('todo-remove', rand_id);
    remove_todo_item.setAttribute('data-item-target', rand_id);
    remove_todo_item.setAttribute('type', "button");
    remove_todo_item.innerText = '[ - ]';

    var todo_item = document.createElement('input');
    todo_item.setAttribute('todo-item', rand_id);
    todo_item.setAttribute('name', 'item[]');
    todo_item.style.display = "none";
    todo_item.readOnly = true;
    todo_item.value = JSON.stringify(initial_data);

    var todo_title = document.createElement('span');
    todo_title.setAttribute('todo-title-text', "");
    todo_title.setAttribute('data-item-target', rand_id);
    todo_title.innerText = initial_data.title;

    var todo_toggle = document.createElement('input');
    todo_toggle.setAttribute('type', "checkbox");
    todo_toggle.setAttribute('data-item-target', rand_id);
    todo_toggle.setAttribute('todo-toggle', "");
    todo_toggle.id = `ckbx_${rand_id}`
    todo_toggle.checked = initial_data.done;

    var todo_toggle_label = document.createElement('label');
    todo_toggle_label.setAttribute('data-item-target', rand_id);
    todo_toggle_label.setAttribute('for', `ckbx_${rand_id}`);
    todo_toggle_label.classList.add("exemplo2");
    /* todo_toggle_label.appendChild(todo_toggle); */

    var todo_title_input = document.createElement('input');
    todo_title_input.setAttribute('type', 'text');
    todo_title_input.setAttribute('data-item-target', rand_id);
    todo_title_input.setAttribute('todo-title', "");
    todo_title_input.setAttribute('title', "Pressione enter para salvar as alterações");
    todo_title_input.style.display = "none";
    todo_title_input.value = initial_data.title;


    var todo_li = document.createElement('li');
    todo_li.classList.add('flex-container-left');
    todo_li.setAttribute('data-item-target', rand_id);
    todo_li.prepend(todo_item);
    todo_li.prepend(todo_title_input);
    todo_li.prepend(todo_title);
    todo_li.prepend(todo_toggle_label);
    todo_li.prepend(todo_toggle);
    todo_li.prepend(remove_todo_item);

    initial_data.done ? todo_li.classList.add('done')
        : todo_li.classList.remove('done');

    addListenersToTodoTitle(todo_title);
    addListenerToRemoveTodo(remove_todo_item);
    addListenerToTodoDataToogle(todo_toggle);
    addListenerToTodoTitleInput(todo_title_input);

    todo_container.prepend(todo_li);
}

function addListenersToTodoTitle(todo_title)
{
    //verifica se o item é um elemento
    if (!todo_title || !(todo_title instanceof HTMLElement)) return;

    todo_title.addEventListener('click', e =>
    {
        var item_id = getItemId(e.target);
        if (!item_id) return;

        toggleEditItem(item_id);
    });
}

function listenEscPressOnTitleInput(element)
{
    if (!element || !(element instanceof HTMLElement)) return;

    element.addEventListener('keydown', function (e)
    {
        if (e.keyCode == 27)
        {
            alert("Escape");
        }
    });
}

function getInputTitleValues(target)
{
    var item_id = getItemId(target);
    if (!item_id) return;

    var todo_target = document.querySelector(`[todo-item="${item_id}"]`);
    var target_data = JSON.parse(todo_target.value);
    target_data.title = target.value;
    todo_target.value = JSON.stringify(target_data);

    var todo_item_text = document.querySelector(`span[data-item-target="${item_id}"]`);
    if (todo_item_text)
        todo_item_text.innerText = target.value;
}

function resetTitleInput(target)
{
    var item_id = getItemId(target);
    if (!item_id) return;

    var todo_target = document.querySelector(`[todo-item="${item_id}"]`);
    var target_data = JSON.parse(todo_target.value);
    target.value = target_data.title;
}

function addListenerToTodoTitleInput(todo_title_input)
{
    // listenEscPressOnTitleInput(todo_title_input);

    todo_title_input.addEventListener('keydown', function (e)
    {
        if (e.keyCode == 27)//Esc
        {
            var item_id = getItemId(e.target);
            if (!item_id) return;

            resetTitleInput(e.target);

            toggleEditItem(item_id);
        }

        if (e.keyCode == 13)//Enter
        {
            e.preventDefault();
            var item_id = getItemId(e.target);
            if (!item_id) return;

            getInputTitleValues(e.target);
            toggleEditItem(item_id);
        }
    });

    todo_title_input.addEventListener('focusout', e =>
    {
        var item_id = getItemId(e.target);
        if (!item_id) return;

        toggleEditItem(item_id)
    });

    /**
     * Ignorando o evento de change na ateração do titulo do TODO item
     * para que a alteração seja feita apenas quando o usuário confirmar com um enter
     *
    todo_title_input.addEventListener('change', e => {
        var target  = e.target;
        getInputTitleValues(target);
    })
    /**/
}

function addListenerToTodoDataToogle(todo_toggle)
{
    if (!todo_toggle)
    {
        return;
    }

    todo_toggle.addEventListener('change', e =>
    {
        var target = e.target;

        var todo = target.dataset.itemTarget;
        if (!todo) return;

        var todo_target = document.querySelector(`[todo-item="${todo}"]`);
        if (!todo_target) return;

        var target_data = (todo_target.value.length > 1 && isJson(todo_target.value)) ? JSON.parse(todo_target.value) : {};

        target_data.done = target.checked;

        var todo_item = document.querySelector(`li[data-item-target="${todo}"]`);

        if (todo_item)
            target.checked ? todo_item.classList.add('done')
                : todo_item.classList.remove('done');

        todo_target.value = JSON.stringify(target_data);
    });
}

function addListenerToRemoveTodo(todo_toggle)
{
    if (!todo_toggle)
    {
        return;
    }

    todo_toggle.addEventListener('click', e =>
    {
        var target = e.target;

        var todo = target.dataset.itemTarget;
        if (!todo) return;

        var todo_target = document.querySelector(`[todo-item="${todo}"]`);
        if (!todo_target) return;

        var todo_item = document.querySelector(`li[data-item-target="${todo}"]`);

        if (!todo_item) return;

        var _confirm = confirm('Excluir item?', false);

        if (_confirm)
            todo_item.remove();
    });
}

function toggleEditItem(item_id)
{
    if (!item_id || item_id.length < 4) return;

    var todo_item_text = document.querySelector(`span[data-item-target="${item_id}"]`);
    if (!todo_item_text) return;

    todo_item_text.style.display === "" ? todo_item_text.style.display = "none" : todo_item_text.style.display = "";

    var todo_item_title_input = document.querySelector(`input[data-item-target="${item_id}"][todo-title]`);
    if (!todo_item_title_input) return;

    todo_item_title_input.style.display === "" ? todo_item_title_input.style.display = "none" : todo_item_title_input.style.display = "";
}

function addListenerToTodoItemText(todo_item_text)
{
    if (!todo_item_text)
    {
        return;
    }

    todo_item_text.addEventListener('click', e =>
    {
        var target = e.target;

        var item_id = getItemId(el.target);
        if (!item_id) return;

        var todo_target = document.querySelector(`[todo-item="${item_id}"]`);
        if (!todo_target) return;

        var todo_item = document.querySelector(`li[data-item-target="${item_id}"]`);

        toggleEditItem(item_id);
    });
}

document.addEventListener('DOMContentLoaded', function ()
{
    document.querySelectorAll('[todo-toggle]').forEach(todo_toggle =>
    {
        addListenerToTodoDataToogle(todo_toggle);
    });

    document.querySelectorAll('[todo-title]').forEach(todo_title_input =>
    {
        addListenerToTodoTitleInput(todo_title_input);
    });

    document.querySelectorAll('[todo-item-new]').forEach(add_todo =>
    {
        add_todo.addEventListener('click', e =>
        {
            addTodoItem();
        });
    });

    //Inicia  itens na listagem
    /*
    [{
        title: "Meu item",
        done: false
    }, {
        title: "Meu item 2",
        done: true
    }].forEach(item =>
    {
        addTodoItem(item);
    });
    */

});
