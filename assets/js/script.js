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
    // 2. Multi-Page Active Navigation & In-Page Section Tracking
    // --------------------------------------------------------------------------
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.nav-menu a');
    
    // Highlight based on current page URL
    allNavLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const linkFile = href.split('#')[0].split('/').pop();
        if ((currentPath === '' || currentPath === 'index.html') && (linkFile === '' || linkFile === 'index.html')) {
            link.classList.add('active');
        } else if (linkFile && linkFile === currentPath) {
            link.classList.add('active');
        }
    });

    const inPageSections = document.querySelectorAll('section[id]');
    const inPageNavLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    if (inPageSections.length && inPageNavLinks.length) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.getAttribute('id');
                    inPageNavLinks.forEach(link => {
                        if (link.getAttribute('href') === `#${activeId}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, { threshold: 0.25 });

        inPageSections.forEach(sec => navObserver.observe(sec));
    }

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
            title: "Requirement Understanding & Consultation",
            description: "Detailed analysis of client GA drawings, single-line diagrams (SLD), mechanical enclosure dimensions, busbar routes, thermal requirements, and IP environmental rating targets (IP55/IP65).",
            image: "assets/images/hero-enclosure-fabrication.jpg",
            checklist: [
                "BOM & Dimensional Drawing Review",
                "Ingress Protection (IP55/IP65) Definition",
                "Thermal Load & Cable Entry Planning",
                "Custom Mounting & Plinth Sizing"
            ]
        },
        {
            step: 2,
            title: "Design & CAD Engineering",
            description: "Conversion of architectural schematics into detailed 3D CAD sheet metal models with precise bend deduction calculations, CNC punching toolpaths, and automated nesting for optimal material utilization.",
            image: "assets/images/panels/panel-modular-3bay.jpg",
            checklist: [
                "SolidWorks 3D Sheet Metal Modeling",
                "Bend Deduction & K-Factor Optimization",
                "Component Mounting Plate Nesting",
                "Engineering GA Drawing Sign-off"
            ]
        },
        {
            step: 3,
            title: "Material Planning & Verification",
            description: "Selection and inspection of prime-grade certified Cold Rolled Close Annealed (CRCA), Galvanized Iron (GI), or Stainless Steel (SS304/SS316) sheet coils with thickness verification and surface flatness inspection.",
            image: "assets/images/product-stainless-steel.jpg",
            checklist: [
                "Prime CRCA & SS304 Stock Selection",
                "Sheet Gauge Thickness Calibration (1.6 - 3.0mm)",
                "Surface Flaw & Flatness Inspection",
                "Lot Traceability & Raw Material Audit"
            ]
        },
        {
            step: 4,
            title: "Fabrication: CNC Laser Cutting & Bending",
            description: "High-precision CNC fiber laser profiling cutting intricate cutouts, gland openings, and louvers with tight tolerance accuracy, followed by multi-axis CNC hydraulic press brake bending for seamless corner joints.",
            image: "assets/images/facility-laser.jpg",
            checklist: [
                "Fiber Laser Cutting with Nitrogen Assist",
                "Burr-Free Edge Contouring (Â±0.05mm)",
                "Multi-Axis Hydraulic Press Brake Folding",
                "Flange & Corner Squareness Verification"
            ]
        },
        {
            step: 5,
            title: "Assembly & Mechanical Finishing",
            description: "Precision TIG, MIG, and projection stud welding to construct heavy-duty structural corner pillars and modular frames. Seams are ground flush, sharp edges deburred, and mounting hardware integrated with precision.",
            image: "assets/images/panels/panel-modular-frame.jpg",
            checklist: [
                "Inert Gas Shielded TIG/MIG Welding",
                "Capacitor Discharge Earthing Stud Welds",
                "Flush Seam Grinding & Edge Linishing",
                "Concealed Hinge & Cam Lock Fitment"
            ]
        },
        {
            step: 6,
            title: "Quality Inspection & Tolerance QA",
            description: "Rigorous quality inspection ensuring strict adherence to CAD drawings. Includes dimensional tolerance checks, diagonal squareness verification, door deflection testing, and seal compression validation.",
            image: "assets/images/panels/panel-sgm-2500a-front.jpg",
            checklist: [
                "Full Dimensional & Diagonal Audit",
                "Door Alignment & Latch Engagement",
                "Ingress Protection Gasket Inspection",
                "Earthing Continuity Verification"
            ]
        },
        {
            step: 7,
            title: "Protective Packaging & Final Delivery",
            description: "Carefully wrapped with edge-corner protectors, industrial bubble wrap, and heavy-gauge stretch film on reinforced wooden pallets to ensure zero-transit damage and prompt dispatch across project sites.",
            image: "assets/images/panels/panel-dispatch-ready.jpg",
            checklist: [
                "Protective Corner & Edge Shielding",
                "Heavy-Duty Stretch Film Wrapping",
                "Palletized Dispatch & Shipping Docs",
                "On-Time Delivery Tracking"
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
    // 9. Contact / RFQ Form Handling & Validation
    // --------------------------------------------------------------------------
    const activeForm = document.getElementById('contactForm') || document.getElementById('rfqForm');
    const formNotice = document.getElementById('formNotice');

    if (activeForm) {
        activeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = activeForm.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerText : 'Submit';

            if (submitBtn) {
                submitBtn.innerText = 'Submitting Request...';
                submitBtn.disabled = true;
            }

            setTimeout(() => {
                if (formNotice) {
                    formNotice.classList.add('success');
                    formNotice.style.display = 'block';
                    formNotice.style.padding = '1rem';
                    formNotice.style.background = 'rgba(0, 168, 150, 0.15)';
                    formNotice.style.border = '1px solid var(--accent-teal)';
                    formNotice.style.borderRadius = '8px';
                    formNotice.style.color = '#FFFFFF';
                    formNotice.innerHTML = 
                        <strong style="color: var(--accent-lime); font-size: 1.05rem;">Quotation Request Received!</strong><br>
                        Thank you for reaching out to SKS Engineering Solutions. Our engineering estimation desk will review your specifications and contact you via email at sales@sksengineeringsolutions.com.
                    ;
                    formNotice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                activeForm.reset();
                if (submitBtn) {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                }
            }, 1000);
        });
    }

    // --------------------------------------------------------------------------
    // 10. Products Catalog Filtering
    // --------------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('#productsCatalog .product-card');

    if (filterButtons.length && productCards.length) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetFilter = btn.getAttribute('data-filter') || 'all';

                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                productCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category') || '';
                    if (targetFilter === 'all' || cardCategory === targetFilter) {
                        card.style.display = 'flex';
                        card.style.opacity = '1';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
});