// Global variables
let deliveries = getStaticData('deliveries');
let currentDelivery = null;

// DOM Elements
const searchInput = document.getElementById('deliverySearch');
const deliveriesBody = document.getElementById('deliveriesBody');

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadDeliveries();
    
    // Setup search
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredDeliveries = deliveries.filter(delivery => {
            return delivery.customerName.toLowerCase().includes(searchTerm) ||
                   delivery.orderId.toLowerCase().includes(searchTerm) ||
                   delivery.status.toLowerCase().includes(searchTerm);
        });
        displayDeliveries(filteredDeliveries);
    });

    // Setup add delivery button
    const addDeliveryBtn = document.getElementById('addDeliveryBtn');
    if (addDeliveryBtn) {
        addDeliveryBtn.addEventListener('click', () => showAddDeliveryModal());
    }
});

// Display deliveries in table
function displayDeliveries(deliveries) {
    deliveriesBody.innerHTML = '';

    if (deliveries.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="8" class="no-results">
                <i class="fas fa-search"></i>
                <span>Aucune livraison trouvée</span>
            </td>
        `;
        deliveriesBody.appendChild(row);
        return;
    }

    deliveries.forEach(delivery => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${delivery.id}</td>
            <td>${delivery.orderId}</td>
            <td>${delivery.customerName}</td>
            <td>${delivery.shippingMethod}</td>
            <td>${delivery.shippingCost}€</td>
            <td>
                <span class="badge ${getStatusClass(delivery.status)}">
                    ${delivery.status}
                </span>
            </td>
            <td>${new Date(delivery.date).toLocaleDateString()}</td>
            <td>
                <div class="actions">
                    <button class="action-btn view-details-btn" onclick="showDeliveryDetails(${delivery.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="showEditDeliveryModal(${delivery.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;
        deliveriesBody.appendChild(row);
    });
}

// Show add delivery modal
function showAddDeliveryModal() {
    const formContent = `
        <form id="deliveryForm">
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
                <label for="customerPhone">Téléphone du Client</label>
                <input type="tel" id="customerPhone" name="customerPhone" required>
            </div>
            <div class="form-group">
                <label for="address">Adresse de Livraison</label>
                <input type="text" id="address" name="address" required>
            </div>
            <div class="form-group">
                <label for="city">Ville</label>
                <input type="text" id="city" name="city" required>
            </div>
            <div class="form-group">
                <label for="postalCode">Code Postal</label>
                <input type="text" id="postalCode" name="postalCode" required>
            </div>
            <div class="form-group">
                <label for="country">Pays</label>
                <input type="text" id="country" name="country" required>
            </div>
            <div class="form-group">
                <label for="shippingMethod">Méthode d'Expédition</label>
                <select id="shippingMethod" name="shippingMethod" required>
                    <option value="Standard">Standard</option>
                    <option value="Express">Express</option>
                    <option value="Colissimo">Colissimo</option>
                </select>
            </div>
            <div class="form-group">
                <label for="shippingCost">Frais de Livraison (€)</label>
                <input type="number" id="shippingCost" name="shippingCost" step="0.01" required>
            </div>
            <div class="form-group">
                <label for="status">Statut</label>
                <select id="status" name="status" required>
                    <option value="pending">En Attente</option>
                    <option value="processing">En Traitement</option>
                    <option value="shipped">Expédié</option>
                    <option value="delivered">Livré</option>
                    <option value="cancelled">Annulé</option>
                </select>
            </div>
            <div class="form-group">
                <label for="date">Date de Livraison</label>
                <input type="date" id="date" name="date" required>
            </div>
            <div class="form-group">
                <label for="items">Produits</label>
                <div id="itemsContainer">
                    <div class="item-row">
                        <input type="text" name="items[0][title]" placeholder="Titre du produit" required>
                        <input type="number" name="items[0][quantity]" placeholder="Quantité" required>
                        <button type="button" class="add-item-btn" onclick="addItemRow()">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="form-buttons">
                <button type="button" class="cancel-button" onclick="closeFormModal()">Annuler</button>
                <button type="submit" class="save-button">Ajouter</button>
            </div>
        </form>
    `;

    showFormModal('Ajouter une Livraison', formContent);
    initializeForm('deliveryForm', handleAddDelivery);
}

// Show edit delivery modal
function showEditDeliveryModal(deliveryId) {
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (!delivery) return;

    let itemsHtml = '';
    delivery.items.forEach((item, index) => {
        itemsHtml += `
            <div class="item-row">
                <input type="text" name="items[${index}][title]" value="${item.title}" required>
                <input type="number" name="items[${index}][quantity]" value="${item.quantity}" required>
                <button type="button" class="remove-item-btn" onclick="removeItemRow(this)">
                    <i class="fas fa-minus"></i>
                </button>
            </div>
        `;
    });

    const formContent = `
        <form id="deliveryForm">
            <input type="hidden" name="id" value="${delivery.id}">
            <div class="form-group">
                <label for="orderId">Numéro de Commande</label>
                <input type="text" id="orderId" name="orderId" value="${delivery.orderId}" required>
            </div>
            <div class="form-group">
                <label for="customerName">Nom du Client</label>
                <input type="text" id="customerName" name="customerName" value="${delivery.customerName}" required>
            </div>
            <div class="form-group">
                <label for="customerEmail">Email du Client</label>
                <input type="email" id="customerEmail" name="customerEmail" value="${delivery.customerEmail}" required>
            </div>
            <div class="form-group">
                <label for="customerPhone">Téléphone du Client</label>
                <input type="tel" id="customerPhone" name="customerPhone" value="${delivery.customerPhone}" required>
            </div>
            <div class="form-group">
                <label for="address">Adresse de Livraison</label>
                <input type="text" id="address" name="address" value="${delivery.address}" required>
            </div>
            <div class="form-group">
                <label for="city">Ville</label>
                <input type="text" id="city" name="city" value="${delivery.city}" required>
            </div>
            <div class="form-group">
                <label for="postalCode">Code Postal</label>
                <input type="text" id="postalCode" name="postalCode" value="${delivery.postalCode}" required>
            </div>
            <div class="form-group">
                <label for="country">Pays</label>
                <input type="text" id="country" name="country" value="${delivery.country}" required>
            </div>
            <div class="form-group">
                <label for="shippingMethod">Méthode d'Expédition</label>
                <select id="shippingMethod" name="shippingMethod" required>
                    <option value="Standard" ${delivery.shippingMethod === 'Standard' ? 'selected' : ''}>Standard</option>
                    <option value="Express" ${delivery.shippingMethod === 'Express' ? 'selected' : ''}>Express</option>
                    <option value="Colissimo" ${delivery.shippingMethod === 'Colissimo' ? 'selected' : ''}>Colissimo</option>
                </select>
            </div>
            <div class="form-group">
                <label for="shippingCost">Frais de Livraison (€)</label>
                <input type="number" id="shippingCost" name="shippingCost" value="${delivery.shippingCost}" step="0.01" required>
            </div>
            <div class="form-group">
                <label for="status">Statut</label>
                <select id="status" name="status" required>
                    <option value="pending" ${delivery.status === 'pending' ? 'selected' : ''}>En Attente</option>
                    <option value="processing" ${delivery.status === 'processing' ? 'selected' : ''}>En Traitement</option>
                    <option value="shipped" ${delivery.status === 'shipped' ? 'selected' : ''}>Expédié</option>
                    <option value="delivered" ${delivery.status === 'delivered' ? 'selected' : ''}>Livré</option>
                    <option value="cancelled" ${delivery.status === 'cancelled' ? 'selected' : ''}>Annulé</option>
                </select>
            </div>
            <div class="form-group">
                <label for="date">Date de Livraison</label>
                <input type="date" id="date" name="date" value="${delivery.date}" required>
            </div>
            <div class="form-group">
                <label for="items">Produits</label>
                <div id="itemsContainer">
                    ${itemsHtml}
                </div>
                <button type="button" class="add-item-btn" onclick="addItemRow()">
                    <i class="fas fa-plus"></i> Ajouter un Produit
                </button>
            </div>
            <div class="form-buttons">
                <button type="button" class="cancel-button" onclick="closeFormModal()">Annuler</button>
                <button type="submit" class="save-button">Modifier</button>
            </div>
        </form>
    `;

    showFormModal('Modifier une Livraison', formContent);
    initializeForm('deliveryForm', handleEditDelivery);
}

// Handle add delivery
function handleAddDelivery(form) {
    const formData = new FormData(form);
    const delivery = {
        id: deliveries.length + 1,
        orderId: formData.get('orderId'),
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail'),
        customerPhone: formData.get('customerPhone'),
        address: formData.get('address'),
        city: formData.get('city'),
        postalCode: formData.get('postalCode'),
        country: formData.get('country'),
        shippingMethod: formData.get('shippingMethod'),
        shippingCost: parseFloat(formData.get('shippingCost')),
        status: formData.get('status'),
        date: formData.get('date'),
        items: []
    };

    // Parse items
    const items = Array.from(form.querySelectorAll('[name^="items["]'));
    items.forEach(item => {
        const index = item.name.match(/items\[(\d+)\]/)[1];
        const title = form.querySelector(`[name="items[${index}][title]"]`).value;
        const quantity = parseInt(form.querySelector(`[name="items[${index}][quantity]"]`).value);
        delivery.items.push({ title, quantity });
    });

    deliveries.push(delivery);
    displaySuccess('Livraison ajoutée avec succès');
    closeFormModal();
    loadDeliveries();
}

// Handle edit delivery
function handleEditDelivery(form) {
    const formData = new FormData(form);
    const deliveryId = parseInt(formData.get('id'));
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (!delivery) return;

    delivery.orderId = formData.get('orderId');
    delivery.customerName = formData.get('customerName');
    delivery.customerEmail = formData.get('customerEmail');
    delivery.customerPhone = formData.get('customerPhone');
    delivery.address = formData.get('address');
    delivery.city = formData.get('city');
    delivery.postalCode = formData.get('postalCode');
    delivery.country = formData.get('country');
    delivery.shippingMethod = formData.get('shippingMethod');
    delivery.shippingCost = parseFloat(formData.get('shippingCost'));
    delivery.status = formData.get('status');
    delivery.date = formData.get('date');

    // Parse items
    delivery.items = [];
    const items = Array.from(form.querySelectorAll('[name^="items["]'));
    items.forEach(item => {
        const index = item.name.match(/items\[(\d+)\]/)[1];
        const title = form.querySelector(`[name="items[${index}][title]"]`).value;
        const quantity = parseInt(form.querySelector(`[name="items[${index}][quantity]"]`).value);
        delivery.items.push({ title, quantity });
    });

    displaySuccess('Livraison modifiée avec succès');
    closeFormModal();
    loadDeliveries();
}

// Show delivery details modal
function showDeliveryDetails(deliveryId) {
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (!delivery) return;

    const modal = document.createElement('div');
    modal.className = 'delivery-details';
    modal.innerHTML = `
        <div class="delivery-details-content">
            <div class="delivery-details-header">
                <h3>Détails de la Livraison</h3>
                <button class="close-details" onclick="closeDeliveryDetails()">&times;</button>
            </div>
            
            <div class="delivery-info">
                <div class="info-item">
                    <label>ID:</label>
                    <span class="value">${delivery.id}</span>
                </div>
                <div class="info-item">
                    <label>Numéro de Commande:</label>
                    <span class="value">${delivery.orderId}</span>
                </div>
                <div class="info-item">
                    <label>Nom du Client:</label>
                    <span class="value">${delivery.customerName}</span>
                </div>
                <div class="info-item">
                    <label>Email:</label>
                    <span class="value">${delivery.customerEmail}</span>
                </div>
                <div class="info-item">
                    <label>Téléphone:</label>
                    <span class="value">${delivery.customerPhone}</span>
                </div>
                <div class="info-item">
                    <label>Adresse:</label>
                    <span class="value">${delivery.address}, ${delivery.city} ${delivery.postalCode}, ${delivery.country}</span>
                </div>
                <div class="info-item">
                    <label>Méthode d'Expédition:</label>
                    <span class="value">${delivery.shippingMethod}</span>
                </div>
                <div class="info-item">
                    <label>Frais de Livraison:</label>
                    <span class="value">${delivery.shippingCost}€</span>
                </div>
                <div class="info-item">
                    <label>Statut:</label>
                    <span class="value badge ${getStatusClass(delivery.status)}">${delivery.status}</span>
                </div>
                <div class="info-item">
                    <label>Date:</label>
                    <span class="value">${new Date(delivery.date).toLocaleDateString()}</span>
                </div>
                <div class="info-item">
                    <label>Produits:</label>
                    <div class="products-list">
                        ${delivery.items.map(item => `
                            <div class="product-item">
                                <span class="title">${item.title}</span>
                                <span class="quantity">x${item.quantity}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Close delivery details modal
function closeDeliveryDetails() {
    const modal = document.querySelector('.delivery-details');
    if (modal) {
        modal.remove();
    }
}

// Helper functions
function getStatusClass(status) {
    const statusClasses = {
        'pending': 'pending',
        'processing': 'processing',
        'shipped': 'shipped',
        'delivered': 'delivered',
        'cancelled': 'cancelled'
    };
    return statusClasses[status] || 'pending';
}

function addItemRow() {
    const container = document.getElementById('itemsContainer');
    const index = container.children.length;
    const newRow = document.createElement('div');
    newRow.className = 'item-row';
    newRow.innerHTML = `
        <input type="text" name="items[${index}][title]" placeholder="Titre du produit" required>
        <input type="number" name="items[${index}][quantity]" placeholder="Quantité" required>
        <button type="button" class="remove-item-btn" onclick="removeItemRow(this)">
            <i class="fas fa-minus"></i>
        </button>
    `;
    container.appendChild(newRow);
}

function removeItemRow(button) {
    button.closest('.item-row').remove();
}

// Load deliveries
function loadDeliveries() {
    displayDeliveries(deliveries);
}
