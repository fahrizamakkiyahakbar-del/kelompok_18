// Create navbar HTML
const navbarHTML = `
<nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top">
    <div class="container">
        <a class="navbar-brand" href="Beranda_HW.html">
            <span class="text-primary">Health</span><span class="text-danger">Web</span>
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link" href="Beranda_HW.html" id="nav-beranda">Beranda</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="project.html" id="nav-produk">Produk</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="kontak.html" id="nav-kontak">Kontak</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="promo2.html" id="nav-promo">Promo</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="trending.html" id="nav-trending">Trending</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="ulasan.html" id="nav-ulasan">Ulasan</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="notifikasi.html" id="nav-notifikasi">Notifikasi</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="Metode_pembayaran.html" id="nav-pembayaran">Pembayaran</a>
                </li>
            </ul>
            
            <!-- Search Box -->
            <div class="d-flex align-items-center">
                <div class="search-box me-3 d-none d-md-block">
                    <i class="bi bi-search search-icon"></i>
                    <input type="text" class="form-control search-input" placeholder="Cari produk...">
                </div>
                
                <!-- Cart Button -->
                <div class="position-relative me-2">
                    <a href="cart.html" class="btn btn-outline-danger position-relative">
                            <i class="bi bi-cart3"></i>
                            <span class="cart-count position-absolute">
                            </span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</nav>
`;

// Function to set active link based on current page
function setActiveNavLink() {
  const currentPage =
    window.location.pathname.split("/").pop() || "Beranda_HW.html";
  const navLinks = {
    "Beranda_HW.html": "nav-beranda",
    "project.html": "nav-produk",
    "kontak.html": "nav-kontak",
    "promo2.html": "nav-promo",
    "trending.html": "nav-trending",
    "ulasan.html": "nav-ulasan",
    "notifikasi.html": "nav-notifikasi",
    "Metode_pembayaran.html": "nav-pembayaran",
  };

  // Remove active class from all nav items
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });

  // Add active class to current page nav item
  const activeNavId = navLinks[currentPage];
  if (activeNavId) {
    const activeNav = document.getElementById(activeNavId);
    if (activeNav) {
      activeNav.classList.add("active");
    }
  }
}

// Function to initialize the navbar
document.addEventListener("DOMContentLoaded", function () {
  // Insert navbar at the beginning of the body
  document.body.insertAdjacentHTML("afterbegin", navbarHTML);

  // Set active nav link
  setActiveNavLink();

  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

// Cart functionality
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );
  const cartCount = document.querySelector(".cart-count");
  if (cartCount) {
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? "flex" : "none";
  }
}

// Initialize cart count when navbar is loaded
document.addEventListener("DOMContentLoaded", updateCartCount);