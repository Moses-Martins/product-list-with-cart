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
    container.innerHTML = ''; // clear current contents

    let total = 0;

    if (cart.length === 0) {
        // Restore default empty cart view
        const emptyFigure = document.createElement('figure');

        const emptyImg = document.createElement('img');
        emptyImg.src = "./assets/images/illustration-empty-cart.svg";
        emptyImg.alt = "Empty Cart";

        const emptyCaption = document.createElement('figcaption');
        const emptyText = document.createElement('span');
        emptyText.textContent = "Your added items will appear here";

        emptyCaption.appendChild(emptyText);
        emptyFigure.appendChild(emptyImg);
        emptyFigure.appendChild(emptyCaption);

        container.appendChild(emptyFigure);
        return; // stop here
    }

    // Render items if cart not empty
    cart.forEach(i => {
        const div = document.createElement('div');
        div.className = 'cart-item';

        // Line 1: Item name
        const nameLine = document.createElement('div');
        nameLine.className = 'item-name';
        nameLine.textContent = i.name;

        // Line 2: Quantity × unit price + Subtotal (all in same row)
        const qtyLine = document.createElement('div');
        qtyLine.className = 'item-qty-price';

        const qtySpan = document.createElement('span');
        qtySpan.className = 'item-qty';
        qtySpan.textContent = `${i.quantity}x`;

        const priceSpan = document.createElement('span');
        priceSpan.className = 'item-price';
        priceSpan.textContent = `@$${i.price.toFixed(2)}`;

        const subtotalSpan = document.createElement('span');
        subtotalSpan.className = 'item-subtotal';
        subtotalSpan.textContent = `$${(i.price * i.quantity).toFixed(2)}`;

        qtyLine.appendChild(qtySpan);
        qtyLine.appendChild(priceSpan);
        qtyLine.appendChild(subtotalSpan);

        div.appendChild(nameLine);
        div.appendChild(qtyLine);

        container.appendChild(div);

        total += i.price * i.quantity;
    });

    // Add order total row
    const totalDiv = document.createElement('div');
    totalDiv.className = 'cart-total';
    totalDiv.style.marginTop = "10px";

    const labelSpan = document.createElement('span');
    labelSpan.className = 'total-label';
    labelSpan.textContent = "Order Total:";

    const amountSpan = document.createElement('span');
    amountSpan.className = 'total-amount';
    amountSpan.textContent = `$${total.toFixed(2)}`;

    totalDiv.appendChild(labelSpan);
    totalDiv.appendChild(amountSpan);

    container.appendChild(totalDiv);
}
