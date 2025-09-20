const minusBtn = document.querySelector(".quantity-selector .minus");
const plusBtn = document.querySelector(".quantity-selector .plus");
const numberSpan = document.querySelector(".quantity-selector .number");

let count = parseInt(numberSpan.textContent); // Start from the displayed number

// Decrease
minusBtn.addEventListener("click", () => {
    if (count > 0) {   // prevent going below 0 (optional)
        count--;
        numberSpan.textContent = count;
    }
});

// Increase
plusBtn.addEventListener("click", () => {
    count++;
    numberSpan.textContent = count;
});





document.getElementById("product-add-1").addEventListener("click", function (e) {


})