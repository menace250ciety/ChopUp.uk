document.addEventListener("DOMContentLoaded", () => {
    const accountDropdown = document.getElementById("accountDropdown");

    // Simulated login state (true if user is logged in, false otherwise)
    const isLoggedIn = false; // Change to true to simulate a logged-in user

    if (isLoggedIn) {
        // Show Account dropdown
        accountDropdown.innerHTML = `
            <div class="dropdown">
                <button class="btn-secondary dropdown-toggle"><i class="fas fa-user"></i> Account</button>
                <div class="dropdown-menu">
                    <a href="profile.html">Profile</a>
                    <a href="#" id="logout">Logout</a>
                </div>
            </div>
        `;
        // Handle logout action
        document.getElementById("logout").addEventListener("click", () => {
            alert("Logged out successfully!");
            // Simulate logout by refreshing the page or redirecting
            location.reload();
        });
    } else {
        // Show Login/Create Account dropdown
        accountDropdown.innerHTML = `
            <div class="dropdown">
                <button class="btn-secondary dropdown-toggle"><i class="fas fa-user"></i> Login</button>
                <div class="dropdown-menu">
                    <a href="login.html">Login</a>
                    <a href="create-account.html">Create Account</a>
                </div>
            </div>
        `;
    }
    // Cart Functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const countElements = document.querySelectorAll('.cart-count');
    countElements.forEach(el => {
        el.textContent = cart.length;
    });
}

function renderCartItems() {
    const container = document.querySelector('.cart-items-container');
    const emptyCart = document.querySelector('.empty-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cart.length === 0) {
        container.innerHTML = '';
        container.appendChild(emptyCart);
        checkoutBtn.disabled = true;
        return;
    }
    
    emptyCart.remove();
    checkoutBtn.disabled = false;
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>${item.price}</p>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="decrement"><i class="fas fa-minus"></i></button>
                    <span class="quantity">1</span>
                    <button class="increment"><i class="fas fa-plus"></i></button>
                </div>
                <button class="remove-item">Remove</button>
            </div>
        </div>
    `).join('');
    
    updateCartTotal();
    setupCartEventListeners();
}

function updateCartTotal() {
    const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price.replace('£', '')), 0);
    const deliveryFee = 3.99;
    const total = subtotal + deliveryFee;
    
    document.getElementById('subtotal').textContent = `£${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `£${total.toFixed(2)}`;
}

function setupCartEventListeners() {
    // Remove items
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.closest('.cart-item').dataset.id;
            cart = cart.filter(item => item.id !== itemId);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
            updateCartCount();
        });
    });
    
    // Quantity controls
    document.querySelectorAll('.increment').forEach(btn => {
        btn.addEventListener('click', function() {
            // Implement quantity increase
        });
    });
    
    document.querySelectorAll('.decrement').forEach(btn => {
        btn.addEventListener('click', function() {
            // Implement quantity decrease
        });
    });
    
    // Delivery options
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.option-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', function() {
        document.querySelector('.cart-items-section').style.display = 'none';
        document.querySelector('.checkout-summary').style.display = 'none';
        document.querySelector('.delivery-form-section').style.display = 'block';
    });
    
    // Back to cart button
    document.getElementById('back-to-cart').addEventListener('click', function() {
        document.querySelector('.cart-items-section').style.display = 'block';
        document.querySelector('.checkout-summary').style.display = 'block';
        document.querySelector('.delivery-form-section').style.display = 'none';
    });
    
    // Postcode validation
    document.getElementById('postcode-check').addEventListener('click', function() {
        const postcode = document.getElementById('postcode').value;
        if (validateUKPostcode(postcode)) {
            alert('Delivery available in your area!');
        } else {
            alert('Please enter a valid UK postcode');
        }
    });
}

function validateUKPostcode(postcode) {
    const regex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    return regex.test(postcode);
}

// Initialize
if (document.querySelector('.checkout-container')) {
    updateCartCount();
    renderCartItems();
}

});
// Checkout Progress Management
document.addEventListener("DOMContentLoaded", function() {
    // Initialize cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
    
    // Set current step (1 = Cart, 2 = Delivery, 3 = Payment)
    const currentStep = 1;
    
    // Highlight progress steps
    document.querySelectorAll('.checkout-progress .step').forEach((step, index) => {
        if (index < currentStep - 1) {
            step.classList.add('completed');
            step.querySelector('span').innerHTML = '<i class="fas fa-check"></i>';
        }
        if (index === currentStep - 1) {
            step.classList.add('active');
        }
    });
    
    // Mobile progress text
    const totalSteps = 3;
    document.querySelector('.progress-text').textContent = 
        `Step ${currentStep} of ${totalSteps} - ${document.querySelector(`.step[data-step="${currentStep}"] p`).textContent}`;
    
    // Render cart items
    renderCartItems();
    
    // Continue button functionality
    document.getElementById('continue-btn').addEventListener('click', function() {
        window.location.href = "delivery.html"; // Next step
    });
});

function renderCartItems() {
    const cartContainer = document.querySelector('.cart-items');
    const emptyCart = document.querySelector('.empty-cart');
    const continueBtn = document.getElementById('continue-btn');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '';
        cartContainer.appendChild(emptyCart);
        continueBtn.disabled = true;
        return;
    }
    
    emptyCart.remove();
    continueBtn.disabled = false;
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="price">${item.price}</p>
                <div class="quantity-control">
                    <button class="qty-btn minus"><i class="fas fa-minus"></i></button>
                    <span class="quantity">1</span>
                    <button class="qty-btn plus"><i class="fas fa-plus"></i></button>
                </div>
            </div>
            <button class="remove-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', removeItem);
    });
    
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', adjustQuantity);
    });
    
    updateOrderSummary();
}

function updateOrderSummary() {
    const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price.replace('£', '')), 0);
    const deliveryFee = 3.99;
    const total = subtotal + deliveryFee;
    
    document.querySelector('.summary-row:nth-child(1) .price').textContent = `£${subtotal.toFixed(2)}`;
    document.querySelector('.summary-row.total .price').textContent = `£${total.toFixed(2)}`;
}

function updateCartCount() {
    const count = cart.length;
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
    });
}

// Mobile Menu Toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('show');
});

// Initialize Cart Count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = cart.length;
    });
}

// Animate Dish Cards on Scroll
function animateOnScroll() {
    const dishes = document.querySelectorAll('.dish-card');
    dishes.forEach((dish, index) => {
        if (isElementInViewport(dish)) {
            setTimeout(() => {
                dish.style.opacity = '1';
                dish.style.transform = 'translateY(0)';
            }, index * 200);
        }
    });
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    );
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Set initial state for animation
    document.querySelectorAll('.dish-card').forEach(dish => {
        dish.style.opacity = '0';
        dish.style.transform = 'translateY(20px)';
        dish.style.transition = 'all 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
});

// Add to Cart from Featured Dishes
document.querySelectorAll('.btn-small').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const dishCard = this.closest('.dish-card');
        const dishName = dishCard.querySelector('h3').textContent;
        const dishPrice = dishCard.querySelector('.price').textContent;
        const dishImage = dishCard.querySelector('img').src;
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({
            name: dishName,
            price: dishPrice,
            image: dishImage,
            quantity: 1
        });
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Visual feedback
        this.textContent = 'Added!';
        setTimeout(() => {
            this.textContent = 'Add to Cart';
        }, 2000);
    });
});


// Create this new file in js/delivery.js
document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('deliveryMap').setView([51.505, -0.09], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);
  
    // Mock delivery zone (replace with your actual service area)
    const deliveryZone = L.circle([51.505, -0.09], {
      color: '#E67E22',
      fillColor: '#f39c12',
      fillOpacity: 0.3,
      radius: 5000
    }).addTo(map);
  
    document.getElementById('checkPostcode').addEventListener('click', checkPostcode);
    document.getElementById('locateMe').addEventListener('click', locateUser);
  
    function checkPostcode() {
      const postcode = document.getElementById('postcodeInput').value.trim();
      const resultEl = document.getElementById('deliveryResult');
      
      if (!validatePostcode(postcode)) {
        showResult('Please enter a valid UK postcode', false);
        return;
      }
      
      // Simulate API check
      setTimeout(() => {
        const canDeliver = checkDeliveryZone(postcode);
        showResult(
          canDeliver 
            ? `✅ We deliver to ${postcode}! <a href="menu.html">Order Now</a>`
            : "⚠️ Currently not serving this area",
          canDeliver
        );
        
        if (canDeliver) {
          map.flyTo([51.505, -0.09], 14);
        }
      }, 800);
    }
  
    function locateUser() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const userLocation = [position.coords.latitude, position.coords.longitude];
            const distance = map.distance(userLocation, [51.505, -0.09]);
            const canDeliver = distance <= 5000; // 5km radius
            
            map.flyTo(userLocation, 15);
            L.marker(userLocation).addTo(map)
              .bindPopup(`You are here (${canDeliver ? 'In' : 'Outside'} delivery zone)`);
            
            showResult(
              canDeliver
                ? "✅ We can deliver to your location!"
                : "⚠️ Outside delivery range",
              canDeliver
            );
          },
          error => {
            showResult("Location access denied. Please enter postcode.", false);
          }
        );
      } else {
        showResult("Geolocation not supported. Please enter postcode.", false);
      }
    }
  
    function validatePostcode(postcode) {
      return /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(postcode);
    }
  
    function checkDeliveryZone(postcode) {
      const londonAreas = ['SW', 'SE', 'NW', 'N', 'E', 'W', 'WC', 'EC'];
      const area = postcode.match(/^[A-Z]+/)?.[0];
      return londonAreas.includes(area);
    }
  
    function showResult(message, isSuccess) {
      const resultEl = document.getElementById('deliveryResult');
      resultEl.innerHTML = message;
      resultEl.className = `delivery-result ${isSuccess ? 'success' : 'error'}`;
    }
  });

function updateBreadcrumbs() {
    document.querySelector('.breadcrumbs').innerHTML = `
      <a href="/">Home</a> > 
      <a href="/nigerian-food">Nigerian Food</a> > 
      <span>Current Page</span>
    `;
  }
 
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure critical content loads even if JS fails
    const lazySections = document.querySelectorAll('.lazy-section');
    lazySections.forEach(section => {
      section.innerHTML = section.dataset.seoFallback || '';
    });
  });
  
  function updatePageTitle(newTitle) {
    document.title = `${newTitle} | Chopup Nigerian Food Delivery`;
    // Push to history for SEO
    history.replaceState({}, '', window.location.href);
  }

  // Deals Page Functionality
document.addEventListener("DOMContentLoaded", function() {
    // Countdown Timer for Mama's Special
    function updateCountdown() {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 2); // 2 days from now
        
        const timer = setInterval(function() {
            const now = new Date().getTime();
            const distance = endDate - now;
            
            if (distance < 0) {
                clearInterval(timer);
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        }, 1000);
    }

    // Add to Cart Functionality
    function setupAddToCart() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const dealCard = this.closest('.deal-card');
                const dealId = dealCard.dataset.dealId;
                const dealName = dealCard.querySelector('h3').textContent;
                const dealPrice = dealCard.querySelector('.new-price').textContent;
                
                // Add to cart logic
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart.push({
                    id: dealId,
                    name: dealName,
                    price: dealPrice,
                    isDeal: true
                });
                
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                
                // Visual feedback
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Added!';
                this.style.backgroundColor = '#2ECC71';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.backgroundColor = '';
                }, 2000);
            });
        });
        
        // Special add to cart button
        document.getElementById('add-to-cart-special').addEventListener('click', function() {
            // Similar logic for the special deal
        });
    }

    // Nutrition Modal
    function setupNutritionModal() {
        const modal = document.getElementById('nutrition-modal');
        const closeBtn = document.querySelector('.close-modal');
        const nutritionLinks = document.querySelectorAll('[href="#nutrition"]');
        
        nutritionLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });
        
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
        
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    // Deal Subscription Form
    function setupSubscriptionForm() {
        const form = document.getElementById('deal-subscription-form');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            
            // In a real implementation, send to your backend
            alert(`Thanks for subscribing! A confirmation has been sent to ${email}`);
            this.reset();
        });
    }

    // Initialize all functionality
    updateCountdown();
    setupAddToCart();
    setupNutritionModal();
    setupSubscriptionForm();
});

document.addEventListener("DOMContentLoaded", function() {
    // DOM Elements
    const searchInput = document.getElementById('menu-search');
    const clearSearch = document.getElementById('clear-search');
    const filterBtn = document.querySelector('.filter-btn');
    const filterOptions = document.querySelector('.filter-options');
    const applyFilters = document.getElementById('apply-filters');
    const resetFilters = document.getElementById('reset-filters');
    const resetAll = document.getElementById('reset-all');
    const menuItems = document.querySelectorAll('.menu-card');
    const menuSections = document.querySelectorAll('.menu-section');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('filter-results');
    
    // Toggle filter dropdown on mobile
    filterBtn.addEventListener('click', function() {
        filterOptions.classList.toggle('show');
    });
    
    // Clear search input
    clearSearch.addEventListener('click', function() {
        searchInput.value = '';
        filterMenuItems();
    });
    
    // Apply filters
    applyFilters.addEventListener('click', function() {
        filterMenuItems();
        filterOptions.classList.remove('show');
    });
    
    // Reset all filters
    resetFilters.addEventListener('click', resetAllFilters);
    resetAll.addEventListener('click', resetAllFilters);
    
    // Real-time search
    searchInput.addEventListener('input', filterMenuItems);
    
    // Filter function
    function filterMenuItems() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
        const selectedPrices = Array.from(document.querySelectorAll('input[name="price"]:checked')).map(cb => cb.value);
        
        let visibleItems = 0;
        let visibleSections = 0;
        
        menuSections.forEach(section => {
            const category = section.dataset.category;
            let sectionVisible = false;
            let sectionItems = 0;
            
            // Filter by category
            if (selectedCategories.includes(category)) {
                const cards = section.querySelectorAll('.menu-card');
                
                cards.forEach(card => {
                    const price = parseInt(card.dataset.price);
                    const title = card.querySelector('h4').textContent.toLowerCase();
                    const description = card.querySelector('.description').textContent.toLowerCase();
                    
                    // Filter by price range
                    let priceMatch = false;
                    selectedPrices.forEach(range => {
                        const [min, max] = range.split('-').map(Number);
                        if (max && price >= min && price <= max) priceMatch = true;
                        else if (!max && price >= min) priceMatch = true;
                    });
                    
                    // Filter by search term
                    const searchMatch = searchTerm === '' || 
                                      title.includes(searchTerm) || 
                                      description.includes(searchTerm);
                    
                    if (priceMatch && searchMatch) {
                        card.style.display = 'flex';
                        visibleItems++;
                        sectionItems++;
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                if (sectionItems > 0) {
                    section.style.display = 'block';
                    visibleSections++;
                } else {
                    section.style.display = 'none';
                }
            } else {
                section.style.display = 'none';
            }
        });
        
        // Update results count
        if (visibleItems === 0) {
            noResults.style.display = 'flex';
            resultsCount.textContent = 'No dishes found';
        } else {
            noResults.style.display = 'none';
            resultsCount.textContent = `${visibleItems} dishes in ${visibleSections} categories`;
        }
    }
    
    // Reset all filters
    function resetAllFilters() {
        // Reset checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = true;
        });
        
        // Reset search
        searchInput.value = '';
        
        // Apply reset
        filterMenuItems();
    }
    
    // Initialize
    filterMenuItems();
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.menu-card');
            const itemName = card.querySelector('h4').textContent;
            const itemPrice = card.querySelector('.price').textContent;
            
            // Add to cart logic
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push({
                name: itemName,
                price: itemPrice,
                image: card.querySelector('img').src
            });
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count
            updateCartCount();
            
            // Visual feedback
            this.textContent = 'Added!';
            this.style.backgroundColor = '#2ECC71';
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.backgroundColor = '';
            }, 2000);
        });
    });
    
    // Update cart count
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = cart.length;
        });
    }
    
    // Mobile menu toggle
    document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
        document.querySelector('.nav-links').classList.toggle('show');
    });
});
// Current mobile menu doesn't close after selection
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.remove('show');
    });
  });
  document.addEventListener('DOMContentLoaded', function() {
    // Get current page filename (e.g., "index.html" or "menu.html")
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Select all navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Loop through each link and add 'active' class if it matches current page
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
            
            // Also highlight the cart link if on checkout page
            if (currentPage === 'checkout.html') {
                document.querySelector('.cart-link').classList.add('active');
            }
        }
    });
});