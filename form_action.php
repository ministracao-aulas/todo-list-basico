<?php
require_once __DIR__.'/vendor/autoload.php';
if($_POST['item'] ?? null)
{
    if(is_array($_POST['item']))
    {
        foreach($_POST['item'] as $item)
        {
            if(is_string($item))
            $new_items[] = json_decode($item, true);
        }

        if($new_items ?? null)
        {
            $db_file = __DIR__ . '/db.json';

            if (!file_exists($db_file))
            {
                file_put_contents($db_file, json_encode($items = []));
            }else{
                $content = file_get_contents($db_file);

                $items  = strlen($content) > 0 ? json_decode($content, true) : [];
            }

            $items      = array_merge($items, $new_items);
            file_put_contents($db_file, json_encode($items));
        }
    }
}
header('Location: index.php');
