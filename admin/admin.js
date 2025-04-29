// Static data for frontend demonstration
const staticData = {
    books: [
        {
            id: 1,
            title: "Le Petit Prince",
            author: "Antoine de Saint-Exupéry",
            price: 15.99,
            stock: 50,
            category: "Classiques",
            description: "Un classique de la littérature française pour enfants et adultes.",
            isbn: "978-2070360096",
            publisher: "Gallimard",
            publicationDate: "1943-06-01",
            coverImage: "images/books/le_petit_prince.jpg"
        },
        {
            id: 2,
            title: "1984",
            author: "George Orwell",
            price: 12.99,
            stock: 30,
            category: "Science-Fiction",
            description: "Roman dystopique qui a influencé la littérature moderne.",
            isbn: "978-2070425006",
            publisher: "Gallimard",
            publicationDate: "1949-06-08",
            coverImage: "images/books/1984.jpg"
        },
        {
            id: 3,
            title: "Orgueil et Préjugés",
            author: "Jane Austen",
            price: 14.99,
            stock: 45,
            category: "Classiques",
            description: "Roman romantique britannique classique.",
            isbn: "978-2070425006",
            publisher: "Gallimard",
            publicationDate: "1813-01-28",
            coverImage: "images/books/orgueil_prejuges.jpg"
        }
    ],
    categories: [
        { 
            id: 1, 
            name: "Classiques", 
            description: "Ouvrages littéraires classiques de la littérature mondiale.",
            image: "images/categories/classiques.jpg"
        },
        { 
            id: 2, 
            name: "Science-Fiction", 
            description: "Romans et ouvrages de science-fiction moderne.",
            image: "images/categories/sci-fi.jpg"
        },
        { 
            id: 3, 
            name: "Romans", 
            description: "Romans contemporains et classiques.",
            image: "images/categories/romans.jpg"
        },
        { 
            id: 4, 
            name: "Policier", 
            description: "Romans policiers et thrillers.",
            image: "images/categories/policier.jpg"
        }
    ],
    users: [
        { 
            id: 1, 
            fullName: "John Doe", 
            username: "johndoe",
            email: "john@example.com", 
            phoneNumber: "+33 6 12 34 56 78",
            address: "123 Rue Principale",
            city: "Paris",
            postalCode: "75000",
            country: "France",
            role: "admin",
            status: "active",
            registrationDate: "2025-01-15",
            lastLogin: "2025-04-29"
        },
        { 
            id: 2, 
            fullName: "Jane Smith", 
            username: "janedoe",
            email: "jane@example.com", 
            phoneNumber: "+33 6 98 76 54 32",
            address: "456 Avenue Secondaire",
            city: "Lyon",
            postalCode: "69000",
            country: "France",
            role: "user",
            status: "active",
            registrationDate: "2025-02-20",
            lastLogin: "2025-04-28"
        },
        { 
            id: 3, 
            fullName: "Bob Johnson", 
            username: "bjohnson",
            email: "bob@example.com", 
            phoneNumber: "+33 6 45 67 89 01",
            address: "789 Rue Tertiaire",
            city: "Marseille",
            postalCode: "13000",
            country: "France",
            role: "user",
            status: "inactive",
            registrationDate: "2025-03-10",
            lastLogin: "2025-04-25"
        }
    ],
    deliveries: [
        {
            id: 1,
            orderId: "ORD001",
            customerName: "John Doe",
            customerEmail: "john@example.com",
            customerPhone: "+33 6 12 34 56 78",
            address: "123 Rue Principale",
            city: "Paris",
            postalCode: "75000",
            country: "France",
            shippingMethod: "Standard",
            shippingCost: 4.99,
            status: "pending",
            date: "2025-04-25",
            items: [
                {
                    id: 1,
                    title: "Le Petit Prince",
                    author: "Antoine de Saint-Exupéry",
                    price: 15.99,
                    quantity: 2,
                    image: "images/books/le_petit_prince.jpg"
                }
            ]
        },
        {
            id: 2,
            orderId: "ORD002",
            customerName: "Jane Smith",
            customerEmail: "jane@example.com",
            customerPhone: "+33 6 98 76 54 32",
            address: "456 Avenue Secondaire",
            city: "Lyon",
            postalCode: "69000",
            country: "France",
            shippingMethod: "Express",
            shippingCost: 9.99,
            status: "delivered",
            date: "2025-04-28",
            items: [
                {
                    id: 2,
                    title: "1984",
                    author: "George Orwell",
                    price: 12.99,
                    quantity: 1,
                    image: "images/books/1984.jpg"
                }
            ]
        }
    ],
    payments: [
        {
            id: 1,
            paymentId: "PAY001",
            orderId: "ORD001",
            customerName: "John Doe",
            customerEmail: "john@example.com",
            amount: 29.98,
            paymentMethod: "Carte de crédit",
            status: "completed",
            date: "2025-04-25",
            transactionId: "TX123456789"
        },
        {
            id: 2,
            paymentId: "PAY002",
            orderId: "ORD002",
            customerName: "Jane Smith",
            customerEmail: "jane@example.com",
            amount: 12.99,
            paymentMethod: "PayPal",
            status: "pending",
            date: "2025-04-28",
            transactionId: "TX987654321"
        }
    ],
    coupons: [
        {
            id: 1,
            code: "DISC10",
            discount: 10,
            type: "percentage",
            expiryDate: "2025-12-31",
            usageLimit: 100,
            minPurchase: 50,
            description: "10% de réduction sur tout le site"
        },
        {
            id: 2,
            code: "WELCOME",
            discount: 5,
            type: "percentage",
            expiryDate: "2025-06-30",
            usageLimit: 1,
            minPurchase: 0,
            description: "5% de réduction pour les nouveaux clients"
        },
        {
            id: 3,
            code: "SUMMER",
            discount: 20,
            type: "percentage",
            expiryDate: "2025-08-31",
            usageLimit: 50,
            minPurchase: 100,
            description: "20% de réduction sur les livres de plage"
        }
    ]
};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initializeComponents();
});

// Initialize all components
function initializeComponents() {
    // Add any component initialization here
    // This is a placeholder for future component initialization
}

// Helper function to get static data
function getStaticData(type) {
    return staticData[type] || [];
}

// Helper function to simulate loading state
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Chargement...</p>
    `;
    document.body.appendChild(loadingDiv);
}

// Helper function to hide loading state
function hideLoading() {
    const loadingDiv = document.querySelector('.loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Helper function to display error message
function displayError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Helper function to display success message
function displaySuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Helper functions for showing messages
function showSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'alert success';
    alert.textContent = message;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

function showError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert error';
    alert.textContent = message;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

// Add active class to current page
const currentPath = window.location.pathname;
document.querySelectorAll('.admin-nav ul li a').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
        link.parentElement.classList.add('active');
    }
});

// Search functionality
const searchInput = document.querySelector('.search-bar input');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    // Add search implementation here
    console.log('Searching for:', searchTerm);
});
