<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getMenuItems();
        break;
        case 'POST':
            addMenuItem();
            break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getMenuItems() {
    global $pdo;

    try {
        $category_id = isset($_GET['category_id']) && $_GET['category_id'] !== ''
            ? $_GET['category_id']
            : null;

        $sql = "SELECT mi.*, c.name AS category_name
                FROM menu_items mi
                LEFT JOIN categories c ON mi.category_id = c.id
                WHERE mi.is_available = 1";

        if ($category_id !== null) {
            $sql .= " AND mi.category_id = :category_id";
        }

        $sql .= " ORDER BY mi.id ASC";

        $stmt = $pdo->prepare($sql);

        if ($category_id !== null) {
            $stmt->bindValue(':category_id', $category_id, PDO::PARAM_INT);
        }

        $stmt->execute();
        $items = $stmt->fetchAll();

        // Ambil kategori
        $categoriesStmt = $pdo->query("SELECT * FROM categories ORDER BY id ASC");
        $categories = $categoriesStmt->fetchAll();

        echo json_encode([
            'success' => true,
            'categories' => $categories,
            'items' => $items
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database error'
        ]);
    }
}


function addMenuItem() {
    global $pdo;

    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['name']) || empty($data['price'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Nama dan harga wajib diisi'
        ]);
        return;
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO menu_items
            (category_id, name, description, price, is_available, preparation_time)
            VALUES (:category_id, :name, :description, :price, :is_available, :preparation_time)
        ");

        $stmt->execute([
            ':category_id' => $data['category_id'],
            ':name' => $data['name'],
            ':description' => $data['description'],
            ':price' => $data['price'],
            ':is_available' => $data['is_available'] ?? 1,
            ':preparation_time' => $data['preparation_time'] ?? 10
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'Menu berhasil ditambahkan'
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
    
}
?>
