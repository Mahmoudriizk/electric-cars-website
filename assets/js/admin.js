// admin.js - EVolution Admin Dashboard

document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin dashboard loaded');
    console.log('Current localStorage inquiries:', 
        JSON.parse(localStorage.getItem('evolution_inquiries') || '[]').length);
    
    // DOM Elements
    const tableBody = document.getElementById('inquiries-table-body');
    const emptyRow = document.getElementById('empty-row');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const modal = document.getElementById('inquiry-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const saveStatusBtn = document.getElementById('save-status');
    
    // Statistics elements
    const totalInquiriesEl = document.getElementById('total-inquiries');
    const newInquiriesEl = document.getElementById('new-inquiries');
    const testDriveRequestsEl = document.getElementById('test-drive-requests');
    const contactedInquiriesEl = document.getElementById('contacted-inquiries');
    
    // Current filter
    let currentFilter = 'all';
    let currentSearch = '';
    let currentInquiryId = null;
    
    // Initialize
    loadInquiries();
    updateStatistics();
    
    // Event Listeners
    searchInput.addEventListener('input', function() {
        currentSearch = this.value.toLowerCase();
        loadInquiries();
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            loadInquiries();
        });
    });
    
    clearAllBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete ALL inquiries? This action cannot be undone.')) {
            localStorage.removeItem('evolution_inquiries');
            loadInquiries();
            updateStatistics();
            showNotification('All inquiries have been cleared', 'success');
        }
    });
    
    closeModalBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    saveStatusBtn.addEventListener('click', function() {
        if (currentInquiryId) {
            const status = document.getElementById('modal-status').value;
            updateInquiryStatus(currentInquiryId, status);
            modal.classList.remove('active');
        }
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Load inquiries from localStorage
    function loadInquiries() {
        const inquiries = getAllInquiries();
        console.log('Loading inquiries:', inquiries.length);
        
        // Apply filters and search
        let filteredInquiries = inquiries;
        
        // Apply filter
        if (currentFilter !== 'all') {
            filteredInquiries = inquiries.filter(inquiry => {
                if (currentFilter === 'new') return inquiry.status === 'new';
                if (currentFilter === 'contacted') return inquiry.status === 'contacted';
                if (currentFilter === 'test-drive') return inquiry.subject === 'test-drive';
                if (currentFilter === 'pricing') return inquiry.subject === 'pricing';
                if (currentFilter === 'charging') return inquiry.subject === 'charging';
                if (currentFilter === 'new-car') return inquiry.subject === 'new-car';
                if (currentFilter === 'used-car') return inquiry.subject === 'used-car';
                return true;
            });
        }
        
        // Apply search
        if (currentSearch) {
            filteredInquiries = filteredInquiries.filter(inquiry => {
                return (
                    inquiry.name.toLowerCase().includes(currentSearch) ||
                    inquiry.email.toLowerCase().includes(currentSearch) ||
                    (inquiry.message && inquiry.message.toLowerCase().includes(currentSearch)) ||
                    inquiry.subject.toLowerCase().includes(currentSearch)
                );
            });
        }
        
        // Sort by date (newest first)
        filteredInquiries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Render table
        renderTable(filteredInquiries);
        updateStatistics();
    }
    
    // Render inquiries table
    function renderTable(inquiries) {
        if (!tableBody) {
            console.error('Table body not found!');
            return;
        }
        
        tableBody.innerHTML = '';
        
        if (inquiries.length === 0) {
            emptyRow.style.display = '';
            tableBody.appendChild(emptyRow);
            return;
        }
        
        emptyRow.style.display = 'none';
        
        inquiries.forEach(inquiry => {
            const row = document.createElement('tr');
            
            // Format date
            const date = new Date(inquiry.timestamp);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            const formattedTime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Subject badge text
            const subjectText = getSubjectText(inquiry.subject);
            
            // Status badge
            const statusClass = `status-${inquiry.status}`;
            const statusText = inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1);
            
            // Truncate message for display
            const displayMessage = inquiry.message ? 
                (inquiry.message.length > 100 ? inquiry.message.substring(0, 100) + '...' : inquiry.message) : 
                'No message';
            
            row.innerHTML = `
                <td>
                    <div class="customer-name">${inquiry.name}</div>
                    <small>ID: ${inquiry.id ? inquiry.id.slice(0, 8) : 'N/A'}</small>
                </td>
                <td>
                    <div class="customer-email">${inquiry.email}</div>
                    <small>${inquiry.phone || 'No phone'}</small>
                </td>
                <td><span class="inquiry-subject">${subjectText}</span></td>
                <td>
                    <div class="inquiry-message" title="${inquiry.message || ''}">
                        ${displayMessage}
                    </div>
                </td>
                <td>
                    <div>${formattedDate}</div>
                    <small>${formattedTime}</small>
                </td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="inquiry-actions">
                        <button class="action-btn view-btn" data-id="${inquiry.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn delete-btn" data-id="${inquiry.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const inquiryId = this.getAttribute('data-id');
                viewInquiryDetails(inquiryId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const inquiryId = this.getAttribute('data-id');
                deleteInquiry(inquiryId);
            });
        });
    }
    
    // View inquiry details in modal
    function viewInquiryDetails(inquiryId) {
        const inquiry = getInquiryById(inquiryId);
        if (!inquiry) {
            showNotification('Inquiry not found', 'error');
            return;
        }
        
        currentInquiryId = inquiryId;
        
        // Fill modal with data
        document.getElementById('modal-name').textContent = inquiry.name;
        document.getElementById('modal-email').textContent = inquiry.email;
        document.getElementById('modal-phone').textContent = inquiry.phone || 'Not provided';
        document.getElementById('modal-subject').textContent = getSubjectText(inquiry.subject);
        document.getElementById('modal-message').textContent = inquiry.message || 'No message';
        
        const date = new Date(inquiry.timestamp);
        document.getElementById('modal-date').textContent = date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        document.getElementById('modal-newsletter').textContent = 
            inquiry.newsletter ? 'Subscribed' : 'Not subscribed';
        
        document.getElementById('modal-status').value = inquiry.status || 'new';
        
        // Show modal
        modal.classList.add('active');
    }
    
    // Delete an inquiry
    function deleteInquiry(inquiryId) {
        if (confirm('Are you sure you want to delete this inquiry?')) {
            const inquiries = getAllInquiries();
            const updatedInquiries = inquiries.filter(inq => inq.id !== inquiryId);
            localStorage.setItem('evolution_inquiries', JSON.stringify(updatedInquiries));
            loadInquiries();
            showNotification('Inquiry deleted successfully', 'success');
        }
    }
    
    // Update inquiry status
    function updateInquiryStatus(inquiryId, newStatus) {
        const inquiries = getAllInquiries();
        const inquiryIndex = inquiries.findIndex(inq => inq.id === inquiryId);
        
        if (inquiryIndex !== -1) {
            inquiries[inquiryIndex].status = newStatus;
            localStorage.setItem('evolution_inquiries', JSON.stringify(inquiries));
            loadInquiries();
            showNotification('Status updated successfully', 'success');
        }
    }
    
    // Update statistics
    function updateStatistics() {
        const inquiries = getAllInquiries();
        const today = new Date().toDateString();
        
        const total = inquiries.length;
        const newToday = inquiries.filter(inq => 
            new Date(inq.timestamp).toDateString() === today
        ).length;
        
        const testDrive = inquiries.filter(inq => 
            inq.subject === 'test-drive'
        ).length;
        
        const contacted = inquiries.filter(inq => 
            inq.status === 'contacted'
        ).length;
        
        // Update UI elements
        if (totalInquiriesEl) totalInquiriesEl.textContent = total;
        if (newInquiriesEl) newInquiriesEl.textContent = newToday;
        if (testDriveRequestsEl) testDriveRequestsEl.textContent = testDrive;
        if (contactedInquiriesEl) contactedInquiriesEl.textContent = contacted;
        
        console.log('Statistics updated:', { total, newToday, testDrive, contacted });
    }
    
    // Helper function to get subject text
    function getSubjectText(subjectKey) {
        const subjects = {
            'test-drive': 'Test Drive',
            'pricing': 'Pricing Inquiry',
            'charging': 'Charging Questions',
            'technical': 'Technical Support',
            'general': 'General Inquiry',
            'partnership': 'Business Partnership',
            'new-car': 'New Car Purchase',
            'used-car': 'Used Car Purchase',
            'trade-in': 'Trade-In Request',
            'financing': 'Financing',
            'maintenance': 'Maintenance'
        };
        return subjects[subjectKey] || subjectKey;
    }
    
    // Helper function to get all inquiries
    function getAllInquiries() {
        const inquiriesJson = localStorage.getItem('evolution_inquiries');
        return inquiriesJson ? JSON.parse(inquiriesJson) : [];
    }
    
    // Helper function to get inquiry by ID
    function getInquiryById(inquiryId) {
        const inquiries = getAllInquiries();
        return inquiries.find(inq => inq.id === inquiryId);
    }
    
    // Export data function
    window.exportInquiries = function() {
        const inquiries = getAllInquiries();
        const dataStr = JSON.stringify(inquiries, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'evolution_inquiries_'+ new Date().toISOString().slice(0,10) +'.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        showNotification('Data exported successfully', 'success');
    };
    
    // Debug function to add test data
    window.addTestInquiry = function() {
        const testInquiry = {
            id: 'test_' + Date.now(),
            name: 'Test Customer',
            email: 'test@example.com',
            phone: '+1234567890',
            subject: 'test-drive',
            subjectText: 'Test Drive',
            message: 'This is a test inquiry for debugging purposes.',
            newsletter: true,
            timestamp: new Date().toISOString(),
            status: 'new'
        };
        
        const inquiries = getAllInquiries();
        inquiries.push(testInquiry);
        localStorage.setItem('evolution_inquiries', JSON.stringify(inquiries));
        loadInquiries();
        showNotification('Test inquiry added', 'success');
    };
    
    // Auto-refresh every 30 seconds
    setInterval(() => {
        loadInquiries();
    }, 30000);
});