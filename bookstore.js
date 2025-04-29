
const addToCartButtons = document.querySelectorAll('.card button');
const cartIcon = document.querySelector('.fa-shopping-cart');


addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});
const searchBar = document.querySelector('.search-bar input');
const books = document.querySelectorAll('.card');

searchBar.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  books.forEach((book) => {
    const title = book.querySelector('h7').textContent.toLowerCase();
    if (title.includes(searchTerm)) {
      book.style.display = 'block';
    } else {
      book.style.display = 'none';
    }
  });
});


function addToCart() {
    const card = this.parentElement;
    const title = card.querySelector('h7').textContent;
    const price = parseFloat(card.querySelector('.price').textContent);

    const item = {
        title: title,
        price: price
    };

    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.push(item);
    localStorage.setItem('cart', JSON.stringify(cartItems));

    alert(`${title} added to cart!`);
    updateCartCount();  // Update the cart count display
    updateCartUI();     // Update the cart modal content
}

function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = cartModal.style.display === 'flex' ? 'none' : 'flex';
    if (cartModal.style.display === 'flex') {
        updateCartUI();  // Update cart content when opening
    }
}

function updateQuantity(change) {
    const quantity = document.querySelector('.quantity');
    const current = parseInt(quantity.textContent);
    const newQuantity = Math.max(0, current + change);
    quantity.textContent = newQuantity;
    updateTotal(newQuantity);
}

function updateTotal(quantity) {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cartItems.reduce((acc, item) => acc + item.price * quantity, 0);
    document.querySelector('.total').textContent = total.toFixed(2);
}

function deleteItem() {
    localStorage.removeItem('cart');
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    document.querySelector('.quantity').textContent = '0';
    document.querySelector('.total').textContent = '0';
    updateCartCount();
}

function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cartItems.length;
}

function updateCartUI() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    cartItemsDiv.innerHTML = cartItems.map(item => `
        <div class="cart-item">
            <h3>${item.title}</h3>
            <p>${item.price} TND</p>
        </div>
    `).join('');
    
    updateCartCount();
    updateTotal(1);  // Update total with default quantity of 1
}

// Initialize cart count
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});
addToCartButtons.forEach(button => {
  button.addEventListener('click', addToCart);
});
// Add this to your existing JavaScript code
document.querySelector('.commander-btn').addEventListener('click', () => {
  alert('Votre commande a été envoyée avec succès !');
  // You can add more checkout functionality here
});


document.querySelector('.close-cart').addEventListener('click', () => {
  toggleCart();
});