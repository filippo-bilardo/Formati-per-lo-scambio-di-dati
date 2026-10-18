<?php
declare(strict_types=1);

function gestisciRichiesta(string $metodo, array $parametri, array $catalogo): array
{
    // TODO: restituisci [statoHTTP, datiRisposta] secondo il contratto.
    // La query etichetta può essere anche un array: controllane il tipo.
    throw new LogicException('Da completare: gestisciRichiesta');
}

header('Content-Type: application/json');

try {
    $file = __DIR__ . '/../../esempi/catalogo.json';
    if (!is_readable($file)) {
        throw new RuntimeException('Catalogo non leggibile');
    }
    $testo = file_get_contents($file);
    if ($testo === false) {
        throw new RuntimeException('Lettura del catalogo non riuscita');
    }
    $catalogo = json_decode($testo, true, 512, JSON_THROW_ON_ERROR);
    [$stato, $dati] = gestisciRichiesta($_SERVER['REQUEST_METHOD'] ?? 'GET', $_GET, $catalogo);
    $corpo = json_encode($dati, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    http_response_code($stato);
    if ($stato === 405) {
        header('Allow: GET');
    }
} catch (LogicException $errore) {
    http_response_code(501);
    $corpo = json_encode(['errore' => $errore->getMessage()], JSON_THROW_ON_ERROR);
} catch (Throwable $errore) {
    http_response_code(500);
    $corpo = json_encode(['errore' => 'Lettura o elaborazione del catalogo non riuscita'], JSON_THROW_ON_ERROR);
}

echo $corpo;
