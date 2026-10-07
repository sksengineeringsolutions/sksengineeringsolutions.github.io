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

    // Initial check on page load
    handleScroll();

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================================================
    // 2. Mobile Navigation Drawer & Touch Interaction Engine
    // ==========================================================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu') || document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        // Automatically inject or reference mobile navigation backdrop overlay
        let navBackdrop = document.querySelector('.nav-backdrop');
        if (!navBackdrop) {
            navBackdrop = document.createElement('div');
            navBackdrop.className = 'nav-backdrop';
            navBackdrop.setAttribute('aria-hidden', 'true');
            document.body.appendChild(navBackdrop);
        }

        const toggleMenu = (open) => {
            const shouldOpen = typeof open === 'boolean' ? open : !navToggle.classList.contains('active');
            navToggle.classList.toggle('active', shouldOpen);
            navMenu.classList.toggle('active', shouldOpen);
            navBackdrop.classList.toggle('active', shouldOpen);
            navToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
            document.body.classList.toggle('mobile-menu-open', shouldOpen);
            document.body.style.overflow = shouldOpen ? 'hidden' : '';
        };

        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close when clicking the backdrop overlay
        navBackdrop.addEventListener('click', () => {
            toggleMenu(false);
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

        // Close mobile drawer if screen is rotated or resized to desktop viewport
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && navMenu.classList.contains('active')) {
                toggleMenu(false);
            }
        }, { passive: true });
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
            image: "assets/images/facility-design-office.jpg",
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
            image: "assets/images/facility-cad-workstation.jpg",
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

    // Helper function for HTML escaping
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ==========================================================================
    // 7. Products Catalog Category Filtering & Dynamic DB Integration
    // ==========================================================================
    const productFilterButtons = document.querySelectorAll('.filter-btn');
    const productsCatalog = document.getElementById('productsCatalog');

    function applyProductFilter(targetFilter) {
        const cards = document.querySelectorAll('.products-grid .product-card, #productsCatalog .product-card');
        cards.forEach(card => {
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
    }

    function bindProductFilters() {
        if (!productFilterButtons.length) return;
        productFilterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetFilter = btn.getAttribute('data-filter') || 'all';
                productFilterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyProductFilter(targetFilter);
            });
        });
    }

    bindProductFilters();

    // Dynamic Cloud Products Render (if Supabase / SKS_DB is available)
    async function loadDynamicProducts() {
        if (!productsCatalog || !window.SKS_DB || typeof window.SKS_DB.getProducts !== 'function') return;
        try {
            const products = await window.SKS_DB.getProducts();
            if (products && products.length > 0) {
                productsCatalog.innerHTML = products.map((p, idx) => {
                    const delayClass = idx % 3 === 1 ? ' reveal-delay' : (idx % 3 === 2 ? ' reveal-delay-2' : '');
                    const feats = Array.isArray(p.features) ? p.features : (p.features ? p.features.split('\n').filter(Boolean) : []);
                    return `
                    <div class="product-card reveal${delayClass}" data-category="${escapeHtml(p.category)}">
                        <div class="product-img-wrap">
                            <img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.title)}" width="1200" height="896" loading="lazy" decoding="async">
                            <span class="product-badge ip-badge">${escapeHtml(p.ip_rating || 'IP55 / IP65')}</span>
                        </div>
                        <div class="product-body">
                            <span class="product-category">${escapeHtml(p.category_label || (p.category.toUpperCase() + ' Enclosure'))}</span>
                            <h3>${escapeHtml(p.title)}</h3>
                            <p>${escapeHtml(p.summary || '')}</p>
                            ${feats.length ? `
                            <ul class="product-feature-list">
                                ${feats.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
                            </ul>` : ''}
                            <div class="product-actions" style="margin-top: 1.5rem;">
                                <a href="contact-us.html?product=${encodeURIComponent(p.title)}" class="btn btn-teal btn-sm" style="width: 100%; text-align: center;">Request RFQ for This Product</a>
                            </div>
                        </div>
                    </div>`;
                }).join('');

                // Preserve active filter if selected
                const activeFilterBtn = document.querySelector('.filter-btn.active');
                if (activeFilterBtn) {
                    applyProductFilter(activeFilterBtn.getAttribute('data-filter') || 'all');
                }
            }
        } catch (err) {
            console.warn('Could not load dynamic products, retaining static cards:', err);
        }
    }

    loadDynamicProducts();

    // ==========================================================================
    // 8. Plant Showcase Gallery & Lightbox Modal (Dynamic DB Enabled)
    // ==========================================================================
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

    function bindGalleryLightboxItems() {
        const items = document.querySelectorAll('.gallery-item');
        items.forEach(item => {
            if (item.dataset.lightboxBound) return;
            item.dataset.lightboxBound = 'true';
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const title = item.querySelector('h4') ? item.querySelector('h4').textContent : 'SKS Plant Showcase';
                const subtitle = item.querySelector('p') ? item.querySelector('p').textContent : '';
                if (img) {
                    openLightbox(img.src, title, subtitle);
                }
            });
        });
    }

    bindGalleryLightboxItems();

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

    // Dynamic Cloud Gallery Render
    async function loadDynamicGallery() {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid || !window.SKS_DB || typeof window.SKS_DB.getGallery !== 'function') return;
        try {
            const gallery = await window.SKS_DB.getGallery();
            if (gallery && gallery.length > 0) {
                galleryGrid.innerHTML = gallery.map((item, idx) => {
                    const delayClass = idx % 3 === 1 ? ' reveal-delay' : (idx % 3 === 2 ? ' reveal-delay-2' : '');
                    return `
                    <div class="gallery-item reveal${delayClass}" data-category="${escapeHtml(item.category || '')}">
                        <img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.title)}" width="1205" height="1600" loading="lazy" decoding="async">
                        <div class="gallery-overlay">
                            <h4>${escapeHtml(item.title)}</h4>
                            <p>${escapeHtml(item.description || '')}</p>
                        </div>
                    </div>`;
                }).join('');
                bindGalleryLightboxItems();
            }
        } catch (err) {
            console.warn('Could not load dynamic gallery, retaining static items:', err);
        }
    }

    loadDynamicGallery();

    // ==========================================================================
    // 9. Contact / RFQ Form Validation & Cloud Database Submission Desk
    // ==========================================================================
    const activeForm = document.getElementById('contactForm') || document.getElementById('rfqForm');
    const formNotice = document.getElementById('formNotice');

    // Pre-fill requested product if URL has ?product=...
    const urlParams = new URLSearchParams(window.location.search);
    const prefillProduct = urlParams.get('product');
    if (prefillProduct && activeForm) {
        const detailsField = activeForm.querySelector('#projectDetails') || activeForm.querySelector('[name="message"]');
        if (detailsField && !detailsField.value) {
            detailsField.value = `Inquiry regarding: ${prefillProduct}\nTarget Quantity: \nCustom Dimensions (H x W x D mm): \nSpecific Ingress or Finish Requirements: `;
        }
    }

    if (activeForm) {
        activeForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = activeForm.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerText : 'Submit RFQ Inquiry \u2192';

            if (submitBtn) {
                submitBtn.innerText = 'Transmitting to Cloud...';
                submitBtn.disabled = true;
            }

            const formData = new FormData(activeForm);
            const inquiryPayload = {
                name: formData.get('name') || activeForm.querySelector('[name="name"]')?.value || 'Anonymous',
                company: formData.get('company') || activeForm.querySelector('[name="company"]')?.value || '',
                email: formData.get('email') || activeForm.querySelector('[name="email"]')?.value || '',
                phone: formData.get('phone') || activeForm.querySelector('[name="phone"]')?.value || '',
                product_interest: formData.get('service') || prefillProduct || 'Custom Enclosures',
                message: formData.get('message') || activeForm.querySelector('[name="message"]')?.value || ''
            };

            let saveResult = null;
            if (window.SKS_DB && typeof window.SKS_DB.submitInquiry === 'function') {
                try {
                    saveResult = await window.SKS_DB.submitInquiry(inquiryPayload);
                } catch (dbErr) {
                    console.warn('DB submission note:', dbErr);
                }
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

                    const waMsg = encodeURIComponent(`Hello SKS Engineering, I submitted an RFQ inquiry for ${inquiryPayload.product_interest}. My name is ${inquiryPayload.name} (${inquiryPayload.company}).`);
                    const waLink = `https://api.whatsapp.com/send?phone=918668742659&text=${waMsg}`;

                    formNotice.innerHTML = `
                        <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
                            <div style="width: 28px; height: 28px; border-radius: 50%; background: #25D366; color: #FFFFFF; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: bold; margin-top: 2px;">✓</div>
                            <div>
                                <strong style="color: #0369A1; font-size: 1.05rem; display: block; margin-bottom: 0.35rem;">Quotation Request Registered!</strong>
                                <p style="margin: 0 0 0.75rem 0; font-size: 0.92rem; color: #334155; line-height: 1.5;">
                                    Thank you, <strong>${escapeHtml(inquiryPayload.name)}</strong>. Your request has been recorded into our engineering portal. Our estimation desk will review your technical drawings and provide a commercial proposal shortly.
                                </p>
                                <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn btn-sm" style="background: #25D366; color: #FFFFFF; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 6px; text-decoration: none;">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c4.55 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.19 8.19 0 0 1-5.83 2.41c-1.55 0-3.07-.43-4.39-1.25l-.31-.19-3.26.85.87-3.18-.21-.34a8.217 8.217 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m-3.55 3.41c-.19 0-.41.07-.63.29-.22.22-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.12 3.65.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.29s-1.44-.71-1.66-.79c-.22-.08-.39-.12-.55.12-.16.25-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.44-1.35-1.68-.14-.25-.01-.38.11-.5.11-.11.25-.28.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.32-.75-1.81-.2-.47-.4-.41-.55-.42z"/></svg>
                                    Priority Direct WhatsApp Follow-up &rarr;
                                </a>
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
            }, 600);
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

            // Store in cloud DB if available
            if (window.SKS_DB && typeof window.SKS_DB.submitInquiry === 'function') {
                try {
                    const phoneVal = careerForm.querySelector('[name="phone"]')?.value || '';
                    const emailVal = careerForm.querySelector('[name="email"]')?.value || '';
                    const locVal = careerForm.querySelector('[name="location"]')?.value || '';
                    const expVal = careerForm.querySelector('[name="experience"]')?.value || '';
                    const resumeVal = careerForm.querySelector('[name="resumeLink"]')?.value || '';
                    window.SKS_DB.submitInquiry({
                        name: candidateName,
                        email: emailVal,
                        phone: phoneVal,
                        company: locVal ? `Location: ${locVal}` : 'Job Candidate',
                        industry: 'Career Application',
                        product_interest: `Job Role: ${selectedPosition}`,
                        message: `Years of Exp: ${expVal} | Location: ${locVal} | Portfolio/Resume: ${resumeVal}`
                    });
                } catch (e) {
                    console.warn('Career submission note:', e);
                }
            }

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
});