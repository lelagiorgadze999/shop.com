// DOM elements
const allProduct = document.querySelector("#all-product");
const cartLength = document.querySelector(".circle");

let cartQuantity = 0;

// update cart quantity
const updateQuantity = () => {
  cartLength.classList.remove("hidden");
  cartLength.textContent = cartQuantity;
};

//add product to cart in localStorage
const addToCart = (productId, quantity) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingProduct = cart.find((item) => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity });
  }

  // save the updated cart localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Function to create product HTML
const createProductHTML = (item) => {
  return `
    <div class="card">
      <img src="${item.image}" alt="${item.title}">
      <h2>${item.title}</h2>
      <p class="rating">${"⭐".repeat(item.rating.rate)} ${item.rating.rate}</p>
      <p>$${item.price}</p>
      <div>
        <button class="add_cart" data-id="${item.id}">add to cart</button>
        <button class="details" data-id="${item.id}">details</button>
      </div>
    </div>`;
};

// render products
const renderProducts = (arr) => {
  allProduct.innerHTML = arr.map(createProductHTML).join("");

  // Event listeners for 'details' buttons
  document.querySelectorAll(".details").forEach((button) => {
    button.addEventListener("click", () => openModal(button.dataset.id));
  });

  // Event listeners for 'add to cart' buttons
  document.querySelectorAll(".add_cart").forEach((button) => {
    let count = 0;
    button.addEventListener("click", () => handleAddToCart(button, count));
  });
};

// Function to handle 'add to cart' button click
const handleAddToCart = (button, count) => {
  const productId = button.getAttribute("data-id");

  count++;
  button.innerHTML = `
    <div class="minus-add">
      <button class="minus">-</button>
      <span class="count">${count}</span>
      <button class="add">+</button>
    </div>
  `;

  cartQuantity++;
  updateQuantity();
  addToCart(productId, count);

  const minusButton = button.querySelector(".minus");
  const addButton = button.querySelector(".add");
  const countSpan = button.querySelector(".count");

  addButton.addEventListener("click", (event) =>
    updateProductCount(event, countSpan, count++, productId)
  );
  minusButton.addEventListener("click", (event) =>
    updateProductCount(event, countSpan, count--, productId)
  );
};

// Function to update the product count and update cart
const updateProductCount = (event, countSpan, count, productId) => {
  event.stopPropagation();
  countSpan.textContent = count;
  cartQuantity += count > 0 ? 1 : -1;
  updateQuantity();
  addToCart(productId, count);
};

// Function to open modal with product details
const openModal = async (productId) => {
  try {
    const response = await fetch(
      `https://fakestoreapi.com/products/${productId}`
    );
    const product = await response.json();

    // Update modal content
    document.querySelector(".modalImage").src = product.image;
    document.querySelector(".modalTitle").textContent = product.title;
    document.querySelector(
      ".modalRating"
    ).textContent = `Rating: ${product.rating.rate}`;
    document.querySelector(
      ".modalPrice"
    ).textContent = `Price: $${product.price}`;
    document.querySelector(".modalDescription").textContent =
      product.description;

    // Show modal and overlay
    document.querySelector(".s-modal").classList.remove("hidden");
    document.querySelector(".overlay").classList.remove("hidden");
  } catch (error) {
    console.error("Error fetching product:", error);
  }
};

// Function to close modal
const closeModal = () => {
  document.querySelector(".s-modal").classList.add("hidden");
  document.querySelector(".overlay").classList.add("hidden");
};

// Close modal when overlay is clicked or 'Escape' key is pressed
document.querySelector(".overlay").addEventListener("click", closeModal);
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeModal();
});

// Fetch and render products
const asyncProduct = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    renderProducts(data);
  } catch (err) {
    console.log(err);
  }
};

asyncProduct();
