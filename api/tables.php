<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getTables();
        break;
    case 'POST':
        createTable();
        break;
    case 'PUT':
        updateTable();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}

/* ========================= */

function getTables()
{
    global $pdo;

    $stmt = $pdo->query("
        SELECT id, table_number, capacity, location, is_available, created_at
        FROM tables
        ORDER BY table_number
    ");

    echo json_encode([
        'success' => true,
        'tables' => $stmt->fetchAll()
    ]);
}

/* ========================= */

function createTable()
{
    global $pdo;
    $input = json_decode(file_get_contents('php://input'), true);

    if (
        empty($input['table_number']) ||
        empty($input['capacity']) ||
        empty($input['location'])
    ) {
        http_response_code(400);
        echo json_encode(['error' => 'Field wajib belum lengkap']);
        return;
    }

    $stmt = $pdo->prepare("
        INSERT INTO tables (table_number, capacity, location, is_available)
        VALUES (:table_number, :capacity, :location, :is_available)
    ");

    $stmt->execute([
        ':table_number' => $input['table_number'],
        ':capacity' => $input['capacity'],
        ':location' => $input['location'],
        ':is_available' => $input['is_available'] ?? 1
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Meja berhasil ditambahkan'
    ]);
}

/* ========================= */

function updateTable()
{
    global $pdo;
    $input = json_decode(file_get_contents('php://input'), true);

    if (
        empty($input['id']) ||
        empty($input['table_number']) ||
        empty($input['capacity']) ||
        empty($input['location'])
    ) {
        http_response_code(400);
        echo json_encode(['error' => 'Data tidak lengkap']);
        return;
    }

    $stmt = $pdo->prepare("
        UPDATE tables SET
            table_number = :table_number,
            capacity = :capacity,
            location = :location,
            is_available = :is_available
        WHERE id = :id
    ");

    $stmt->execute([
        ':id' => $input['id'],
        ':table_number' => $input['table_number'],
        ':capacity' => $input['capacity'],
        ':location' => $input['location'],
        ':is_available' => $input['is_available']
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Meja berhasil diupdate'
    ]);
}
