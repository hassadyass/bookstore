// Variable globale pour stocker les catégories
let staticCategories = [];

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

// ICI : Appels API pour la gestion des catégories
// GET ${API_BASE_URL}/categories - Liste des catégories
// GET ${API_BASE_URL}/categories/{id} - Détails catégorie
// POST ${API_BASE_URL}/categories - Créer catégorie
// PUT ${API_BASE_URL}/categories/{id} - Modifier catégorie
// DELETE ${API_BASE_URL}/categories/{id} - Supprimer catégorie

// DOM Elements
const categoriesList = document.getElementById('categories-list');
const categoryModal = document.getElementById('category-modal');
const categoryForm = document.getElementById('category-form');
const modalTitle = document.getElementById('modal-title');
const addBtn = document.querySelector('.add-button');
const tbody = document.getElementById('categoriesBody');
const searchInput = document.getElementById('categorySearch');

// Fonction pour afficher le formulaire
function showAddCategoryForm() {
    const modal = document.getElementById('addCategoryModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Fonction pour cacher le formulaire
function hideAddCategoryForm() {
    const modal = document.getElementById('addCategoryModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Fonction pour gérer la soumission du formulaire
async function handleAddCategory(event) {
    event.preventDefault();
    
    // Affichage du loader
    // document.getElementById('loader').style.display = 'block';
    
    const formData = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value
    };

    // Validation
    if (!formData.name) {
        alert('Veuillez remplir le nom de la catégorie');
        return false;
    }

    // ICI : Appel API POST pour ajouter la catégorie
    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de l\'ajout de la catégorie');
        }
        
        const newCategory = await response.json();
        staticCategories.push(newCategory);
        displayCategories();
        hideAddCategoryForm();
        document.getElementById('categoryForm').reset();
        
        alert('Catégorie ajoutée avec succès');
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur: ' + error.message);
    } finally {
        // document.getElementById('loader').style.display = 'none';
    }
}

// Initialisation de la page
document.addEventListener('DOMContentLoaded', () => {
    // Gestion du bouton de fermeture du modal
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideAddCategoryForm);
    }

    // Gestion du clic en dehors du modal
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('addCategoryModal');
        if (event.target == modal) {
            hideAddCategoryForm();
        }
    });

    // Affichage des catégories
    loadCategories();

    // Gestion de la recherche
    const searchInput = document.getElementById('categorySearch');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredCategories = staticCategories.filter(category => {
                return category.name.toLowerCase().includes(searchTerm) ||
                       category.description.toLowerCase().includes(searchTerm);
            });
            displayCategories(filteredCategories);
        });
    }

    // Gestion du bouton d'ajout
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', showAddCategoryForm);
    }
});

// Fonction pour charger les catégories
async function loadCategories() {
    // ICI : Appel API GET pour charger toutes les catégories
    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des catégories');
        }
        
        staticCategories = await response.json();
        displayCategories();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur: ' + error.message);
    }
}

// Affichage des catégories
function displayCategories(categories = staticCategories) {
    const categoriesBody = document.getElementById('categoriesBody');
    categoriesBody.innerHTML = '';

    if (categories.length === 0) {
        categoriesBody.innerHTML = '<tr><td colspan="5" class="no-results">Aucune catégorie trouvée</td></tr>';
        return;
    }

    categories.forEach(category => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td>${category.description}</td>
            <td>
                <div class="image-container">
                    <img src="${category.image}" alt="${category.name}" class="table-image">
                </div>
            </td>
            <td>
                <div class="actions">
                    <button class="action-btn view-details-btn" onclick="showCategoryDetails(${category.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="showEditCategoryModal(${category.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteCategory(${category.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        categoriesBody.appendChild(row);
    });
}

// Affichage des détails de la catégorie
function showCategoryDetails(categoryId) {
    const category = staticCategories.find(c => c.id === categoryId);
    if (!category) return;

    const details = `
        <div class="category-details">
            <h3>Détails de la Catégorie</h3>
            <div class="category-info">
                <div class="info-item">
                    <label>ID:</label>
                    <span>${category.id}</span>
                </div>
                <div class="info-item">
                    <label>Nom:</label>
                    <span>${category.name}</span>
                </div>
                <div class="info-item">
                    <label>Description:</label>
                    <span>${category.description || 'Aucune description'}</span>
                </div>
                <div class="info-item">
                    <label>Image:</label>
                    <img src="${category.image}" alt="${category.name}" class="detail-image">
                </div>
            </div>
            <button class="close-btn" onclick="closeCategoryDetails()">Fermer</button>
        </div>
    `;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = details;
    document.body.appendChild(modal);
}

// Fermeture des détails de la catégorie
function closeCategoryDetails() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Fonction pour supprimer une catégorie
async function deleteCategory(categoryId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
        return;
    }

    // ICI : Appel API DELETE pour supprimer la catégorie
    try {
        const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression de la catégorie');
        }
        
        staticCategories = staticCategories.filter(category => category.id !== categoryId);
        displayCategories();
        alert('Catégorie supprimée avec succès');
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur: ' + error.message);
    }
}
