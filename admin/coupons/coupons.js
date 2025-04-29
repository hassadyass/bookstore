// Variable pour stocker les coupons
let coupons = [];

// Configuration de l'API
const API_BASE_URL = 'http://localhost:8080/api';  // À modifier avec l'URL de votre serveur JEE

// ICI : Appels API pour la gestion des utilisateurs
// GET ${API_BASE_URL}/users - Liste des utilisateurs
// GET ${API_BASE_URL}/users/{id} - Détails utilisateur
// POST ${API_BASE_URL}/users - Créer utilisateur
// PUT ${API_BASE_URL}/users/{id} - Modifier utilisateur
// DELETE ${API_BASE_URL}/users/{id} - Supprimer utilisateur

// ICI : Appels API pour la gestion des commandes
// GET ${API_BASE_URL}/orders - Liste des commandes
// GET ${API_BASE_URL}/orders/{id} - Détails commande
// POST ${API_BASE_URL}/orders - Créer commande
// PUT ${API_BASE_URL}/orders/{id} - Modifier commande
// DELETE ${API_BASE_URL}/orders/{id} - Supprimer commande

// ICI : Appels API pour la gestion des paiements
// GET ${API_BASE_URL}/payments - Liste des paiements
// GET ${API_BASE_URL}/payments/{id} - Détails paiement
// POST ${API_BASE_URL}/payments - Créer paiement
// PUT ${API_BASE_URL}/payments/{id} - Modifier paiement
// DELETE ${API_BASE_URL}/payments/{id} - Supprimer paiement

// ICI : Appels API pour la gestion des coupons
// GET ${API_BASE_URL}/coupons - Liste des coupons
// GET ${API_BASE_URL}/coupons/{id} - Détails coupon
// POST ${API_BASE_URL}/coupons - Créer coupon
// PUT ${API_BASE_URL}/coupons/{id} - Modifier coupon
// DELETE ${API_BASE_URL}/coupons/{id} - Supprimer coupon

// Initialisation de la page
document.addEventListener('DOMContentLoaded', () => {
    // Gestion du bouton de fermeture du modal
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideAddCouponForm);
    }

    // Gestion du clic en dehors du modal
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('addCouponModal');
        if (event.target == modal) {
            hideAddCouponForm();
        }
    });

    // Affichage des coupons
    loadCoupons();

    // Gestion de la recherche
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredCoupons = coupons.filter(coupon => {
                return coupon.code.toLowerCase().includes(searchTerm);
            });
            displayCoupons(filteredCoupons);
        });
    }

    // Gestion du bouton d'ajout
    const addBtn = document.querySelector('#add-coupon-btn'); // Correction de l'ID du bouton d'ajout
    if (addBtn) {
        addBtn.addEventListener('click', showAddCouponForm);
    }
});

// Fonction pour afficher le formulaire
function showAddCouponForm() {
    const modal = document.getElementById('addCouponModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Fonction pour cacher le formulaire
function hideAddCouponForm() {
    const modal = document.getElementById('addCouponModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Fonction pour gérer la soumission du formulaire
async function handleAddCoupon(event) {
    event.preventDefault();
    
    // Affichage du loader
    // document.getElementById('loader').style.display = 'block';
    
    const formData = {
        code: document.getElementById('code').value,
        type: document.getElementById('type').value,
        value: parseFloat(document.getElementById('value').value),
        minAmount: parseFloat(document.getElementById('minAmount').value),
        maxDiscount: parseFloat(document.getElementById('maxDiscount').value),
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        status: document.getElementById('status').value
    };

    // Validation
    if (!formData.code || !formData.type || !formData.value) {
        alert('Veuillez remplir les champs obligatoires');
        return false;
    }

    // ICI : Appel API POST pour ajouter le coupon
    try {
        const response = await fetch(`${API_BASE_URL}/coupons`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de l\'ajout du coupon');
        }
        
        const newCoupon = await response.json();
        window.coupons.push(newCoupon);
        displayCoupons();
        hideAddCouponForm();
        document.getElementById('couponForm').reset();
        
        alert('Coupon ajouté avec succès');
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur: ' + error.message);
    } finally {
        // document.getElementById('loader').style.display = 'none';
    }
}

// Affichage des coupons
function displayCoupons(couponsList = coupons) {
    const couponsBody = document.getElementById('couponsBody');
    couponsBody.innerHTML = '';

    if (couponsList.length === 0) {
        couponsBody.innerHTML = '<tr><td colspan="8" class="no-results">Aucun coupon trouvé</td></tr>';
        return;
    }

    couponsList.forEach(coupon => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${coupon.id}</td>
            <td>${coupon.code}</td>
            <td>
                <span class="badge ${coupon.type === 'percentage' ? 'percentage' : 'fixed'}">
                    ${coupon.type === 'percentage' ? 'Pourcentage' : 'Montant Fixe'}
                </span>
            </td>
            <td>${coupon.value}%</td>
            <td>${coupon.minAmount}€</td>
            <td>${coupon.maxDiscount}€</td>
            <td>
                <span class="badge ${coupon.status === 'active' ? 'active' : 'inactive'}">
                    ${coupon.status}
                </span>
            </td>
            <td>
                <div class="actions">
                    <button class="action-btn view-details-btn" onclick="showCouponDetails(${coupon.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="showEditCouponModal(${coupon.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;
        couponsBody.appendChild(row);
    });
}

// Affichage des détails du coupon
function showCouponDetails(couponId) {
    const coupon = coupons.find(c => c.id === couponId);
    if (!coupon) return;

    const details = `
        <div class="coupon-details">
            <h3>Détails du Coupon</h3>
            <div class="coupon-info">
                <div class="info-item">
                    <label>ID:</label>
                    <span>${coupon.id}</span>
                </div>
                <div class="info-item">
                    <label>Code:</label>
                    <span>${coupon.code}</span>
                </div>
                <div class="info-item">
                    <label>Type:</label>
                    <span class="badge ${coupon.type === 'percentage' ? 'percentage' : 'fixed'}">
                        ${coupon.type === 'percentage' ? 'Pourcentage' : 'Montant Fixe'}
                    </span>
                </div>
                <div class="info-item">
                    <label>Valeur:</label>
                    <span>${coupon.value}%</span>
                </div>
                <div class="info-item">
                    <label>Montant Minimum:</label>
                    <span>${coupon.minAmount}€</span>
                </div>
                <div class="info-item">
                    <label>Remise Maximale:</label>
                    <span>${coupon.maxDiscount}€</span>
                </div>
                <div class="info-item">
                    <label>Date de Début:</label>
                    <span>${coupon.startDate}</span>
                </div>
                <div class="info-item">
                    <label>Date de Fin:</label>
                    <span>${coupon.endDate}</span>
                </div>
                <div class="info-item">
                    <label>Statut:</label>
                    <span class="badge ${coupon.status === 'active' ? 'active' : 'inactive'}">${coupon.status}</span>
                </div>
            </div>
            <button class="close-btn" onclick="closeCouponDetails()">Fermer</button>
        </div>
    `;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = details;
    document.body.appendChild(modal);
}

// Fermeture des détails du coupon
function closeCouponDetails() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Gestion de la modification d'un coupon
async function handleEditCoupon(event) {
    event.preventDefault();
    
    const couponId = parseInt(document.getElementById('editCouponId').value);
    const couponIndex = window.coupons.findIndex(c => c.id === couponId);
    
    if (couponIndex === -1) {
        alert('Coupon non trouvé');
        return;
    }

    const formData = {
        code: document.getElementById('editCode').value,
        type: document.getElementById('editType').value,
        value: parseFloat(document.getElementById('editValue').value),
        minAmount: parseFloat(document.getElementById('editMinAmount').value),
        maxDiscount: parseFloat(document.getElementById('editMaxDiscount').value),
        startDate: document.getElementById('editStartDate').value,
        endDate: document.getElementById('editEndDate').value,
        status: document.getElementById('editStatus').value
    };

    // Validation
    if (!formData.code || !formData.type || !formData.value) {
        alert('Veuillez remplir les champs obligatoires');
        return;
    }

    // ICI : Appel API PUT pour modifier le coupon
    try {
        const response = await fetch(`${API_BASE_URL}/coupons/${couponId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la modification du coupon');
        }
        
        const updatedCoupon = await response.json();
        window.coupons[couponIndex] = updatedCoupon;
        displayCoupons();
        hideEditCouponModal();
        
        alert('Coupon mis à jour avec succès');
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur: ' + error.message);
    }
}

// Fonction pour charger les coupons
async function loadCoupons() {
    // ICI : Appel API GET pour charger tous les coupons
    try {
        const response = await fetch(`${API_BASE_URL}/coupons`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des coupons');
        }
        
        window.coupons = await response.json();
        displayCoupons();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur: ' + error.message);
    }
}

// Fonction pour supprimer un coupon
async function deleteCoupon(couponId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce coupon ?')) {
        return;
    }

    // ICI : Appel API DELETE pour supprimer le coupon
    try {
        const response = await fetch(`${API_BASE_URL}/coupons/${couponId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du coupon');
        }
        
        window.coupons = window.coupons.filter(coupon => coupon.id !== couponId);
        displayCoupons();
        alert('Coupon supprimé avec succès');
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur: ' + error.message);
    }
}
