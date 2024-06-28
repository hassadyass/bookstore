
const section = document.getElementById('section');
const plusBtn = document.querySelector('.plusBtn');
const minusBtn = document.querySelector('.minusBtn');
const quantity = document.querySelector('.quantity');
const total = document.querySelector('.total');
const deleteBtn = document.querySelector('.delete');


document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});


plusBtn.addEventListener('click', () => {
    updateQuantity(1);
});

minusBtn.addEventListener('click', () => {
    updateQuantity(-1);
});

deleteBtn.addEventListener('click', () => {
    deleteItem();
});


function updateQuantity(change) {
    let qty = parseInt(quantity.textContent) + change;
    if (qty < 0) return; 
    quantity.textContent = qty; 
    updateTotal(qty); 
    
}


function updateTotal(qty) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = cartItems.reduce((acc, item) => acc + item.price * qty, 0);
    total.textContent = totalPrice.toFixed(2);
}


function deleteItem() {
    localStorage.removeItem('cart');
    section.style.display = 'none';
    alert('Cart emptied successfully!');
}


function updateCartUI() {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let qty = cartItems.length; 

    quantity.textContent = qty;
    updateTotal(qty);
}
