<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getMenuItems();
        break;
    case 'POST':
        if (isset($_POST['id'])) {
            updateMenuItem();
        } else {
            addMenuItem();
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getMenuItems()
{
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


function addMenuItem()
{
    global $pdo;

    if (empty($_POST['name']) || empty($_POST['price'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Nama dan harga wajib diisi'
        ]);
        return;
    }

    // ===== UPLOAD FOTO =====
    $photoName = null;

    if (!empty($_FILES['photo']['name'])) {
        $uploadDir = '../public/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $ext = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
        $photoName = uniqid('menu_') . '.' . $ext;
        $uploadPath = $uploadDir . $photoName;

        move_uploaded_file($_FILES['photo']['tmp_name'], $uploadPath);
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO menu_items
            (category_id, name, description, image_url, price, is_available, preparation_time)
            VALUES (:category_id, :name, :description, :photo, :price, :is_available, :preparation_time)
        ");

        $stmt->execute([
            ':category_id' => $_POST['category_id'] ?? null,
            ':name' => $_POST['name'],
            ':description' => $_POST['description'] ?? null,
            ':photo' => $photoName,
            ':price' => $_POST['price'],
            ':is_available' => $_POST['is_available'] ?? 1,
            ':preparation_time' => $_POST['preparation_time'] ?? 10
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

function updateMenuItem()
{
    global $pdo;

    if (empty($_POST['id']) || empty($_POST['name']) || empty($_POST['price'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'ID, nama, dan harga wajib diisi'
        ]);
        return;
    }

    // Ambil foto lama
    $stmtOld = $pdo->prepare("SELECT image_url FROM menu_items WHERE id = ?");
    $stmtOld->execute([$_POST['id']]);
    $oldImage = $stmtOld->fetchColumn();

    $imageName = $oldImage;
    $uploadDir = '../public/';

    // Upload foto baru (jika ada)
    if (!empty($_FILES['photo']['name'])) {
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $ext = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
        $imageName = uniqid('menu_') . '.' . $ext;
        move_uploaded_file($_FILES['photo']['tmp_name'], $uploadDir . $imageName);

        // Hapus foto lama
        if ($oldImage && file_exists($uploadDir . $oldImage)) {
            unlink($uploadDir . $oldImage);
        }
    }

    try {
        $stmt = $pdo->prepare("
            UPDATE menu_items SET
                category_id = :category_id,
                name = :name,
                description = :description,
                image_url = :image_url,
                price = :price,
                is_available = :is_available,
                preparation_time = :preparation_time
            WHERE id = :id
        ");

        $stmt->execute([
            ':id' => $_POST['id'],
            ':category_id' => $_POST['category_id'] ?: null,
            ':name' => $_POST['name'],
            ':description' => $_POST['description'] ?: null,
            ':image_url' => $imageName,
            ':price' => $_POST['price'],
            ':is_available' => $_POST['is_available'],
            ':preparation_time' => $_POST['preparation_time']
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'Menu berhasil diperbarui'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
}
