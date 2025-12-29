// main.js - COMPLETE FILE (FIXED)

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initCarCards();     // 1. توليد السيارات أولاً
    initCarFilter();    // 2. ثم الفلترة
    initSorting();      // 3. ثم الترتيب
    initFeaturedCars(); // 4. ثم السيارات المميزة
    initNewsletterForm();
    initSmoothScroll();
    initTestimonialsSlider();
    initContactForm();
    highlightCurrentPage();
    
    console.log("✅ All components initialized");
});

// ===== ALL 8 CARS DATABASE =====
window.carsDatabase = [
    {
        id: 1,
        name: "Tesla Model 3",
        category: "sedan",
        image: "assets/car-images/tesla-model3.jpg",
        range: "455 km",
        acceleration: "3.1 s",
        charge: "250 kW",
        price: "$42,990",
        description: "The Tesla Model 3 redefines the electric sedan, offering an exceptional blend of range, performance, safety, and cutting-edge technology.",
        features: ["Autopilot", "Minimalist Interior", "Over-the-Air Updates", "Panoramic Glass Roof"]
    },
    {
        id: 2,
        name: "BMW iX",
        category: "suv",
        image: "assets/car-images/bmw-ix.jpg",
        range: "630 km",
        acceleration: "4.6 s",
        charge: "200 kW",
        price: "$84,195",
        description: "A bold all-electric SUV with extraordinary range and luxury.",
        features: ["Iconic Sounds Electric", "BMW Curved Display", "Sky Lounge Roof", "Shy Tech"]
    },
    {
        id: 3,
        name: "Audi e-tron",
        category: "suv",
        image: "assets/car-images/audi-etron.jpg",
        range: "400 km",
        acceleration: "5.5 s",
        charge: "150 kW",
        price: "$68,000",
        description: "Premium electric SUV with luxury and quality craftsmanship.",
        features: ["Virtual Mirrors", "Quiet Cabin", "Premium Interior", "All-Wheel Drive"]
    },
    {
        id: 4,
        name: "Mercedes EQS",
        category: "luxury",
        image: "assets/car-images/mercedes-eqs.jpg",
        range: "563 km",
        acceleration: "4.3 s",
        charge: "200 kW",
        price: "$104,400",
        description: "Electric luxury flagship with advanced technology and design.",
        features: ["MBUX Hyperscreen", "Rear-Axle Steering", "Dolby Atmos Sound", "HEPA Filtration"]
    },
    {
        id: 5,
        name: "Ford Mustang Mach-E",
        category: "suv",
        image: "assets/car-images/ford-mustang.jpg",
        range: "490 km",
        acceleration: "3.5 s",
        charge: "150 kW",
        price: "$42,895",
        description: "All-electric SUV capturing the soul of the Mustang.",
        features: ["One-Pedal Driving", "Panoramic Glass Roof", "BlueCruise", "15.5\" Touchscreen"]
    },
    {
        id: 6,
        name: "Porsche Taycan",
        category: "sports",
        image: "assets/car-images/porsche-taycan.jpg",
        range: "452 km",
        acceleration: "2.8 s",
        charge: "270 kW",
        price: "$82,700",
        description: "Electric sports car with performance and Porsche usability.",
        features: ["800-Volt Architecture", "Porsche 4D Chassis", "Porsche Electric Sport Sound", "Regenerative Braking"]
    },
    {
        id: 7,
        name: "Hyundai IONIQ 5",
        category: "suv",
        image: "assets/car-images/hyundai-ioniq5.jpg",
        range: "481 km",
        acceleration: "5.2 s",
        charge: "350 kW",
        price: "$41,450",
        description: "Award-winning electric SUV with retro-futuristic design.",
        features: ["Vehicle-to-Load (V2L)", "Sliding Center Console", "Relaxation Seats", "Pixel Parametric Lights"]
    },
    {
        id: 8,
        name: "Rivian R1T",
        category: "suv",
        image: "assets/car-images/rivian-r1t.jpg",
        range: "505 km",
        acceleration: "3.0 s",
        charge: "210 kW",
        price: "$73,000",
        description: "Electric adventure pickup truck for on and off-road.",
        features: ["Gear Tunnel", "Tank Turn", "Air Suspension", "Camp Kitchen"]
    }
];

console.log("✅ Cars database loaded:", window.carsDatabase.length, "cars");

// ===== MOBILE MENU TOGGLE =====
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// ===== SIMPLE CAR FILTER FUNCTIONALITY =====
function initCarFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length === 0) {
        console.log("⚠️ Filter buttons not found");
        return;
    }
    
    console.log("✅ Found", filterButtons.length, "filter buttons");
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log("🔘 Filter button clicked:", this.getAttribute('data-filter'));
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Get ALL car cards
            const carCards = document.querySelectorAll('.car-card');
            
            if (carCards.length === 0) {
                console.log("❌ No car cards found");
                return;
            }
            
            console.log("🚗 Filtering", carCards.length, "cars by:", filterValue);
            
            // Filter car cards
            let visibleCount = 0;
            
            carCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                const shouldShow = filterValue === 'all' || cardCategory === filterValue;
                
                if (shouldShow) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                    visibleCount++;
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            console.log("👁️ Showing", visibleCount, "cars");
            
            // Update car count
            updateCarCount(visibleCount, filterValue);
        });
    });
    
    function updateCarCount(count, filterValue) {
        const carCountElement = document.getElementById('car-count');
        const filterInfoElement = document.getElementById('filter-info');
        
        if (!carCountElement || !filterInfoElement) return;
        
        carCountElement.textContent = count;
        
        const categoryNames = {
            'all': 'All Cars',
            'sedan': 'Sedan',
            'suv': 'SUV', 
            'sports': 'Sports',
            'luxury': 'Luxury'
        };
        
        filterInfoElement.innerHTML = `Showing ${categoryNames[filterValue]} • <span id="car-count">${count}</span> cars`;
    }
}

// ===== SORTING FUNCTIONALITY =====
function initSorting() {
    const sortSelect = document.getElementById('sort-select');
    const sortedCountElement = document.getElementById('sorted-count');
    const resetButton = document.getElementById('reset-sort');
    
    if (!sortSelect) {
        console.log("⚠️ Sort select not found");
        return;
    }
    
    console.log("✅ Sort functionality initialized");
    
    // Sort functionality
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        console.log("🔀 Sorting by:", sortValue);
        
        sortCars(sortValue);
    });
    
    // Reset button functionality
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            console.log("🔄 Resetting sort to default");
            sortSelect.value = 'default';
            sortCars('default');
        });
    }
    
    function sortCars(sortValue) {
        const carsContainer = document.getElementById('cars-container');
        if (!carsContainer) return;
        
        // Get all car cards
        const carCards = Array.from(carsContainer.querySelectorAll('.car-card'));
        
        if (carCards.length === 0) {
            console.log("❌ No car cards to sort");
            return;
        }
        
        // Sort the cards based on selected option
        carCards.sort((a, b) => {
            const aId = parseInt(a.getAttribute('data-id')) || 0;
            const bId = parseInt(b.getAttribute('data-id')) || 0;
            
            // Get car data from database
            const carA = window.carsDatabase.find(c => c.id === aId);
            const carB = window.carsDatabase.find(c => c.id === bId);
            
            if (!carA || !carB) return 0;
            
            switch(sortValue) {
                case 'price-low':
                    return extractPrice(carA.price) - extractPrice(carB.price);
                case 'price-high':
                    return extractPrice(carB.price) - extractPrice(carA.price);
                case 'range-high':
                    return extractRange(carB.range) - extractRange(carA.range);
                case 'name-asc':
                    return carA.name.localeCompare(carB.name);
                case 'name-desc':
                    return carB.name.localeCompare(carA.name);
                default: // 'default'
                    return aId - bId; // Original order
            }
        });
        
        // Clear container
        carsContainer.innerHTML = '';
        
        // Re-append sorted cards with animation
        carCards.forEach((card, index) => {
            // Add delay for animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                carsContainer.appendChild(card);
                
                // Animate in
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            }, index * 30);
        });
        
        // Update count
        if (sortedCountElement) {
            const visibleCards = carCards.filter(card => 
                card.style.display !== 'none' && 
                card.style.opacity !== '0'
            ).length;
            sortedCountElement.textContent = visibleCards || carCards.length;
        }
        
        console.log(`✅ Sorted ${carCards.length} cars by ${sortValue}`);
    }
    
    // Helper functions
    function extractPrice(priceString) {
        const numericString = priceString.replace(/[^0-9.]/g, '');
        return parseFloat(numericString) || 0;
    }
    
    function extractRange(rangeString) {
        const numericString = rangeString.replace(/[^0-9.]/g, '');
        return parseFloat(numericString) || 0;
    }
}

// ===== DYNAMIC CAR CARDS GENERATION =====
function initCarCards() {
    const carsContainer = document.getElementById('cars-container');
    
    if (carsContainer && window.carsDatabase) {
        console.log("🔄 Generating car cards...");
        
        // Clear existing content
        carsContainer.innerHTML = '';
        
        // Generate cards from our database
        window.carsDatabase.forEach(car => {
            const carCard = document.createElement('div');
            
            // 1. Add classes for styling
            carCard.className = `car-card ${car.category}`;
            
            // 2. Add data attributes for filtering and sorting
            carCard.setAttribute('data-category', car.category);
            carCard.setAttribute('data-id', car.id);
            
            // 3. Card content with improved button
            carCard.innerHTML = `
                <div class="car-image">
                    <img src="${car.image}" alt="${car.name}" 
                         onerror="this.src='https://via.placeholder.com/300x200/0a192f/00d9ff?text=Car+Image'">
                </div>
                <div class="car-info">
                    <h3>${car.name}</h3>
                    <div class="car-specs">
                        <span><i class="fas fa-road"></i> ${car.range}</span>
                        <span><i class="fas fa-bolt"></i> ${car.acceleration}</span>
                        <span><i class="fas fa-charging-station"></i> ${car.charge}</span>
                    </div>
                    <div class="car-price">Starting at <strong>${car.price}</strong></div>
                    <!-- ✅ Button like index.html -->
                    <a href="car-details.html?id=${car.id}" class="btn btn-primary" 
                       style="width:100%; margin-top:1rem; display:flex; align-items:center; justify-content:center; gap:8px;">
                        <i class="fas fa-eye"></i> View Details
                    </a>
                </div>
            `;
            carsContainer.appendChild(carCard);
        });
        
        console.log("✅ Car cards generated:", window.carsDatabase.length);
    } else {
        console.error("❌ Could not load cars or container not found");
    }
}

// ===== FEATURED CARS ON HOMEPAGE =====
function initFeaturedCars() {
    const featuredContainer = document.getElementById('featured-cars-container');
    
    if (!featuredContainer) {
        console.log("⚠️ Featured cars container not found - checking alternative...");
        
        // Try alternative container (for old HTML structure)
        const oldContainer = document.querySelector('.cars-grid');
        if (oldContainer) {
            console.log("✅ Found old cars-grid, updating links...");
            updateOldFeaturedCars(oldContainer);
        }
        return;
    }
    
    console.log("🔄 Loading featured cars...");
    
    if (window.carsDatabase && window.carsDatabase.length > 0) {
        // Get first 3 cars
        const featuredCars = window.carsDatabase.slice(0, 3);
        
        // Clear container
        featuredContainer.innerHTML = '';
        
        // Generate featured cars HTML
        featuredCars.forEach(car => {
            const carElement = document.createElement('div');
            carElement.className = 'featured-car-card';
            carElement.innerHTML = `
                <div class="featured-car-image">
                    <img src="${car.image}" alt="${car.name}" 
                         onerror="this.src='https://via.placeholder.com/400x250/0a192f/00d9ff?text=Car+Image'">
                    <div class="featured-car-badge">Featured</div>
                </div>
                <div class="featured-car-info">
                    <h3>${car.name}</h3>
                    <div class="featured-car-specs">
                        <span><i class="fas fa-road"></i> ${car.range}</span>
                        <span><i class="fas fa-bolt"></i> ${car.acceleration}</span>
                        <span><i class="fas fa-charging-station"></i> ${car.charge}</span>
                    </div>
                    <div class="featured-car-price">${car.price}</div>
                    <!-- ✅ This link opens car details page directly -->
                    <a href="car-details.html?id=${car.id}" class="btn btn-primary">
                        <i class="fas fa-eye"></i> View Details
                    </a>
                </div>
            `;
            featuredContainer.appendChild(carElement);
        });
        
        console.log("✅ Featured cars loaded:", featuredCars.length);
    } else {
        featuredContainer.innerHTML = `
            <div style="text-align:center; padding:2rem; color:#666;">
                <i class="fas fa-spinner fa-spin"></i> Loading featured cars...
            </div>
        `;
        
        // Try again after 1 second
        setTimeout(() => {
            if (window.carsDatabase && window.carsDatabase.length > 0) {
                initFeaturedCars();
            }
        }, 1000);
    }
}

// Function to update old HTML structure
function updateOldFeaturedCars(container) {
    // Update links in old HTML structure
    const links = container.querySelectorAll('a.btn-small');
    
    // Map car names to IDs
    const carMap = {
        'Tesla Model 3': 1,
        'BMW iX': 2,
        'Audi e-tron GT': 3
    };
    
    links.forEach(link => {
        const carName = link.closest('.car-info').querySelector('h3').textContent;
        const carId = carMap[carName];
        
        if (carId) {
            link.href = `car-details.html?id=${carId}`;
            console.log(`✅ Updated link for ${carName} to ID ${carId}`);
        }
    });
}

// ===== NEWSLETTER FORM =====
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // Simulate form submission
                emailInput.value = '';
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                console.log('Subscribed email:', email);
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            let isValid = true;
            
            if (!data.name || data.name.trim().length < 2) {
                showNotification('Please enter your full name.', 'error');
                isValid = false;
            }
            
            if (!validateEmail(data.email)) {
                showNotification('Please enter a valid email address.', 'error');
                isValid = false;
            }
            
            if (!data.message || data.message.trim().length < 10) {
                showNotification('Please enter a message with at least 10 characters.', 'error');
                isValid = false;
            }
            
            if (isValid) {
                // Simulate form submission
                showNotification('Thank you for your message! We will contact you soon.', 'success');
                contactForm.reset();
                console.log('Contact form submitted:', data);
            }
        });
    }
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ===== TESTIMONIALS SLIDER =====
function initTestimonialsSlider() {
    const testimonialsContainer = document.querySelector('.testimonials-slider');
    
    if (testimonialsContainer) {
        console.log('Testimonials slider would be initialized here');
    }
}

// ===== HIGHLIGHT CURRENT PAGE =====
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === undefined && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ===== HELPER FUNCTIONS =====

// Email validation
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        
        // Add slide out animation
        const slideOutStyle = document.createElement('style');
        slideOutStyle.textContent = `
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(slideOutStyle);
        
        setTimeout(() => {
            notification.remove();
            slideOutStyle.remove();
        }, 300);
    }, 5000);
}

// Initialize lazy loading
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Initialize lazy loading
initLazyLoading();

// Add current year to footer
const yearElement = document.querySelector('.current-year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// Debug helper
window.debugCars = function() {
    console.log("=== CARS DATABASE DEBUG ===");
    console.log("Total cars:", window.carsDatabase ? window.carsDatabase.length : 0);
    console.log("Database:", window.carsDatabase);
    console.log("Car cards on page:", document.querySelectorAll('.car-card').length);
    console.log("Filter buttons:", document.querySelectorAll('.filter-btn').length);
    console.log("Featured container:", document.getElementById('featured-cars-container'));
    console.log("========================");
};