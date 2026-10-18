<?php
declare(strict_types=1);

function selezionaProdotti(array $prodotti, string $etichetta): array
{
    // TODO: seleziona disponibili, applica l'eventuale etichetta e reindicizza.
    throw new LogicException('Da completare: selezionaProdotti');
}

try {
    $testo = file_get_contents(__DIR__ . '/../../esempi/catalogo.json');
    if ($testo === false) {
        throw new RuntimeException('Lettura del catalogo non riuscita');
    }
    $catalogo = json_decode($testo, true, 512, JSON_THROW_ON_ERROR);
    $prodotti = selezionaProdotti($catalogo['prodotti'], $argv[1] ?? '');
    $json = json_encode($prodotti, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    $output = __DIR__ . '/output';
    if (!is_dir($output) && !mkdir($output, 0777, true)) {
        throw new RuntimeException('Creazione della cartella output non riuscita');
    }
    if (file_put_contents($output . '/prodotti-disponibili.json', $json . PHP_EOL) === false) {
        throw new RuntimeException('Scrittura del risultato non riuscita');
    }
    echo 'Prodotti esportati: ' . count($prodotti), PHP_EOL;
} catch (Throwable $errore) {
    fwrite(STDERR, 'Errore: ' . $errore->getMessage() . PHP_EOL);
    exit(1);
}
