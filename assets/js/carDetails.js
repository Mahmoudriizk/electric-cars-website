// assets/js/carDetails.js - CLEAN VERSION

document.addEventListener('DOMContentLoaded', function() {
    console.log('Car Details Page: Initializing...');
    
    // Get car ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id');
    
    if (!carId) {
        showErrorMessage('No car selected. Please choose a car from the gallery.');
        return;
    }
    
    // Load car details with retry logic
    loadCarDetails(carId);
});

function loadCarDetails(carId) {
    // Check if database is loaded
    if (!window.carsDatabase) {
        console.warn('Car database not loaded yet, waiting...');
        
        // Try again after a short delay
        setTimeout(() => {
            if (window.carsDatabase) {
                findAndDisplayCar(carId);
            } else {
                showErrorMessage('Could not load car data. Please check console for errors.');
            }
        }, 500);
        return;
    }
    
    findAndDisplayCar(carId);
}

function findAndDisplayCar(carId) {
    console.log('Searching for car ID:', carId);
    console.log('Available cars:', window.carsDatabase.length);
    
    // Find the car
    const car = window.carsDatabase.find(c => c.id == carId);
    
    if (!car) {
        console.error('Car not found. Available IDs:', window.carsDatabase.map(c => c.id));
        showErrorMessage(`Car with ID ${carId} not found in our database.`);
        return;
    }
    
    console.log('Found car:', car.name);
    
    // Update page title
    document.title = `${car.name} - Details | EVolution`;
    
    // Update hero section
    const heroTitle = document.getElementById('car-title');
    const heroSubtitle = document.getElementById('car-subtitle');
    
    if (heroTitle) heroTitle.textContent = car.name;
    if (heroSubtitle) heroSubtitle.textContent = 'Premium Electric Vehicle';
    
    // Display car details
    displayCarHTML(car);
}

function displayCarHTML(car) {
    const contentDiv = document.querySelector('.car-details-content');
    if (!contentDiv) {
        console.error('Content container not found');
        return;
    }
    
    contentDiv.innerHTML = `
        <!-- Breadcrumb -->
        <div class="breadcrumb">
            <a href="index.html">Home</a> &gt; 
            <a href="cars.html">Electric Cars</a> &gt; 
            <span>${car.name}</span>
        </div>
        
        <!-- Main Layout -->
        <div class="car-details-layout">
            <!-- Left Column -->
            <div class="car-main-section">
                <div class="car-main-image">
                    <img src="${car.image}" alt="${car.name}" 
                         onerror="this.src='https://via.placeholder.com/600x400/0a192f/00d9ff?text=Image+Not+Available'">
                </div>
                
                <!-- Quick Specs -->
                <div class="quick-specs">
                    <div class="spec-item">
                        <i class="fas fa-road"></i>
                        <div>
                            <span class="spec-label">Range</span>
                            <span class="spec-value">${car.range}</span>
                        </div>
                    </div>
                    <div class="spec-item">
                        <i class="fas fa-bolt"></i>
                        <div>
                            <span class="spec-label">0-100 km/h</span>
                            <span class="spec-value">${car.acceleration}</span>
                        </div>
                    </div>
                    <div class="spec-item">
                        <i class="fas fa-charging-station"></i>
                        <div>
                            <span class="spec-label">Fast Charge</span>
                            <span class="spec-value">${car.charge}</span>
                        </div>
                    </div>
                    <div class="spec-item">
                        <i class="fas fa-tag"></i>
                        <div>
                            <span class="spec-label">Price</span>
                            <span class="spec-value">${car.price}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Right Column -->
            <div class="car-details-section">
                <!-- Category -->
                <div class="category-badge">
                    <i class="fas fa-car"></i> ${car.category.toUpperCase()}
                </div>
                
                <!-- Price -->
                <div class="price-display">
                    <h2>${car.price}</h2>
                    <p>Starting Price</p>
                </div>
                
                <!-- Description -->
                <div class="car-description">
                    <h3>About This Model</h3>
                    <p>${car.description}</p>
                </div>
                
                <!-- Features -->
                <div class="car-features">
                    <h3><i class="fas fa-star"></i> Key Features</h3>
                    <ul>
                        ${car.features.map(feature => `
                            <li>
                                <i class="fas fa-check-circle"></i>
                                ${feature}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <!-- Action Buttons -->
                <div class="action-buttons">
                    <a href="contact.html?car=${encodeURIComponent(car.name)}&price=${encodeURIComponent(car.price)}" 
                       class="btn btn-primary">
                        <i class="fas fa-calendar-check"></i> Book Test Drive
                    </a>
                    <a href="contact.html?inquiry=${encodeURIComponent(car.name)}" 
                       class="btn btn-secondary">
                        <i class="fas fa-question-circle"></i> Request Info
                    </a>
                    <a href="cars.html" class="btn btn-outline">
                        <i class="fas fa-arrow-left"></i> Back to Cars
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Technical Specifications -->
        <div class="tech-specs">
            <h3><i class="fas fa-cogs"></i> Technical Specifications</h3>
            <table>
                <tr>
                    <td><strong>Vehicle Type</strong></td>
                    <td>All-Electric ${car.category.charAt(0).toUpperCase() + car.category.slice(1)}</td>
                </tr>
                <tr>
                    <td><strong>Maximum Range</strong></td>
                    <td>${car.range}</td>
                </tr>
                <tr>
                    <td><strong>Acceleration (0-100 km/h)</strong></td>
                    <td>${car.acceleration}</td>
                </tr>
                <tr>
                    <td><strong>Fast Charging Power</strong></td>
                    <td>Up to ${car.charge}</td>
                </tr>
                <tr>
                    <td><strong>Starting Price</strong></td>
                    <td><strong class="highlight">${car.price}</strong></td>
                </tr>
            </table>
        </div>
        
        <!-- Related Cars -->
        <div class="related-cars">
            <h3><i class="fas fa-car-side"></i> Similar ${car.category.toUpperCase()} Vehicles</h3>
            <div class="related-cars-grid">
                ${getRelatedCarsHTML(car)}
            </div>
        </div>
    `;
}

function getRelatedCarsHTML(currentCar) {
    // Get 3 random cars from same category (excluding current car)
    const relatedCars = window.carsDatabase
        .filter(c => c.category === currentCar.category && c.id !== currentCar.id)
        .slice(0, 3);
    
    if (relatedCars.length === 0) return '<p>No similar vehicles found.</p>';
    
    return relatedCars.map(car => `
        <div class="related-car-card">
            <img src="${car.image}" alt="${car.name}">
            <div class="related-car-info">
                <h4>${car.name}</h4>
                <p>${car.range} • ${car.price}</p>
                <a href="car-details.html?id=${car.id}" class="btn btn-small">View Details</a>
            </div>
        </div>
    `).join('');
}

function showErrorMessage(message) {
    const contentDiv = document.querySelector('.car-details-content');
    
    if (!contentDiv) {
        // Create content div if missing
        const newDiv = document.createElement('div');
        newDiv.className = 'car-details-content';
        const container = document.querySelector('.container') || document.body;
        container.appendChild(newDiv);
    }
    
    contentDiv.innerHTML = `
        <div class="error-message">
            <h2><i class="fas fa-exclamation-triangle"></i> Error Loading Car</h2>
            <p>${message}</p>
            <div style="margin-top: 2rem;">
                <a href="cars.html" class="btn btn-primary">
                    <i class="fas fa-arrow-left"></i> Back to Cars Gallery
                </a>
                <a href="index.html" class="btn btn-secondary">
                    <i class="fas fa-home"></i> Go to Homepage
                </a>
            </div>
        </div>
    `;
}

// Backup check after page loads
window.addEventListener('load', function() {
    console.log('Page fully loaded, checking database...');
    
    if (!window.carsDatabase) {
        console.error('carsDatabase still not loaded after page load');
    }
});