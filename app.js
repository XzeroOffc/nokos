// GANTI DENGAN CONFIG FIREBASE KAMU
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-app",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "...",
    appId: "..."
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// CONFIG TELEGRAM
const TG_TOKEN = "TOKEN_BOT_ANDA";
const TG_OWNER_ID = "ID_CHAT_ANDA";

// State Management
let currentUser = null;

// UI Initialization
lucide.createIcons();

// --- AUTH FUNCTIONS ---
async function handleLogin() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    
    try {
        const res = await auth.signInWithEmailAndPassword(email, pass);
        setupUser(res.user);
    } catch (e) {
        // Jika belum ada akun, otomatis daftar (Simple logic)
        const res = await auth.createUserWithEmailAndPassword(email, pass);
        await db.collection('users').doc(res.user.uid).set({
            email: email,
            saldo: 0,
            role: 'user',
            createdAt: new Date()
        });
        sendNotifTele(`👤 User Baru Terdaftar: ${email}`);
        setupUser(res.user);
    }
}

auth.onAuthStateChanged(user => {
    if (user) setupUser(user);
    else showAuth(true);
});

async function setupUser(user) {
    currentUser = user;
    const doc = await db.collection('users').doc(user.uid).get();
    const data = doc.data();
    
    document.getElementById('balance').innerText = data.saldo.toLocaleString();
    document.getElementById('userMail').innerText = user.email;
    showAuth(false);
    loadProducts();
}

function showAuth(show) {
    document.getElementById('authSection').classList.toggle('hidden', !show);
    document.getElementById('dashboard').classList.toggle('hidden', show);
}

// --- PRODUCT LOGIC (API RUMAH OTP) ---
async function loadProducts() {
    // Simulasi Fetch API Rumah OTP
    const container = document.getElementById('productContainer');
    // Contoh data dummy (nanti ganti dengan fetch ke endpoint kamu)
    const services = [
        { id: 1, name: 'Telegram', price: 5000, img: 'https://cdn-icons-png.flaticon.com/512/2111/2111646.png' },
        { id: 2, name: 'WhatsApp', price: 7000, img: 'https://cdn-icons-png.flaticon.com/512/733/733585.png' }
    ];

    container.innerHTML = services.map(s => `
        <div class="product-card bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div class="flex items-center gap-4">
                <img src="${s.img}" class="w-10">
                <div>
                    <h4 class="font-bold dark:text-white">${s.name}</h4>
                    <p class="text-blue-500 font-semibold text-sm">Rp ${s.price}</p>
                </div>
            </div>
            <button onclick="buy('${s.name}', ${s.price})" class="bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-xl font-bold">Beli</button>
        </div>
    `).join('');
}

// --- NOTIFICATION & UTILS ---
function sendNotifTele(msg) {
    fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${TG_OWNER_ID}&text=${encodeURIComponent(msg)}`);
}

async function buy(name, price) {
    // Logika potong saldo di Firestore & kirim notif
    alert(`Memproses pembelian ${name}...`);
    sendNotifTele(`🛒 Order Baru!\nUser: ${currentUser.email}\nProduk: ${name}\nHarga: ${price}`);
}

// Theme Toggle with Animation
const themeBtn = document.getElementById('themeBtn');
themeBtn.onclick = (e) => {
    const body = document.body;
    const isDark = body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Ripple Effect
    let ripple = document.createElement('span');
    ripple.classList.add('ripple');
    themeBtn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
};

// Sidebar & CS Toggle
document.getElementById('menuToggle').onclick = () => {
    document.getElementById('sidebar').classList.toggle('-translate-x-full');
};

document.getElementById('csBtn').onclick = () => {
    const menu = document.getElementById('csMenu');
    menu.classList.toggle('hidden');
    setTimeout(() => menu.classList.toggle('scale-100'), 10);
};
