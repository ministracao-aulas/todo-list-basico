<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        * { margin: 0; padding: 0; }
        /* [todo-item]{ color: red; width: 50%; } */
        ul[todo-item-container] > li[data-item-target]{ background: red !important; display: flex; flex-direction: row;}
        ul[todo-item-container] > li[data-item-target].done, li[data-item-target].done {  background: green !important; }
    </style>
</head>
<body>
    <form method="POST" action="form_action.php">
        <button type="button" todo-item-new>[ + ]</button>

        <ul todo-item-container></ul>
        <button type="submit">Enviar</button>
    </form>

    <script>
        function uuidv4()
        {
            return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
        }

        function genRandId()
        {
            return uuidv4().replaceAll('-', '_');
        }

        function isJson(str)
        {
            if(typeof str != "string")
                return false;

            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }

        function addTodoItem(todo_item_data = {})
        {
            if(todo_item_data && typeof todo_item_data != "object")
                return;

            var rand_id = genRandId();

            if(!rand_id || rand_id.length < 4) return;

            var todo_container = document.querySelector('[todo-item-container]');
            if (!todo_container) return;

            var initial_data = {
                title:  (typeof todo_item_data.title == "string") ? todo_item_data.title : "Meu item",
                done:   (typeof todo_item_data.done == "boolean") ? todo_item_data.done : false
            };

            var remove_todo_item = document.createElement('button');
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
                todo_title.setAttribute('data-item-target', rand_id);
                todo_title.innerText = initial_data.title;

            var todo_toggle = document.createElement('input');
                    todo_toggle.setAttribute('type', "checkbox");
                    todo_toggle.setAttribute('data-item-target', rand_id);
                    todo_toggle.setAttribute('todo-toggle', "");
                    todo_toggle.checked = initial_data.done;


            var todo_title_input = document.createElement('input');
                todo_title_input.setAttribute('data-item-target', rand_id);
                todo_title_input.setAttribute('todo-title', "");
                todo_title_input.style.display = "none";
                todo_title_input.value = initial_data.title;


            var todo_li = document.createElement('li');
                todo_li.setAttribute('data-item-target', rand_id);
                todo_li.prepend(remove_todo_item);
                todo_li.prepend(todo_item);
                todo_li.prepend(todo_title_input);
                todo_li.prepend(todo_title);
                todo_li.prepend(todo_toggle);

                initial_data.done  ? todo_li.classList.add('done')
                                    : todo_li.classList.remove('done');

            addListenerToRemoveTodo(remove_todo_item);
            addListenerToTodoDataToogle(todo_toggle);
            addListenerToTodoDataTitle(todo_title_input);

            todo_container.prepend(todo_li);
        }

        function addListenerToTodoDataTitle(todo_title_input)
        {
            todo_title_input.addEventListener('change', e => {
                var target = e.target;
                var todo = target.dataset.itemTarget;
                var todo_target = document.querySelector(`[todo-item="${todo}"]`);
                var target_data = JSON.parse(todo_target.value);
                target_data.title = target.value;
                todo_target.value = JSON.stringify(target_data);
            })
        }

        function addListenerToTodoDataToogle(todo_toggle)
        {
            if (!todo_toggle)
            {
                return;
            }

            todo_toggle.addEventListener('change', e => {
                var target = e.target;

                var todo = target.dataset.itemTarget;
                if (!todo) return;

                var todo_target = document.querySelector(`[todo-item="${todo}"]`);
                if (!todo_target) return;

                var target_data = (todo_target.value.length > 1 && isJson(todo_target.value)) ? JSON.parse(todo_target.value) : {};

                target_data.done = target.checked;

                var todo_item = document.querySelector(`li[data-item-target="${todo}"]`);

                if(todo_item)
                    target.checked  ? todo_item.classList.add('done')
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

            todo_toggle.addEventListener('click', e => {
                var target = e.target;

                var todo = target.dataset.itemTarget;
                if (!todo) return;

                var todo_target = document.querySelector(`[todo-item="${todo}"]`);
                if (!todo_target) return;

                var todo_item = document.querySelector(`li[data-item-target="${todo}"]`);

                if(!todo_item) return;

                var _confirm = confirm('Excluir item?', false);

                if(_confirm)
                    todo_item.remove();
            });
        }

        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('[todo-toggle]').forEach(todo_toggle => {
                addListenerToTodoDataToogle(todo_toggle);
            });

            document.querySelectorAll('[todo-title]').forEach(todo_title_input => {
                addListenerToTodoDataTitle(todo_title_input);
            });

            document.querySelectorAll('[todo-item-new]').forEach(add_todo => {
                add_todo.addEventListener('click', e => {
                    addTodoItem();
                });
            });

            [{
                title: "Meu item",
                done: false
            }, {
                title: "Meu item 2",
                done: true
            }].forEach(item => {
                addTodoItem(item);
            });

        });

    </script>
</body>
</html>
