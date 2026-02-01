// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN";
const TELEGRAM_OWNER_ID = "YOUR_TELEGRAM_OWNER_ID";

// API Endpoints (Replace with your actual API endpoints)
const API_ENDPOINTS = {
    PRODUCTS: "https://api.rumah-otp.com/services",
    ORDER: "https://api.rumah-otp.com/order",
    DEPOSIT: "https://api.rumah-otp.com/deposit",
    CHECK_DEPOSIT: "https://api.rumah-otp.com/check-deposit",
    HISTORY_ORDERS: "https://api.rumah-otp.com/history/orders",
    HISTORY_DEPOSITS: "https://api.rumah-otp.com/history/deposits",
    USER_PROFILE: "https://api.rumah-otp.com/user/profile"
};

// Send notification to Telegram
async function sendTelegramNotification(message) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_OWNER_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        return response.json();
    } catch (error) {
        console.error("Error sending Telegram notification:", error);
    }
}

// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
