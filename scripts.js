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

    // initialize
    product.dataset.count = 0;

    function updateCount(newCount) {
        product.dataset.count = newCount; // store in DOM
        numberSpan.textContent = newCount;
        syncCart(id, name, price, newCount);

        const productImage = product.querySelector(".product-image");
        if (newCount > 0) {
            productImage.classList.add("selected");
        } else {
            // Revert to default "Add to cart"
            figcaption.classList.remove("active");
            addLabel.style.display = "inline";
            quantitySelector.style.display = "none";
            productImage.classList.remove("selected");
        }
    }

    // Clicking the figcaption to add first item
    figcaption.addEventListener("click", e => {
        if (e.target === plusBtn || e.target === minusBtn) return;

        const current = parseInt(product.dataset.count) || 0;
        if (current === 0) {
            figcaption.classList.add("active");
            addLabel.style.display = "none";
            quantitySelector.style.display = "flex";
            updateCount(1);
        }
    });

    // Minus button
    minusBtn.addEventListener("click", e => {
        e.stopPropagation();
        const current = parseInt(product.dataset.count) || 0;
        if (current > 0) updateCount(current - 1);
    });

    // Plus button
    plusBtn.addEventListener("click", e => {
        e.stopPropagation();
        const current = parseInt(product.dataset.count) || 0;
        updateCount(current + 1);
    });
});

// --- Sync cart logic remains the same ---
function syncCart(id, name, price, qty) {
    const product = document.querySelector(`.product[data-id='${id}']`);
    const image = product?.dataset.image || product?.querySelector(".product-image")?.src || "";

    const item = cart.find(i => i.id === id);

    if (qty === 0) {
        cart = cart.filter(i => i.id !== id);
    } else if (item) {
        item.quantity = qty;
    } else {
        cart.push({ id, name, price, image, quantity: qty }); // ✅ store image
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
        return; // ⛔ stop here if empty
    }

    // If cart has items:
    cart.forEach(i => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.dataset.id = i.id;

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

        // Cancel icon
        const cancelIcon = document.createElement("i");
        cancelIcon.className = "bi bi-x-circle-fill my-custom-icon";
        cancelIcon.style.cursor = "pointer";
        cancelIcon.style.position = "absolute";
        cancelIcon.style.right = "10px";
        cancelIcon.style.top = "50%";
        cancelIcon.style.transform = "translateY(-50%)";

        cancelIcon.addEventListener("click", () => {
            cart = cart.filter(item => item.id !== i.id);
            updateCart();

            const product = document.querySelector(`.product[data-id='${i.id}']`);
            if (product) {
                const figcaption = product.querySelector("figcaption.caption");
                const addLabel = figcaption.querySelector(".add-label");
                const quantitySelector = figcaption.querySelector(".quantity-selector");
                const numberSpan = quantitySelector.querySelector(".number");
                const productImage = product.querySelector(".product-image");

                figcaption.classList.remove("active");
                addLabel.style.display = "inline";
                quantitySelector.style.display = "none";
                numberSpan.textContent = "0";
                productImage.classList.remove("selected");
                product.dataset.count = 0;
            }
        });

        div.style.position = "relative";
        div.appendChild(cancelIcon);

        container.appendChild(div);

        total += i.price * i.quantity;
    });

    // --- Order Total ---
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

    // --- Carbon neutral + Confirm Order ---
    const footerDiv = document.createElement("div");
    footerDiv.className = "cart-footer";
    footerDiv.style.marginTop = "15px";

    footerDiv.innerHTML = `
    <div class="carbon-span">
        <img src="./assets/images/icon-carbon-neutral.svg" alt="carbon neutral" />
        <span>This is a <strong>carbon-neutral</strong> delivery</span>
    </div>
    <button id="confirm-order-btn" class="confirm-order-btn">
        Confirm Order
    </button>
`;

    container.appendChild(footerDiv);

    // ✅ Attach confirm button logic here
    const confirmBtn = footerDiv.querySelector("#confirm-order-btn");
    const dialog = document.getElementById("dialog-items");
    const closeBtn = document.getElementById("closeBtn");

    confirmBtn.addEventListener("click", () => {
        // Clear old dialog items
        dialog.innerHTML = "";

        let total = 0;

        // Copy the same "cart-item" structure into dialog
        cart.forEach(i => {
            const div = document.createElement("div");
            div.className = "cart-item";
            div.dataset.id = i.id;
            div.style.position = "relative";
            div.style.display = "flex"; // ✅ make it a row
            div.style.alignItems = "center";
            div.style.gap = "12px";

            // Product image
            const img = document.createElement("img");
            img.src = i.image;
            img.alt = i.name;
            img.className = "dialog-product-image";
            div.appendChild(img);

            // Wrap text info
            const textWrapper = document.createElement("div");
            textWrapper.style.flex = "1"; // take remaining space

            // Item name
            const nameLine = document.createElement("div");
            nameLine.className = "item-name";
            nameLine.textContent = i.name;

            // Qty + Price + Subtotal
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

            textWrapper.appendChild(nameLine);
            textWrapper.appendChild(qtyLine);

            div.appendChild(textWrapper);
            dialog.appendChild(div);

            total += i.price * i.quantity;
        });

        // --- Order Total (same style as cart) ---
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

        dialog.appendChild(totalDiv);

        // Show modal
        document.getElementById("myDialog").showModal();
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            // 1. Close the dialog
            document.getElementById("myDialog").close();

            // 2. Reset the cart
            cart = [];

            // 3. Reset all product UIs
            document.querySelectorAll(".product").forEach(product => {
                const figcaption = product.querySelector("figcaption.caption");
                const addLabel = figcaption.querySelector(".add-label");
                const quantitySelector = figcaption.querySelector(".quantity-selector");
                const numberSpan = quantitySelector.querySelector(".number");
                const productImage = product.querySelector(".product-image");

                figcaption.classList.remove("active");
                addLabel.style.display = "inline";
                quantitySelector.style.display = "none";
                numberSpan.textContent = "0";
                productImage.classList.remove("selected");
                product.dataset.count = 0;
            });

            // 4. Update cart UI
            updateCart();
        });
    }


}
