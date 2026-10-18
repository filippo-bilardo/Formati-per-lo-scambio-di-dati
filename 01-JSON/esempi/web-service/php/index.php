<?php
header('Content-Type: application/json; charset=utf-8');

$dati = [
    'messaggio' => 'Ciao dal web service!',
    'corso' => 'JSON',
];

echo json_encode($dati, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
