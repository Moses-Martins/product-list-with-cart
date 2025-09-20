let cart = [];

// Attach listeners to ALL products
document.querySelectorAll(".product").forEach(product => {
    const minusBtn = product.querySelector(".minus");
    const plusBtn = product.querySelector(".plus");
    const numberSpan = product.querySelector(".number");

    let count = parseInt(numberSpan.textContent);
    const id = parseInt(product.dataset.id);
    const name = product.dataset.name;
    const price = parseFloat(product.dataset.price);

    // Decrease
    minusBtn.addEventListener("click", () => {
        if (count > 0) {
            count--;
            numberSpan.textContent = count;
            syncCart(id, name, price, count);
        }
    });

    // Increase
    plusBtn.addEventListener("click", () => {
        count++;
        numberSpan.textContent = count;
        syncCart(id, name, price, count);
    });
});

// Sync cart with quantity
function syncCart(id, name, price, qty) {
    const item = cart.find(i => i.id === id);

    if (qty === 0) {
        cart = cart.filter(i => i.id !== id);
    } else if (item) {
        item.quantity = qty;
    } else {
        cart.push({ id, name, price, quantity: qty });
    }
    updateCart();
}

function updateCart() {
    const count = cart.reduce((t, i) => t + i.quantity, 0);
    document.getElementById('cart-count').textContent = `Your Cart (${count})`;

    const container = document.getElementById('cart-items');
    container.innerHTML = '';
    cart.forEach(i => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.textContent = `${i.name} x ${i.quantity} = $${(i.price * i.quantity).toFixed(2)}`;
        container.appendChild(div);
    });
}

// Toggle cart view
document.getElementById('cart-count').addEventListener('click', () => {
    const box = document.getElementById('cart-items');
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
});