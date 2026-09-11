/* ==========================================================================
   SKS Engineering Solutions - Interactive JavaScript Engine
   Features:
   - Header scroll dynamics & active section tracker
   - Mobile navigation drawer
   - Scroll-triggered reveal animations
   - Animated numeric statistics counter
   - Interactive 7-Step Fabrication Workflow
   - Product Catalog Category Filtering
   - Project Showcase Lightbox Modal
   - Brochure Download Modal
   - RFQ Form Validation & Feedback
   - WhatsApp Floating Representative Widget
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------------------------
    // 1. Header Scroll Dynamics, Progress Bar & Back to Top
    // --------------------------------------------------------------------------
    const header = document.querySelector('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        // Header scrolled class
        if (header) {
            if (scrollTop > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Reading Scroll Progress Bar
        if (scrollProgressBar) {
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (scrollHeight > 0) {
                const progress = (scrollTop / scrollHeight) * 100;
                scrollProgressBar.style.width = `${progress}%`;
            }
        }

        // Back to Top Button visibility
        if (backToTopBtn) {
            if (scrollTop > 450) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        }
    }, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Full-Screen Industrial Background Slideshow Engine
    const heroSlides = document.querySelectorAll('.hero-slide');
    const industryDots = document.querySelectorAll('.industry-dot');
    const currentIndustryLabel = document.getElementById('currentIndustryLabel');
    let currentSlideIndex = 0;
    let slideshowInterval = null;

    function showHeroSlide(index) {
        if (!heroSlides.length) return;
        currentSlideIndex = (index + heroSlides.length) % heroSlides.length;

        heroSlides.forEach((slide, idx) => {
            if (idx === currentSlideIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        industryDots.forEach((dot, idx) => {
            if (idx === currentSlideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        if (currentIndustryLabel && heroSlides[currentSlideIndex]) {
            const industry = heroSlides[currentSlideIndex].getAttribute('data-industry') || '';
            currentIndustryLabel.textContent = 'Industry: ' + industry;
        }
    }

    function startHeroSlideshow() {
        if (slideshowInterval) clearInterval(slideshowInterval);
        slideshowInterval = setInterval(() => {
            showHeroSlide(currentSlideIndex + 1);
        }, 5000);
    }

    if (heroSlides.length > 0) {
        showHeroSlide(0);
        startHeroSlideshow();

        industryDots.forEach((dot) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
                showHeroSlide(targetIndex);
                startHeroSlideshow(); // Reset timer on user interaction
            });
        });
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // --------------------------------------------------------------------------
    // 2. Active Navigation Section Highlighting
    // --------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, { threshold: 0.25 });

    sections.forEach(sec => navObserver.observe(sec));

    // --------------------------------------------------------------------------
    // 3. Scroll Reveal Animations (Multi-Directional & Cascading Stagger)
    // --------------------------------------------------------------------------
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));

    // --------------------------------------------------------------------------
    // 4. Animated Number Counters
    // --------------------------------------------------------------------------
    const counters = document.querySelectorAll('.count-number');
    let counted = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 1800;
            const start = 0;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic
                const currentVal = Math.floor(progress * (target - start) + start);
                counter.innerText = currentVal;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            requestAnimationFrame(updateCounter);
        });
    };

    const statsSection = document.querySelector('.strengths-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counted) {
                    counted = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.2 });
        statsObserver.observe(statsSection);
    }

    // --------------------------------------------------------------------------
    // 5. Interactive 7-Step Fabrication Workflow
    // --------------------------------------------------------------------------
    const processStepsData = [
        {
            step: 1,
            title: "Precision Laser Cutting",
            description: "Sheet metal panels are programmed using CAD/CAM nesting software and cut on ultra-precise 3kW CNC Fiber Laser machines. Clean edge profiles with zero burrs and tight tolerances of ±0.1 mm ensure flawless fitment for all enclosure doors, gland plates, and internal mounting plates.",
            image: "assets/images/facility-laser.jpg",
            checklist: [
                "CAD/CAM Nesting Optimization",
                "Cold-Rolled Sheet (CRCA & SS 304/316)",
                "Tolerance Accuracy within ±0.1mm",
                "Clean Piercing & Slag-Free Edges"
            ]
        },
        {
            step: 2,
            title: "CNC Hydraulic Bending",
            description: "High-tonnage multi-axis CNC Press Brakes shape sheet profiles with digital angle compensation. Complex return flanges, double-fold stiffeners, and interlocking gasket grooves are bent with mathematical consistency across entire production batches.",
            image: "assets/images/facility-bending.jpg",
            checklist: [
                "150-Ton Multi-Axis CNC Press Brake",
                "Digital Angle & Crowning Compensation",
                "Continuous Return Flange Stiffness",
                "Standardized Gasket Channel Forming"
            ]
        },
        {
            step: 3,
            title: "Precision Welding & Structural Assembly",
            description: "Enclosure structural corners, pillars, and cross-members are joined using advanced MIG, TIG, and automated spot welding. Argon shielding prevents oxidation, resulting in superior structural rigidity and seismic withstand capabilities.",
            image: "assets/images/panels/panel-modular-frame.jpg",
            checklist: [
                "TIG & MIG Inert Gas Shielded Welding",
                "Capacitor Discharge Stud Welding for Earthing",
                "Rigid Modular Structural Internal Frame",
                "Non-Destructive Weld Joint Inspection"
            ]
        },
        {
            step: 4,
            title: "Surface Finishing & Deburring",
            description: "Welded enclosure assemblies undergo comprehensive mechanical finishing. Weld seams are ground flush, sharp corners deburred, and surfaces conditioned to provide an ultra-smooth substrate for powder paint adhesion and IP gasket seating.",
            image: "assets/images/product-junction-boxes.jpg",
            checklist: [
                "Flush Weld Seam Grinding & Linishing",
                "Radius Corner Edge Deburring",
                "Surface Contaminant & Slag Removal",
                "Mechanical Flatness Verification"
            ]
        },
        {
            step: 5,
            title: "7-Tank Pretreatment & Powder Coating",
            description: "Every steel enclosure undergoes a rigorous chemical 7-tank pretreatment process (degreasing, derusting, phosphating, passivation) followed by electrostatic pure polyester powder coating (RAL 7035 standard) cured at 200°C for exceptional corrosion resistance (tested up to 1000 hours salt spray).",
            image: "assets/images/facility-powder.jpg",
            checklist: [
                "7-Tank Chemical Dip Pretreatment",
                "Electrostatic Powder Coating (RAL 7035)",
                "200°C Thermal Curing Oven",
                "DFT Thickness: 80–90 Microns Guaranteed"
            ]
        },
        {
            step: 6,
            title: "PU Foamed Gasketing & Hardware Fitting",
            description: "Continuous formed-in-place polyurethane (PU) foam gaskets are CNC dispensed along enclosure door profiles to guarantee IP55 / IP65 dust and water ingress protection. Precision door hinges, quarter-turn locks, and zinc-plated mounting plates are fitted.",
            image: "assets/images/product-modular-enclosure.jpg",
            checklist: [
                "Continuous CNC Poured PU Foam Gasket",
                "Heavy-Duty Zinc Die-Cast Concealed Hinges",
                "Quarter-Turn Cam Locks & Espagnolette Rods",
                "Passivated Galvanized Internal Mounting Plates"
            ]
        },
        {
            step: 7,
            title: "100% Dimensional QA & Safe Dispatch",
            description: "Every enclosure undergoes rigid dimensional verification, diagonal squareness checks, door seal compression audits, and coating thickness (DFT) testing before protective bubble wrapping, palletization, and on-time dispatch.",
            image: "assets/images/panels/panel-dispatch-ready.jpg",
            checklist: [
                "Diagonal Squareness & Alignment Audit",
                "DFT Coating Thickness & Adhesion Test",
                "Door Gasket Compression Verification",
                "Export-Grade Palletized Protective Packaging"
            ]
        }
    ];

    const stepButtons = document.querySelectorAll('.process-step-btn');
    const stageIndicator = document.getElementById('stageIndicator');
    const stageTitle = document.getElementById('stageTitle');
    const stageDesc = document.getElementById('stageDesc');
    const stageImg = document.getElementById('stageImg');
    const stageChecklist = document.getElementById('stageChecklist');

    const updateProcessStage = (index) => {
        const data = processStepsData[index];
        if (!data) return;

        stepButtons.forEach((btn, idx) => {
            if (idx === index) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (stageIndicator) stageIndicator.innerText = `Step 0${data.step} of 07`;
        if (stageTitle) stageTitle.innerText = data.title;
        if (stageDesc) stageDesc.innerText = data.description;
        if (stageImg) {
            stageImg.style.opacity = '0';
            setTimeout(() => {
                stageImg.src = data.image;
                stageImg.alt = data.title;
                stageImg.style.opacity = '1';
            }, 150);
        }

        if (stageChecklist) {
            stageChecklist.innerHTML = data.checklist.map(item => `
                <li>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    <span>${item}</span>
                </li>
            `).join('');
        }
    };

    stepButtons.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            updateProcessStage(idx);
        });
    });

    // --------------------------------------------------------------------------
    // 6. Product Catalog Category Filtering
    // --------------------------------------------------------------------------
    const productFilters = document.querySelectorAll('.catalog-filter-bar .filter-btn');
    const productCards = document.querySelectorAll('.product-item-card');

    productFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            productFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.96)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        });
    });

    // --------------------------------------------------------------------------
    // 7. Gallery Category Filtering & Lightbox Modal
    // --------------------------------------------------------------------------
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('h4') ? item.querySelector('h4').innerText : 'SKS Engineering Showcase';
            const subtitle = item.querySelector('p') ? item.querySelector('p').innerText : '';

            if (lightboxModal && lightboxImg && img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = title;
                if (lightboxCaption) {
                    lightboxCaption.innerHTML = `<strong>${title}</strong> &mdash; ${subtitle}`;
                }
                lightboxModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeLightbox = () => {
        if (lightboxModal) {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // --------------------------------------------------------------------------
    // 8. Brochure Download Modal
    // --------------------------------------------------------------------------
    const brochureModal = document.getElementById('brochureModal');
    const brochureTriggers = document.querySelectorAll('.trigger-brochure');
    const brochureClose = document.getElementById('brochureClose');
    const brochureForm = document.getElementById('brochureForm');

    brochureTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (brochureModal) {
                brochureModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeBrochureModal = () => {
        if (brochureModal) {
            brochureModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    const brochureModalClose = document.getElementById('brochureModalClose');
    if (brochureClose) brochureClose.addEventListener('click', closeBrochureModal);
    if (brochureModalClose) brochureModalClose.addEventListener('click', closeBrochureModal);
    if (brochureModal) {
        brochureModal.addEventListener('click', (e) => {
            if (e.target === brochureModal) closeBrochureModal();
        });
    }

    if (brochureForm) {
        brochureForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = brochureForm.querySelector('button[type="submit"]');
            const orig = submitBtn.innerText;
            submitBtn.innerText = 'Preparing Download...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('Thank you! SKS Engineering Solutions Technical Catalog download will begin shortly.');
                closeBrochureModal();
                brochureForm.reset();
                submitBtn.innerText = orig;
                submitBtn.disabled = false;
            }, 1200);
        });
    }

    // --------------------------------------------------------------------------
    // 9. Contact / RFQ Form Validation & Feedback
    // --------------------------------------------------------------------------
    const contactForm = document.getElementById('rfqForm');
    const formNotice = document.getElementById('formNotice');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('rfqSubmitBtn');
            const originalText = submitBtn.innerText;

            submitBtn.innerText = 'Sending Inquiry...';
            submitBtn.disabled = true;

            setTimeout(() => {
                if (formNotice) {
                    formNotice.classList.add('success');
                    formNotice.innerHTML = `
                        <strong>Inquiry Transmitted Successfully!</strong><br>
                        Thank you for reaching out. An SKS Senior Electrical Engineer will review your specs and contact you within 4 business hours.
                    `;
                }
                contactForm.reset();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;

                // Scroll notice into view
                formNotice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 1400);
        });
    }

    // --------------------------------------------------------------------------
    // 10. WhatsApp Floating Representative Widget (Mobile Native + Desktop Modal)
    // --------------------------------------------------------------------------
    const whatsappBtn = document.getElementById('whatsappBtn');
    const whatsappChat = document.getElementById('whatsappChat');
    const chatClose = document.getElementById('chatClose');
    const whatsappForm = document.getElementById('whatsappForm');
    const whatsappMsg = document.getElementById('whatsappMsg');

    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            // Check if mobile screen (<= 768px) or mobile device
            const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
            
            if (isMobile) {
                // On mobile, allow direct <a> link navigation straight into native WhatsApp application
                return;
            }

            // On desktop, toggle interactive chat dialog box
            if (whatsappChat) {
                e.preventDefault();
                e.stopPropagation();
                whatsappChat.classList.toggle('active');
            }
        });

        if (chatClose && whatsappChat) {
            chatClose.addEventListener('click', (e) => {
                e.stopPropagation();
                whatsappChat.classList.remove('active');
            });
        }

        document.addEventListener('click', (e) => {
            if (whatsappChat && !whatsappChat.contains(e.target) && !whatsappBtn.contains(e.target)) {
                whatsappChat.classList.remove('active');
            }
        });

        if (whatsappForm && whatsappMsg) {
            whatsappForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const rawMsg = whatsappMsg.value.trim();
                const phoneNumber = "919975644816";
                const messageText = rawMsg 
                    ? `Hello SKS Engineering, I would like to inquire about sheet metal enclosures: ${rawMsg}`
                    : `Hello SKS Engineering, I would like to inquire about custom sheet metal enclosures.`;
                const encodedMsg = encodeURIComponent(messageText);
                const waUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMsg}`;
                
                // Direct navigation to prevent popup blocker interception
                window.location.href = waUrl;
                whatsappMsg.value = '';
                if (whatsappChat) whatsappChat.classList.remove('active');
            });
        }
    }
});
