/**
 * Placeholder Music Website Scripts
 * Handles animations, form submissions, and interactivity
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initScrollAnimations();
    initFloatingShapes();
    initForms();
});

/**
 * Navigation functionality
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Check if we're on the index page
    const isIndexPage = window.location.pathname.endsWith('index.html') || 
                        window.location.pathname === '/' || 
                        window.location.pathname.endsWith('/');

    if (isIndexPage) {
        // Initially hide navbar on index page
        navbar.style.transform = 'translateY(-100%)';
        navbar.style.transition = 'transform 0.3s ease, padding 0.3s ease, background 0.3s ease';

        let isHovering = false;

        // Show navbar on hover when at top of page
        document.addEventListener('mousemove', function(e) {
            const currentScroll = window.pageYOffset;
            
            // Only show on hover if we're at the top of the page
            if (currentScroll <= 10 && e.clientY <= 80) {
                if (!isHovering) {
                    isHovering = true;
                    navbar.style.transform = 'translateY(0)';
                }
            } else if (currentScroll <= 10 && e.clientY > 80) {
                if (isHovering) {
                    isHovering = false;
                    navbar.style.transform = 'translateY(-100%)';
                }
            }
        });

        // Hide navbar when mouse leaves the top area
        navbar.addEventListener('mouseleave', function() {
            const currentScroll = window.pageYOffset;
            if (currentScroll <= 10) {
                isHovering = false;
                navbar.style.transform = 'translateY(-100%)';
            }
        });

        // Navbar scroll effect - show when scrolling, hide when at top
        let lastScroll = 0;
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Show navbar when scrolling, hide when at top (unless hovering)
            if (currentScroll > 10) {
                navbar.style.transform = 'translateY(0)';
                isHovering = false;
            } else if (!isHovering) {
                navbar.style.transform = 'translateY(-100%)';
            }

            lastScroll = currentScroll;
        });
    } else {
        // On other pages, navbar is always visible
        navbar.style.transform = 'translateY(0)';
        navbar.style.transition = 'transform 0.3s ease, padding 0.3s ease, background 0.3s ease';

        // Still handle scrolled state for styling
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll(
        '.bio-content, .contact-item, .benefit-item, .music-link, .contact-form-section, .subscribe-form-container'
    );

    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Trigger initial check for elements already in view
    setTimeout(() => {
        animateElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('fade-in');
                el.style.opacity = '1';
            }
        });
    }, 100);
}

/**
 * Enhanced floating shapes with mouse parallax
 */
function initFloatingShapes() {
    const shapes = document.querySelectorAll('.shape');
    
    if (shapes.length === 0) return;

    // Mouse parallax effect
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 20;
            const x = mouseX * speed;
            const y = mouseY * speed;
            
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

/**
 * Form handling and Google Sheets integration
 */
function initForms() {
    // Subscribe form
    const subscribeForm = document.getElementById('subscribeForm');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', handleSubscribe);
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContact);
    }
}

/**
 * Handle email subscription form submission
 * Integrates with Google Sheets via Google Apps Script
 */
async function handleSubscribe(e) {
    e.preventDefault();
    
    const form = e.target;
    const messageEl = document.getElementById('subscribeMessage');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Validate form
    const firstName = form.querySelector('#firstName').value.trim();
    const lastName = form.querySelector('#lastName').value.trim();
    const email = form.querySelector('#subEmail').value.trim();
    const consent = form.querySelector('#consent').checked;

    if (!firstName || !lastName || !email) {
        showMessage(messageEl, 'Please fill in all fields.', 'error');
        return;
    }

    if (!consent) {
        showMessage(messageEl, 'Please agree to receive email updates.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage(messageEl, 'Please enter a valid email address.', 'error');
        return;
    }

    // Show loading state
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;

    try {
        // Google Apps Script Web App URL - Replace with your actual URL after setup
        const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
        
        // Prepare data for Google Sheets
        const formData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            timestamp: new Date().toISOString()
        };

        // If Google Script URL is configured, send data
        if (GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
        }

        // Show success message
        showMessage(messageEl, 'Thanks for subscribing! 🎉 Check your inbox for a confirmation.', 'success');
        form.reset();
        
    } catch (error) {
        console.error('Subscription error:', error);
        showMessage(messageEl, 'Something went wrong. Please try again later.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Handle contact form submission
 */
async function handleContact(e) {
    e.preventDefault();
    
    const form = e.target;
    const messageEl = document.getElementById('formMessage');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Validate form
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !subject || !message) {
        showMessage(messageEl, 'Please fill in all fields.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage(messageEl, 'Please enter a valid email address.', 'error');
        return;
    }

    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
        // Simulate sending (in production, integrate with your email service)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showMessage(messageEl, 'Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();
        
    } catch (error) {
        console.error('Contact form error:', error);
        showMessage(messageEl, 'Something went wrong. Please try again later.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Display form messages
 */
function showMessage(element, message, type) {
    if (!element) return;
    
    element.textContent = message;
    element.className = 'form-message ' + type;
    element.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * Add ripple effect to buttons
 */
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/**
 * Music links hover sound effect (optional)
 */
const musicLinks = document.querySelectorAll('.music-link');
musicLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
});
