<?php
require_once __DIR__ . '/vendor/autoload.php';

$db_file = __DIR__ . '/db.json';

if (!file_exists($db_file))
{
    file_put_contents($db_file, json_encode($items = []));
}else{
    $content = file_get_contents($db_file);

    $items  = strlen($content) > 0 ? json_decode($content, true) : [];
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TODO List</title>
    <link rel="stylesheet" href="assets/todo-list.css">
</head>
<body>
    <div class="checklist-container">
        <form method="POST" action="form_action.php">
            <button type="button" todo-item-new>[ + ]</button>

            <ul todo-item-container></ul>
            <button type="submit">Enviar</button>
        </form>
    </div>

    <script src="assets/todo-list.js"></script>
    <script>
        var my_todo = <?=json_encode($items)?>;
        my_todo.forEach(item =>
        {
            addTodoItem(item);
        });
    </script>
</body>
</html>
