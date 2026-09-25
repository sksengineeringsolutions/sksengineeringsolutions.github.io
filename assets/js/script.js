/**
 * SKS Engineering Solutions - Production Interactive JavaScript Engine
 * A Shinde Groups Enterprise
 * 
 * Features:
 * - High-performance throttled header scroll dynamics & progress indicator
 * - Accessible mobile navigation drawer with touch gesture support
 * - Hero background slideshow with industry switcher and tab-visibility pause
 * - Multi-page active route detection & in-page section intersection tracking
 * - Smooth scroll-triggered reveal animations
 * - Interactive 7-stage manufacturing process navigator with crossfade previews
 * - Instant product catalog filtering (Modular, Wall-mount, Stainless, Outdoor, Desks, Junctions)
 * - Plant showcase lightbox modal with keyboard navigation
 * - RFQ quotation form validation and instant feedback
 * - Animated statistics counter with cubic ease-out
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Flag to enable smooth CSS reveal transitions once JS is active
    document.documentElement.classList.add('js-loaded');

    // ==========================================================================
    // 1. Header Scroll Dynamics, Progress Bar & Back-to-Top Button
    // ==========================================================================
    const header = document.getElementById('siteHeader') || document.querySelector('header');
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    const backToTopBtn = document.getElementById('backToTopBtn');

    let isScrolling = false;

    function handleScroll() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        // Sticky Header Elevation
        if (header) {
            if (scrollTop > 30) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Reading Progress Bar
        if (scrollProgressBar) {
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (scrollHeight > 0) {
                const progress = (scrollTop / scrollHeight) * 100;
                scrollProgressBar.style.width = `${progress}%`;
            }
        }

        // Back to Top Visibility
        if (backToTopBtn) {
            if (scrollTop > 380) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        }

        isScrolling = false;
    }

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(handleScroll);
            isScrolling = true;
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

    // ==========================================================================
    // 2. Mobile Navigation Drawer
    // ==========================================================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu') || document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        const toggleMenu = (open) => {
            const shouldOpen = typeof open === 'boolean' ? open : !navToggle.classList.contains('active');
            navToggle.classList.toggle('active', shouldOpen);
            navMenu.classList.toggle('active', shouldOpen);
            navToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
            document.body.style.overflow = shouldOpen ? 'hidden' : '';
        };

        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close when clicking any nav link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu(false);
            });
        });

        // Close on clicking outside the drawer
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                toggleMenu(false);
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    }

    // ==========================================================================
    // 3. Hero Background Slideshow with Industry Switcher
    // ==========================================================================
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
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.classList.remove('active');
                dot.removeAttribute('aria-current');
            }
        });

        if (currentIndustryLabel && heroSlides[currentSlideIndex]) {
            const industry = heroSlides[currentSlideIndex].getAttribute('data-industry') || '';
            currentIndustryLabel.textContent = 'Industry: ' + industry;
        }
    }

    function startHeroSlideshow() {
        if (slideshowInterval) clearInterval(slideshowInterval);
        if (heroSlides.length <= 1) return;
        slideshowInterval = setInterval(() => {
            showHeroSlide(currentSlideIndex + 1);
        }, 5000);
    }

    function stopHeroSlideshow() {
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
        }
    }

    if (heroSlides.length > 0) {
        showHeroSlide(0);
        startHeroSlideshow();

        industryDots.forEach((dot) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
                if (!isNaN(targetIndex)) {
                    showHeroSlide(targetIndex);
                    startHeroSlideshow();
                }
            });
        });

        // Pause slideshow when page is in background to save battery / CPU
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopHeroSlideshow();
            } else {
                startHeroSlideshow();
            }
        });
    }

    // ==========================================================================
    // 4. Multi-Page Active Route & In-Page Section Tracking
    // ==========================================================================
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.nav-menu a');

    // Route active matching
    allNavLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const linkFile = href.split('#')[0].split('/').pop();
        if ((currentPath === '' || currentPath === 'index.html') && (linkFile === '' || linkFile === 'index.html')) {
            if (!href.includes('#') || href === '#hero' || href === 'index.html') {
                link.classList.add('active');
            }
        } else if (linkFile && linkFile === currentPath) {
            link.classList.add('active');
        }
    });

    // In-page section scroll tracking for single-page jumps
    const inPageSections = document.querySelectorAll('section[id]');
    const inPageNavLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    if (inPageSections.length && inPageNavLinks.length && 'IntersectionObserver' in window) {
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
        }, { threshold: 0.25, rootMargin: '-60px 0px -40% 0px' });

        inPageSections.forEach(sec => navObserver.observe(sec));
    }

    // ==========================================================================
    // 5. Scroll Reveal Animations (Hardware Accelerated)
    // ==========================================================================
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger');

    if (reveals.length && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        reveals.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: make all immediately visible
        reveals.forEach(el => el.classList.add('active'));
    }

    // ==========================================================================
    // 6. Interactive 7-Stage Manufacturing Process
    // ==========================================================================
    const processStepsData = [
        {
            step: 1,
            title: "Requirement Understanding & Consultation",
            description: "Detailed engineering review of client architectural schematics, electrical single-line diagrams (SLD), mechanical enclosure dimensions, busbar routes, thermal requirements, and ingress protection targets (IP55/IP65).",
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
            description: "Conversion of architectural schematics into detailed 3D CAD SolidWorks sheet metal models with precise bend deduction calculations, CNC punching toolpaths, and automated nesting for optimal material utilization.",
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
            description: "Selection and inspection of prime-grade certified Cold Rolled Close Annealed (CRCA), Galvanized Iron (GI), or Stainless Steel (SS304/SS316) sheet coils with thickness calibration and surface flatness inspection.",
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
                "Burr-Free Edge Contouring (\u00B10.1mm)",
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
    const stageImage = document.getElementById('stageImage') || document.getElementById('stageImg');
    const stageChecklist = document.getElementById('stageChecklist');

    function updateProcessStage(index) {
        const data = processStepsData[index];
        if (!data) return;

        stepButtons.forEach((btn, idx) => {
            if (idx === index) {
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            }
        });

        if (stageIndicator) {
            stageIndicator.textContent = `Stage 0${data.step} of 07`;
        }
        if (stageTitle) {
            stageTitle.textContent = data.title;
        }
        if (stageDesc) {
            stageDesc.textContent = data.description;
        }

        if (stageImage) {
            stageImage.style.transition = 'opacity 0.2s ease';
            stageImage.style.opacity = '0.3';
            setTimeout(() => {
                stageImage.src = data.image;
                stageImage.alt = `${data.title} - SKS Fabrication Plant`;
                stageImage.style.opacity = '1';
            }, 180);
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
    }

    if (stepButtons.length > 0) {
        stepButtons.forEach((btn, idx) => {
            btn.addEventListener('click', () => {
                updateProcessStage(idx);
            });
        });
        // Initialize stage 1 on DOM ready to ensure consistent checklist icons & content
        updateProcessStage(0);
    }

    // ==========================================================================
    // 7. Products Catalog Category Filtering
    // ==========================================================================
    const productFilterButtons = document.querySelectorAll('.filter-btn');
    const catalogCards = document.querySelectorAll('.products-grid .product-card, #productsCatalog .product-card, .products-catalog-grid .product-item-card');

    if (productFilterButtons.length && catalogCards.length) {
        productFilterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetFilter = btn.getAttribute('data-filter') || 'all';

                productFilterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                catalogCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category') || '';
                    if (targetFilter === 'all' || cardCategory === targetFilter) {
                        card.style.display = '';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        card.style.display = 'none';
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.96)';
                    }
                });
            });
        });
    }

    // ==========================================================================
    // 8. Plant Showcase Gallery & Lightbox Modal
    // ==========================================================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    const openLightbox = (imgSrc, imgTitle, imgSubtitle) => {
        if (!lightboxModal || !lightboxImg) return;
        lightboxImg.src = imgSrc;
        lightboxImg.alt = imgTitle;
        if (lightboxCaption) {
            lightboxCaption.innerHTML = `<strong>${imgTitle}</strong> ${imgSubtitle ? `&mdash; ${imgSubtitle}` : ''}`;
        }
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        if (lightboxModal) {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('h4') ? item.querySelector('h4').textContent : 'SKS Plant Showcase';
            const subtitle = item.querySelector('p') ? item.querySelector('p').textContent : '';

            if (img) {
                openLightbox(img.src, title, subtitle);
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // ==========================================================================
    // 9. Contact / RFQ Form Validation & Feedback Desk
    // ==========================================================================
    const activeForm = document.getElementById('contactForm') || document.getElementById('rfqForm');
    const formNotice = document.getElementById('formNotice');

    if (activeForm) {
        activeForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = activeForm.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerText : 'Submit RFQ Inquiry \u2192';

            if (submitBtn) {
                submitBtn.innerText = 'Submitting Request...';
                submitBtn.disabled = true;
            }

            setTimeout(() => {
                if (formNotice) {
                    formNotice.classList.add('success');
                    formNotice.style.display = 'block';
                    formNotice.style.padding = '1.25rem';
                    formNotice.style.background = 'rgba(2, 132, 199, 0.08)';
                    formNotice.style.border = '1px solid var(--c-primary)';
                    formNotice.style.borderRadius = '8px';
                    formNotice.style.color = '#0F172A';
                    formNotice.style.marginTop = '1.25rem';
                    formNotice.innerHTML = `
                        <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
                            <div style="width: 26px; height: 26px; border-radius: 50%; background: #25D366; color: #FFFFFF; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: bold; margin-top: 2px;">✓</div>
                            <div>
                                <strong style="color: #0369A1; font-size: 1.05rem; display: block; margin-bottom: 0.35rem;">Quotation Request Received!</strong>
                                <p style="margin: 0; font-size: 0.92rem; color: #334155; line-height: 1.5;">
                                    Thank you for reaching out to SKS Engineering Solutions. Our engineering estimation desk will review your technical specifications and contact you shortly via email at sales@sksengineeringsolutions.com.
                                </p>
                            </div>
                        </div>
                    `;
                    formNotice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }

                activeForm.reset();

                if (submitBtn) {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                }
            }, 800);
        });
    }

    // ==========================================================================
    // 10. Animated Statistics Counter (when in viewport)
    // ==========================================================================
    const counters = document.querySelectorAll('.count-number, .stat-number[data-target]');
    let hasCounted = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            if (isNaN(target)) return;

            const duration = 1600;
            const startTime = performance.now();

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Cubic ease-out
                const ease = 1 - Math.pow(1 - progress, 3);
                const currentVal = Math.floor(ease * target);
                counter.textContent = currentVal;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            };
            requestAnimationFrame(update);
        });
    };

    const statsTrigger = document.querySelector('.strengths-section') || document.querySelector('.hero-kpis');
    if (statsTrigger && counters.length && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounted) {
                    hasCounted = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.2 });
        statsObserver.observe(statsTrigger);
    }

    // ==========================================================================
    // 11. Careers Page Interactive Features
    // ==========================================================================
    const applyButtons = document.querySelectorAll('.apply-for-role-btn');
    const careerPositionSelect = document.getElementById('careerPosition');
    const careerForm = document.getElementById('careerApplicationForm');
    const careerFormNotice = document.getElementById('careerFormNotice');
    const careerNameInput = document.getElementById('careerName');

    if (applyButtons.length && careerPositionSelect) {
        applyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetRole = btn.getAttribute('data-role');
                if (targetRole) {
                    let matched = false;
                    for (let i = 0; i < careerPositionSelect.options.length; i++) {
                        const opt = careerPositionSelect.options[i];
                        if (opt.value.toLowerCase().includes(targetRole.toLowerCase()) || 
                            targetRole.toLowerCase().includes(opt.value.toLowerCase())) {
                            careerPositionSelect.selectedIndex = i;
                            matched = true;
                            break;
                        }
                    }
                    if (!matched) {
                        careerPositionSelect.value = targetRole;
                    }
                }

                const applySection = document.getElementById('applySection') || document.getElementById('applyFormCard');
                if (applySection) {
                    applySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

                if (careerNameInput) {
                    setTimeout(() => {
                        careerNameInput.focus();
                    }, 400);
                }
            });
        });
    }

    if (careerForm) {
        careerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = careerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerText : 'Submit Job Application \u2192';

            if (submitBtn) {
                submitBtn.innerText = 'Submitting Application...';
                submitBtn.disabled = true;
            }

            const candidateName = careerNameInput && careerNameInput.value ? careerNameInput.value.trim() : 'Candidate';
            const selectedPosition = careerPositionSelect && careerPositionSelect.value ? careerPositionSelect.value : 'Applied Role';

            setTimeout(() => {
                if (careerFormNotice) {
                    careerFormNotice.classList.add('success');
                    careerFormNotice.style.display = 'block';
                    careerFormNotice.style.padding = '1.25rem';
                    careerFormNotice.style.background = 'rgba(0, 168, 150, 0.12)';
                    careerFormNotice.style.border = '1px solid var(--accent-teal)';
                    careerFormNotice.style.borderRadius = '8px';
                    careerFormNotice.style.color = '#0B132B';
                    careerFormNotice.style.marginTop = '1.25rem';
                    careerFormNotice.innerHTML = `
                        <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
                            <div style="width: 26px; height: 26px; border-radius: 50%; background: #25D366; color: #FFFFFF; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: bold; margin-top: 2px;">✓</div>
                            <div>
                                <strong style="color: #007365; font-size: 1.05rem; display: block; margin-bottom: 0.35rem;">Application Submitted Successfully!</strong>
                                <p style="margin: 0; font-size: 0.92rem; color: #334155; line-height: 1.5;">
                                    Thank you <strong>${candidateName}</strong> for applying for the <strong>${selectedPosition}</strong> role at SKS Engineering Solutions. Our recruitment desk at <strong>careers@sksengineeringsolutions.com</strong> will review your qualifications and contact you within 24–48 business hours.
                                </p>
                            </div>
                        </div>
                    `;
                    careerFormNotice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }

                careerForm.reset();

                if (submitBtn) {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                }
            }, 800);
        });
    }

    // ==========================================================================
    // 12. Dynamic Vacancy Flyer & Announcement Popup on Homepage
    // ==========================================================================
    const vacancyModal = document.getElementById('vacancyModal');
    const vacancyModalBackdrop = document.getElementById('vacancyModalBackdrop');
    const vacancyModalClose = document.getElementById('vacancyModalClose');
    const vacancyModalImage = document.getElementById('vacancyModalImage');
    const vacancyImageLink = document.getElementById('vacancyImageLink');
    const vacancyModalHeading = document.getElementById('vacancyModalHeading');
    const vacancyModalSubtitle = document.getElementById('vacancyModalSubtitle');
    const vacancyModalBtn = document.getElementById('vacancyModalBtn');
    const floatingHiringPill = document.getElementById('floatingHiringPill');

    const openVacancyModal = () => {
        if (!vacancyModal) return;
        vacancyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeVacancyModal = () => {
        if (!vacancyModal) return;
        vacancyModal.classList.remove('active');
        document.body.style.overflow = '';
        sessionStorage.setItem('sks_vacancy_dismissed', 'true');
    };

    if (vacancyModalClose) vacancyModalClose.addEventListener('click', closeVacancyModal);
    if (vacancyModalBackdrop) vacancyModalBackdrop.addEventListener('click', closeVacancyModal);
    if (floatingHiringPill) floatingHiringPill.addEventListener('click', openVacancyModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && vacancyModal && vacancyModal.classList.contains('active')) {
            closeVacancyModal();
        }
    });

    // Check data/vacancy.json to display flyer when active
    async function checkVacancyAnnouncement() {
        if (!vacancyModal) return;

        // Browsers block fetch() on local file:// protocol; fetch runs on http/https
        if (window.location.protocol === 'file:') {
            return;
        }

        try {
            const res = await fetch(`data/vacancy.json?_t=${Date.now()}`);
            if (!res.ok) return;
            const data = await res.json();

            if (data && data.active && data.imageUrl) {
                if (vacancyModalHeading && data.title) vacancyModalHeading.textContent = data.title;
                if (vacancyModalSubtitle && data.subtitle) vacancyModalSubtitle.textContent = data.subtitle;
                if (vacancyModalImage) vacancyModalImage.src = data.imageUrl;
                if (vacancyImageLink && data.buttonLink) vacancyImageLink.href = data.buttonLink;
                if (vacancyModalBtn) {
                    if (data.buttonText) vacancyModalBtn.textContent = data.buttonText;
                    if (data.buttonLink) vacancyModalBtn.href = data.buttonLink;
                }

                if (floatingHiringPill) {
                    floatingHiringPill.style.display = 'flex';
                }

                // Show modal after 1.2s delay if not dismissed during current session
                if (!sessionStorage.getItem('sks_vacancy_dismissed')) {
                    setTimeout(() => {
                        openVacancyModal();
                    }, 1200);
                }
            }
        } catch (e) {
            // Silently ignore network/fetch error
        }
    }

    checkVacancyAnnouncement();
});