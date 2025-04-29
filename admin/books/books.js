// Fonction pour afficher le formulaire
function showAddBookForm() {
    const modal = document.getElementById('addBookModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Fonction pour cacher le formulaire
function hideAddBookForm() {
    const modal = document.getElementById('addBookModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

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

// Fonction pour gérer la soumission du formulaire
async function handleAddBook(event) {
    event.preventDefault();
    
    // Affichage du loader
    // document.getElementById('loader').style.display = 'block';
    
    const formData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        isbn: document.getElementById('isbn').value
    };

    // Validation
    if (!formData.title || !formData.author || !formData.price || !formData.stock || !formData.category) {
        alert('Veuillez remplir tous les champs obligatoires');
        return false;
    }

    // ICI : Appel API POST pour ajouter le livre
    try {
        const response = await fetch(`${API_BASE_URL}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de l\'ajout du livre');
        }
        
        const newBook = await response.json();
        window.books.push(newBook);
        displayBooks();
        hideAddBookForm();
        document.getElementById('bookForm').reset();
        
        alert('Livre ajouté avec succès');
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur: ' + error.message);
    } finally {
        // document.getElementById('loader').style.display = 'none';
    }
}

// Initialisation des catégories
document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        const categories = [
            { name: 'Roman' },
            { name: 'Science-fiction' },
            { name: 'Fantastique' },
            { name: 'Policier' },
            { name: 'Thriller' },
            { name: 'Horreur' },
            { name: 'Jeunesse' },
            { name: 'Scolaire' },
            { name: 'Universitaire' },
            { name: 'Divers' }
        ];

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }

    // Gestion du bouton de fermeture du modal
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideAddBookForm);
    }

    // Gestion du clic en dehors du modal
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('addBookModal');
        if (event.target == modal) {
            hideAddBookForm();
        }
    });

    // Affichage des livres
    loadBooks();

    // Gestion de la recherche
    const searchInput = document.getElementById('bookSearch');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredBooks = window.books.filter(book => {
                return book.title.toLowerCase().includes(searchTerm) ||
                       book.author.toLowerCase().includes(searchTerm) ||
                       book.category.toLowerCase().includes(searchTerm);
            });
            displayBooks(filteredBooks);
        });
    }

    // Gestion du bouton annuler
    const cancelButton = document.querySelector('.cancel-button');
    if (cancelButton) {
        cancelButton.addEventListener('click', hideAddBookForm);
    }

    // Gestion du bouton d'ajout
    const addBookBtn = document.getElementById('addBookBtn');
    if (addBookBtn) {
        addBookBtn.addEventListener('click', showAddBookForm);
    }

    // Gestion du formulaire
    const bookForm = document.getElementById('bookForm');
    if (bookForm) {
        bookForm.addEventListener('submit', handleAddBook);
    }

    // Initialisation des catégories pour le formulaire d'édition
    const editCategorySelect = document.getElementById('editCategory');
    if (editCategorySelect) {
        const categories = [
            { name: 'Roman' },
            { name: 'Science-fiction' },
            { name: 'Fantastique' },
            { name: 'Policier' },
            { name: 'Thriller' },
            { name: 'Horreur' },
            { name: 'Jeunesse' },
            { name: 'Scolaire' },
            { name: 'Universitaire' },
            { name: 'Divers' }
        ];

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            editCategorySelect.appendChild(option);
        });
    }

    // Gestion du bouton annuler pour le formulaire d'édition
    const editCancelButton = document.querySelector('#editBookModal .cancel-button');
    if (editCancelButton) {
        editCancelButton.addEventListener('click', hideEditBookModal);
    }

    // Gestion du formulaire d'édition
    const editBookForm = document.getElementById('editBookForm');
    if (editBookForm) {
        editBookForm.addEventListener('submit', handleEditBook);
    }

    // Gestion du bouton de fermeture du modal d'édition
    const editCloseBtn = document.querySelector('#editBookModal .close-modal');
    if (editCloseBtn) {
        editCloseBtn.addEventListener('click', hideEditBookModal);
    }

    // Gestion du clic en dehors du modal d'édition
    window.addEventListener('click', (event) => {
        const editModal = document.getElementById('editBookModal');
        if (event.target == editModal) {
            hideEditBookModal();
        }
    });
});

// Affichage des livres
function displayBooks(books = window.books) {
    const booksBody = document.getElementById('booksBody');
    booksBody.innerHTML = '';

    if (books.length === 0) {
        booksBody.innerHTML = '<tr><td colspan="8" class="no-results">Aucun livre trouvé</td></tr>';
        return;
    }

    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.price}€</td>
            <td>${book.stock}</td>
            <td>${book.category}</td>
            <td>
                <div class="image-container">
                    <img src="${book.coverImage}" alt="${book.title}" class="table-image">
                </div>
            </td>
            <td>
                <div class="actions">
                    <button class="action-btn view-details-btn" onclick="showBookDetails(${book.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="showEditBookModal(${book.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;
        booksBody.appendChild(row);
    });
}

// Affichage des détails du livre
function showBookDetails(bookId) {
    const book = window.books.find(b => b.id === bookId);
    if (!book) return;

    const details = `
        <div class="book-details">
            <h3>Détails du Livre</h3>
            <div class="book-info">
                <div class="info-item">
                    <label>ID:</label>
                    <span>${book.id}</span>
                </div>
                <div class="info-item">
                    <label>Titre:</label>
                    <span>${book.title}</span>
                </div>
                <div class="info-item">
                    <label>Auteur:</label>
                    <span>${book.author}</span>
                </div>
                <div class="info-item">
                    <label>Prix:</label>
                    <span>${book.price}€</span>
                </div>
                <div class="info-item">
                    <label>Stock:</label>
                    <span>${book.stock}</span>
                </div>
                <div class="info-item">
                    <label>Catégorie:</label>
                    <span>${book.category}</span>
                </div>
                <div class="info-item">
                    <label>ISBN:</label>
                    <span>${book.isbn || 'Non spécifié'}</span>
                </div>
                <div class="info-item">
                    <label>Date de création:</label>
                    <span>${book.createdAt}</span>
                </div>
                <div class="info-item">
                    <label>Description:</label>
                    <p>${book.description || 'Aucune description'}</p>
                </div>
                <div class="info-item">
                    <label>Couverture:</label>
                    <div class="image-container">
                        <img src="${book.coverImage}" alt="${book.title}" class="detail-image">
                    </div>
                </div>
            </div>
            <div class="actions">
                <button class="cancel-button" onclick="closeBookDetails()">Fermer</button>
            </div>
        </div>
    `;

    const modal = document.getElementById('bookDetailsModal');
    if (modal) {
        modal.innerHTML = details;
        modal.style.display = 'block';
    }
}

// Fermeture des détails du livre
function closeBookDetails() {
    const modal = document.getElementById('bookDetailsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Affichage du formulaire d'édition
function showEditBookModal(bookId) {
    const book = window.books.find(b => b.id === bookId);
    if (!book) return;

    const modal = document.getElementById('editBookModal');
    if (modal) {
        modal.style.display = 'block';
        
        // Remplir le formulaire avec les données existantes
        document.getElementById('editTitle').value = book.title;
        document.getElementById('editAuthor').value = book.author;
        document.getElementById('editPrice').value = book.price;
        document.getElementById('editStock').value = book.stock;
        document.getElementById('editCategory').value = book.category;
        document.getElementById('editDescription').value = book.description;
        document.getElementById('editIsbn').value = book.isbn;
    }
}

// Cacher le formulaire d'édition
function hideEditBookModal() {
    const modal = document.getElementById('editBookModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Gestion de la modification d'un livre
async function handleEditBook(event) {
    event.preventDefault();
    
    const bookId = parseInt(document.getElementById('editBookId').value);
    const bookIndex = window.books.findIndex(b => b.id === bookId);
    
    if (bookIndex === -1) {
        alert('Livre non trouvé');
        return;
    }

    const formData = {
        title: document.getElementById('editTitle').value,
        author: document.getElementById('editAuthor').value,
        price: parseFloat(document.getElementById('editPrice').value),
        stock: parseInt(document.getElementById('editStock').value),
        category: document.getElementById('editCategory').value,
        description: document.getElementById('editDescription').value,
        isbn: document.getElementById('editIsbn').value
    };

    // Validation
    if (!formData.title || !formData.author || !formData.price || !formData.stock || !formData.category) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }

    // ICI : Appel API PUT pour modifier le livre
    try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la modification du livre');
        }
        
        const updatedBook = await response.json();
        window.books[bookIndex] = updatedBook;
        displayBooks();
        hideEditBookModal();
        
        alert('Livre mis à jour avec succès');
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur: ' + error.message);
    }
}

// Fonction pour charger les livres
async function loadBooks() {
    // ICI : Appel API GET pour charger tous les livres
    try {
        const response = await fetch(`${API_BASE_URL}/books`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des livres');
        }
        
        window.books = await response.json();
        displayBooks();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur: ' + error.message);
    }
}

// Fonction pour supprimer un livre
async function deleteBook(bookId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
        return;
    }

    // ICI : Appel API DELETE pour supprimer le livre
    try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du livre');
        }
        
        window.books = window.books.filter(book => book.id !== bookId);
        displayBooks();
        alert('Livre supprimé avec succès');
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur: ' + error.message);
    }
}
