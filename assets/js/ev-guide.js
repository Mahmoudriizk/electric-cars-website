// assets/js/ev-guide.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('EV Guide page loaded');
    
    // Tab switching functionality
    const tabs = document.querySelectorAll('.guide-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Function to switch tabs
    function switchTab(tabId) {
        console.log('Switching to tab:', tabId);
        
        // Remove active class from all tabs and contents
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Add active class to clicked tab and corresponding content
        const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
        const activeContent = document.getElementById(tabId);
        
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        if (activeContent) {
            activeContent.classList.add('active');
        }
        
        // Close all FAQ items when switching tabs (except FAQ tab)
        if (tabId !== 'faq') {
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
        }
    }
    
    // Add click event to each tab
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
            
            // Log for debugging
            console.log(`Now viewing: ${this.querySelector('span').textContent}`);
        });
    });
    
    // FAQ functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    const faqSearch = document.getElementById('faq-search');
    
    // FAQ toggle
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
    
    // FAQ Search functionality
    if (faqSearch) {
        faqSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const faqItems = document.querySelectorAll('.faq-item');
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question h4').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
                
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Initialize first tab as active
    switchTab('getting-started');
});