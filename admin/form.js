// Form handling utilities

// Show form modal
function showFormModal(title, formContent) {
    const modal = document.createElement('div');
    modal.className = 'form-modal';
    modal.innerHTML = `
        <div class="form-content">
            <div class="form-header">
                <h3>${title}</h3>
                <button class="close-form" onclick="closeFormModal()">&times;</button>
            </div>
            ${formContent}
        </div>
    `;
    document.body.appendChild(modal);
}

// Close form modal
function closeFormModal() {
    const modal = document.querySelector('.form-modal');
    if (modal) {
        modal.remove();
    }
}

// Form validation utilities
function validateForm(form) {
    const errors = [];
    
    // Validate required fields
    form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
            errors.push(`Le champ "${field.name}" est requis`);
        }
    });

    // Validate email format
    const emailFields = form.querySelectorAll('[type="email"]');
    emailFields.forEach(field => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (field.value && !emailRegex.test(field.value)) {
            errors.push(`L'email "${field.name}" n'est pas valide`);
        }
    });

    // Validate phone number
    const phoneFields = form.querySelectorAll('[type="tel"]');
    phoneFields.forEach(field => {
        const phoneRegex = /^\+\d{1,3}[-.\s]?\d{1,14}$/;
        if (field.value && !phoneRegex.test(field.value)) {
            errors.push(`Le numéro de téléphone "${field.name}" n'est pas valide`);
        }
    });

    return errors;
}

// Handle form submission
function handleFormSubmit(form, onSubmit) {
    const errors = validateForm(form);
    
    if (errors.length > 0) {
        errors.forEach(error => {
            displayError(error);
        });
        return false;
    }

    onSubmit(form);
    return true;
}

// Helper function to display error message
function displayError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert error';
    alert.textContent = message;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

// Helper function to display success message
function displaySuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'alert success';
    alert.textContent = message;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

// Form initialization
function initializeForm(formId, onSubmit) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(form, onSubmit);
    });

    // Reset form on close
    const closeButtons = form.querySelectorAll('.close-form');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            form.reset();
        });
    });
}

// Export utilities
export {
    showFormModal,
    closeFormModal,
    validateForm,
    handleFormSubmit,
    initializeForm
};
