/* ===============================
   KERANJANG BELANJA
================================ */

// Update the cart functionality
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsEl =
  document.querySelector(".cart-items") || document.getElementById("cartItems");
const totalPriceEl =
  document.querySelector(".total-price") ||
  document.getElementById("totalPrice");

// Function to add product to cart
function addToCart(productName, price, image = "") {
  // Clean price (remove 'Rp ' and any dots, then convert to number)
  const cleanPrice =
    typeof price === "string" ? parseInt(price.replace(/[^0-9]/g, "")) : price;

  // Check if product already in cart
  const existingItem = cart.find((item) => item.name === productName);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      name: productName,
      price: cleanPrice,
      image: image,
      qty: 1,
    });
  }

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update cart display
  updateCartCount();

  // Show notification
  showNotification(`"${productName}" telah ditambahkan ke keranjang!`);

  // Update cart display if on cart page
  if (cartItemsEl) {
    renderCart();
  }

  return cart;
}

// Function to show notification
function showNotification(message) {
  // Create notification element if it doesn't exist
  let notification = document.querySelector(".notification-toast");
  if (!notification) {
    notification = document.createElement("div");
    notification.className = "notification-toast";
    document.body.appendChild(notification);
  }

  // Set notification content and show
  notification.textContent = message;
  notification.classList.add("show");

  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// Update cart count function
function updateCartCount() {
  const cartCounts = document.querySelectorAll(".cart-count");
  if (cartCounts.length > 0) {
    const totalItems = cart.reduce((total, item) => total + item.qty, 0);
    cartCounts.forEach((counter) => {
      counter.textContent = totalItems;
      // Show/hide badge based on cart items
      if (totalItems > 0) {
        counter.classList.add("show");
      } else {
        counter.classList.remove("show");
      }
    });
  }
}

// Render cart function
function renderCart() {
  if (!cartItemsEl) return; // Only run on cart page

  cartItemsEl.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
            <div class="text-center py-4">
                <i class="bi bi-cart-x display-4 text-muted mb-3"></i>
                <p class="text-muted mb-0">Keranjang belanja Anda masih kosong</p>
                <a href="project.html" class="btn btn-primary mt-3">Lanjutkan Belanja</a>
            </div>`;
    if (totalPriceEl) totalPriceEl.textContent = "Rp 0";
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    cartItemsEl.innerHTML += `
            <div class="d-flex align-items-center mb-3 border-bottom pb-3">
                <img src="${
                  item.image || "https://via.placeholder.com/80"
                }" width="80" class="rounded me-3" alt="${item.name}">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.name}</h6>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary me-2" onclick="updateQuantity(${index}, -1)">-</button>
                        <span class="me-2">${item.qty}</span>
                        <button class="btn btn-sm btn-outline-secondary me-3" onclick="updateQuantity(${index}, 1)">+</button>
                        <small class="text-muted">
                            Rp ${item.price.toLocaleString("id-ID")} x ${
      item.qty
    } = 
                            <strong>Rp ${itemTotal.toLocaleString(
                              "id-ID"
                            )}</strong>
                        </small>
                    </div>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
  });

  // Update total price display
  if (totalPriceEl) {
    totalPriceEl.textContent = "Rp " + total.toLocaleString("id-ID");
  }

  // Update cart count in navigation
  updateCartCount();
}

// Function to update item quantity
function updateQuantity(index, change) {
  if (index >= 0 && index < cart.length) {
    cart[index].qty += change;

    // Remove item if quantity is 0 or less
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }

    // Save to localStorage and update display
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
  }
}

// Function to remove item from cart
function removeItem(index) {
  if (index >= 0 && index < cart.length) {
    const itemName = cart[index].name;
    cart.splice(index, 1);

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update display
    renderCart();
    updateCartCount();

    // Show notification
    showNotification(`"${itemName}" telah dihapus dari keranjang`);
  }
}

// Initialize cart when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Initialize cart
  updateCartCount();
  if (cartItemsEl) {
    renderCart();
  }

  // Add click event to all "Tambah ke Keranjang" buttons
  document.addEventListener("click", function (e) {
    const addToCartBtn = e.target.closest(".btn-primary");

    if (
      addToCartBtn &&
      (addToCartBtn.textContent.includes("Tambah ke Keranjang") ||
        addToCartBtn.querySelector("i.bi-cart-plus"))
    ) {
      const productCard = addToCartBtn.closest(".product-card, .card");
      if (!productCard) return;

      // Get product details
      const productName =
        productCard
          .querySelector(".product-title, .card-title")
          ?.textContent.trim() || "Produk";
      const priceText =
        productCard
          .querySelector(".product-price, .text-danger")
          ?.textContent.trim() || "0";
      const productImage = productCard.querySelector("img")?.src || "";

      // Add to cart
      addToCart(productName, priceText, productImage);

      // Visual feedback
      const originalHTML = addToCartBtn.innerHTML;
      addToCartBtn.innerHTML =
        '<i class="bi bi-check-circle me-1"></i> Ditambahkan!';
      addToCartBtn.classList.remove("btn-primary");
      addToCartBtn.classList.add("btn-success");

      // Reset button after 2 seconds
      setTimeout(() => {
        addToCartBtn.innerHTML = originalHTML;
        addToCartBtn.classList.remove("btn-success");
        addToCartBtn.classList.add("btn-primary");
      }, 2000);
    }
  });
});

/* ===============================
   FITUR PENCARIAN
================================ */

// Create a search box if it doesn't exist
function initSearchBox() {
  // Check if search box already exists
  if (!document.querySelector(".search-box")) {
    const searchContainer = document.createElement("div");
    searchContainer.className = "search-box me-3";
    searchContainer.innerHTML = `
            <i class="bi bi-search search-icon"></i>
            <input class="form-control search-input" type="search" placeholder="Cari produk...">
        `;

    // Insert the search box before the cart button
    const cartButton = document.querySelector(".btn-outline-danger");
    if (cartButton) {
      cartButton.parentNode.insertBefore(searchContainer, cartButton);
    }
  }
}

// Function to filter products
function filterProducts(searchTerm) {
  if (!searchTerm.trim()) {
    // If search is empty, show all products
    document.querySelectorAll(".product-card").forEach((card) => {
      card.style.display = "";
    });
    return;
  }

  const searchTermLower = searchTerm.toLowerCase();
  let foundResults = false;

  // Loop through all product cards
  document.querySelectorAll(".product-card").forEach((card) => {
    const title =
      card.querySelector(".card-title")?.textContent?.toLowerCase() || "";
    const description =
      card.querySelector(".card-text")?.textContent?.toLowerCase() || "";

    // Check if search term is in title or description
    if (
      title.includes(searchTermLower) ||
      description.includes(searchTermLower)
    ) {
      card.style.display = "";
      foundResults = true;
    } else {
      card.style.display = "none";
    }
  });

  // Show no results message if needed
  const noResults = document.getElementById("no-results");
  if (!foundResults) {
    if (!noResults) {
      const container = document.querySelector(".container.py-5");
      if (container) {
        const message = document.createElement("div");
        message.id = "no-results";
        message.className = "alert alert-info mt-3";
        message.textContent = "Produk tidak ditemukan. Coba kata kunci lain.";
        container.appendChild(message);
      }
    }
  } else if (noResults) {
    noResults.remove();
  }
}

// Initialize search functionality
function initSearch() {
  // Initialize search box
  initSearchBox();

  // Add event listener to search input
  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      filterProducts(e.target.value);
    });

    // Add event listener for Enter key
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        filterProducts(e.target.value);
      }
    });
  }
}

// Initialize the search when the page loads
document.addEventListener("DOMContentLoaded", () => {
  initSearch();

  // Add click event listeners to all "Add to Cart" buttons
  document.querySelectorAll(".btn-primary").forEach((button) => {
    if (button.textContent.trim().includes("Tambah ke Keranjang")) {
      button.addEventListener("click", function () {
        const card = this.closest(".card");
        const productName =
          card.querySelector(".card-title")?.textContent || "Produk";
        const priceText =
          card.querySelector(".text-danger")?.textContent || "0";
        const price = parseInt(priceText.replace(/[^0-9]/g, "")) || 0;

        addToCart(productName, price);
      });
    }
  });
});

// Function to toggle password visibility
function togglePassword(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("bi-eye");
    icon.classList.add("bi-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("bi-eye-slash");
    icon.classList.add("bi-eye");
  }
}

// Function to handle payment
function pay() {
  // Simple validation
  const method = document.getElementById("method").value;
  if (!method) {
    alert("Silakan pilih metode pembayaran terlebih dahulu");
    return;
  }

  // Show success message
  alert(
    "Pesanan berhasil dikonfirmasi!\nKami akan mengirimkan detail pembayaran ke email Anda.\nTerima kasih sudah berbelanja di HealthWeb!"
  );

  // Optional: Reset form after submission
  // document.querySelector('form').reset();
  // document.getElementById("method").value = "";
  // changeMethod();
}

// Initialize payment functionality when the page loads
document.addEventListener("DOMContentLoaded", function () {
  // Add any initialization code here if needed
});

function like(btn) {
  const count = btn.querySelector("span");
  count.textContent = parseInt(count.textContent) + 1;
  btn.classList.add("liked");
  btn.disabled = true;
}

// Search functionality
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const productCards = document.querySelectorAll(".product-card");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase().trim();

      productCards.forEach((card) => {
        const title = card
          .querySelector(".product-title, .card-title")
          .textContent.toLowerCase();
        const description = card
          .querySelector(".product-description, .card-text")
          .textContent.toLowerCase();

        // Check if search term exists in title or description
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
          card.classList.remove("hidden");

          // Highlight matching text
          highlightText(card, searchTerm);
        } else {
          card.classList.add("hidden");
        }
      });
    });
  }

  // Function to highlight matching text
  function highlightText(element, searchTerm) {
    if (!searchTerm) {
      // Remove all highlights if search is empty
      const highlights = element.querySelectorAll(".highlight");
      highlights.forEach((hl) => {
        const text = hl.textContent;
        hl.replaceWith(text);
      });
      return;
    }

    // Highlight in title
    const titleElement = element.querySelector(".product-title, .card-title");
    if (titleElement) {
      const title = titleElement.textContent;
      const highlightedTitle = title.replace(
        new RegExp(searchTerm, "gi"),
        (match) => `<span class="highlight">${match}</span>`
      );
      titleElement.innerHTML = highlightedTitle;
    }

    // Highlight in description
    const descElement = element.querySelector(
      ".product-description, .card-text"
    );
    if (descElement) {
      const desc = descElement.textContent;
      const highlightedDesc = desc.replace(
        new RegExp(searchTerm, "gi"),
        (match) => `<span class="highlight">${match}</span>`
      );
      descElement.innerHTML = highlightedDesc;
    }
  }
});

// Ganti metode pembayaran
function changeMethod() {
  const selected = document.getElementById("method").value;

  // Semua metode disembunyikan dulu
  document.querySelectorAll(".payment-method").forEach((el) => {
    el.classList.add("hidden");
  });

  // Tampilkan sesuai pilihan
  if (selected) {
    document.getElementById(selected).classList.remove("hidden");
  }
}

// Toggle tampil / sembunyikan password
function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  const icon = button.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    icon.classList.replace("bi-eye", "bi-eye-slash");
  } else {
    input.type = "password";
    icon.classList.replace("bi-eye-slash", "bi-eye");
  }
}

// Simulasi pembayaran
function pay() {
  const method = document.getElementById("method").value;

  if (!method) {
    alert("Silakan pilih metode pembayaran terlebih dahulu.");
    return;
  }

  let message = "";

  switch (method) {
    case "bank":
      message = "Pembayaran melalui Transfer Bank berhasil disimulasikan.";
      break;
    case "ewallet":
      message = "Pembayaran melalui E-Wallet berhasil disimulasikan.";
      break;
    case "cod":
      message = "Pesanan COD berhasil dibuat. Bayar saat barang diterima.";
      break;
  }

  alert(message);
}

