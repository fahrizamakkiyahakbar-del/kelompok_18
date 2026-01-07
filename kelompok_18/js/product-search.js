document.addEventListener('DOMContentLoaded', function() {
    // Only run on the products page
    if (!document.getElementById('productContainer')) return;

    const productContainer = document.getElementById('productContainer');
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    const searchForm = document.getElementById('globalSearchForm');
    const searchInput = document.getElementById('globalSearchInput');
    
    // Store original product cards HTML for reset
    const originalProductsHTML = productContainer.innerHTML;

    // Function to get URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Function to filter products
    function filterProducts(searchTerm) {
        // Update the search input value
        if (searchInput) {
            searchInput.value = searchTerm;
        }

        if (!searchTerm.trim()) {
            // If search is empty, show all products
            productContainer.innerHTML = originalProductsHTML;
            return;
        }

        const searchLower = searchTerm.toLowerCase();
        const filteredProducts = [];

        // Filter products
        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            const description = card.querySelector('.product-description').textContent.toLowerCase();
            if (title.includes(searchLower) || description.includes(searchLower)) {
                filteredProducts.push(card.outerHTML);
            }
        });

        // Update the URL with search parameter
        const newUrl = window.location.pathname + (searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '');
        window.history.pushState({ path: newUrl }, '', newUrl);

        // Update the product display
        if (filteredProducts.length > 0) {
            productContainer.innerHTML = filteredProducts.join('');
        } else {
            productContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-search display-1 text-muted"></i>
                    <h4 class="mt-3">Produk tidak ditemukan</h4>
                    <p class="text-muted">Coba dengan kata kunci lain</p>
                </div>`;
        }
    }

    // Handle form submission
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = searchInput ? searchInput.value.trim() : '';
            if (searchTerm) {
                window.location.href = `project.html?search=${encodeURIComponent(searchTerm)}`;
            } else {
                window.location.href = 'project.html';
            }
        });
    }

    // Check for search parameter on page load
    const searchParam = getUrlParameter('search');
    if (searchParam) {
        filterProducts(searchParam);
    }
});
