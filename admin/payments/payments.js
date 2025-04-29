// Global variables
let payments = getStaticData('payments');
let currentPayment = null;

// DOM Elements
const searchInput = document.getElementById('paymentSearch');
const paymentsBody = document.getElementById('paymentsBody');
const paymentDetailsModal = document.getElementById('paymentDetailsModal');
const statusSelect = document.getElementById('statusSelect');

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadPayments();
    
    // Setup search
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredPayments = payments.filter(payment => {
            return payment.orderId.toLowerCase().includes(searchTerm) ||
                   payment.customerName.toLowerCase().includes(searchTerm) ||
                   payment.status.toLowerCase().includes(searchTerm);
        });
        displayPayments(filteredPayments);
    });

    // Setup add payment button
    const addPaymentBtn = document.getElementById('addPaymentBtn');
    if (addPaymentBtn) {
        addPaymentBtn.addEventListener('click', () => showAddPaymentModal());
    }
});

// Display payments in table
function displayPayments(payments) {
    paymentsBody.innerHTML = '';

    if (payments.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="8" class="no-results">
                <i class="fas fa-search"></i>
                <span>Aucun paiement trouvé</span>
            </td>
        `;
        paymentsBody.appendChild(row);
        return;
    }

    payments.forEach(payment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${payment.id}</td>
            <td>${payment.orderId}</td>
            <td>${payment.customerName}</td>
            <td>${payment.paymentMethod}</td>
            <td>${payment.amount}€</td>
            <td>
                <span class="badge ${getStatusClass(payment.status)}">
                    ${payment.status}
                </span>
            </td>
            <td>${new Date(payment.date).toLocaleDateString()}</td>
            <td>
                <div class="actions">
                    <button class="action-btn view-details-btn" onclick="showPaymentDetails(${payment.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="showEditPaymentModal(${payment.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;
        paymentsBody.appendChild(row);
    });
}

// Show add payment modal
function showAddPaymentModal() {
    const formContent = `
        <form id="paymentForm">
            <div class="form-group">
                <label for="orderId">Numéro de Commande</label>
                <input type="text" id="orderId" name="orderId" required>
            </div>
            <div class="form-group">
                <label for="customerName">Nom du Client</label>
                <input type="text" id="customerName" name="customerName" required>
            </div>
            <div class="form-group">
                <label for="customerEmail">Email du Client</label>
                <input type="email" id="customerEmail" name="customerEmail" required>
            </div>
            <div class="form-group">
                <label for="amount">Montant (€)</label>
                <input type="number" id="amount" name="amount" step="0.01" required>
            </div>
            <div class="form-group">
                <label for="paymentMethod">Méthode de Paiement</label>
                <select id="paymentMethod" name="paymentMethod" required>
                    <option value="credit_card">Carte de Crédit</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_transfer">Virement Bancaire</option>
                    <option value="cash_on_delivery">Paiement à la Livraison</option>
                </select>
            </div>
            <div class="form-group">
                <label for="status">Statut</label>
                <select id="status" name="status" required>
                    <option value="pending">En Attente</option>
                    <option value="processing">En Traitement</option>
                    <option value="completed">Complété</option>
                    <option value="failed">Échoué</option>
                    <option value="cancelled">Annulé</option>
                </select>
            </div>
            <div class="form-group">
                <label for="date">Date de Paiement</label>
                <input type="date" id="date" name="date" required>
            </div>
            <div class="form-group">
                <label for="transactionId">ID de Transaction</label>
                <input type="text" id="transactionId" name="transactionId" required>
            </div>
            <div class="form-group">
                <label for="notes">Notes</label>
                <textarea id="notes" name="notes" rows="3"></textarea>
            </div>
            <div class="form-buttons">
                <button type="button" class="cancel-button" onclick="closeFormModal()">Annuler</button>
                <button type="submit" class="save-button">Ajouter</button>
            </div>
        </form>
    `;

    showFormModal('Ajouter un Paiement', formContent);
    initializeForm('paymentForm', handleAddPayment);
}

// Show edit payment modal
function showEditPaymentModal(paymentId) {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    const formContent = `
        <form id="paymentForm">
            <input type="hidden" name="id" value="${payment.id}">
            <div class="form-group">
                <label for="orderId">Numéro de Commande</label>
                <input type="text" id="orderId" name="orderId" value="${payment.orderId}" required>
            </div>
            <div class="form-group">
                <label for="customerName">Nom du Client</label>
                <input type="text" id="customerName" name="customerName" value="${payment.customerName}" required>
            </div>
            <div class="form-group">
                <label for="customerEmail">Email du Client</label>
                <input type="email" id="customerEmail" name="customerEmail" value="${payment.customerEmail}" required>
            </div>
            <div class="form-group">
                <label for="amount">Montant (€)</label>
                <input type="number" id="amount" name="amount" value="${payment.amount}" step="0.01" required>
            </div>
            <div class="form-group">
                <label for="paymentMethod">Méthode de Paiement</label>
                <select id="paymentMethod" name="paymentMethod" required>
                    <option value="credit_card" ${payment.paymentMethod === 'credit_card' ? 'selected' : ''}>Carte de Crédit</option>
                    <option value="paypal" ${payment.paymentMethod === 'paypal' ? 'selected' : ''}>PayPal</option>
                    <option value="bank_transfer" ${payment.paymentMethod === 'bank_transfer' ? 'selected' : ''}>Virement Bancaire</option>
                    <option value="cash_on_delivery" ${payment.paymentMethod === 'cash_on_delivery' ? 'selected' : ''}>Paiement à la Livraison</option>
                </select>
            </div>
            <div class="form-group">
                <label for="status">Statut</label>
                <select id="status" name="status" required>
                    <option value="pending" ${payment.status === 'pending' ? 'selected' : ''}>En Attente</option>
                    <option value="processing" ${payment.status === 'processing' ? 'selected' : ''}>En Traitement</option>
                    <option value="completed" ${payment.status === 'completed' ? 'selected' : ''}>Complété</option>
                    <option value="failed" ${payment.status === 'failed' ? 'selected' : ''}>Échoué</option>
                    <option value="cancelled" ${payment.status === 'cancelled' ? 'selected' : ''}>Annulé</option>
                </select>
            </div>
            <div class="form-group">
                <label for="date">Date de Paiement</label>
                <input type="date" id="date" name="date" value="${payment.date}" required>
            </div>
            <div class="form-group">
                <label for="transactionId">ID de Transaction</label>
                <input type="text" id="transactionId" name="transactionId" value="${payment.transactionId}" required>
            </div>
            <div class="form-group">
                <label for="notes">Notes</label>
                <textarea id="notes" name="notes" rows="3">${payment.notes}</textarea>
            </div>
            <div class="form-buttons">
                <button type="button" class="cancel-button" onclick="closeFormModal()">Annuler</button>
                <button type="submit" class="save-button">Modifier</button>
            </div>
        </form>
    `;

    showFormModal('Modifier un Paiement', formContent);
    initializeForm('paymentForm', handleEditPayment);
}

// Handle add payment
function handleAddPayment(form) {
    const formData = new FormData(form);
    const payment = {
        id: payments.length + 1,
        orderId: formData.get('orderId'),
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail'),
        amount: parseFloat(formData.get('amount')),
        paymentMethod: formData.get('paymentMethod'),
        status: formData.get('status'),
        date: formData.get('date'),
        transactionId: formData.get('transactionId'),
        notes: formData.get('notes') || ''
    };

    payments.push(payment);
    displaySuccess('Paiement ajouté avec succès');
    closeFormModal();
    loadPayments();
}

// Handle edit payment
function handleEditPayment(form) {
    const formData = new FormData(form);
    const paymentId = parseInt(formData.get('id'));
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    payment.orderId = formData.get('orderId');
    payment.customerName = formData.get('customerName');
    payment.customerEmail = formData.get('customerEmail');
    payment.amount = parseFloat(formData.get('amount'));
    payment.paymentMethod = formData.get('paymentMethod');
    payment.status = formData.get('status');
    payment.date = formData.get('date');
    payment.transactionId = formData.get('transactionId');
    payment.notes = formData.get('notes') || '';

    displaySuccess('Paiement modifié avec succès');
    closeFormModal();
    loadPayments();
}

// Show payment details modal
function showPaymentDetails(paymentId) {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    const modal = document.createElement('div');
    modal.className = 'payment-details';
    modal.innerHTML = `
        <div class="payment-details-content">
            <div class="payment-details-header">
                <h3>Détails du Paiement</h3>
                <button class="close-details" onclick="closePaymentDetails()">&times;</button>
            </div>
            
            <div class="payment-info">
                <div class="info-item">
                    <label>ID:</label>
                    <span class="value">${payment.id}</span>
                </div>
                <div class="info-item">
                    <label>Numéro de Commande:</label>
                    <span class="value">${payment.orderId}</span>
                </div>
                <div class="info-item">
                    <label>Nom du Client:</label>
                    <span class="value">${payment.customerName}</span>
                </div>
                <div class="info-item">
                    <label>Email:</label>
                    <span class="value">${payment.customerEmail}</span>
                </div>
                <div class="info-item">
                    <label>Montant:</label>
                    <span class="value">${payment.amount}€</span>
                </div>
                <div class="info-item">
                    <label>Méthode de Paiement:</label>
                    <span class="value">${payment.paymentMethod}</span>
                </div>
                <div class="info-item">
                    <label>Statut:</label>
                    <span class="value badge ${getStatusClass(payment.status)}">${payment.status}</span>
                </div>
                <div class="info-item">
                    <label>Date:</label>
                    <span class="value">${new Date(payment.date).toLocaleDateString()}</span>
                </div>
                <div class="info-item">
                    <label>ID de Transaction:</label>
                    <span class="value">${payment.transactionId}</span>
                </div>
                <div class="info-item">
                    <label>Notes:</label>
                    <span class="value">${payment.notes || 'Aucune note'}</span>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Close payment details modal
function closePaymentDetails() {
    const modal = document.querySelector('.payment-details');
    if (modal) {
        modal.remove();
    }
}

// Helper functions
function getStatusClass(status) {
    const statusClasses = {
        'pending': 'pending',
        'processing': 'processing',
        'completed': 'completed',
        'failed': 'failed',
        'cancelled': 'cancelled'
    };
    return statusClasses[status] || 'pending';
}

// Load payments
function loadPayments() {
    displayPayments(payments);
}
