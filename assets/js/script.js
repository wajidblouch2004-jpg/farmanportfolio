

if (typeof gsap !== "undefined") {
    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    gsap.from(".avatar-wrap",
        {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: ".avatar-wrap"

        });
    gsap.from(".about-right > *",
        {
            y: 20,
            opacity: 0,
            duration: 0.9,
            stagger: 0.15,
            delay: 0.15,
            ease: "power3.out",


            scrollTrigger: ".avatar-wrap"
        });
}

gsap.to(".skill-item", {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.2,
    scrollTrigger: {
        trigger: "#skills",
        start: "top 80%",
        scrub: true,           // smooth scrub with scroll
        toggleActions: "play none none reverse"
    }
});



gsap.to(".contact-form", {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
        trigger: "#contact",
        start: "top 80%",
    }
});

// Inputs animate with stagger
gsap.to(".contact-form input, .contact-form textarea", {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.2,
    scrollTrigger: {
        trigger: ".contact-form",
        start: "top 90%",
    }
});

// Initialize Scrollspy
document.addEventListener('DOMContentLoaded', function () {
    const scrollSpy = new bootstrap.ScrollSpy(document.body, {
        target: '#navbarNavList',
        offset: 70
    });

    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 0) {
            navbar.style.setProperty('position', 'fixed', 'important');
            navbar.style.setProperty('width', '100%', 'important');
            navbar.style.setProperty('top', '0', 'important');
        } else {
            navbar.style.removeProperty('position');
            navbar.style.removeProperty('width');
            navbar.style.removeProperty('top');
        }
    });

    // Circular Progress Bar Animation
    const progressBars = document.querySelectorAll('.circular-progress');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let target = entry.target.getAttribute('data-target');
                entry.target.style.setProperty('--p', target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    progressBars.forEach(bar => observer.observe(bar));

    // ===== PORTFOLIO TABS FUNCTIONALITY =====
    const tabButtons = document.querySelectorAll('.portfolio-tab-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const showMoreButton = document.querySelector('.btn-show-more');
    let showMoreExpanded = false;
    const DEFAULT_VISIBLE_CARDS = 6;

    const getFilteredCards = (filter) => {
        return Array.from(portfolioCards).filter(card => filter === 'all' || card.getAttribute('data-category') === filter);
    };

    const setShowMoreText = () => {
        if (!showMoreButton) return;
        if (showMoreExpanded) {
            showMoreButton.innerHTML = 'Show Less <i class="fas fa-arrow-left ms-2"></i>';
        } else {
            showMoreButton.innerHTML = 'Show More <i class="fas fa-arrow-right ms-2"></i>';
        }
    };

    const updateShowMoreButton = (filter) => {
        if (!showMoreButton) return;
        const filteredCards = getFilteredCards(filter);
        if (filteredCards.length > DEFAULT_VISIBLE_CARDS) {
            showMoreButton.style.display = 'inline-flex';
        } else {
            showMoreButton.style.display = 'none';
        }
        setShowMoreText();
    };

    const applyFilter = (filter) => {
        const filteredCards = getFilteredCards(filter);
        let visibleIndex = 0;

        portfolioCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const matchesFilter = filter === 'all' || category === filter;

            if (!matchesFilter) {
                card.classList.add('fade-out');
                setTimeout(() => {
                    card.classList.add('hidden');
                }, 350);
                return;
            }

            if (!showMoreExpanded && visibleIndex >= DEFAULT_VISIBLE_CARDS) {
                card.classList.add('hidden');
                card.classList.remove('fade-in');
            } else {
                card.classList.remove('hidden', 'fade-out');
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, 20);
            }
            visibleIndex += 1;
        });

        updateShowMoreButton(filter);
    };

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            showMoreExpanded = false;
            applyFilter(filter);
        });
    });

    if (showMoreButton) {
        showMoreButton.addEventListener('click', () => {
            const activeTab = document.querySelector('.portfolio-tab-btn.active');
            const filter = activeTab ? activeTab.getAttribute('data-filter') : 'all';
            showMoreExpanded = !showMoreExpanded;
            applyFilter(filter);
        });
    }

    // Initialize with 'All' filter active
    const allFilter = document.querySelector('[data-filter="all"]');
    if (allFilter) {
        allFilter.classList.add('active');
        applyFilter('all');
    }

    // ===== CONTACT FORM FUNCTIONALITY =====
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const successMessage = document.querySelector('.form-success-message');

    // Form validation
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const showError = (input, message) => {
        const errorElement = input.closest('.form-field-wrapper').querySelector('.field-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.opacity = '1';
            input.style.borderColor = '#ff6b6b';
        }
    };

    const clearError = (input) => {
        const errorElement = input.closest('.form-field-wrapper').querySelector('.field-error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.opacity = '0';
            input.style.borderColor = '';
        }
    };

    // Input event listeners for real-time validation
    nameInput.addEventListener('blur', () => {
        if (nameInput.value.trim().length < 2) {
            showError(nameInput, 'Name must be at least 2 characters');
        } else {
            clearError(nameInput);
        }
    });

    emailInput.addEventListener('blur', () => {
        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
        } else {
            clearError(emailInput);
        }
    });

    subjectInput.addEventListener('blur', () => {
        if (subjectInput.value.trim().length < 3) {
            showError(subjectInput, 'Subject must be at least 3 characters');
        } else {
            clearError(subjectInput);
        }
    });

    messageInput.addEventListener('blur', () => {
        if (messageInput.value.trim().length < 10) {
            showError(messageInput, 'Message must be at least 10 characters');
        } else {
            clearError(messageInput);
        }
    });

    // Clear errors on input
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        input.addEventListener('input', () => {
            if (input.style.borderColor === 'rgb(255, 107, 107)') {
                clearError(input);
            }
        });
    });

    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate all fields
        let isValid = true;

        if (nameInput.value.trim().length < 2) {
            showError(nameInput, 'Name must be at least 2 characters');
            isValid = false;
        } else {
            clearError(nameInput);
        }

        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(emailInput);
        }

        if (subjectInput.value.trim().length < 3) {
            showError(subjectInput, 'Subject must be at least 3 characters');
            isValid = false;
        } else {
            clearError(subjectInput);
        }

        if (messageInput.value.trim().length < 10) {
            showError(messageInput, 'Message must be at least 10 characters');
            isValid = false;
        } else {
            clearError(messageInput);
        }

        if (isValid) {
            // Show success message
            successMessage.classList.add('show');

            // Reset form
            contactForm.reset();

            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);

            // Log form data (in real application, send to server)
            console.log({
                name: nameInput.value,
                email: emailInput.value,
                subject: subjectInput.value,
                message: messageInput.value
            });
        }
    });
});
