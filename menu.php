<?php require_once 'config/database.php'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menu - Blue Space Coffee</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        .menu-categories {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 2rem 0;
            flex-wrap: wrap;
        }
        .category-btn {
            padding: 0.75rem 1.5rem;
            border: 2px solid var(--primary-color);
            background: transparent;
            color: var(--primary-color);
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .category-btn.active,
        .category-btn:hover {
            background: var(--primary-color);
            color: var(--white);
        }
        .order-type-selector {
            background: var(--white);
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        .order-types {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        .order-type {
            padding: 1rem;
            border: 2px solid var(--border-color);
            border-radius: 10px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .order-type.selected {
            border-color: var(--primary-color);
            background: var(--primary-color);
            color: var(--white);
        }
        .cart-sidebar {
            position: fixed;
            right: -400px;
            top: 0;
            width: 400px;
            height: 100vh;
            background: var(--white);
            box-shadow: -2px 0 10px rgba(0,0,0,0.1);
            transition: right 0.3s ease;
            z-index: 1001;
            overflow-y: auto;
        }
        .cart-sidebar.open {
            right: 0;
        }
        .cart-toggle {
            position: fixed;
            right: 2rem;
            bottom: 2rem;
            background: var(--primary-color);
            color: var(--white);
            border: none;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
        }
        .quantity-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        .quantity-btn {
            width: 30px;
            height: 30px;
            border: 1px solid var(--primary-color);
            background: var(--white);
            color: var(--primary-color);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .quantity-btn:hover {
            background: var(--primary-color);
            color: var(--white);
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
                <li><a href="menu.php" style="color: var(--primary-color);">Menu</a></li>
                <li><a href="reservasi.php">Reservasi</a></li>
                <li><a href="admin/">Admin</a></li>
            </ul>
        </nav>
    </header>

    <div class="container">
        <!-- Order Type Selection -->
        <section class="order-type-selector">
            <h2 class="text-center">Pilih Jenis Pesanan</h2>
            <div class="order-types">
                <div class="order-type" data-type="dine_in">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🍽️</div>
                    <h3>Makan di Tempat</h3>
                    <p>Nikmati di cafe kami</p>
                </div>
                <div class="order-type" data-type="takeaway">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🥤</div>
                    <h3>Bawa Pulang</h3>
                    <p>Ambil dan bawa pulang</p>
                </div>
                <div class="order-type" data-type="delivery">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🚚</div>
                    <h3>Layanan Antar</h3>
                    <p>Diantar ke alamat Anda</p>
                </div>
            </div>
        </section>

        <!-- Menu Categories -->
        <div class="menu-categories">
            <button class="category-btn active" data-category="all">Semua Menu</button>
            <!-- Categories will be loaded dynamically -->
        </div>

        <!-- Menu Items -->
        <div id="menu-items">
            <!-- Menu items will be loaded here via JavaScript -->
        </div>
    </div>

    <!-- Cart Toggle Button -->
    <button class="cart-toggle" onclick="toggleCart()">
        🛒 <span id="cart-count">0</span>
    </button>

    <!-- Cart Sidebar -->
    <div class="cart-sidebar" id="cart-sidebar">
        <div class="p-2">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h3>Keranjang Belanja</h3>
                <button onclick="toggleCart()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">✕</button>
            </div>
            <div id="cart-items">
                <p class="text-center">Keranjang kosong</p>
            </div>
            <div id="cart-total" style="margin-top: 2rem; padding-top: 1rem; border-top: 2px solid var(--border-color);">
                <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: bold;">
                    <span>Total:</span>
                    <span id="total-amount">Rp 0</span>
                </div>
            </div>
            <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="checkout()">
                Lanjut ke Pembayaran
            </button>
        </div>
    </div>

    <script>
        let menuItems = [];
        let categories = [];
        let cart = [];
        let selectedOrderType = '';

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            loadMenuData();
            
            // Order type selection
            document.querySelectorAll('.order-type').forEach(type => {
                type.addEventListener('click', function() {
                    document.querySelectorAll('.order-type').forEach(t => t.classList.remove('selected'));
                    this.classList.add('selected');
                    selectedOrderType = this.dataset.type;
                });
            });
        });

        async function loadMenuData() {
            try {
                const response = await fetch('api/menu.php');
                const data = await response.json();
                
                if (data.success) {
                    menuItems = data.items;
                    categories = data.categories;
                    displayMenuItems('all');
                    updateCategoryButtons();
                } else {
                    console.error('Error loading menu:', data.error);
                    // Fallback to static data if API fails
                    loadFallbackData();
                }
            } catch (error) {
                console.error('Error fetching menu:', error);
                loadFallbackData();
            }
        }

        function loadFallbackData() {
            // Fallback static data
            categories = [
                {id: 1, name: 'Kopi'},
                {id: 2, name: 'Makanan'},
                {id: 3, name: 'Minuman Non-Kopi'},
                {id: 4, name: 'Dessert'}
            ];
            
            menuItems = [
                {id: 1, category_id: 1, name: 'Espresso', description: 'Kopi hitam pekat dengan rasa yang kuat', price: 15000, image_url: 'assets/images/espresso.jpg', preparation_time: 5},
                {id: 2, category_id: 1, name: 'Cappuccino', description: 'Espresso dengan susu steamed dan foam', price: 25000, image_url: 'assets/images/cappuccino.jpg', preparation_time: 8},
                {id: 3, category_id: 1, name: 'Latte', description: 'Espresso dengan susu steamed dan sedikit foam', price: 28000, image_url: 'assets/images/latte.jpg', preparation_time: 8},
                {id: 4, category_id: 2, name: 'Sandwich Club', description: 'Sandwich dengan ayam, sayuran segar', price: 35000, image_url: 'assets/images/sandwich.jpg', preparation_time: 12},
                {id: 5, category_id: 2, name: 'Pasta Carbonara', description: 'Pasta dengan saus krim dan bacon', price: 45000, image_url: 'assets/images/pasta.jpg', preparation_time: 15},
                {id: 6, category_id: 3, name: 'Teh Tarik', description: 'Teh dengan susu yang ditarik', price: 12000, image_url: 'assets/images/teh.jpg', preparation_time: 5},
                {id: 7, category_id: 4, name: 'Tiramisu', description: 'Dessert Italia dengan kopi dan mascarpone', price: 28000, image_url: 'assets/images/tiramisu.jpg', preparation_time: 2}
            ];
            
            displayMenuItems('all');
            updateCategoryButtons();
        }

        function updateCategoryButtons() {
            const categoryContainer = document.querySelector('.menu-categories');
            const buttonsHtml = `
                <button class="category-btn active" data-category="all">Semua Menu</button>
                ${categories.map(cat => 
                    `<button class="category-btn" data-category="${cat.id}">${cat.name}</button>`
                ).join('')}
            `;
            categoryContainer.innerHTML = buttonsHtml;
            
            // Re-attach event listeners
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    displayMenuItems(this.dataset.category);
                });
            });
        }

        function displayMenuItems(category) {
            const container = document.getElementById('menu-items');
            let filteredItems = category === 'all' ? menuItems : menuItems.filter(item => item.category_id == category);
            
            container.innerHTML = filteredItems.map(item => `
                <div class="menu-item">
                    <img src="${item.image_url || 'assets/images/placeholder.jpg'}" alt="${item.name}" onerror="this.src='assets/images/placeholder.jpg'">
                    <div class="menu-item-content">
                        <h4>${item.name}</h4>
                        <p>${item.description}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span class="menu-item-price">Rp ${parseInt(item.price).toLocaleString()}</span>
                            <small>⏱️ ${item.preparation_time} menit</small>
                        </div>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                            <span id="qty-${item.id}">0</span>
                            <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                            <button class="btn btn-primary" style="margin-left: 1rem;" onclick="addToCart(${item.id})">Tambah</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function changeQuantity(itemId, change) {
            const qtyElement = document.getElementById(`qty-${itemId}`);
            let currentQty = parseInt(qtyElement.textContent);
            currentQty = Math.max(0, currentQty + change);
            qtyElement.textContent = currentQty;
        }

        function addToCart(itemId) {
            const qty = parseInt(document.getElementById(`qty-${itemId}`).textContent);
            if (qty === 0) return;

            const item = menuItems.find(i => i.id === itemId);
            const existingItem = cart.find(c => c.id === itemId);

            if (existingItem) {
                existingItem.quantity += qty;
            } else {
                cart.push({...item, quantity: qty});
            }

            document.getElementById(`qty-${itemId}`).textContent = '0';
            updateCartDisplay();
        }

        function updateCartDisplay() {
            const cartItems = document.getElementById('cart-items');
            const cartCount = document.getElementById('cart-count');
            const totalAmount = document.getElementById('total-amount');

            if (cart.length === 0) {
                cartItems.innerHTML = '<p class="text-center">Keranjang kosong</p>';
                cartCount.textContent = '0';
                totalAmount.textContent = 'Rp 0';
                return;
            }

            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const total = cart.reduce((sum, item) => sum + (parseInt(item.price) * item.quantity), 0);

            cartCount.textContent = totalItems;
            totalAmount.textContent = `Rp ${total.toLocaleString()}`;

            cartItems.innerHTML = cart.map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--border-color);">
                    <div>
                        <h5>${item.name}</h5>
                        <p>Rp ${parseInt(item.price).toLocaleString()} x ${item.quantity}</p>
                    </div>
                    <button onclick="removeFromCart(${item.id})" style="background: var(--danger-color); color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">×</button>
                </div>
            `).join('');
        }

        function removeFromCart(itemId) {
            cart = cart.filter(item => item.id !== itemId);
            updateCartDisplay();
        }

        function toggleCart() {
            document.getElementById('cart-sidebar').classList.toggle('open');
        }

        function checkout() {
            if (cart.length === 0) {
                alert('Keranjang masih kosong!');
                return;
            }
            if (!selectedOrderType) {
                alert('Silakan pilih jenis pesanan terlebih dahulu!');
                return;
            }
            
            // Store cart and order type in localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('orderType', selectedOrderType);
            window.location.href = 'checkout.php';
        }
    </script>
</body>
</html>
