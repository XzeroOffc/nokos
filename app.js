// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const closeSidebar = document.getElementById('closeSidebar');
const sidebar = document.getElementById('sidebar');
const authSection = document.getElementById('authSection');
const dashboardSection = document.getElementById('dashboardSection');
const logoutBtn = document.getElementById('logoutBtn');
const csButton = document.getElementById('csButton');
const csModal = document.getElementById('csModal');
const closeCsModal = document.querySelector('.close-cs-modal');
const orderModal = document.getElementById('orderModal');
const closeOrderModal = document.querySelector('.close-order-modal');
const notificationBell = document.getElementById('notificationBell');
const notificationDropdown = document.getElementById('notificationDropdown');

// Auth Elements
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const githubAuth = document.getElementById('githubAuth');
const githubLoginBtn = document.getElementById('githubLoginBtn');
const togglePasswordButtons = document.querySelectorAll('.toggle-password');

// Dashboard Elements
const welcomeUsername = document.getElementById('welcomeUsername');
const userBalance = document.getElementById('userBalance');
const sidebarBalance = document.getElementById('sidebarBalance');
const totalOrders = document.getElementById('totalOrders');
const successOrders = document.getElementById('successOrders');
const usernameDisplay = document.getElementById('usernameDisplay');
const sidebarUserName = document.getElementById('sidebarUserName');
const productsGrid = document.getElementById('productsGrid');
const productsLoading = document.getElementById('productsLoading');
const productSearch = document.getElementById('productSearch');
const categoryFilter = document.getElementById('categoryFilter');
const depositAmount = document.getElementById('depositAmount');
const amountPresets = document.querySelectorAll('.amount-preset');
const submitDeposit = document.getElementById('submitDeposit');
const methodCards = document.querySelectorAll('.method-card');
const historyTabs = document.querySelectorAll('.history-tab');
const historyTabContents = document.querySelectorAll('.history-tab-content');
const ordersTableBody = document.getElementById('ordersTableBody');
const depositsTableBody = document.getElementById('depositsTableBody');
const toastContainer = document.getElementById('toastContainer');

// Application State
let currentUser = null;
let userData = null;
let products = [];
let filteredProducts = [];
let currentOrderProduct = null;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    checkAuthState();
    loadProducts();
    
    // Check for theme in localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
});

// Event Listeners
function initEventListeners() {
    // Theme Toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Menu Toggle
    menuToggle.addEventListener('click', () => {
        sidebar.classList.add('active');
    });
    
    closeSidebar.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
    
    // Auth Tabs
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchAuthTab(tabName);
        });
    });
    
    // Toggle Password Visibility
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Login Form
    loginForm.addEventListener('submit', handleLogin);
    
    // Signup Form
    signupForm.addEventListener('submit', handleSignup);
    
    // GitHub Login
    githubLoginBtn.addEventListener('click', handleGitHubLogin);
    
    // Logout
    logoutBtn.addEventListener('click', handleLogout);
    
    // CS Button
    csButton.addEventListener('click', () => {
        csModal.classList.add('active');
    });
    
    closeCsModal.addEventListener('click', () => {
        csModal.classList.remove('active');
    });
    
    // Close CS modal when clicking outside
    csModal.addEventListener('click', (e) => {
        if (e.target === csModal) {
            csModal.classList.remove('active');
        }
    });
    
    // Order Modal
    closeOrderModal.addEventListener('click', () => {
        orderModal.classList.remove('active');
    });
    
    // Close order modal when clicking outside
    orderModal.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            orderModal.classList.remove('active');
        }
    });
    
    // Notification Bell
    notificationBell.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationDropdown.classList.toggle('active');
    });
    
    // Close notification dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!notificationContainer.contains(e.target)) {
            notificationDropdown.classList.remove('active');
        }
    });
    
    // Product Search
    productSearch.addEventListener('input', filterProducts);
    
    // Category Filter
    categoryFilter.addEventListener('change', filterProducts);
    
    // Deposit Amount Presets
    amountPresets.forEach(preset => {
        preset.addEventListener('click', function() {
            const amount = this.getAttribute('data-amount');
            depositAmount.value = amount;
            
            // Remove active class from all presets
            amountPresets.forEach(p => p.classList.remove('active'));
            // Add active class to clicked preset
            this.classList.add('active');
        });
    });
    
    // Deposit Method Selection
    methodCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            methodCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked card
            this.classList.add('active');
        });
    });
    
    // Submit Deposit
    submitDeposit.addEventListener('click', handleDeposit);
    
    // History Tabs
    historyTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Update active tab
            historyTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            historyTabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabName}History`) {
                    content.classList.add('active');
                }
            });
            
            // Load data for the active tab
            if (tabName === 'orders') {
                loadOrderHistory();
            } else if (tabName === 'deposits') {
                loadDepositHistory();
            }
        });
    });
    
    // Quick Actions
    document.getElementById('quickOrder').addEventListener('click', () => {
        window.scrollTo({
            top: document.getElementById('productsSection').offsetTop - 100,
            behavior: 'smooth'
        });
    });
    
    document.getElementById('quickDeposit').addEventListener('click', () => {
        window.scrollTo({
            top: document.getElementById('depositSection').offsetTop - 100,
            behavior: 'smooth'
        });
    });
    
    document.getElementById('checkOrders').addEventListener('click', () => {
        // Switch to orders history tab
        historyTabs[0].click();
        window.scrollTo({
            top: document.getElementById('historySection').offsetTop - 100,
            behavior: 'smooth'
        });
    });
    
    document.getElementById('openHistory').addEventListener('click', () => {
        historyTabs[0].click();
        window.scrollTo({
            top: document.getElementById('historySection').offsetTop - 100,
            behavior: 'smooth'
        });
    });
}

// Theme Functions
function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Create ripple effect
    const ripple = themeToggle.querySelector('.theme-ripple');
    ripple.style.transform = 'scale(1.5)';
    ripple.style.opacity = '0.1';
    
    setTimeout(() => {
        ripple.style.transform = 'scale(0)';
        ripple.style.opacity = '0';
    }, 500);
}

function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.querySelector('.theme-icon i').className = 'fas fa-moon';
    } else {
        document.body.classList.remove('dark-theme');
        themeToggle.querySelector('.theme-icon i').className = 'fas fa-sun';
    }
    localStorage.setItem('theme', theme);
}

// Auth Functions
function switchAuthTab(tabName) {
    // Update active tab
    authTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === tabName) {
            tab.classList.add('active');
        }
    });
    
    // Show corresponding form
    authForms.forEach(form => {
        form.classList.remove('active');
        if (form.id === `${tabName}Form` || form.id === `${tabName}Auth`) {
            form.classList.add('active');
        }
    });
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        showToast('info', 'Sedang masuk...', 'Mohon tunggu sebentar');
        
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        currentUser = userCredential.user;
        
        // Load user data from Firestore
        await loadUserData(currentUser.uid);
        
        showToast('success', 'Login berhasil!', `Selamat datang ${userData.username}`);
        
        // Send Telegram notification for user login
        const telegramMessage = `🔄 <b>User Login</b>\n👤 Username: ${userData.username}\n📧 Email: ${email}\n⏰ Waktu: ${new Date().toLocaleString()}`;
        sendTelegramNotification(telegramMessage);
        
    } catch (error) {
        console.error("Login error:", error);
        showToast('error', 'Login gagal!', getErrorMessage(error));
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (password !== confirmPassword) {
        showToast('error', 'Password tidak cocok!', 'Pastikan password dan konfirmasi password sama');
        return;
    }
    
    if (password.length < 6) {
        showToast('error', 'Password terlalu pendek!', 'Password minimal 6 karakter');
        return;
    }
    
    try {
        showToast('info', 'Membuat akun...', 'Mohon tunggu sebentar');
        
        // Create user in Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        currentUser = userCredential.user;
        
        // Create user document in Firestore
        await db.collection('users').doc(currentUser.uid).set({
            uid: currentUser.uid,
            username: username,
            email: email,
            balance: 0,
            totalOrders: 0,
            successOrders: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        
        // Load user data
        await loadUserData(currentUser.uid);
        
        showToast('success', 'Akun berhasil dibuat!', `Selamat bergabung ${username}`);
        
        // Send Telegram notification for new user
        const telegramMessage = `🎉 <b>User Baru Mendaftar!</b>\n👤 Username: ${username}\n📧 Email: ${email}\n🆔 UID: ${currentUser.uid}\n⏰ Waktu: ${new Date().toLocaleString()}`;
        sendTelegramNotification(telegramMessage);
        
    } catch (error) {
        console.error("Signup error:", error);
        showToast('error', 'Pendaftaran gagal!', getErrorMessage(error));
    }
}

async function handleGitHubLogin() {
    try {
        showToast('info', 'Login dengan GitHub...', 'Mengalihkan ke GitHub');
        // Note: GitHub auth requires additional Firebase setup
        // For now, we'll show a message
        showToast('info', 'Fitur sedang dikembangkan', 'Login dengan GitHub akan tersedia segera');
    } catch (error) {
        console.error("GitHub login error:", error);
        showToast('error', 'Login GitHub gagal!', getErrorMessage(error));
    }
}

async function handleLogout() {
    try {
        await auth.signOut();
        currentUser = null;
        userData = null;
        showToast('success', 'Logout berhasil!', 'Sampai jumpa kembali');
    } catch (error) {
        console.error("Logout error:", error);
        showToast('error', 'Logout gagal!', getErrorMessage(error));
    }
}

async function checkAuthState() {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            await loadUserData(user.uid);
            showDashboard();
        } else {
            showAuth();
        }
    });
}

async function loadUserData(uid) {
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        
        if (userDoc.exists) {
            userData = userDoc.data();
            updateUIWithUserData();
        } else {
            console.log("User document not found!");
        }
    } catch (error) {
        console.error("Error loading user data:", error);
    }
}

function updateUIWithUserData() {
    if (!userData) return;
    
    // Update username displays
    welcomeUsername.textContent = userData.username;
    usernameDisplay.textContent = userData.username;
    sidebarUserName.textContent = userData.username;
    
    // Update balance
    const balance = userData.balance || 0;
    userBalance.textContent = formatCurrency(balance);
    sidebarBalance.textContent = formatCurrency(balance);
    
    // Update order stats
    totalOrders.textContent = userData.totalOrders || 0;
    successOrders.textContent = userData.successOrders || 0;
    
    // Update profile section
    document.getElementById('profileFullName').textContent = userData.username;
    document.getElementById('profileEmail').textContent = userData.email;
    document.getElementById('profileUsername').textContent = userData.username;
    document.getElementById('profileEmailValue').textContent = userData.email;
    document.getElementById('profileTotalOrders').textContent = userData.totalOrders || 0;
    
    if (userData.createdAt) {
        const joinDate = new Date(userData.createdAt);
        document.getElementById('joinDate').textContent = joinDate.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
}

function showAuth() {
    authSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    // Reset forms
    loginForm.reset();
    signupForm.reset();
}

function showDashboard() {
    authSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    // Load user-specific data
    loadOrderHistory();
    loadDepositHistory();
}

// Product Functions
async function loadProducts() {
    try {
        productsLoading.style.display = 'block';
        
        // Simulate API call (replace with actual API call)
        // const response = await fetch(API_ENDPOINTS.PRODUCTS);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockProducts = [
            {
                id: 1,
                name: "WhatsApp Number",
                category: "whatsapp",
                description: "Nomor WhatsApp fresh untuk verifikasi akun",
                price: 15000,
                stock: 100,
                icon: "fab fa-whatsapp",
                badge: "popular"
            },
            {
                id: 2,
                name: "Telegram Number",
                category: "telegram",
                description: "Nomor Telegram untuk verifikasi akun baru",
                price: 12000,
                stock: 50,
                icon: "fab fa-telegram",
                badge: "new"
            },
            {
                id: 3,
                name: "Instagram Account",
                category: "instagram",
                description: "Akun Instagram siap pakai",
                price: 25000,
                stock: 30,
                icon: "fab fa-instagram",
                badge: null
            },
            {
                id: 4,
                name: "Facebook Account",
                category: "facebook",
                description: "Akun Facebook dengan profil lengkap",
                price: 20000,
                stock: 40,
                icon: "fab fa-facebook",
                badge: null
            },
            {
                id: 5,
                name: "TikTok Account",
                category: "tiktok",
                description: "Akun TikTok untuk kebutuhan marketing",
                price: 30000,
                stock: 20,
                icon: "fab fa-tiktok",
                badge: null
            },
            {
                id: 6,
                name: "Twitter Account",
                category: "other",
                description: "Akun Twitter dengan followers awal",
                price: 18000,
                stock: 25,
                icon: "fab fa-twitter",
                badge: null
            }
        ];
        
        products = mockProducts;
        filteredProducts = [...products];
        
        renderProducts();
        
    } catch (error) {
        console.error("Error loading products:", error);
        showToast('error', 'Gagal memuat produk', 'Coba refresh halaman');
    } finally {
        productsLoading.style.display = 'none';
    }
}

function renderProducts() {
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>Tidak ada produk ditemukan</h3>
                <p>Coba gunakan kata kunci atau kategori lain</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            ${product.badge ? `<span class="product-badge ${product.badge}">${product.badge === 'popular' ? 'Populer' : 'Baru'}</span>` : ''}
            <div class="product-header">
                <div class="product-icon">
                    <i class="${product.icon}"></i>
                </div>
                <h3 class="product-title">${product.name}</h3>
                <span class="product-category">${getCategoryName(product.category)}</span>
                <p class="product-description">${product.description}</p>
            </div>
            <div class="product-body">
                <div class="product-price">${formatCurrency(product.price)}</div>
                <div class="product-stock ${getStockClass(product.stock)}">
                    ${getStockText(product.stock)}
                </div>
            </div>
            <div class="product-footer">
                <button class="btn-order ${product.stock <= 0 ? 'disabled' : ''}" 
                        onclick="openOrderModal(${product.id})"
                        ${product.stock <= 0 ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i>
                    ${product.stock <= 0 ? 'Stok Habis' : 'Pesan Sekarang'}
                </button>
            </div>
        </div>
    `).join('');
}

function getCategoryName(category) {
    const categories = {
        'whatsapp': 'WhatsApp',
        'telegram': 'Telegram',
        'instagram': 'Instagram',
        'facebook': 'Facebook',
        'tiktok': 'TikTok',
        'other': 'Lainnya'
    };
    return categories[category] || category;
}

function getStockClass(stock) {
    if (stock <= 0) return 'out-of-stock';
    if (stock <= 10) return 'low-stock';
    return 'in-stock';
}

function getStockText(stock) {
    if (stock <= 0) return 'Stok habis';
    if (stock <= 10) return `Stok terbatas (${stock})`;
    return 'Stok tersedia';
}

function filterProducts() {
    const searchTerm = productSearch.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                             product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    
    renderProducts();
}

function openOrderModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentOrderProduct = product;
    
    document.getElementById('orderModalTitle').textContent = `Order ${product.name}`;
    
    document.getElementById('orderModalBody').innerHTML = `
        <div class="order-summary">
            <div class="order-product-info">
                <div class="order-product-icon">
                    <i class="${product.icon}"></i>
                </div>
                <div class="order-product-details">
                    <h4>${product.name}</h4>
                    <p>${product.description}</p>
                    <div class="order-price">${formatCurrency(product.price)}</div>
                </div>
            </div>
            
            <div class="order-form">
                <div class="form-group">
                    <label for="orderQuantity">Jumlah</label>
                    <input type="number" id="orderQuantity" min="1" max="${product.stock}" value="1">
                </div>
                
                <div class="form-group">
                    <label for="orderNote">Catatan (Opsional)</label>
                    <textarea id="orderNote" rows="3" placeholder="Tambah catatan khusus untuk pesanan"></textarea>
                </div>
                
                <div class="order-total">
                    <span>Total:</span>
                    <span id="orderTotalAmount">${formatCurrency(product.price)}</span>
                </div>
                
                <button class="btn-confirm-order" onclick="submitOrder()">
                    <i class="fas fa-paper-plane"></i> Konfirmasi Pesanan
                </button>
            </div>
        </div>
    `;
    
    // Update total when quantity changes
    document.getElementById('orderQuantity').addEventListener('input', function() {
        const quantity = parseInt(this.value) || 1;
        const total = product.price * quantity;
        document.getElementById('orderTotalAmount').textContent = formatCurrency(total);
    });
    
    orderModal.classList.add('active');
}

async function submitOrder() {
    if (!currentUser || !userData) {
        showToast('error', 'Login diperlukan', 'Silakan login terlebih dahulu');
        return;
    }
    
    if (!currentOrderProduct) {
        showToast('error', 'Produk tidak ditemukan', 'Coba refresh halaman');
        return;
    }
    
    const quantity = parseInt(document.getElementById('orderQuantity').value) || 1;
    const note = document.getElementById('orderNote').value;
    const totalAmount = currentOrderProduct.price * quantity;
    
    // Check balance
    if (userData.balance < totalAmount) {
        showToast('error', 'Saldo tidak cukup', `Saldo Anda: ${formatCurrency(userData.balance)}, Dibutuhkan: ${formatCurrency(totalAmount)}`);
        return;
    }
    
    // Check stock
    if (currentOrderProduct.stock < quantity) {
        showToast('error', 'Stok tidak cukup', `Stok tersedia: ${currentOrderProduct.stock}`);
        return;
    }
    
    try {
        showToast('info', 'Memproses pesanan...', 'Mohon tunggu sebentar');
        
        // Generate order ID
        const orderId = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
        
        // In a real app, you would call your API here
        // const response = await fetch(API_ENDPOINTS.ORDER, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${currentUser.getIdToken()}`
        //     },
        //     body: JSON.stringify({
        //         productId: currentOrderProduct.id,
        //         quantity: quantity,
        //         note: note
        //     })
        // });
        
        // Mock API response
        const mockResponse = {
            success: true,
            orderId: orderId,
            message: "Pesanan berhasil diproses"
        };
        
        if (mockResponse.success) {
            // Update user balance in Firestore
            const newBalance = userData.balance - totalAmount;
            await db.collection('users').doc(currentUser.uid).update({
                balance: newBalance,
                totalOrders: (userData.totalOrders || 0) + 1,
                updatedAt: new Date().toISOString()
            });
            
            // Update user data locally
            userData.balance = newBalance;
            userData.totalOrders = (userData.totalOrders || 0) + 1;
            updateUIWithUserData();
            
            // Add order to Firestore
            await db.collection('orders').add({
                orderId: orderId,
                userId: currentUser.uid,
                productId: currentOrderProduct.id,
                productName: currentOrderProduct.name,
                quantity: quantity,
                price: currentOrderProduct.price,
                totalAmount: totalAmount,
                note: note,
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            
            // Send Telegram notification
            const telegramMessage = `🛒 <b>Pesanan Baru!</b>\n📦 Order ID: ${orderId}\n👤 User: ${userData.username}\n📱 Layanan: ${currentOrderProduct.name}\n💰 Total: ${formatCurrency(totalAmount)}\n⏰ Waktu: ${new Date().toLocaleString()}`;
            sendTelegramNotification(telegramMessage);
            
            showToast('success', 'Pesanan berhasil!', `Order ID: ${orderId}`);
            
            // Close modal and refresh data
            orderModal.classList.remove('active');
            loadOrderHistory();
            
            // Add notification
            addNotification('success', `Pesanan ${orderId} berhasil diproses`);
        } else {
            showToast('error', 'Pesanan gagal', 'Coba lagi nanti');
        }
        
    } catch (error) {
        console.error("Order error:", error);
        showToast('error', 'Pesanan gagal!', getErrorMessage(error));
    }
}

// Deposit Functions
async function handleDeposit() {
    if (!currentUser || !userData) {
        showToast('error', 'Login diperlukan', 'Silakan login terlebih dahulu');
        return;
    }
    
    const amount = parseInt(depositAmount.value);
    const selectedMethod = document.querySelector('.method-card.active');
    
    if (!amount || amount < 10000) {
        showToast('error', 'Jumlah invalid', 'Minimal deposit Rp 10.000');
        return;
    }
    
    if (!selectedMethod) {
        showToast('error', 'Pilih metode', 'Pilih metode pembayaran terlebih dahulu');
        return;
    }
    
    const method = selectedMethod.getAttribute('data-method');
    const note = document.getElementById('depositNote').value;
    
    try {
        showToast('info', 'Memproses deposit...', 'Mohon tunggu sebentar');
        
        // Generate deposit ID
        const depositId = 'DEP' + Date.now() + Math.floor(Math.random() * 1000);
        
        // In a real app, you would call your API here
        // const response = await fetch(API_ENDPOINTS.DEPOSIT, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${currentUser.getIdToken()}`
        //     },
        //     body: JSON.stringify({
        //         amount: amount,
        //         method: method,
        //         note: note
        //     })
        // });
        
        // Mock API response
        const mockResponse = {
            success: true,
            depositId: depositId,
            paymentUrl: `https://payment.example.com/${depositId}`,
            message: "Deposit berhasil diproses"
        };
        
        if (mockResponse.success) {
            // Add deposit to Firestore
            await db.collection('deposits').add({
                depositId: depositId,
                userId: currentUser.uid,
                amount: amount,
                method: method,
                note: note,
                status: 'pending',
                paymentUrl: mockResponse.paymentUrl,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            
            // Show payment instructions
            showToast('success', 'Deposit diproses!', `ID Deposit: ${depositId}`);
            
            // Send Telegram notification
            const telegramMessage = `💰 <b>Deposit Baru!</b>\n📥 Deposit ID: ${depositId}\n👤 User: ${userData.username}\n💵 Jumlah: ${formatCurrency(amount)}\n💳 Metode: ${method.toUpperCase()}\n⏰ Waktu: ${new Date().toLocaleString()}`;
            sendTelegramNotification(telegramMessage);
            
            // Show payment modal
            showPaymentModal(depositId, amount, method, mockResponse.paymentUrl);
            
            // Add notification
            addNotification('info', `Deposit ${depositId} menunggu pembayaran`);
            
            // Reset form
            depositAmount.value = '';
            document.getElementById('depositNote').value = '';
            amountPresets.forEach(p => p.classList.remove('active'));
            
            // Refresh deposit history
            loadDepositHistory();
        }
        
    } catch (error) {
        console.error("Deposit error:", error);
        showToast('error', 'Deposit gagal!', getErrorMessage(error));
    }
}

function showPaymentModal(depositId, amount, method, paymentUrl) {
    const methodNames = {
        'dana': 'DANA',
        'ovo': 'OVO',
        'gopay': 'GoPay',
        'bank': 'Transfer Bank'
    };
    
    const modalContent = `
        <div class="payment-instructions">
            <h4>Lanjutkan Pembayaran</h4>
            <div class="payment-info">
                <div class="payment-detail">
                    <span>ID Deposit:</span>
                    <strong>${depositId}</strong>
                </div>
                <div class="payment-detail">
                    <span>Jumlah:</span>
                    <strong>${formatCurrency(amount)}</strong>
                </div>
                <div class="payment-detail">
                    <span>Metode:</span>
                    <strong>${methodNames[method] || method}</strong>
                </div>
            </div>
            
            <div class="payment-steps">
                <h5>Instruksi Pembayaran:</h5>
                <ol>
                    <li>Buka aplikasi ${methodNames[method] || method} Anda</li>
                    <li>Transfer ${formatCurrency(amount)} ke nomor/akun berikut:</li>
                    <li class="payment-account">
                        <strong>${getPaymentAccount(method)}</strong>
                    </li>
                    <li>Tambahkan catatan: <code>${depositId}</code></li>
                    <li>Klik tombol di bawah setelah transfer</li>
                </ol>
            </div>
            
            <div class="payment-actions">
                <button class="btn-copy" onclick="copyToClipboard('${depositId}')">
                    <i class="fas fa-copy"></i> Salin ID Deposit
                </button>
                <button class="btn-paid" onclick="markAsPaid('${depositId}')">
                    <i class="fas fa-check"></i> Sudah Bayar
                </button>
                <a href="${paymentUrl}" target="_blank" class="btn-payment-link">
                    <i class="fas fa-external-link-alt"></i> Bayar Sekarang
                </a>
            </div>
            
            <div class="payment-note">
                <p><i class="fas fa-info-circle"></i> Deposit akan diproses otomatis dalam 1-5 menit setelah pembayaran berhasil diverifikasi</p>
            </div>
        </div>
    `;
    
    document.getElementById('orderModalTitle').textContent = 'Instruksi Pembayaran';
    document.getElementById('orderModalBody').innerHTML = modalContent;
    orderModal.classList.add('active');
}

function getPaymentAccount(method) {
    const accounts = {
        'dana': '081234567890 (NOKOS.ID)',
        'ovo': '081234567890 (NOKOS.ID)',
        'gopay': '081234567890 (NOKOS.ID)',
        'bank': 'BRI 0123-4567-8901-2345 (PT NOKOS INDONESIA)'
    };
    return accounts[method] || 'Lihat instruksi di halaman pembayaran';
}

async function markAsPaid(depositId) {
    try {
        showToast('info', 'Memverifikasi pembayaran...', 'Mohon tunggu');
        
        // In a real app, you would call your API here
        // const response = await fetch(API_ENDPOINTS.CHECK_DEPOSIT, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ depositId: depositId })
        // });
        
        showToast('info', 'Pembayaran diverifikasi', 'Saldo akan ditambahkan dalam 1-5 menit');
        orderModal.classList.remove('active');
        
    } catch (error) {
        console.error("Error marking as paid:", error);
        showToast('error', 'Verifikasi gagal', 'Coba lagi nanti');
    }
}

// History Functions
async function loadOrderHistory() {
    if (!currentUser) return;
    
    try {
        // In a real app, you would call your API here
        // const response = await fetch(`${API_ENDPOINTS.HISTORY_ORDERS}?userId=${currentUser.uid}`);
        // const orders = await response.json();
        
        // Get orders from Firestore
        const ordersSnapshot = await db.collection('orders')
            .where('userId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();
        
        const orders = [];
        ordersSnapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        
        renderOrderHistory(orders);
        
    } catch (error) {
        console.error("Error loading order history:", error);
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">Gagal memuat riwayat pesanan</td>
            </tr>
        `;
    }
}

function renderOrderHistory(orders) {
    if (orders.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Belum ada pesanan</p>
                </td>
            </tr>
        `;
        return;
    }
    
    ordersTableBody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.orderId}</td>
            <td>${order.productName}</td>
            <td>${formatCurrency(order.totalAmount)}</td>
            <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
            <td>${formatDate(order.createdAt)}</td>
            <td>
                <button class="btn-view-order" onclick="viewOrderDetail('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function loadDepositHistory() {
    if (!currentUser) return;
    
    try {
        // In a real app, you would call your API here
        // const response = await fetch(`${API_ENDPOINTS.HISTORY_DEPOSITS}?userId=${currentUser.uid}`);
        // const deposits = await response.json();
        
        // Get deposits from Firestore
        const depositsSnapshot = await db.collection('deposits')
            .where('userId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();
        
        const deposits = [];
        depositsSnapshot.forEach(doc => {
            deposits.push({ id: doc.id, ...doc.data() });
        });
        
        renderDepositHistory(deposits);
        
    } catch (error) {
        console.error("Error loading deposit history:", error);
        depositsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">Gagal memuat riwayat deposit</td>
            </tr>
        `;
    }
}

function renderDepositHistory(deposits) {
    if (deposits.length === 0) {
        depositsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    <i class="fas fa-wallet"></i>
                    <p>Belum ada deposit</p>
                </td>
            </tr>
        `;
        return;
    }
    
    depositsTableBody.innerHTML = deposits.map(deposit => `
        <tr>
            <td>${deposit.depositId}</td>
            <td>${formatCurrency(deposit.amount)}</td>
            <td>${deposit.method.toUpperCase()}</td>
            <td><span class="status-badge status-${deposit.status}">${getStatusText(deposit.status)}</span></td>
            <td>${formatDate(deposit.createdAt)}</td>
        </tr>
    `).join('');
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Menunggu',
        'processing': 'Diproses',
        'success': 'Sukses',
        'failed': 'Gagal',
        'completed': 'Selesai',
        'cancelled': 'Dibatalkan'
    };
    return statusMap[status] || status;
}

// Notification Functions
function addNotification(type, message) {
    const notificationList = document.getElementById('notificationList');
    const notificationCount = document.getElementById('notificationCount');
    
    const notificationItem = document.createElement('div');
    notificationItem.className = 'notification-item';
    
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    
    notificationItem.innerHTML = `
        <div class="notification-icon ${type}">
            <i class="fas ${icons[type] || 'fa-bell'}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
            <span class="notification-time">Baru saja</span>
        </div>
    `;
    
    // Add to top of the list
    notificationList.insertBefore(notificationItem, notificationList.firstChild);
    
    // Update count
    const currentCount = parseInt(notificationCount.textContent) || 0;
    notificationCount.textContent = currentCount + 1;
    
    // Show notification bell animation
    notificationBell.style.animation = 'none';
    setTimeout(() => {
        notificationBell.style.animation = 'shake 0.5s ease';
    }, 10);
}

// Toast Notification Function
function showToast(type, title, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-times-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icons[type] || 'fa-bell'}"></i>
        </div>
        <div class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
}

// Helper Functions
function getErrorMessage(error) {
    switch (error.code) {
        case 'auth/user-not-found':
            return 'Email tidak terdaftar';
        case 'auth/wrong-password':
            return 'Password salah';
        case 'auth/email-already-in-use':
            return 'Email sudah digunakan';
        case 'auth/weak-password':
            return 'Password terlalu lemah';
        case 'auth/invalid-email':
            return 'Email tidak valid';
        case 'auth/network-request-failed':
            return 'Koneksi internet bermasalah';
        default:
            return 'Terjadi kesalahan, coba lagi';
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('success', 'Disalin!', 'ID Deposit berhasil disalin');
    });
}

// Add CSS animation for bell shake
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: rotate(0); }
        25% { transform: rotate(15deg); }
        75% { transform: rotate(-15deg); }
    }
    
    @keyframes toastSlideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(-100%); }
    }
`;
document.head.appendChild(style);
