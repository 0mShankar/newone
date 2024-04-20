document.addEventListener('DOMContentLoaded', function () {
    const loader = document.createElement('div');
    loader.classList.add('loader');
    document.body.appendChild(loader);

    const productContainer = document.querySelector('.product-container');
    const buttons = document.querySelectorAll('.button');
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');

    

    let currentCategory = null;

    function showLoader() {
        loader.style.display = 'block';
    }

    function hideLoader() {
        loader.style.display = 'none';
    }

    fetchAndRenderProducts();

    function fetchAndRenderProducts() {
        showLoader();
        fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
            .then(response => response.json())
            .then(data => {
                const categories = data.categories;

                categories.forEach(category => {
                    renderCategory(category);
                });

                showCategoryData(currentCategory);

                hideLoader();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                hideLoader();
            });
    }

    function renderCategory(category) {
        const categoryName = category.category_name;
        const categoryProducts = category.category_products;

        const productCardContainer = document.createElement('div');
        productCardContainer.classList.add('product-card-container');
        productCardContainer.dataset.category = categoryName.toLowerCase();

        categoryProducts.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');

            const imageContainer = document.createElement('div');
            imageContainer.classList.add('product-image-container');

            const image = document.createElement('img');
            image.src = product.image;
            image.classList.add('product-image');
            imageContainer.appendChild(image);

            if (product.badge_text) {
                const badge = document.createElement('div');
                badge.classList.add('product-badge');
                badge.textContent = product.badge_text;
                imageContainer.appendChild(badge);
            }

            const details = document.createElement('div');
            details.classList.add('product-details');

            const title = document.createElement('h4');
            title.classList.add('product-title');
            const trimmedTitle = product.title.length > 10 ? product.title.substring(0, 10) + '...' : product.title;
            title.innerHTML = `${trimmedTitle} <br><span class="product-vendor">Vendor: ${product.vendor}</span>`;
            details.appendChild(title);

            title.addEventListener('click', function () {
                const currentTitle = this.innerHTML;
                const fullTitle = product.title + ` <span class="product-vendor">Vendor: ${product.vendor}</span>`;
                this.innerHTML = currentTitle === fullTitle ? trimmedTitle : fullTitle;
            });

            const price = document.createElement('p');
            price.classList.add('product-price');
            const discountPercent = Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100);

            price.innerHTML = `Rs ${product.price} <del class="old-price">${product.compare_at_price}</del><span class="discount">${discountPercent}% off</span>`;
            details.appendChild(price);

            const addToCartButton = document.createElement('button');
            addToCartButton.classList.add('add-to-cart-button');
            addToCartButton.textContent = 'Add to Cart';
            details.appendChild(addToCartButton);

            card.appendChild(imageContainer);
            card.appendChild(details);
            productCardContainer.appendChild(card);
        });

        productContainer.appendChild(productCardContainer);
    }

    function showCategoryData(category) {
        showLoader();
        const productCardContainers = document.querySelectorAll('.product-card-container');

        productCardContainers.forEach(container => {
            if (!category || container.dataset.category === category) {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
            }
        });

        hideLoader();
    }

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            showLoader();
            const category = this.dataset.category.toLowerCase();

            if (currentCategory === category) {
                currentCategory = null;
            } else {
                currentCategory = category;
            }

            buttons.forEach(btn => {
                btn.classList.remove('selected');
            });

            if (currentCategory) {
                this.classList.add('selected');
            }

            showCategoryData(currentCategory);
        });
    });
    
    searchButton.addEventListener('click', function () {
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (searchTerm !== '') {
            showLoader();

            // Filter and display products based on the search term
            const productCards = document.querySelectorAll('.product-card');

            productCards.forEach(card => {
                const title = card.querySelector('.product-title').textContent.toLowerCase();
                const vendor = card.querySelector('.product-vendor').textContent.toLowerCase();
                const cardMatches = title.includes(searchTerm) || vendor.includes(searchTerm);
                card.style.display = cardMatches ? 'block' : 'none';
                
            });

            hideLoader();
        }
    });
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim().toLowerCase();
    
        if (searchTerm === '') {
            showAllProducts();
        }
    });

    searchInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
    
        if (searchTerm !== '') {
            showLoader();
    
            // Filter and display products based on the search term
            const productCards = document.querySelectorAll('.product-card');
    
            productCards.forEach(card => {
                const title = card.querySelector('.product-title').textContent.toLowerCase();
                const vendor = card.querySelector('.product-vendor').textContent.toLowerCase();
                const cardMatches = title.includes(searchTerm) || vendor.includes(searchTerm);
                card.style.display = cardMatches ? 'block' : 'none';
            });
    
            hideLoader();
        } else {
            showAllProducts();
        }
    }
    
    function showAllProducts() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.style.display = 'block';
        });
    }


    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            document.querySelectorAll('.product-card-container').forEach(container => container.remove());

            fetchAndRenderProducts();
        }, 200);
    });
});
