// Variable pour stocker les utilisateurs
let users = [];

// Initialisation de la page
document.addEventListener('DOMContentLoaded', () => {
    // Gestion du bouton de fermeture du modal
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideAddUserForm);
    }

    // Gestion du clic en dehors du modal
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('addUserModal');
        if (event.target == modal) {
            hideAddUserForm();
        }
    });

    // Affichage des utilisateurs
    displayUsers();

    // Gestion de la recherche
    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredUsers = users.filter(user => {
                return user.fullName.toLowerCase().includes(searchTerm) ||
                       user.username.toLowerCase().includes(searchTerm) ||
                       user.email.toLowerCase().includes(searchTerm);
            });
            displayUsers(filteredUsers);
        });
    }

    // Gestion du bouton d'ajout
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            const modal = document.getElementById('addUserModal');
            if (modal) {
                modal.style.display = 'block';
            }
        });
    }
});

// Fonction pour cacher le formulaire
function hideAddUserForm() {
    const modal = document.getElementById('addUserModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Fonction pour gérer la soumission du formulaire
function handleAddUser(event) {
    event.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phone').value,
        role: document.getElementById('role').value,
        status: document.getElementById('status').value
    };

    // Validation
    if (!formData.fullName || !formData.username || !formData.email) {
        alert('Veuillez remplir les champs obligatoires');
        return false;
    }

    // Ajout de l'utilisateur
    const newUser = {
        id: users.length + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    displayUsers();
    hideAddUserForm();
    document.getElementById('userForm').reset();
    
    alert('Utilisateur ajouté avec succès');
    return false;
}

// Affichage des utilisateurs
function displayUsers(usersList = users) {
    const usersBody = document.getElementById('usersBody');
    usersBody.innerHTML = '';

    if (usersList.length === 0) {
        usersBody.innerHTML = '<tr><td colspan="10" class="no-results">Aucun utilisateur trouvé</td></tr>';
        return;
    }

    usersList.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.fullName}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.phoneNumber}</td>
            <td>
                <span class="badge ${user.role === 'admin' ? 'admin' : 'user'}">
                    ${user.role}
                </span>
            </td>
            <td>
                <span class="badge ${user.status === 'active' ? 'active' : 'inactive'}">
                    ${user.status}
                </span>
            </td>
            <td>
                <div class="actions">
                    <button class="action-btn view-details-btn" onclick="showUserDetails(${user.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="showEditUserModal(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;
        usersBody.appendChild(row);
    });
}

// Affichage des détails de l'utilisateur
function showUserDetails(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const details = `
        <div class="user-details">
            <h3>Détails de l'Utilisateur</h3>
            <div class="user-info">
                <div class="info-item">
                    <label>ID:</label>
                    <span>${user.id}</span>
                </div>
                <div class="info-item">
                    <label>Nom Complet:</label>
                    <span>${user.fullName}</span>
                </div>
                <div class="info-item">
                    <label>Username:</label>
                    <span>${user.username}</span>
                </div>
                <div class="info-item">
                    <label>Email:</label>
                    <span>${user.email}</span>
                </div>
                <div class="info-item">
                    <label>Téléphone:</label>
                    <span>${user.phoneNumber}</span>
                </div>
                <div class="info-item">
                    <label>Rôle:</label>
                    <span class="badge ${user.role === 'admin' ? 'admin' : 'user'}">${user.role}</span>
                </div>
                <div class="info-item">
                    <label>Statut:</label>
                    <span class="badge ${user.status === 'active' ? 'active' : 'inactive'}">${user.status}</span>
                </div>
            </div>
            <button class="close-btn" onclick="closeUserDetails()">Fermer</button>
        </div>
    `;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = details;
    document.body.appendChild(modal);
}

// Fermeture des détails de l'utilisateur
function closeUserDetails() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Fonction pour afficher le formulaire
function showAddUserForm() {
    const modal = document.getElementById('addUserModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Fonction pour cacher le formulaire
function hideAddUserForm() {
    const modal = document.getElementById('addUserModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Fonction pour gérer la soumission du formulaire
function handleAddUser(event) {
    event.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phone').value,
        role: document.getElementById('role').value,
        status: document.getElementById('status').value
    };

    // Validation
    if (!formData.fullName || !formData.username || !formData.email) {
        alert('Veuillez remplir les champs obligatoires');
        return false;
    }

    // Ajout de l'utilisateur
    const newUser = {
        id: users.length + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    displayUsers();
    hideAddUserForm();
    document.getElementById('userForm').reset();
    
    alert('Utilisateur ajouté avec succès');
    return false;
}

// Affichage des utilisateurs
function displayUsers(usersList = users) {
    const usersBody = document.getElementById('usersBody');
    usersBody.innerHTML = '';

    if (usersList.length === 0) {
        usersBody.innerHTML = '<tr><td colspan="10" class="no-results">Aucun utilisateur trouvé</td></tr>';
        return;
    }

    usersList.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.fullName}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.phoneNumber}</td>
            <td>
                <span class="badge ${user.role === 'admin' ? 'admin' : 'user'}">
                    ${user.role}
                </span>
            </td>
            <td>
                <span class="badge ${user.status === 'active' ? 'active' : 'inactive'}">
                    ${user.status}
                </span>
            </td>
            <td>
                <div class="actions">
                    <button class="action-btn view-details-btn" onclick="showUserDetails(${user.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="showEditUserModal(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;
        usersBody.appendChild(row);
    });
}

// Affichage des détails de l'utilisateur
function showUserDetails(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const details = `
        <div class="user-details">
            <h3>Détails de l'Utilisateur</h3>
            <div class="user-info">
                <div class="info-item">
                    <label>ID:</label>
                    <span>${user.id}</span>
                </div>
                <div class="info-item">
                    <label>Nom Complet:</label>
                    <span>${user.fullName}</span>
                </div>
                <div class="info-item">
                    <label>Username:</label>
                    <span>${user.username}</span>
                </div>
                <div class="info-item">
                    <label>Email:</label>
                    <span>${user.email}</span>
                </div>
                <div class="info-item">
                    <label>Téléphone:</label>
                    <span>${user.phoneNumber}</span>
                </div>
                <div class="info-item">
                    <label>Rôle:</label>
                    <span class="badge ${user.role === 'admin' ? 'admin' : 'user'}">${user.role}</span>
                </div>
                <div class="info-item">
                    <label>Statut:</label>
                    <span class="badge ${user.status === 'active' ? 'active' : 'inactive'}">${user.status}</span>
                </div>
            </div>
            <button class="close-btn" onclick="closeUserDetails()">Fermer</button>
        </div>
    `;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = details;
    document.body.appendChild(modal);
}

// Fermeture des détails de l'utilisateur
function closeUserDetails() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Fonction pour afficher le formulaire de modification
function showEditUserModal(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const formContent = `
        <form id="userForm">
            <input type="hidden" name="id" value="${user.id}">
            <div class="form-group">
                <label for="fullName">Nom Complet</label>
                <input type="text" id="fullName" name="fullName" value="${user.fullName}" required>
            </div>
            <div class="form-group">
                <label for="username">Nom d'Utilisateur</label>
                <input type="text" id="username" name="username" value="${user.username}" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="${user.email}" required>
            </div>
            <div class="form-group">
                <label for="phoneNumber">Téléphone</label>
                <input type="tel" id="phoneNumber" name="phoneNumber" value="${user.phoneNumber}" required>
            </div>
            <div class="form-group">
                <label for="role">Rôle</label>
                <select id="role" name="role" required>
                    <option value="user" ${user.role === 'user' ? 'selected' : ''}>Utilisateur</option>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrateur</option>
                </select>
            </div>
            <div class="form-group">
                <label for="status">Statut</label>
                <select id="status" name="status" required>
                    <option value="active" ${user.status === 'active' ? 'selected' : ''}>Actif</option>
                    <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>Inactif</option>
                </select>
            </div>
            <div class="form-buttons">
                <button type="button" class="cancel-button" onclick="closeFormModal()">Annuler</button>
                <button type="submit" class="save-button">Modifier</button>
            </div>
        </form>
    `;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = formContent;
    document.body.appendChild(modal);

    document.getElementById('userForm').addEventListener('submit', handleEditUser);
}

// Fonction pour gérer la modification de l'utilisateur
function handleEditUser(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const userId = parseInt(formData.get('id'));
    const user = users.find(u => u.id === userId);
    if (!user) return;

    user.fullName = formData.get('fullName');
    user.username = formData.get('username');
    user.email = formData.get('email');
    user.phoneNumber = formData.get('phoneNumber');
    user.role = formData.get('role');
    user.status = formData.get('status');

    displayUsers();
    closeFormModal();
    alert('Utilisateur modifié avec succès');
}

// Fonction pour fermer le formulaire
function closeFormModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}
