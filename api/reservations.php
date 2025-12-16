<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'POST':
        createReservation();
        break;
    case 'GET':
        if (isset($_GET['available_tables'])) {
            getAvailableTables();
        } else {
            getReservations();
        }
        break;
    case 'PUT':
        updateReservationStatus();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function createReservation() {
    global $pdo;
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!isset($input['customer']) || !isset($input['date']) || !isset($input['time']) || !isset($input['table_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            return;
        }
        
        $pdo->beginTransaction();
        
        // Insert customer
        $customerStmt = $pdo->prepare("
            INSERT INTO customers (name, phone, email) 
            VALUES (:name, :phone, :email)
        ");
        
        $customerStmt->execute([
            ':name' => $input['customer']['name'],
            ':phone' => $input['customer']['phone'],
            ':email' => $input['customer']['email'] ?? null
        ]);
        
        $customer_id = $pdo->lastInsertId();
        
        // Check table availability
        $availabilityStmt = $pdo->prepare("
            SELECT COUNT(*) as count FROM reservations 
            WHERE table_id = :table_id 
            AND reservation_date = :date 
            AND reservation_time = :time 
            AND status NOT IN ('cancelled')
        ");
        
        $availabilityStmt->execute([
            ':table_id' => $input['table_id'],
            ':date' => $input['date'],
            ':time' => $input['time']
        ]);
        
        $availability = $availabilityStmt->fetch();
        
        if ($availability['count'] > 0) {
            $pdo->rollBack();
            http_response_code(400);
            echo json_encode(['error' => 'Meja tidak tersedia pada waktu yang dipilih']);
            return;
        }
        
        // Insert reservation
        $reservationStmt = $pdo->prepare("
            INSERT INTO reservations (customer_id, table_id, reservation_date, reservation_time, party_size, special_requests) 
            VALUES (:customer_id, :table_id, :reservation_date, :reservation_time, :party_size, :special_requests)
        ");
        
        $reservationStmt->execute([
            ':customer_id' => $customer_id,
            ':table_id' => $input['table_id'],
            ':reservation_date' => $input['date'],
            ':reservation_time' => $input['time'],
            ':party_size' => $input['party_size'],
            ':special_requests' => $input['special_requests'] ?? null
        ]);
        
        $reservation_id = $pdo->lastInsertId();
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'reservation_id' => $reservation_id,
            'message' => 'Reservasi berhasil dibuat'
        ]);
        
    } catch(PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function getAvailableTables() {
    global $pdo;
    
    try {
        $date = $_GET['date'] ?? null;
        $time = $_GET['time'] ?? null;
        $party_size = $_GET['party_size'] ?? null;
        
        if (!$date || !$time || !$party_size) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required parameters']);
            return;
        }
        
        $sql = "SELECT t.* FROM tables t 
                WHERE t.capacity >= :party_size 
                AND t.is_available = 1
                AND t.id NOT IN (
                    SELECT r.table_id FROM reservations r 
                    WHERE r.reservation_date = :date 
                    AND r.reservation_time = :time 
                    AND r.status NOT IN ('cancelled')
                )
                ORDER BY t.capacity, t.table_number";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':party_size' => $party_size,
            ':date' => $date,
            ':time' => $time
        ]);
        
        $tables = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'tables' => $tables
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function getReservations() {
    global $pdo;
    
    try {
        $status = isset($_GET['status']) ? $_GET['status'] : null;
        $date = isset($_GET['date']) ? $_GET['date'] : null;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
        
        $sql = "SELECT r.*, c.name as customer_name, c.phone as customer_phone,
                       t.table_number, t.capacity, t.location
                FROM reservations r
                JOIN customers c ON r.customer_id = c.id
                JOIN tables t ON r.table_id = t.id
                WHERE 1=1";
        
        if ($status) {
            $sql .= " AND r.status = :status";
        }
        
        if ($date) {
            $sql .= " AND r.reservation_date = :date";
        }
        
        $sql .= " ORDER BY r.reservation_date DESC, r.reservation_time DESC LIMIT :limit";
        
        $stmt = $pdo->prepare($sql);
        
        if ($status) {
            $stmt->bindParam(':status', $status);
        }
        if ($date) {
            $stmt->bindParam(':date', $date);
        }
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        
        $stmt->execute();
        $reservations = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'reservations' => $reservations
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function updateReservationStatus() {
    global $pdo;
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['reservation_id']) || !isset($input['status'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing reservation_id or status']);
            return;
        }
        
        $stmt = $pdo->prepare("UPDATE reservations SET status = :status WHERE id = :reservation_id");
        $stmt->execute([
            ':status' => $input['status'],
            ':reservation_id' => $input['reservation_id']
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Status reservasi berhasil diupdate'
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
