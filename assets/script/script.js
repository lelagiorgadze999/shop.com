const mensClothing = document.querySelector(".mens_clothing");
const highRated = document.querySelector(".high-rated");
const jewelery = document.querySelector(".jewelery");
const electronics = document.querySelector(".electronics");
const womensClothing = document.querySelector(".womens_clothing");
const addCart = document.querySelectorAll(".add_cart");
const cartLength = document.querySelector(".circle");

let cartQuentity = "";
const updateQuentity = () => {
  cartLength.classList.remove("hidden");
  cartLength.textContent = cartQuentity;
};
const filteredProducts = (arr, section, filter) => {
  let template = "";
  const filtered = arr.filter(filter);
  filtered.forEach((item) => {
    template += `<div class="card">
        <img src =${item.image}>
        <h2>${item.title}</h2>
        <p class="rating">${"⭐".repeat(item.rating.rate)}</p>
         <p>${item.price}$</p>
         <div>
         </div>
        </div>`;
  });
  section.innerHTML = template;
};

const asyncfiltered = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    filteredProducts(data, highRated, (item) => item.rating.rate > 4);
    filteredProducts(
      data,
      mensClothing,
      (item) => item.category === "men's clothing"
    );
    filteredProducts(data, jewelery, (item) => item.category === "jewelery");
    filteredProducts(
      data,
      electronics,
      (item) => item.category === "electronics"
    );
    filteredProducts(
      data,
      womensClothing,
      (item) => item.category === "women's clothing"
    );
  } catch (err) {
    console.log("შეცდომა:" + err);
  }
};
asyncfiltered();
