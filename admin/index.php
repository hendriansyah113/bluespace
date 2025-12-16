<?php
session_start();
require_once '../config/database.php';

// Simple authentication (in production, use proper authentication)
if (!isset($_SESSION['admin_logged_in'])) {
    if (isset($_POST['login'])) {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';

        // Simple hardcoded admin credentials (use database in production)
        if ($username === 'admin' && $password === 'admin123') {
            $_SESSION['admin_logged_in'] = true;
            header('Location: index.php');
            exit;
        } else {
            $error = 'Username atau password salah';
        }
    }

    // Show login form
    include 'login.php';
    exit;
}
?>
<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Blue Space Coffee</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        .admin-header {
            background: var(--primary-color);
            color: var(--white);
            padding: 1rem 0;
            margin-bottom: 2rem;
        }

        .admin-nav {
            display: flex;
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .admin-nav button {
            padding: 0.75rem 1.5rem;
            border: 2px solid var(--primary-color);
            background: transparent;
            color: var(--primary-color);
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .admin-nav button.active,
        .admin-nav button:hover {
            background: var(--primary-color);
            color: var(--white);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background: var(--white);
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: var(--primary-color);
        }

        .data-table {
            background: var(--white);
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .data-table table {
            width: 100%;
            border-collapse: collapse;
        }

        .data-table th,
        .data-table td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }

        .data-table th {
            background: var(--light-gray);
            font-weight: bold;
        }

        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: bold;
        }

        .status-pending {
            background: #fff3cd;
            color: #856404;
        }

        .status-confirmed {
            background: #d4edda;
            color: #155724;
        }

        .status-completed {
            background: #d1ecf1;
            color: #0c5460;
        }

        .status-cancelled {
            background: #f8d7da;
            color: #721c24;
        }

        .action-buttons {
            display: flex;
            gap: 0.5rem;
        }

        .btn-sm {
            padding: 0.25rem 0.75rem;
            font-size: 0.8rem;
        }

        .section {
            display: none;
        }

        .section.active {
            display: block;
        }
    </style>
</head>

<body>
    <header class="admin-header">
        <div class="container">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h1>Admin Panel - Blue Space Coffee</h1>
                <div>
                    <span>Selamat datang, Admin</span>
                    <a href="logout.php" class="btn btn-outline"
                        style="margin-left: 1rem; color: var(--white); border-color: var(--white);">Logout</a>
                </div>
            </div>
        </div>
    </header>

    <div class="container">
        <!-- Navigation -->
        <nav class="admin-nav">
            <button class="nav-btn active" data-section="dashboard">Dashboard</button>
            <button class="nav-btn" data-section="orders">Pesanan</button>
            <button class="nav-btn" data-section="reservations">Reservasi</button>
            <button class="nav-btn" data-section="menu">Menu</button>
            <button class="nav-btn" data-section="analytics">Laporan</button>
        </nav>

        <!-- Dashboard Section -->
        <section id="dashboard" class="section active">
            <h2>Dashboard</h2>
            <div class="stats-grid" id="statsGrid">
                <!-- Stats will be loaded here -->
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div class="data-table">
                    <h3 style="padding: 1rem;">Pesanan Terbaru</h3>
                    <div id="recentOrders">
                        <!-- Recent orders will be loaded here -->
                    </div>
                </div>

                <div class="data-table">
                    <h3 style="padding: 1rem;">Reservasi Hari Ini</h3>
                    <div id="todayReservations">
                        <!-- Today's reservations will be loaded here -->
                    </div>
                </div>
            </div>
        </section>

        <!-- Orders Section -->
        <section id="orders" class="section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2>Manajemen Pesanan</h2>
                <div>
                    <select id="orderStatusFilter" class="form-control" style="display: inline-block; width: auto;">
                        <option value="">Semua Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Dikonfirmasi</option>
                        <option value="preparing">Sedang Disiapkan</option>
                        <option value="ready">Siap</option>
                        <option value="completed">Selesai</option>
                        <option value="cancelled">Dibatalkan</option>
                    </select>
                    <button class="btn btn-primary" onclick="loadOrders()">Refresh</button>
                </div>
            </div>

            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Pelanggan</th>
                            <th>Jenis</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Waktu</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="ordersTableBody">
                        <!-- Orders will be loaded here -->
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Reservations Section -->
        <section id="reservations" class="section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2>Manajemen Reservasi</h2>
                <div>
                    <input type="date" id="reservationDateFilter" class="form-control"
                        style="display: inline-block; width: auto;">
                    <button class="btn btn-primary" onclick="loadReservations()">Refresh</button>
                </div>
            </div>

            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Pelanggan</th>
                            <th>Meja</th>
                            <th>Tanggal</th>
                            <th>Waktu</th>
                            <th>Tamu</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="reservationsTableBody">
                        <!-- Reservations will be loaded here -->
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Menu Section -->
        <section id="menu" class="section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2>Manajemen Menu</h2>
                <button class="btn btn-primary" onclick="showAddMenuForm()">Tambah Item</button>
            </div>

            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama</th>
                            <th>Kategori</th>
                            <th>Harga</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="menuTableBody">
                        <!-- Menu items will be loaded here -->
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Analytics Section -->
        <section id="analytics" class="section">
            <h2>Laporan & Analitik</h2>

            <div style="margin-bottom: 2rem;">
                <select id="analyticsPeriod" class="form-control" style="display: inline-block; width: auto;">
                    <option value="today">Hari Ini</option>
                    <option value="week">7 Hari Terakhir</option>
                    <option value="month">30 Hari Terakhir</option>
                </select>
                <button class="btn btn-primary" onclick="loadAnalytics()">Update</button>
            </div>

            <div class="stats-grid" id="analyticsStats">
                <!-- Analytics stats will be loaded here -->
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem;">
                <div class="data-table">
                    <h3 style="padding: 1rem;">Menu Terpopuler</h3>
                    <div id="popularItems">
                        <!-- Popular items will be loaded here -->
                    </div>
                </div>

                <div class="data-table">
                    <h3 style="padding: 1rem;">Jam Sibuk</h3>
                    <div id="peakHours">
                        <!-- Peak hours will be loaded here -->
                    </div>
                </div>
            </div>
        </section>
    </div>

    <!-- Modal Tambah Menu -->
    <!-- Modal Tambah Menu -->
    <div id="addMenuModal" style="
    display:none;
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.5);
    z-index:1000;
    overflow-y:auto;">
        <div style="background:#fff; width:450px; margin:5% auto; padding:1.5rem; border-radius:10px;">
            <h3>Tambah Menu</h3>

            <div class="form-group">
                <label>Nama Menu</label>
                <input type="text" id="menuName" class="form-control">
            </div>

            <div class="form-group">
                <label>Kategori</label>
                <select id="menuCategory" class="form-control">
                    <option value="">-- Pilih Kategori --</option>
                    <option value="1">Minuman</option>
                    <option value="2">Makanan</option>
                    <option value="3">Snack</option>
                </select>
            </div>

            <div class="form-group">
                <label>Deskripsi</label>
                <textarea id="menuDescription" class="form-control"></textarea>
            </div>

            <div class="form-group">
                <label>Harga</label>
                <input type="number" id="menuPrice" class="form-control">
            </div>

            <div class="form-group">
                <label>Foto Menu</label>
                <input type="file" id="menuPhoto" class="form-control" accept="image/*">
            </div>


            <div class="form-group">
                <label>Waktu Persiapan (menit)</label>
                <input type="number" id="menuPrepTime" class="form-control" value="10">
            </div>

            <div class="form-group">
                <label>Status</label>
                <select id="menuStatus" class="form-control">
                    <option value="1">Tersedia</option>
                    <option value="0">Tidak Tersedia</option>
                </select>
            </div>

            <div style="margin-top:1rem; text-align:right;">
                <button class="btn btn-outline" onclick="closeAddMenuForm()">Batal</button>
                <button class="btn btn-primary" onclick="submitAddMenu()">Simpan</button>
            </div>
        </div>
    </div>



    <script>
        // Initialize admin panel
        document.addEventListener('DOMContentLoaded', function() {
            setupNavigation();
            loadDashboard();
        });

        function setupNavigation() {
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    // Update active nav button
                    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');

                    // Show corresponding section
                    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
                    document.getElementById(this.dataset.section).classList.add('active');

                    // Load section data
                    switch (this.dataset.section) {
                        case 'dashboard':
                            loadDashboard();
                            break;
                        case 'orders':
                            loadOrders();
                            break;
                        case 'reservations':
                            loadReservations();
                            break;
                        case 'menu':
                            loadMenu();
                            break;
                        case 'analytics':
                            loadAnalytics();
                            break;
                    }
                });
            });
        }

        async function submitAddMenu() {
            const name = document.getElementById('menuName').value;
            const category = document.getElementById('menuCategory').value || '';
            const description = document.getElementById('menuDescription').value || '';
            const price = document.getElementById('menuPrice').value;
            const prepTime = document.getElementById('menuPrepTime').value || 10;
            const status = document.getElementById('menuStatus').value;
            const photoInput = document.getElementById('menuPhoto');

            if (!name || !price) {
                alert('Nama dan harga wajib diisi');
                return;
            }

            const formData = new FormData();
            formData.append('name', name);
            formData.append('category_id', category);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('preparation_time', prepTime);
            formData.append('is_available', status);

            if (photoInput && photoInput.files.length > 0) {
                formData.append('photo', photoInput.files[0]);
            }

            try {
                const response = await fetch('../api/menu.php', {
                    method: 'POST',
                    body: formData // ⬅️ PENTING
                });

                const result = await response.json();

                if (result.success) {
                    alert('Menu berhasil ditambahkan');
                    closeAddMenuForm();
                    loadMenu();
                } else {
                    alert(result.error || 'Gagal menambah menu');
                }
            } catch (error) {
                console.error(error);
                alert('Terjadi kesalahan');
            }
        }


        async function loadDashboard() {
            try {
                // Load basic stats
                const response = await fetch('../api/analytics.php?period=today');
                const data = await response.json();

                if (data.success) {
                    displayDashboardStats(data);
                }

                // Load recent orders
                loadRecentOrders();
                loadTodayReservations();

            } catch (error) {
                console.error('Error loading dashboard:', error);
            }
        }

        function displayDashboardStats(data) {
            const statsGrid = document.getElementById('statsGrid');
            const stats = data.order_stats;

            statsGrid.innerHTML = `
                <div class="stat-card">
                    <div class="stat-number">${stats.total_orders || 0}</div>
                    <div>Pesanan Hari Ini</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">Rp ${parseInt(stats.total_revenue || 0).toLocaleString()}</div>
                    <div>Pendapatan Hari Ini</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">Rp ${parseInt(stats.avg_order_value || 0).toLocaleString()}</div>
                    <div>Rata-rata Pesanan</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${data.reservation_stats?.total_reservations || 0}</div>
                    <div>Reservasi Hari Ini</div>
                </div>
            `;
        }

        async function loadRecentOrders() {
            try {
                const response = await fetch('../api/orders.php?limit=5');
                const data = await response.json();

                if (data.success) {
                    const container = document.getElementById('recentOrders');
                    container.innerHTML = `
                        <table>
                            <tbody>
                                ${data.orders.map(order => `
                                    <tr>
                                        <td>#${order.id}</td>
                                        <td>${order.customer_name}</td>
                                        <td>Rp ${parseInt(order.total_amount).toLocaleString()}</td>
                                        <td><span class="status-badge status-${order.order_status}">${getStatusText(order.order_status)}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `;
                }
            } catch (error) {
                console.error('Error loading recent orders:', error);
            }
        }

        async function loadTodayReservations() {
            try {
                const today = new Date().toISOString().split('T')[0];
                const response = await fetch(`../api/reservations.php?date=${today}&limit=5`);
                const data = await response.json();

                if (data.success) {
                    const container = document.getElementById('todayReservations');
                    container.innerHTML = `
                        <table>
                            <tbody>
                                ${data.reservations.map(reservation => `
                                    <tr>
                                        <td>#${reservation.id}</td>
                                        <td>${reservation.customer_name}</td>
                                        <td>Meja ${reservation.table_number}</td>
                                        <td>${reservation.reservation_time}</td>
                                        <td><span class="status-badge status-${reservation.status}">${getStatusText(reservation.status)}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `;
                }
            } catch (error) {
                console.error('Error loading today reservations:', error);
            }
        }

        async function loadOrders() {
            try {
                const status = document.getElementById('orderStatusFilter')?.value || '';
                const url = status ? `../api/orders.php?status=${status}` : '../api/orders.php';
                const response = await fetch(url);
                const data = await response.json();

                if (data.success) {
                    const tbody = document.getElementById('ordersTableBody');
                    tbody.innerHTML = data.orders.map(order => `
                        <tr>
                            <td>#${order.id}</td>
                            <td>
                                <strong>${order.customer_name}</strong><br>
                                <small>${order.customer_phone}</small>
                            </td>
                            <td>${getOrderTypeText(order.order_type)}</td>
                            <td>Rp ${parseInt(order.total_amount).toLocaleString()}</td>
                            <td><span class="status-badge status-${order.order_status}">${getStatusText(order.order_status)}</span></td>
                            <td>${new Date(order.created_at).toLocaleString('id-ID')}</td>
                            <td>
                                <div class="action-buttons">
                                    <select class="form-control btn-sm" onchange="updateOrderStatus(${order.id}, this.value)">
                                        <option value="">Ubah Status</option>
                                        <option value="confirmed" ${order.order_status === 'confirmed' ? 'selected' : ''}>Konfirmasi</option>
                                        <option value="preparing" ${order.order_status === 'preparing' ? 'selected' : ''}>Sedang Disiapkan</option>
                                        <option value="ready" ${order.order_status === 'ready' ? 'selected' : ''}>Siap</option>
                                        <option value="completed" ${order.order_status === 'completed' ? 'selected' : ''}>Selesai</option>
                                        <option value="cancelled" ${order.order_status === 'cancelled' ? 'selected' : ''}>Batal</option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                    `).join('');
                }
            } catch (error) {
                console.error('Error loading orders:', error);
            }
        }

        async function loadReservations() {
            try {
                const date = document.getElementById('reservationDateFilter')?.value || '';
                const url = date ? `../api/reservations.php?date=${date}` : '../api/reservations.php';
                const response = await fetch(url);
                const data = await response.json();

                if (data.success) {
                    const tbody = document.getElementById('reservationsTableBody');
                    tbody.innerHTML = data.reservations.map(reservation => `
                        <tr>
                            <td>#${reservation.id}</td>
                            <td>
                                <strong>${reservation.customer_name}</strong><br>
                                <small>${reservation.customer_phone}</small>
                            </td>
                            <td>Meja ${reservation.table_number} (${reservation.capacity} orang)</td>
                            <td>${reservation.reservation_date}</td>
                            <td>${reservation.reservation_time}</td>
                            <td>${reservation.party_size} orang</td>
                            <td><span class="status-badge status-${reservation.status}">${getStatusText(reservation.status)}</span></td>
                            <td>
                                <div class="action-buttons">
                                    <select class="form-control btn-sm" onchange="updateReservationStatus(${reservation.id}, this.value)">
                                        <option value="">Ubah Status</option>
                                        <option value="confirmed" ${reservation.status === 'confirmed' ? 'selected' : ''}>Konfirmasi</option>
                                        <option value="completed" ${reservation.status === 'completed' ? 'selected' : ''}>Selesai</option>
                                        <option value="cancelled" ${reservation.status === 'cancelled' ? 'selected' : ''}>Batal</option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                    `).join('');
                }
            } catch (error) {
                console.error('Error loading reservations:', error);
            }
        }

        async function loadMenu() {
            try {
                const response = await fetch('../api/menu.php');
                const data = await response.json();

                if (data.success) {
                    const tbody = document.getElementById('menuTableBody');
                    tbody.innerHTML = data.items.map(item => `
                        <tr>
                            <td>#${item.id}</td>
                            <td>${item.name}</td>
                            <td>${item.category_name}</td>
                            <td>Rp ${parseInt(item.price).toLocaleString()}</td>
                            <td><span class="status-badge ${item.is_available ? 'status-confirmed' : 'status-cancelled'}">${item.is_available ? 'Tersedia' : 'Tidak Tersedia'}</span></td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn btn-sm btn-primary" onclick="editMenuItem(${item.id})">Edit</button>
                                    <button class="btn btn-sm ${item.is_available ? 'btn-danger' : 'btn-success'}" onclick="toggleMenuAvailability(${item.id}, ${!item.is_available})">
                                        ${item.is_available ? 'Nonaktifkan' : 'Aktifkan'}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('');
                }
            } catch (error) {
                console.error('Error loading menu:', error);
            }
        }

        async function loadAnalytics() {
            try {
                const period = document.getElementById('analyticsPeriod')?.value || 'today';
                const response = await fetch(`../api/analytics.php?period=${period}`);
                const data = await response.json();

                if (data.success) {
                    displayAnalyticsStats(data);
                    displayPopularItems(data.popular_items);
                    displayPeakHours(data.peak_hours);
                }
            } catch (error) {
                console.error('Error loading analytics:', error);
            }
        }

        function displayAnalyticsStats(data) {
            const container = document.getElementById('analyticsStats');
            const stats = data.order_stats;

            container.innerHTML = `
                <div class="stat-card">
                    <div class="stat-number">${stats.total_orders || 0}</div>
                    <div>Total Pesanan</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">Rp ${parseInt(stats.total_revenue || 0).toLocaleString()}</div>
                    <div>Total Pendapatan</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">Rp ${parseInt(stats.avg_order_value || 0).toLocaleString()}</div>
                    <div>Rata-rata Pesanan</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${data.reservation_stats?.total_reservations || 0}</div>
                    <div>Total Reservasi</div>
                </div>
            `;
        }

        function displayPopularItems(items) {
            const container = document.getElementById('popularItems');
            container.innerHTML = `
                <table>
                    <tbody>
                        ${items.map((item, index) => `
                            <tr>
                                <td>#${index + 1}</td>
                                <td>${item.name}</td>
                                <td>${item.total_quantity} terjual</td>
                                <td>Rp ${parseInt(item.total_revenue).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        function displayPeakHours(hours) {
            const container = document.getElementById('peakHours');
            container.innerHTML = `
                <table>
                    <tbody>
                        ${hours.map(hour => `
                            <tr>
                                <td>${hour.hour}:00</td>
                                <td>${hour.order_count} pesanan</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        async function updateOrderStatus(orderId, status) {
            if (!status) return;

            try {
                const response = await fetch('../api/orders.php', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        order_id: orderId,
                        status: status
                    })
                });

                const result = await response.json();
                if (result.success) {
                    alert('Status pesanan berhasil diupdate');
                    loadOrders();
                } else {
                    alert('Error: ' + result.error);
                }
            } catch (error) {
                console.error('Error updating order status:', error);
                alert('Terjadi kesalahan saat mengupdate status');
            }
        }

        async function updateReservationStatus(reservationId, status) {
            if (!status) return;

            try {
                const response = await fetch('../api/reservations.php', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        reservation_id: reservationId,
                        status: status
                    })
                });

                const result = await response.json();
                if (result.success) {
                    alert('Status reservasi berhasil diupdate');
                    loadReservations();
                } else {
                    alert('Error: ' + result.error);
                }
            } catch (error) {
                console.error('Error updating reservation status:', error);
                alert('Terjadi kesalahan saat mengupdate status');
            }
        }

        function getStatusText(status) {
            const statusMap = {
                'pending': 'Menunggu',
                'confirmed': 'Dikonfirmasi',
                'preparing': 'Sedang Disiapkan',
                'ready': 'Siap',
                'completed': 'Selesai',
                'cancelled': 'Dibatalkan'
            };
            return statusMap[status] || status;
        }

        function getOrderTypeText(type) {
            const typeMap = {
                'dine_in': 'Makan di Tempat',
                'takeaway': 'Bawa Pulang',
                'delivery': 'Layanan Antar'
            };
            return typeMap[type] || type;
        }

        function showAddMenuForm() {
            document.getElementById('addMenuModal').style.display = 'block';
        }

        function closeAddMenuForm() {
            document.getElementById('addMenuModal').style.display = 'none';
        }

        function editMenuItem(id) {
            alert('Fitur edit menu akan segera tersedia');
        }

        function toggleMenuAvailability(id, available) {
            alert('Fitur toggle ketersediaan menu akan segera tersedia');
        }
    </script>
</body>

</html>