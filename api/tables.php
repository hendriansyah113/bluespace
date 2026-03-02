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
        SELECT id, table_number, capacity, location, is_available, created_at, photo
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

    if (
        empty($_POST['table_number']) ||
        empty($_POST['capacity']) ||
        empty($_POST['location'])
    ) {
        http_response_code(400);
        echo json_encode(['error' => 'Field wajib belum lengkap']);
        return;
    }

    $photoName = null;

    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === 0) {

        $allowed = ['jpg', 'jpeg', 'png', 'webp'];
        $ext = strtolower(pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION));

        if (!in_array($ext, $allowed)) {
            http_response_code(400);
            echo json_encode(['error' => 'Format gambar tidak didukung']);
            return;
        }

        $uploadDir = '../uploads/tables/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $photoName = 'table_' . time() . '_' . rand(100, 999) . '.' . $ext;

        move_uploaded_file($_FILES['photo']['tmp_name'], $uploadDir . $photoName);
    }

    $stmt = $pdo->prepare("
        INSERT INTO tables (table_number, capacity, location, is_available, photo)
        VALUES (:table_number, :capacity, :location, :is_available, :photo)
    ");

    $stmt->execute([
        ':table_number' => $_POST['table_number'],
        ':capacity' => $_POST['capacity'],
        ':location' => $_POST['location'],
        ':is_available' => $_POST['is_available'] ?? 1,
        ':photo' => $photoName
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

    $id = $_POST['id'] ?? null;

    if (
        empty($id) ||
        empty($_POST['table_number']) ||
        empty($_POST['capacity']) ||
        empty($_POST['location'])
    ) {
        http_response_code(400);
        echo json_encode(['error' => 'Data tidak lengkap']);
        return;
    }

    $photoName = null;

    // Ambil foto lama
    $stmtOld = $pdo->prepare("SELECT photo FROM tables WHERE id = ?");
    $stmtOld->execute([$id]);
    $oldData = $stmtOld->fetch();

    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === 0) {

        $allowed = ['jpg', 'jpeg', 'png', 'webp'];
        $ext = strtolower(pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION));

        if (!in_array($ext, $allowed)) {
            http_response_code(400);
            echo json_encode(['error' => 'Format gambar tidak didukung']);
            return;
        }

        $uploadDir = '../uploads/tables/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $photoName = 'table_' . time() . '_' . rand(100, 999) . '.' . $ext;
        move_uploaded_file($_FILES['photo']['tmp_name'], $uploadDir . $photoName);

        // Hapus foto lama
        if (!empty($oldData['photo']) && file_exists($uploadDir . $oldData['photo'])) {
            unlink($uploadDir . $oldData['photo']);
        }
    } else {
        $photoName = $oldData['photo'];
    }

    $stmt = $pdo->prepare("
        UPDATE tables SET
            table_number = :table_number,
            capacity = :capacity,
            location = :location,
            is_available = :is_available,
            photo = :photo
        WHERE id = :id
    ");

    $stmt->execute([
        ':id' => $id,
        ':table_number' => $_POST['table_number'],
        ':capacity' => $_POST['capacity'],
        ':location' => $_POST['location'],
        ':is_available' => $_POST['is_available'],
        ':photo' => $photoName
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Meja berhasil diupdate'
    ]);
}
