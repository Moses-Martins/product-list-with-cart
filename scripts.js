let cart = [];

// Attach listeners to ALL quantity selectors
document.querySelectorAll(".quantity-selector").forEach(quantitySelector => {
    const minusBtn = quantitySelector.querySelector(".minus");
    const plusBtn = quantitySelector.querySelector(".plus");
    const numberSpan = quantitySelector.querySelector(".number");

    const figcaption = quantitySelector.closest("figcaption.caption");
    const addLabel = figcaption.querySelector(".add-label");
    const product = figcaption.closest(".product");

    // Read product info from parent
    const id = parseInt(product.dataset.id) || 0;
    const name = product.dataset.name || "Unknown";
    const price = parseFloat(product.dataset.price) || 0;

    let count = 0;

    function updateCount(newCount) {
        count = newCount;
        numberSpan.textContent = count;
        syncCart(id, name, price, count);

        if (count === 0) {
            // Revert to default "Add to cart"
            figcaption.classList.remove("active");
            addLabel.style.display = "inline";
            quantitySelector.style.display = "none";
        }
    }

    // Clicking the figcaption to add first item
    figcaption.addEventListener("click", e => {
        // Ignore clicks on plus/minus
        if (e.target === plusBtn || e.target === minusBtn) return;

        if (count === 0) {
            figcaption.classList.add("active");
            addLabel.style.display = "none";
            quantitySelector.style.display = "flex";
            updateCount(1); // first click adds 1
        }
    });

    // Minus button
    minusBtn.addEventListener("click", e => {
        e.stopPropagation();
        if (count > 0) updateCount(count - 1);
    });

    // Plus button
    plusBtn.addEventListener("click", e => {
        e.stopPropagation();
        updateCount(count + 1);
    });
});

// --- Sync cart logic remains the same ---
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
    document.getElementById("cart-count").textContent = `Your Cart (${count})`;

    const container = document.getElementById("cart-items");
    container.innerHTML = ""; // clear

    let total = 0;

    if (cart.length === 0) {
        const emptyFigure = document.createElement("figure");
        const emptyImg = document.createElement("img");
        emptyImg.src = "./assets/images/illustration-empty-cart.svg";
        emptyImg.alt = "Empty Cart";

        const emptyCaption = document.createElement("figcaption");
        const emptyText = document.createElement("span");
        emptyText.textContent = "Your added items will appear here";

        emptyCaption.appendChild(emptyText);
        emptyFigure.appendChild(emptyImg);
        emptyFigure.appendChild(emptyCaption);

        container.appendChild(emptyFigure);
        return;
    }

    cart.forEach(i => {
        const div = document.createElement("div");
        div.className = "cart-item";

        const nameLine = document.createElement("div");
        nameLine.className = "item-name";
        nameLine.textContent = i.name;

        const qtyLine = document.createElement("div");
        qtyLine.className = "item-qty-price";

        const qtySpan = document.createElement("span");
        qtySpan.className = "item-qty";
        qtySpan.textContent = `${i.quantity}x`;

        const priceSpan = document.createElement("span");
        priceSpan.className = "item-price";
        priceSpan.textContent = `@$${i.price.toFixed(2)}`;

        const subtotalSpan = document.createElement("span");
        subtotalSpan.className = "item-subtotal";
        subtotalSpan.textContent = `$${(i.price * i.quantity).toFixed(2)}`;

        qtyLine.appendChild(qtySpan);
        qtyLine.appendChild(priceSpan);
        qtyLine.appendChild(subtotalSpan);

        div.appendChild(nameLine);
        div.appendChild(qtyLine);

        container.appendChild(div);

        total += i.price * i.quantity;
    });

    const totalDiv = document.createElement("div");
    totalDiv.className = "cart-total";
    totalDiv.style.marginTop = "10px";

    const labelSpan = document.createElement("span");
    labelSpan.className = "total-label";
    labelSpan.textContent = "Order Total:";

    const amountSpan = document.createElement("span");
    amountSpan.className = "total-amount";
    amountSpan.textContent = `$${total.toFixed(2)}`;

    totalDiv.appendChild(labelSpan);
    totalDiv.appendChild(amountSpan);

    container.appendChild(totalDiv);
}
