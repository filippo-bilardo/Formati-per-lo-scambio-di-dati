<?php
declare(strict_types=1);

function creaRiepilogo(array $catalogo): array
{
    // TODO: conta, somma e distingui presenza, null e risultato di isset.
    throw new LogicException('Da completare: creaRiepilogo');
}

try {
    $percorso = $argv[1] ?? __DIR__ . '/../../esempi/catalogo.json';
    if (!is_readable($percorso)) {
        throw new RuntimeException('File non leggibile');
    }
    $testo = file_get_contents($percorso);
    if ($testo === false) {
        throw new RuntimeException('Lettura del file non riuscita');
    }
    $catalogo = json_decode($testo, true, 512, JSON_THROW_ON_ERROR);
    $report = creaRiepilogo($catalogo);
    echo json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR), PHP_EOL;
} catch (Throwable $errore) {
    fwrite(STDERR, 'Errore: ' . $errore->getMessage() . PHP_EOL);
    exit(1);
}
