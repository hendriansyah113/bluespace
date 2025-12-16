<?php require_once 'config/database.php'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reservasi Meja - Blue Space Coffee</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        .reservation-form {
            max-width: 600px;
            margin: 2rem auto;
            background: var(--white);
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        .table-selection {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin: 1rem 0;
        }
        .table-option {
            padding: 1rem;
            border: 2px solid var(--border-color);
            border-radius: 10px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .table-option.available:hover {
            border-color: var(--primary-color);
        }
        .table-option.selected {
            border-color: var(--primary-color);
            background: var(--primary-color);
            color: var(--white);
        }
        .table-option.unavailable {
            background: var(--light-gray);
            color: #999;
            cursor: not-allowed;
        }
        .time-slots {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 0.5rem;
            margin: 1rem 0;
        }
        .time-slot {
            padding: 0.5rem;
            border: 2px solid var(--border-color);
            border-radius: 5px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .time-slot:hover {
            border-color: var(--primary-color);
        }
        .time-slot.selected {
            border-color: var(--primary-color);
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
                <li><a href="menu.php">Menu</a></li>
                <li><a href="reservasi.php" style="color: var(--primary-color);">Reservasi</a></li>
                <li><a href="admin/">Admin</a></li>
            </ul>
        </nav>
    </header>

    <div class="container">
        <h1 class="text-center mb-2">Reservasi Meja</h1>
        <p class="text-center mb-2">Pesan meja Anda untuk pengalaman yang lebih nyaman di Blue Space Coffee</p>

        <form class="reservation-form" id="reservationForm">
            <!-- Step 1: Date and Party Size -->
            <div class="form-step" id="step1">
                <h3>Pilih Tanggal dan Jumlah Tamu</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Tanggal Reservasi</label>
                        <input type="date" class="form-control" id="reservationDate" required>
                    </div>
                    <div class="form-group">
                        <label>Jumlah Tamu</label>
                        <select class="form-control" id="partySize" required>
                            <option value="">Pilih jumlah tamu</option>
                            <option value="1">1 orang</option>
                            <option value="2">2 orang</option>
                            <option value="3">3 orang</option>
                            <option value="4">4 orang</option>
                            <option value="5">5 orang</option>
                            <option value="6">6 orang</option>
                            <option value="7">7+ orang</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Waktu Reservasi</label>
                    <div class="time-slots">
                        <div class="time-slot" data-time="08:00">08:00</div>
                        <div class="time-slot" data-time="09:00">09:00</div>
                        <div class="time-slot" data-time="10:00">10:00</div>
                        <div class="time-slot" data-time="11:00">11:00</div>
                        <div class="time-slot" data-time="12:00">12:00</div>
                        <div class="time-slot" data-time="13:00">13:00</div>
                        <div class="time-slot" data-time="14:00">14:00</div>
                        <div class="time-slot" data-time="15:00">15:00</div>
                        <div class="time-slot" data-time="16:00">16:00</div>
                        <div class="time-slot" data-time="17:00">17:00</div>
                        <div class="time-slot" data-time="18:00">18:00</div>
                        <div class="time-slot" data-time="19:00">19:00</div>
                        <div class="time-slot" data-time="20:00">20:00</div>
                        <div class="time-slot" data-time="21:00">21:00</div>
                    </div>
                </div>

                <button type="button" class="btn btn-primary" onclick="nextStep(2)">Lanjut ke Pemilihan Meja</button>
            </div>

            <!-- Step 2: Table Selection -->
            <div class="form-step" id="step2" style="display: none;">
                <h3>Pilih Meja</h3>
                <p>Meja yang tersedia untuk tanggal dan waktu yang dipilih:</p>
                
                <div class="table-selection" id="tableSelection">
                    <!-- Tables will be loaded here -->
                </div>

                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button type="button" class="btn btn-outline" onclick="prevStep(1)">Kembali</button>
                    <button type="button" class="btn btn-primary" onclick="nextStep(3)">Lanjut ke Data Diri</button>
                </div>
            </div>

            <!-- Step 3: Customer Information -->
            <div class="form-step" id="step3" style="display: none;">
                <h3>Data Diri</h3>
                
                <div class="form-group">
                    <label>Nama Lengkap</label>
                    <input type="text" class="form-control" id="customerName" required>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Nomor Telepon</label>
                        <input type="tel" class="form-control" id="customerPhone" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" class="form-control" id="customerEmail">
                    </div>
                </div>

                <div class="form-group">
                    <label>Permintaan Khusus</label>
                    <textarea class="form-control" id="specialRequests" rows="3" placeholder="Contoh: Meja dekat jendela, perayaan ulang tahun, dll."></textarea>
                </div>

                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button type="button" class="btn btn-outline" onclick="prevStep(2)">Kembali</button>
                    <button type="submit" class="btn btn-primary">Konfirmasi Reservasi</button>
                </div>
            </div>
        </form>
    </div>

    <script>
        let tables = [];
        let selectedDate = '';
        let selectedTime = '';
        let selectedTable = '';
        let selectedPartySize = '';

        // Initialize form
        document.addEventListener('DOMContentLoaded', function() {
            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('reservationDate').min = today;

            // Time slot selection
            document.querySelectorAll('.time-slot').forEach(slot => {
                slot.addEventListener('click', function() {
                    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                    this.classList.add('selected');
                    selectedTime = this.dataset.time;
                });
            });

            // Form submission
            document.getElementById('reservationForm').addEventListener('submit', function(e) {
                e.preventDefault();
                submitReservation();
            });
        });

        function nextStep(step) {
            if (step === 2) {
                selectedDate = document.getElementById('reservationDate').value;
                selectedPartySize = document.getElementById('partySize').value;
                
                if (!selectedDate || !selectedPartySize || !selectedTime) {
                    alert('Mohon lengkapi semua field terlebih dahulu!');
                    return;
                }
                
                loadAvailableTables();
            }
            
            if (step === 3 && !selectedTable) {
                alert('Mohon pilih meja terlebih dahulu!');
                return;
            }

            document.querySelectorAll('.form-step').forEach(s => s.style.display = 'none');
            document.getElementById('step' + step).style.display = 'block';
        }

        function prevStep(step) {
            document.querySelectorAll('.form-step').forEach(s => s.style.display = 'none');
            document.getElementById('step' + step).style.display = 'block';
        }

        async function loadAvailableTables() {
            if (!selectedDate || !selectedTime || !selectedPartySize) {
                return;
            }

            try {
                const response = await fetch(`api/reservations.php?available_tables=1&date=${selectedDate}&time=${selectedTime}&party_size=${selectedPartySize}`);
                const data = await response.json();
                
                if (data.success) {
                    displayAvailableTables(data.tables);
                } else {
                    console.error('Error loading tables:', data.error);
                    // Fallback to static data
                    displayFallbackTables();
                }
            } catch (error) {
                console.error('Error fetching tables:', error);
                displayFallbackTables();
            }
        }

        function displayFallbackTables() {
            const fallbackTables = [
                {id: 1, table_number: 'A1', capacity: 2, location: 'window'},
                {id: 2, table_number: 'A2', capacity: 2, location: 'window'},
                {id: 3, table_number: 'B1', capacity: 4, location: 'indoor'},
                {id: 4, table_number: 'B2', capacity: 4, location: 'indoor'},
                {id: 5, table_number: 'C1', capacity: 6, location: 'indoor'},
                {id: 6, table_number: 'D1', capacity: 2, location: 'outdoor'},
                {id: 7, table_number: 'D2', capacity: 4, location: 'outdoor'}
            ];
            
            const partySize = parseInt(selectedPartySize);
            const suitableTables = fallbackTables.filter(table => table.capacity >= partySize);
            displayAvailableTables(suitableTables);
        }

        function displayAvailableTables(availableTables) {
            const container = document.getElementById('tableSelection');
            
            container.innerHTML = availableTables.map(table => {
                const locationIcon = table.location === 'window' ? '🪟' : 
                                   table.location === 'outdoor' ? '🌳' : '🏠';
                const locationText = table.location === 'window' ? 'Dekat Jendela' :
                                   table.location === 'outdoor' ? 'Outdoor' : 'Indoor';
                
                return `
                    <div class="table-option available" data-table="${table.id}">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">${locationIcon}</div>
                        <h4>Meja ${table.table_number}</h4>
                        <p>${table.capacity} orang</p>
                        <small>${locationText}</small>
                    </div>
                `;
            }).join('');

            // Add click handlers
            document.querySelectorAll('.table-option').forEach(option => {
                option.addEventListener('click', function() {
                    if (this.classList.contains('unavailable')) return;
                    
                    document.querySelectorAll('.table-option').forEach(o => o.classList.remove('selected'));
                    this.classList.add('selected');
                    selectedTable = this.dataset.table;
                });
            });
        }

        async function submitReservation() {
            const customerName = document.getElementById('customerName').value;
            const customerPhone = document.getElementById('customerPhone').value;
            const customerEmail = document.getElementById('customerEmail').value;
            const specialRequests = document.getElementById('specialRequests').value;

            if (!customerName || !customerPhone) {
                alert('Mohon lengkapi nama dan nomor telepon!');
                return;
            }

            const reservationData = {
                date: selectedDate,
                time: selectedTime,
                table_id: selectedTable,
                party_size: selectedPartySize,
                customer: {
                    name: customerName,
                    phone: customerPhone,
                    email: customerEmail
                },
                special_requests: specialRequests
            };

            try {
                const response = await fetch('api/reservations.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reservationData)
                });

                const result = await response.json();
                
                if (result.success) {
                    alert(`Reservasi berhasil dibuat!\n\nID Reservasi: #${result.reservation_id}\nTanggal: ${selectedDate}\nWaktu: ${selectedTime}\nNama: ${customerName}\n\nKami akan menghubungi Anda untuk konfirmasi.`);
                    
                    // Reset form
                    document.getElementById('reservationForm').reset();
                    document.querySelectorAll('.form-step').forEach(s => s.style.display = 'none');
                    document.getElementById('step1').style.display = 'block';
                } else {
                    alert('Error: ' + result.error);
                }
            } catch (error) {
                console.error('Error submitting reservation:', error);
                alert('Terjadi kesalahan saat membuat reservasi. Silakan coba lagi.');
            }
        }
    </script>
</body>
</html>
