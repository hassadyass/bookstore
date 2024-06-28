
const addToCartButtons = document.querySelectorAll('.card button');
const cartIcon = document.querySelector('.fa-shopping-cart');


addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
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
}


cartIcon.addEventListener('click', () => {
    window.location.href = './cart.html';
});
