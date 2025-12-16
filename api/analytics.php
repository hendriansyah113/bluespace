<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getAnalytics();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getAnalytics() {
    global $pdo;
    
    try {
        $period = $_GET['period'] ?? 'today';
        
        // Date range based on period
        switch($period) {
            case 'today':
                $dateCondition = "DATE(created_at) = CURDATE()";
                break;
            case 'week':
                $dateCondition = "created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
                break;
            case 'month':
                $dateCondition = "created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
                break;
            default:
                $dateCondition = "DATE(created_at) = CURDATE()";
        }
        
        // Total orders and revenue
        $orderStmt = $pdo->prepare("
            SELECT COUNT(*) as total_orders, 
                   COALESCE(SUM(total_amount), 0) as total_revenue,
                   AVG(total_amount) as avg_order_value
            FROM orders 
            WHERE $dateCondition AND order_status NOT IN ('cancelled')
        ");
        $orderStmt->execute();
        $orderStats = $orderStmt->fetch();
        
        // Orders by type
        $typeStmt = $pdo->prepare("
            SELECT order_type, COUNT(*) as count, SUM(total_amount) as revenue
            FROM orders 
            WHERE $dateCondition AND order_status NOT IN ('cancelled')
            GROUP BY order_type
        ");
        $typeStmt->execute();
        $orderTypes = $typeStmt->fetchAll();
        
        // Popular menu items
        $popularStmt = $pdo->prepare("
            SELECT mi.name, SUM(oi.quantity) as total_quantity, SUM(oi.quantity * oi.price) as total_revenue
            FROM order_items oi
            JOIN menu_items mi ON oi.menu_item_id = mi.id
            JOIN orders o ON oi.order_id = o.id
            WHERE $dateCondition AND o.order_status NOT IN ('cancelled')
            GROUP BY mi.id, mi.name
            ORDER BY total_quantity DESC
            LIMIT 10
        ");
        $popularStmt->execute();
        $popularItems = $popularStmt->fetchAll();
        
        // Reservations
        $reservationStmt = $pdo->prepare("
            SELECT COUNT(*) as total_reservations
            FROM reservations 
            WHERE $dateCondition AND status NOT IN ('cancelled')
        ");
        $reservationStmt->execute();
        $reservationStats = $reservationStmt->fetch();
        
        // Peak hours
        $peakStmt = $pdo->prepare("
            SELECT HOUR(created_at) as hour, COUNT(*) as order_count
            FROM orders 
            WHERE $dateCondition AND order_status NOT IN ('cancelled')
            GROUP BY HOUR(created_at)
            ORDER BY order_count DESC
            LIMIT 5
        ");
        $peakStmt->execute();
        $peakHours = $peakStmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'period' => $period,
            'order_stats' => $orderStats,
            'order_types' => $orderTypes,
            'popular_items' => $popularItems,
            'reservation_stats' => $reservationStats,
            'peak_hours' => $peakHours
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
