/* SKS Engineering Solutions - Interactive JS */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when any link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // 3. Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal, .reveal-delay, .reveal-delay-2');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // stop observing once revealed
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(el => revealObserver.observe(el));

    // 4. Contact Form Handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            
            btn.innerText = 'Sending...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                alert('Thank you for contacting SKS Engineering Solutions. We will get back to you shortly!');
                contactForm.reset();
                btn.innerText = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }

    // 5. Smooth Scroll for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 6. WhatsApp Bot Widget Logic
    const whatsappBtn = document.getElementById('whatsappBtn');
    const whatsappChat = document.getElementById('whatsappChat');
    const chatClose = document.getElementById('chatClose');
    const whatsappForm = document.getElementById('whatsappForm');
    const whatsappMsg = document.getElementById('whatsappMsg');

    if (whatsappBtn && whatsappChat) {
        // Toggle chat popover
        whatsappBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            whatsappChat.classList.toggle('active');
        });

        // Close chat popover
        if (chatClose) {
            chatClose.addEventListener('click', (e) => {
                e.stopPropagation();
                whatsappChat.classList.remove('active');
            });
        }

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!whatsappChat.contains(e.target) && !whatsappBtn.contains(e.target)) {
                whatsappChat.classList.remove('active');
            }
        });

        // Handle redirection
        if (whatsappForm && whatsappMsg) {
            whatsappForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const msg = encodeURIComponent(whatsappMsg.value.trim());
                if (msg) {
                    const phoneNumber = "919975644816"; // SKS Sales number
                    const url = `https://wa.me/${phoneNumber}?text=${msg}`;
                    window.open(url, '_blank');
                    whatsappMsg.value = '';
                    whatsappChat.classList.remove('active');
                }
            });
        }
    }
});
