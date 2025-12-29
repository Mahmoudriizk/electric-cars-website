// assets/js/charging-calculator.js

document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Charging Calculator
    console.log('Charging Calculator initialized');
    
    // Update range value displays
    const batteryCapacity = document.getElementById('battery-capacity');
    const currentCharge = document.getElementById('current-charge');
    const targetCharge = document.getElementById('target-charge');
    const electricityRate = document.getElementById('electricity-rate');
    
    const capacityValue = document.getElementById('capacity-value');
    const currentValue = document.getElementById('current-value');
    const targetValue = document.getElementById('target-value');
    const rateValue = document.getElementById('rate-value');
    
    // Update displays
    function updateValueDisplays() {
        if (capacityValue) capacityValue.textContent = batteryCapacity.value + ' kWh';
        if (currentValue) currentValue.textContent = currentCharge.value + '%';
        if (targetValue) targetValue.textContent = targetCharge.value + '%';
        if (rateValue) rateValue.textContent = '$' + electricityRate.value + '/kWh';
    }
    
    // Add event listeners
    [batteryCapacity, currentCharge, targetCharge, electricityRate].forEach(input => {
        input.addEventListener('input', function() {
            updateValueDisplays();
            // Auto-calculate on significant change
            if (this.id !== 'electricity-rate') {
                calculateCharging();
            }
        });
    });
    
    // Time of day toggle
    const timeBadges = document.querySelectorAll('.time-badge');
    timeBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            timeBadges.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            calculateCharging();
        });
    });
    
    // Map controls
    const mapBtns = document.querySelectorAll('.map-btn');
    mapBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            mapBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Visual feedback
            const mapVis = document.getElementById('map-visualization');
            if (this.dataset.zoom === 'region') {
                mapVis.style.transform = 'scale(0.8)';
            } else if (this.dataset.zoom === 'trip') {
                mapVis.style.transform = 'scale(1.1)';
            } else {
                mapVis.style.transform = 'scale(1)';
            }
        });
    });
    
    // Calculate button
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateCharging);
    }
    
    // Station marker interactions
    document.querySelectorAll('.station-marker').forEach(marker => {
        marker.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            const info = this.querySelector('.station-info').textContent;
            alert(`Selected: ${info}\nType: ${type.toUpperCase()} charging`);
        });
    });
    
    // Initial calculation
    updateValueDisplays();
    calculateCharging();
});

function calculateCharging() {
    // Get values
    const capacity = parseFloat(document.getElementById('battery-capacity').value);
    const current = parseFloat(document.getElementById('current-charge').value) / 100;
    const target = parseFloat(document.getElementById('target-charge').value) / 100;
    const power = parseFloat(document.getElementById('charger-power').value);
    const rate = parseFloat(document.getElementById('electricity-rate').value);
    
    // Check for valid inputs
    if (current >= target) {
        showNotification('Target charge must be higher than current charge', 'error');
        return;
    }
    
    // Calculate energy needed (kWh)
    const energyNeeded = capacity * (target - current);
    
    // Calculate charging time (hours)
    let chargingTimeHours = energyNeeded / power;
    
    // Account for charging curve (slower above 80%)
    if (target > 0.8) {
        chargingTimeHours *= 1.3;
    }
    
    // Time of day multiplier
    const timeOfDay = document.querySelector('.time-badge.active').textContent.toLowerCase();
    let rateMultiplier = 1.0;
    if (timeOfDay.includes('peak')) {
        rateMultiplier = 1.5; // 50% more during peak
    } else if (timeOfDay.includes('off-peak')) {
        rateMultiplier = 0.7; // 30% discount
    }
    
    // Calculate cost
    const cost = energyNeeded * rate * rateMultiplier;
    
    // Estimate added range (assuming 6.5 km per kWh)
    const addedRange = Math.round(energyNeeded * 6.5);
    
    // Update UI
    document.getElementById('energy-needed').textContent = energyNeeded.toFixed(1) + ' kWh';
    
    // Format time
    if (chargingTimeHours < 1) {
        const minutes = Math.ceil(chargingTimeHours * 60);
        document.getElementById('charging-time').textContent = `${minutes} min`;
    } else {
        const hours = Math.floor(chargingTimeHours);
        const minutes = Math.round((chargingTimeHours - hours) * 60);
        document.getElementById('charging-time').textContent = `${hours}h ${minutes}m`;
    }
    
    document.getElementById('charging-cost').textContent = '$' + cost.toFixed(2);
    document.getElementById('added-range').textContent = addedRange + ' km';
    
    // Update visualization bars
    const currentBar = document.querySelector('.current-charge-bar');
    const targetBar = document.querySelector('.target-charge-bar');
    
    if (currentBar) {
        currentBar.style.width = (current * 100) + '%';
        currentBar.querySelector('span').textContent = Math.round(current * 100) + '%';
    }
    
    if (targetBar) {
        targetBar.style.width = (target * 100) + '%';
        targetBar.querySelector('span').textContent = Math.round(target * 100) + '%';
    }
    
    // Update cost comparison
    const gasCost = Math.round(addedRange * 0.10); // Assuming $0.10 per km for gas
    const gasElement = document.querySelector('.comparison-item:nth-child(2) strong');
    const savingsElement = document.querySelector('.savings-badge strong');
    
    if (gasElement) {
        gasElement.textContent = '$' + gasCost.toFixed(2);
    }
    
    if (savingsElement) {
        const savings = gasCost - cost;
        savingsElement.textContent = '$' + savings.toFixed(2);
        savingsElement.parentElement.style.background = savings > 0 ? '#4CAF50' : '#f44336';
    }
}

function showNotification(message, type = 'info') {
    // Use existing notification function from main.js or create simple alert
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        alert(message);
    }
}