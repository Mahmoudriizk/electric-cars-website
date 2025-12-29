// assets/js/contact-form.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('Contact Form initialized');
    
    // Generate unique ID for each inquiry
    function generateId() {
        return 'inq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Save inquiry to localStorage
    function saveInquiryToStorage(formData) {
        // Map subject values to readable text
        const subjectMap = {
            'test-drive': 'Test Drive',
            'pricing': 'Pricing Inquiry',
            'charging': 'Charging Questions',
            'technical': 'Technical Support',
            'general': 'General Inquiry',
            'partnership': 'Business Partnership',
            'new-car': 'Buy New Electric Car',
            'used-car': 'Buy Used Electric Car',
            'trade-in': 'Trade-In My Car',
            'financing': 'Financing Options',
            'maintenance': 'Maintenance Service'
        };
        
        const inquiry = {
            id: generateId(),
            name: formData.customerData.name,
            email: formData.customerData.email,
            phone: formData.customerData.phone,
            subject: formData.customerData.subject,
            subjectText: subjectMap[formData.customerData.subject] || formData.customerData.subject,
            message: formData.customerData.message,
            newsletter: formData.customerData.subscribedToNewsletter,
            timestamp: new Date().toISOString(),
            status: 'new'
        };
        
        // Get existing inquiries
        const existingInquiries = JSON.parse(localStorage.getItem('evolution_inquiries') || '[]');
        
        // Add new inquiry
        existingInquiries.push(inquiry);
        
        // Save back to localStorage
        localStorage.setItem('evolution_inquiries', JSON.stringify(existingInquiries));
        
        console.log('Inquiry saved to localStorage:', inquiry);
        return inquiry;
    }
    
    // Email validation function
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Main form handling
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formLoading = document.getElementById('form-loading');
    const formSuccess = document.getElementById('form-success');
    const sendAnotherBtn = document.getElementById('send-another');
    const scheduleOnlineBtn = document.getElementById('schedule-online');
    
    // Schedule Online Button
    if (scheduleOnlineBtn) {
        scheduleOnlineBtn.addEventListener('click', function() {
            const subjectSelect = document.getElementById('subject');
            subjectSelect.value = 'test-drive';
            contactForm.scrollIntoView({ behavior: 'smooth' });
            
            showNotification('Please fill out the form to schedule your test drive!', 'info');
        });
    }
    
    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                inquiryType: "Contact Form Submission",
                timestamp: new Date().toISOString(),
                customerData: {
                    name: document.getElementById('name').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value.trim(),
                    subscribedToNewsletter: document.getElementById('newsletter').checked
                }
            };
            
            // Validate form
            if (!formData.customerData.name || !formData.customerData.email || 
                !formData.customerData.message || !formData.customerData.subject) {
                showNotification('Please fill all required fields (Name, Email, Subject, Message).', 'error');
                return;
            }
            
            if (formData.customerData.subject === '') {
                showNotification('Please select a subject from the dropdown list.', 'error');
                return;
            }
            
            if (!validateEmail(formData.customerData.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.style.display = 'none';
            formLoading.style.display = 'block';
            
            // Simulate processing delay
            setTimeout(() => {
                try {
                    // Save data to localStorage
                    const savedInquiry = saveInquiryToStorage(formData);
                    
                    // Show success message
                    formLoading.style.display = 'none';
                    formSuccess.style.display = 'block';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Scroll to success message
                    formSuccess.scrollIntoView({ behavior: 'smooth' });
                    
                    // Show notification
                    const subjectText = savedInquiry.subjectText;
                    showNotification(`Your ${subjectText.toLowerCase()} request has been saved!`, 'success');
                    
                    console.log('Form submitted successfully. Inquiry ID:', savedInquiry.id);
                    
                } catch (error) {
                    console.error('Error saving form data:', error);
                    formLoading.style.display = 'none';
                    submitBtn.style.display = 'block';
                    showNotification('Error saving your request. Please try again.', 'error');
                }
            }, 800);
        });
        
        // Send another message button
        if (sendAnotherBtn) {
            sendAnotherBtn.addEventListener('click', function() {
                formSuccess.style.display = 'none';
                submitBtn.style.display = 'block';
                contactForm.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }
    
    // Initialize form validation
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const subjectSelect = document.getElementById('subject');
    
    if (nameInput && emailInput && messageInput && subjectSelect) {
        // Real-time validation feedback
        [nameInput, emailInput, messageInput].forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value.trim() === '' && this.hasAttribute('required')) {
                    this.style.borderColor = '#f44336';
                } else {
                    this.style.borderColor = '#e2e8f0';
                }
            });
            
            input.addEventListener('input', function() {
                if (this.value.trim() !== '') {
                    this.style.borderColor = '#e2e8f0';
                }
            });
        });
        
        // Email specific validation
        emailInput.addEventListener('blur', function() {
            if (this.value.trim() !== '' && !validateEmail(this.value)) {
                this.style.borderColor = '#f44336';
                showNotification('Please enter a valid email address', 'error');
            }
        });
        
        // Subject validation
        subjectSelect.addEventListener('change', function() {
            if (this.value !== '') {
                this.style.borderColor = '#e2e8f0';
            }
        });
    }
    
    console.log('Contact page loaded. Total inquiries:', 
        JSON.parse(localStorage.getItem('evolution_inquiries') || '[]').length);
});

function showNotification(message, type = 'info') {
    // Use existing notification function from main.js
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        // Fallback notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 5000);
    }
}