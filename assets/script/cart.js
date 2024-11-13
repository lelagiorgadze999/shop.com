// Function to retrieve cart items from localStorage
const getCartItems = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

// Function to fetch product data by ID
const fetchProductData = async (productId) => {
  try {
    const response = await fetch(
      `https://fakestoreapi.com/products/${productId}`
    );
    return response.ok ? await response.json() : null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

// Function to update total price in the cart
const updateTotalPrice = (cartItems) => {
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  document.querySelector(
    ".total-price"
  ).textContent = `ჯამში: $${totalPrice.toFixed(2)}`;
};

// Function to render cart items on the page
const renderCartItems = async () => {
  const cartItemsContainer = document.querySelector(".cart-box");
  const cartItems = getCartItems();
  // Clear previous cart content
  cartItemsContainer.innerHTML = "";

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = "<p>კალათა ცარიელია</p>";
    cartItemsContainer.style.textAlign = "center";
    document.querySelector(".total-price").textContent = "ჯამში: $0.00";
    return;
  }

  let template = "";
  const cartItemsWithDetails = await Promise.all(
    cartItems.map(async (item) => {
      const product = await fetchProductData(item.id);
      return product ? { ...item, ...product } : null;
    })
  );

  cartItemsWithDetails.forEach((item) => {
    if (item) {
      const itemTotal = item.price * item.quantity;
      template += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.title}" class="cart-item-image">
          <div class="cart-item-info">
            <h2>${item.title}</h2>
            <p>Quantity: ${item.quantity}</p>
            <p>Price per unit: $${item.price}</p>
            <p>Total: $${itemTotal.toFixed(2)}</p>
            <button class="remove-item" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `;
    }
  });

  // Insert all items' HTML into the cart container
  cartItemsContainer.innerHTML = template;

  // Update the total price
  updateTotalPrice(cartItemsWithDetails.filter((item) => item));

  // Add event listeners to "remove" buttons
  cartItemsContainer.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.target.getAttribute("data-id");
      removeFromCart(productId);
    });
  });
};

// Function to remove item from cart
const removeFromCart = (productId) => {
  let cart = getCartItems();
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));

  renderCartItems(); // Re-render cart after removing item
};

// Initialize cart on page load
renderCartItems();
