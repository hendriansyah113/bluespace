<?php require_once 'config/database.php'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout - Blue Space Coffee</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        .checkout-container {
            display: grid;
            grid-template-columns: 1fr 400px;
            gap: 2rem;
            margin: 2rem 0;
        }
        .order-summary {
            background: var(--white);
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            height: fit-content;
        }
        .payment-methods {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin: 1rem 0;
        }
        .payment-method {
            padding: 1rem;
            border: 2px solid var(--border-color);
            border-radius: 10px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .payment-method.selected {
            border-color: var(--primary-color);
            background: var(--primary-color);
            color: var(--white);
        }
        .qris-section {
            display: none;
            text-align: center;
            padding: 2rem;
            background: var(--light-gray);
            border-radius: 10px;
            margin: 1rem 0;
        }
        .qris-code {
            width: 200px;
            height: 200px;
            background: var(--white);
            border: 2px solid var(--border-color);
            margin: 1rem auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
        }
        @media (max-width: 768px) {
            .checkout-container {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <nav class="navbar">
            <a href="index.html" class="logo">
                <div class="logo-icon">☕</div>
                <div>
                    <div>Blue Space Coffee</div>
                    <small style="font-size: 0.8rem; font-weight: normal;">Pengalaman Kopi Premium</small>
                </div>
            </a>
            <ul class="nav-menu">
                <li><a href="menu.php">Menu</a></li>
                <li><a href="reservasi.php">Reservasi</a></li>
                <li><a href="admin/">Admin</a></li>
            </ul>
        </nav>
    </header>

    <div class="container">
        <h1 class="text-center mb-2">Checkout Pesanan</h1>
        
        <div class="checkout-container">
            <!-- Customer Information Form -->
            <div>
                <form id="checkoutForm" style="background: var(--white); padding: 2rem; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <h3>Informasi Pelanggan</h3>
                    
                    <div class="form-group">
                        <label>Nama Lengkap</label>
                        <input type="text" class="form-control" id="customerName" required>
                    </div>

                    <div class="form-group">
                        <label>Nomor Telepon</label>
                        <input type="tel" class="form-control" id="customerPhone" required>
                    </div>

                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" class="form-control" id="customerEmail">
                    </div>

                    <!-- Delivery Address (shown only for delivery orders) -->
                    <div id="deliverySection" style="display: none;">
                        <div class="form-group">
                            <label>Alamat Pengiriman</label>
                            <textarea class="form-control" id="deliveryAddress" rows="3" placeholder="Masukkan alamat lengkap untuk pengiriman"></textarea>
                        </div>
                    </div>

                    <!-- Table Selection (shown only for dine-in orders) -->
                    <div id="tableSection" style="display: none;">
                        <div class="form-group">
                            <label>Pilih Meja (Opsional)</label>
                            <select class="form-control" id="tableSelection">
                                <option value="">Pilih meja atau biarkan kosong</option>
                                <option value="A1">Meja A1 (2 orang, dekat jendela)</option>
                                <option value="A2">Meja A2 (2 orang, dekat jendela)</option>
                                <option value="B1">Meja B1 (4 orang, indoor)</option>
                                <option value="B2">Meja B2 (4 orang, indoor)</option>
                                <option value="C1">Meja C1 (6 orang, indoor)</option>
                                <option value="D1">Meja D1 (2 orang, outdoor)</option>
                                <option value="D2">Meja D2 (4 orang, outdoor)</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Catatan Pesanan</label>
                        <textarea class="form-control" id="orderNotes" rows="3" placeholder="Catatan khusus untuk pesanan Anda"></textarea>
                    </div>

                    <h3 style="margin-top: 2rem;">Metode Pembayaran</h3>
                    <div class="payment-methods">
                        <div class="payment-method" data-method="cash">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">💵</div>
                            <h4>Tunai</h4>
                            <p>Bayar di kasir</p>
                        </div>
                        <div class="payment-method" data-method="qris">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">📱</div>
                            <h4>QRIS</h4>
                            <p>Pembayaran digital</p>
                        </div>
                    </div>

                    <!-- QRIS Payment Section -->
                    <div class="qris-section" id="qrisSection">
                        <h4>Scan QR Code untuk Pembayaran</h4>
                        <div class="qris-code">
                            📱<br>QR
                        </div>
                        <p>Scan kode QR di atas dengan aplikasi pembayaran digital Anda</p>
                        <div id="paymentTimer" style="font-size: 1.2rem; font-weight: bold; color: var(--primary-color);">
                            Waktu tersisa: <span id="countdown">05:00</span>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 2rem;">
                        Konfirmasi Pesanan
                    </button>
                </form>
            </div>

            <!-- Order Summary -->
            <div class="order-summary">
                <h3>Ringkasan Pesanan</h3>
                <div id="orderType" style="margin-bottom: 1rem;"></div>
                <div id="orderItems"></div>
                <div style="border-top: 2px solid var(--border-color); margin-top: 1rem; padding-top: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Subtotal:</span>
                        <span id="subtotal">Rp 0</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;" id="deliveryFeeRow" style="display: none;">
                        <span>Biaya Antar:</span>
                        <span id="deliveryFee">Rp 5,000</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: bold;">
                        <span>Total:</span>
                        <span id="totalAmount">Rp 0</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let cart = [];
        let orderType = '';
        let selectedPaymentMethod = '';
        let paymentTimer;

        document.addEventListener('DOMContentLoaded', function() {
            // Load cart and order type from localStorage
            cart = JSON.parse(localStorage.getItem('cart') || '[]');
            orderType = localStorage.getItem('orderType') || '';

            if (cart.length === 0) {
                alert('Keranjang kosong! Silakan pesan terlebih dahulu.');
                window.location.href = 'menu.php';
                return;
            }

            displayOrderSummary();
            setupPaymentMethods();
            setupFormSections();

            // Form submission
            document.getElementById('checkoutForm').addEventListener('submit', function(e) {
                e.preventDefault();
                submitOrder();
            });
        });

        function displayOrderSummary() {
            const orderTypeText = {
                'dine_in': '🍽️ Makan di Tempat',
                'takeaway': '🥤 Bawa Pulang',
                'delivery': '🚚 Layanan Antar'
            };

            document.getElementById('orderType').innerHTML = `<strong>${orderTypeText[orderType]}</strong>`;

            const itemsHtml = cart.map(item => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                    <div>
                        <h5>${item.name}</h5>
                        <small>Rp ${parseInt(item.price).toLocaleString()} x ${item.quantity}</small>
                    </div>
                    <span>Rp ${(parseInt(item.price) * item.quantity).toLocaleString()}</span>
                </div>
            `).join('');

            document.getElementById('orderItems').innerHTML = itemsHtml;

            const subtotal = cart.reduce((sum, item) => sum + (parseInt(item.price) * item.quantity), 0);
            const deliveryFee = orderType === 'delivery' ? 5000 : 0;
            const total = subtotal + deliveryFee;

            document.getElementById('subtotal').textContent = `Rp ${subtotal.toLocaleString()}`;
            document.getElementById('totalAmount').textContent = `Rp ${total.toLocaleString()}`;

            if (orderType === 'delivery') {
                document.getElementById('deliveryFeeRow').style.display = 'flex';
            }
        }

        function setupFormSections() {
            if (orderType === 'delivery') {
                document.getElementById('deliverySection').style.display = 'block';
            } else if (orderType === 'dine_in') {
                document.getElementById('tableSection').style.display = 'block';
            }
        }

        function setupPaymentMethods() {
            document.querySelectorAll('.payment-method').forEach(method => {
                method.addEventListener('click', function() {
                    document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
                    this.classList.add('selected');
                    selectedPaymentMethod = this.dataset.method;

                    if (selectedPaymentMethod === 'qris') {
                        document.getElementById('qrisSection').style.display = 'block';
                        startPaymentTimer();
                    } else {
                        document.getElementById('qrisSection').style.display = 'none';
                        if (paymentTimer) clearInterval(paymentTimer);
                    }
                });
            });
        }

        function startPaymentTimer() {
            let timeLeft = 300; // 5 minutes
            const countdownElement = document.getElementById('countdown');

            paymentTimer = setInterval(() => {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                if (timeLeft <= 0) {
                    clearInterval(paymentTimer);
                    alert('Waktu pembayaran habis. Silakan coba lagi.');
                    document.getElementById('qrisSection').style.display = 'none';
                    document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
                    selectedPaymentMethod = '';
                }
                timeLeft--;
            }, 1000);
        }

        async function submitOrder() {
            const customerName = document.getElementById('customerName').value;
            const customerPhone = document.getElementById('customerPhone').value;
            const customerEmail = document.getElementById('customerEmail').value;
            const orderNotes = document.getElementById('orderNotes').value;

            if (!customerName || !customerPhone) {
                alert('Mohon lengkapi nama dan nomor telepon!');
                return;
            }

            if (!selectedPaymentMethod) {
                alert('Mohon pilih metode pembayaran!');
                return;
            }

            if (orderType === 'delivery' && !document.getElementById('deliveryAddress').value) {
                alert('Mohon masukkan alamat pengiriman!');
                return;
            }

            // Prepare order data
            const orderData = {
                order_type: orderType,
                items: cart,
                customer: {
                    name: customerName,
                    phone: customerPhone,
                    email: customerEmail
                },
                deliveryAddress: orderType === 'delivery' ? document.getElementById('deliveryAddress').value : null,
                tableSelection: orderType === 'dine_in' ? document.getElementById('tableSelection').value : null,
                notes: orderNotes,
                paymentMethod: selectedPaymentMethod
            };

            try {
                const response = await fetch('api/orders.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData)
                });

                const result = await response.json();
                
                if (result.success) {
                    alert(`Pesanan berhasil dibuat!\n\nNomor Pesanan: #${result.order_id}\nMetode Pembayaran: ${selectedPaymentMethod === 'cash' ? 'Tunai' : 'QRIS'}\n\nTerima kasih telah memesan di Blue Space Coffee!`);

                    // Clear cart and redirect
                    localStorage.removeItem('cart');
                    localStorage.removeItem('orderType');
                    window.location.href = 'index.html';
                } else {
                    alert('Error: ' + result.error);
                }
            } catch (error) {
                console.error('Error submitting order:', error);
                alert('Terjadi kesalahan saat membuat pesanan. Silakan coba lagi.');
            }
        }
    </script>
</body>
</html>
