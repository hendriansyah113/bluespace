<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'POST':
        createOrder();
        break;
    case 'GET':
        getOrders();
        break;
    case 'PUT':
        updateOrderStatus();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function createOrder() {
    global $pdo;
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!isset($input['customer']) || !isset($input['items']) || !isset($input['order_type'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            return;
        }
        
        $pdo->beginTransaction();
        
        // Insert customer
        $customerStmt = $pdo->prepare("
            INSERT INTO customers (name, phone, email, address) 
            VALUES (:name, :phone, :email, :address)
        ");
        
        $customerStmt->execute([
            ':name' => $input['customer']['name'],
            ':phone' => $input['customer']['phone'],
            ':email' => $input['customer']['email'] ?? null,
            ':address' => $input['deliveryAddress'] ?? null
        ]);
        
        $customer_id = $pdo->lastInsertId();
        
        // Calculate total
        $total = 0;
        foreach ($input['items'] as $item) {
            $total += $item['price'] * $item['quantity'];
        }
        
        // Add delivery fee if applicable
        if ($input['order_type'] === 'delivery') {
            $total += 5000;
        }
        
        // Insert order
        $orderStmt = $pdo->prepare("
            INSERT INTO orders (customer_id, order_type, table_id, delivery_address, total_amount, payment_method, notes) 
            VALUES (:customer_id, :order_type, :table_id, :delivery_address, :total_amount, :payment_method, :notes)
        ");
        
        $table_id = null;
        if ($input['order_type'] === 'dine_in' && !empty($input['tableSelection'])) {
            // Get table ID from table number
            $tableStmt = $pdo->prepare("SELECT id FROM tables WHERE table_number = :table_number");
            $tableStmt->execute([':table_number' => $input['tableSelection']]);
            $table = $tableStmt->fetch();
            $table_id = $table ? $table['id'] : null;
        }
        
        $orderStmt->execute([
            ':customer_id' => $customer_id,
            ':order_type' => $input['order_type'],
            ':table_id' => $table_id,
            ':delivery_address' => $input['deliveryAddress'] ?? null,
            ':total_amount' => $total,
            ':payment_method' => $input['paymentMethod'],
            ':notes' => $input['notes'] ?? null
        ]);
        
        $order_id = $pdo->lastInsertId();
        
        // Insert order items
        $itemStmt = $pdo->prepare("
            INSERT INTO order_items (order_id, menu_item_id, quantity, price) 
            VALUES (:order_id, :menu_item_id, :quantity, :price)
        ");
        
        foreach ($input['items'] as $item) {
            $itemStmt->execute([
                ':order_id' => $order_id,
                ':menu_item_id' => $item['id'],
                ':quantity' => $item['quantity'],
                ':price' => $item['price']
            ]);
        }
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'order_id' => $order_id,
            'message' => 'Pesanan berhasil dibuat'
        ]);
        
    } catch(PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function getOrders() {
    global $pdo;
    
    try {
        $status = isset($_GET['status']) ? $_GET['status'] : null;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
        
        $sql = "SELECT o.*, c.name as customer_name, c.phone as customer_phone,
                       t.table_number, COUNT(oi.id) as item_count
                FROM orders o
                JOIN customers c ON o.customer_id = c.id
                LEFT JOIN tables t ON o.table_id = t.id
                LEFT JOIN order_items oi ON o.id = oi.order_id";
        
        if ($status) {
            $sql .= " WHERE o.order_status = :status";
        }
        
        $sql .= " GROUP BY o.id ORDER BY o.created_at DESC LIMIT :limit";
        
        $stmt = $pdo->prepare($sql);
        
        if ($status) {
            $stmt->bindParam(':status', $status);
        }
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        
        $stmt->execute();
        $orders = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'orders' => $orders
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function updateOrderStatus() {
    global $pdo;
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['order_id']) || !isset($input['status'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing order_id or status']);
            return;
        }
        
        $stmt = $pdo->prepare("UPDATE orders SET order_status = :status WHERE id = :order_id");
        $stmt->execute([
            ':status' => $input['status'],
            ':order_id' => $input['order_id']
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Status pesanan berhasil diupdate'
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
