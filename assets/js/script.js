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
    // 7. Blinkit-Style Interactive Product Store & RFQ Basket System
    // ==========================================================================
    const productsCatalog = document.getElementById('productsCatalog');

    // Default In-Memory / Fallback Inventory
    const defaultStoreProducts = [
        {
            id: 'prod-01',
            title: 'Modular Floor-Standing Cabinets',
            category: 'modular',
            category_label: 'Modular Series',
            image_url: 'assets/images/product-modular-enclosure.jpg',
            ip_rating: 'IP55 / IP65',
            summary: 'Engineered for LV switchgear, MCC panels, and automation. Rigid 9-fold structural corner profiles with multi-bay extension kit.',
            material: 'Prime 2.0mm CRCA Frame / 1.6mm Covers',
            features: [
                'Modular multi-bay interlockable frame system',
                'Continuous formed polyurethane (PU) foamed gasket',
                'Depth-adjustable passivated galvanized mounting plate',
                'Standard 100mm / 200mm cable entry plinth base'
            ]
        },
        {
            id: 'prod-02',
            title: 'Wall-Mounted Enclosures',
            category: 'wallmount',
            category_label: 'Compact Series',
            image_url: 'assets/images/product-wall-mount-enclosure.jpg',
            ip_rating: 'IP65 Standard',
            summary: 'Compact, rigid sheet metal boxes for instrumentation and PLC nodes. Concealed hinges with bottom gland plate.',
            material: '1.6mm CRCA / GI Sheet Metal',
            features: [
                'IP65 continuous polyurethane foam seal',
                '120° reversible door opening with earthing studs',
                'Removable bottom cable entry gland plate',
                'External wall-mounting heavy brackets included'
            ]
        },
        {
            id: 'prod-03',
            title: 'Stainless Steel (SS304/SS316) Boxes',
            category: 'stainless',
            category_label: 'Stainless Series',
            image_url: 'assets/images/product-stainless-steel.jpg',
            ip_rating: 'IP66 / SS304',
            summary: 'Corrosion-resistant stainless enclosures for pharma, food processing, and coastal plants. Sanitary and non-reactive.',
            material: 'AISI 304 / AISI 316 Stainless Steel (1.6mm / 2.0mm)',
            features: [
                'Scotch-Brite brushed satin linishing (grain 240)',
                'IP66 washdown water-tight protection',
                'Heavy-duty stainless steel hinges and locks',
                'Food-grade silicone or PU door seal'
            ]
        },
        {
            id: 'prod-04',
            title: 'Outdoor Feeder Pillars',
            category: 'outdoor',
            category_label: 'Distribution Series',
            image_url: 'assets/images/product-feeder-pillar.jpg',
            ip_rating: 'IP55 Weatherproof',
            summary: 'Outdoor power distribution pillars with rain canopies, insect-screened ventilation, and tamper-resistant 3-point locking.',
            material: '2.0mm Galvanized Iron (GI) / CRCA Sheet Metal',
            features: [
                'Sloped rain canopy overhang roof design',
                'Natural convection ventilation louvers with brass mesh',
                'Padlockable 3-point espagnolette latch mechanism',
                'Ground-burial root plinth or flange mounting base'
            ]
        },
        {
            id: 'prod-05',
            title: 'Operator Console Desks',
            category: 'console',
            category_label: 'HMI Workstation',
            image_url: 'assets/images/product-console-desk.jpg',
            ip_rating: 'IP54 / Ergonomic',
            summary: 'Ergonomic control desks for factory plants and automated lines. Laser cutouts for screens, meters, and pushbuttons.',
            material: '1.6mm / 2.0mm CRCA Sheet',
            features: [
                'Sloped desk top with pneumatic gas struts for easy lifting',
                'Laser cutouts for HMI screens, pushbuttons & meters',
                'Rear & bottom cable management access doors',
                'Dual-tone powder coat finish for high aesthetics'
            ]
        },
        {
            id: 'prod-06',
            title: 'Custom Junction Boxes',
            category: 'junction',
            category_label: 'Terminal Series',
            image_url: 'assets/images/product-junction-boxes.jpg',
            ip_rating: 'IP65 Ingress',
            summary: 'Precision-punched terminal and junction enclosures for cable marshalling and instrumentation. DIN rail brackets included.',
            material: '1.2mm - 1.6mm CRCA / GI / SS304 Sheet',
            features: [
                'Screw-cover or hinged door configurations',
                'DIN-rail mounting brackets & internal earthing studs',
                'Custom punch array for multi-cable glands',
                'Oil-resistant continuous PU foam gasketing'
            ]
        }
    ];

    let storeProducts = [...defaultStoreProducts];
    let rfqCart = {};
    try {
        const savedCart = localStorage.getItem('sks_rfq_cart');
        if (savedCart) rfqCart = JSON.parse(savedCart);
    } catch (e) {
        rfqCart = {};
    }

    let activeCategory = 'all';
    let activeSubfilter = 'all';
    let searchQuery = '';

    // Save cart state
    function saveCartState() {
        try {
            localStorage.setItem('sks_rfq_cart', JSON.stringify(rfqCart));
        } catch (e) {
            console.warn('Could not save cart:', e);
        }
        updateCartUI();
    }

    // Add Item to RFQ Cart
    window.addToRfqCart = function(productId) {
        const prod = storeProducts.find(p => p.id === productId);
        if (!prod) return;

        if (!rfqCart[productId]) {
            rfqCart[productId] = {
                id: prod.id,
                title: prod.title,
                category: prod.category,
                category_label: prod.category_label || (prod.category.toUpperCase()),
                image_url: prod.image_url,
                ip_rating: prod.ip_rating || 'IP65',
                material: prod.material || 'Sheet Metal',
                qty: 1
            };
        } else {
            rfqCart[productId].qty += 1;
        }
        saveCartState();
    };

    // Decrement item quantity
    window.decrementRfqCart = function(productId) {
        if (!rfqCart[productId]) return;
        rfqCart[productId].qty -= 1;
        if (rfqCart[productId].qty <= 0) {
            delete rfqCart[productId];
        }
        saveCartState();
    };

    // Remove item completely
    window.removeRfqCart = function(productId) {
        if (rfqCart[productId]) {
            delete rfqCart[productId];
            saveCartState();
        }
    };

    // Update Cart UI across the page
    function updateCartUI() {
        const itemIds = Object.keys(rfqCart);
        const totalItems = itemIds.reduce((sum, id) => sum + rfqCart[id].qty, 0);
        const uniqueModels = itemIds.length;

        // Header Cart Badge
        const headerCount = document.getElementById('headerCartCount');
        if (headerCount) {
            headerCount.textContent = totalItems;
        }

        // Floating Bottom Cart Bar
        const floatBar = document.getElementById('floatingCartBar');
        const floatCount = document.getElementById('floatingCartCount');
        const floatSummary = document.getElementById('floatingCartSummary');
        if (floatBar) {
            if (totalItems > 0) {
                floatBar.style.display = 'block';
                document.body.classList.add('has-active-cart');
                if (floatCount) floatCount.textContent = totalItems;
                if (floatSummary) floatSummary.textContent = `${totalItems} Enclosure ${totalItems === 1 ? 'Unit' : 'Units'} in RFQ Quote Basket`;
            } else {
                floatBar.style.display = 'none';
                document.body.classList.remove('has-active-cart');
            }
        }

        // Drawer Counter & Items
        const drawerBadge = document.getElementById('drawerItemCountBadge');
        if (drawerBadge) {
            drawerBadge.textContent = `${uniqueModels} ${uniqueModels === 1 ? 'Model' : 'Models'}`;
        }

        const drawerList = document.getElementById('drawerItemList');
        if (drawerList) {
            if (uniqueModels === 0) {
                drawerList.innerHTML = `
                    <div style="text-align: center; padding: 2.5rem 1rem; color: #94A3B8;">
                        <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor" style="opacity: 0.35; margin-bottom: 0.75rem;"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
                        <h4 style="color: #475569; margin: 0 0 0.35rem 0;">Your RFQ Quote Basket is Empty</h4>
                        <p style="font-size: 0.85rem; margin: 0;">Click the green <strong>ADD +</strong> button on any enclosure to request a commercial quote.</p>
                    </div>`;
            } else {
                drawerList.innerHTML = itemIds.map(id => {
                    const item = rfqCart[id];
                    return `
                    <div class="b-cart-item">
                        <img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.title)}" class="b-cart-item-img">
                        <div class="b-cart-item-info">
                            <h4 class="b-cart-item-title">${escapeHtml(item.title)}</h4>
                            <div class="b-cart-item-meta">${escapeHtml(item.ip_rating)} &bull; ${escapeHtml(item.material)}</div>
                        </div>
                        <div class="b-cart-item-actions">
                            <div class="b-stepper">
                                <button type="button" class="b-stepper-btn" onclick="decrementRfqCart('${id}')">&minus;</button>
                                <span class="b-stepper-val">${item.qty}</span>
                                <button type="button" class="b-stepper-btn" onclick="addToRfqCart('${id}')">+</button>
                            </div>
                            <button type="button" class="b-cart-item-delete" onclick="removeRfqCart('${id}')" title="Remove">&times;</button>
                        </div>
                    </div>`;
                }).join('');
            }
        }

        // Update all button wraps on cards
        storeProducts.forEach(prod => {
            const actionWrap = document.getElementById(`action-${prod.id}`);
            if (actionWrap) {
                const qty = rfqCart[prod.id] ? rfqCart[prod.id].qty : 0;
                if (qty > 0) {
                    actionWrap.innerHTML = `
                        <div class="b-stepper">
                            <button type="button" class="b-stepper-btn" onclick="decrementRfqCart('${prod.id}')">&minus;</button>
                            <span class="b-stepper-val">${qty}</span>
                            <button type="button" class="b-stepper-btn" onclick="addToRfqCart('${prod.id}')">+</button>
                        </div>`;
                } else {
                    actionWrap.innerHTML = `
                        <button type="button" class="b-add-btn" onclick="addToRfqCart('${prod.id}')">
                            ADD <span class="plus-icon">+</span>
                        </button>`;
                }
            }
        });
    }

    // Slide-Over Drawer Controls
    window.openRfqDrawer = function() {
        const overlay = document.getElementById('rfqDrawerOverlay');
        const panel = document.getElementById('rfqDrawerPanel');
        if (overlay && panel) {
            overlay.classList.add('active');
            panel.classList.add('active');
            document.body.style.overflow = 'hidden';
            updateCartUI();
        }
    };

    window.closeRfqDrawer = function() {
        const overlay = document.getElementById('rfqDrawerOverlay');
        const panel = document.getElementById('rfqDrawerPanel');
        if (overlay && panel) {
            overlay.classList.remove('active');
            panel.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Quick Specs Modal Controls
    window.openQuickSpecsModal = function(productId) {
        const prod = storeProducts.find(p => p.id === productId);
        if (!prod) return;

        const modal = document.getElementById('quickSpecsModal');
        const content = document.getElementById('quickSpecsContent');
        if (!modal || !content) return;

        const feats = Array.isArray(prod.features) ? prod.features : [];
        content.innerHTML = `
            <div style="display: flex; gap: 1.5rem; align-items: flex-start; flex-wrap: wrap;">
                <div style="width: 220px; flex-shrink: 0; background: #F8FAFC; border-radius: 12px; padding: 1rem; border: 1px solid #E2E8F0; text-align: center;">
                    <img src="${escapeHtml(prod.image_url)}" alt="${escapeHtml(prod.title)}" style="max-width: 100%; max-height: 200px; object-fit: contain;">
                    <div style="margin-top: 0.75rem; font-size: 0.75rem; font-weight: 700; color: #0C831F; background: #DCFCE7; padding: 0.3rem 0.6rem; border-radius: 999px;">
                        ${escapeHtml(prod.ip_rating || 'IP65 Verified')}
                    </div>
                </div>
                <div style="flex-grow: 1; min-width: 260px;">
                    <span style="font-size: 0.78rem; text-transform: uppercase; font-weight: 700; color: #00A896;">${escapeHtml(prod.category_label || 'Enclosure Specs')}</span>
                    <h3 style="font-size: 1.35rem; margin: 0.25rem 0 0.5rem 0; color: #0F172A;">${escapeHtml(prod.title)}</h3>
                    <p style="font-size: 0.88rem; color: #475569; line-height: 1.5; margin-bottom: 1rem;">${escapeHtml(prod.summary || '')}</p>
                    
                    <div style="background: #F1F5F9; border-radius: 8px; padding: 0.85rem; margin-bottom: 1rem;">
                        <div style="font-size: 0.8rem; font-weight: 700; color: #1E293B; margin-bottom: 0.35rem;">Technical Construction:</div>
                        <div style="font-size: 0.82rem; color: #334155;"><strong>Material:</strong> ${escapeHtml(prod.material || 'CRCA / GI Sheet')}</div>
                    </div>

                    ${feats.length ? `
                    <div style="margin-bottom: 1.25rem;">
                        <strong style="font-size: 0.82rem; color: #0F172A; display: block; margin-bottom: 0.4rem;">Engineering Features:</strong>
                        <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.82rem; color: #475569; line-height: 1.6;">
                            ${feats.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
                        </ul>
                    </div>` : ''}

                    <div style="display: flex; gap: 0.75rem;">
                        <button type="button" class="btn btn-lime btn-sm" onclick="addToRfqCart('${prod.id}'); closeQuickSpecsModal(); openRfqDrawer();" style="flex-grow: 1; justify-content: center;">
                            Add to RFQ Quote Basket &rarr;
                        </button>
                    </div>
                </div>
            </div>`;

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    window.closeQuickSpecsModal = function() {
        const modal = document.getElementById('quickSpecsModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    // Submit RFQ via WhatsApp
    window.submitRfqViaWhatsApp = function() {
        const itemIds = Object.keys(rfqCart);
        if (itemIds.length === 0) {
            alert('Please add at least one enclosure model to your RFQ Quote Basket.');
            return;
        }

        const name = (document.getElementById('rfqUserName')?.value || '').trim() || 'Purchaser';
        const company = (document.getElementById('rfqUserCompany')?.value || '').trim() || 'Client Company';
        const phone = (document.getElementById('rfqUserPhone')?.value || '').trim();
        const email = (document.getElementById('rfqUserEmail')?.value || '').trim();
        const customSpecs = (document.getElementById('rfqCustomSpecs')?.value || '').trim();

        let message = `*RFQ INQUIRY - SKS ENGINEERING SOLUTIONS*\n`;
        message += `=====================================\n`;
        message += `*Client:* ${name}\n`;
        message += `*Company:* ${company}\n`;
        if (phone) message += `*Contact:* ${phone}\n`;
        if (email) message += `*Email:* ${email}\n\n`;
        message += `*REQUESTED ENCLOSURE MODELS:*\n`;

        itemIds.forEach((id, idx) => {
            const item = rfqCart[id];
            message += `${idx + 1}. *${item.title}* - Qty: ${item.qty} units (${item.ip_rating})\n`;
        });

        if (customSpecs) {
            message += `\n*TARGET DIMENSIONS & SPECS:*\n${customSpecs}\n`;
        }

        message += `\n=====================================\n`;
        message += `Please review technical feasibility and share a formal estimation proposal.`;

        const waUrl = `https://api.whatsapp.com/send?phone=918668742659&text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    };

    // Submit RFQ to Cloud Database
    window.submitRfqToDatabase = async function() {
        const itemIds = Object.keys(rfqCart);
        if (itemIds.length === 0) {
            alert('Your RFQ basket is empty. Please add an enclosure model.');
            return;
        }

        const nameInput = document.getElementById('rfqUserName');
        const companyInput = document.getElementById('rfqUserCompany');
        const phoneInput = document.getElementById('rfqUserPhone');
        const emailInput = document.getElementById('rfqUserEmail');
        const customSpecsInput = document.getElementById('rfqCustomSpecs');

        const name = (nameInput?.value || '').trim();
        const company = (companyInput?.value || '').trim();
        const phone = (phoneInput?.value || '').trim();
        const email = (emailInput?.value || '').trim();
        const customSpecs = (customSpecsInput?.value || '').trim();

        if (!name || !company || (!phone && !email)) {
            alert('Please provide your Name, Company, and Mobile Number or Work Email to submit the quotation request.');
            if (nameInput && !name) nameInput.focus();
            return;
        }

        const submitBtn = document.getElementById('btnSubmitDesk');
        if (submitBtn) {
            submitBtn.innerText = 'Submitting to Engineering Desk...';
            submitBtn.disabled = true;
        }

        const itemsSummary = itemIds.map(id => `${rfqCart[id].title} (x${rfqCart[id].qty})`).join(', ');
        const fullMessage = `Items: ${itemsSummary}\n\nCustom Specs / Dimensions: ${customSpecs || 'Standard CAD specs'}`;

        if (window.SKS_DB && typeof window.SKS_DB.submitInquiry === 'function') {
            try {
                await window.SKS_DB.submitInquiry({
                    name,
                    company,
                    phone,
                    email,
                    product_interest: `Store RFQ (${itemIds.length} Models)`,
                    message: fullMessage
                });
            } catch (err) {
                console.warn('Database note:', err);
            }
        }

        alert(`Quotation Request Received! Thank you, ${name}. Our engineering estimation desk will review your CAD specs and contact you within 24–48 hours.`);
        
        // Reset Cart
        rfqCart = {};
        saveCartState();
        closeRfqDrawer();

        if (submitBtn) {
            submitBtn.innerText = 'Submit RFQ to Engineering Desk \u2192';
            submitBtn.disabled = false;
        }
    };

    // Filtering logic
    function filterAndRenderStoreCards() {
        const cards = document.querySelectorAll('#productsCatalog .b-card');
        let visibleCount = 0;

        cards.forEach(card => {
            const cat = card.getAttribute('data-category') || '';
            const ip = card.getAttribute('data-ip') || '';
            const textContent = card.innerText.toLowerCase();

            const matchCat = (activeCategory === 'all' || cat === activeCategory);
            const matchSub = (activeSubfilter === 'all' || ip === activeSubfilter || cat.includes(activeSubfilter));
            const matchSearch = (!searchQuery || textContent.includes(searchQuery));

            if (matchCat && matchSub && matchSearch) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        const countLabel = document.getElementById('catalogResultsCount');
        if (countLabel) {
            countLabel.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? 'model' : 'models'}`;
        }

        const heading = document.getElementById('currentCategoryTitle');
        if (heading) {
            const catMap = {
                all: 'All Enclosures',
                modular: 'Modular Floor-Standing Cabinets',
                wallmount: 'Wall-Mounted Enclosures',
                stainless: 'Stainless Steel SS304/SS316',
                outdoor: 'Outdoor Feeder Pillars',
                console: 'Operator Console Desks',
                junction: 'Custom Sheet Metal Junction Boxes'
            };
            heading.textContent = catMap[activeCategory] || 'Enclosures Portfolio';
        }
    }

    // Bind Blinkit Controls
    function initBlinkitStore() {
        // Search Input
        const searchInput = document.getElementById('catalogSearchInput');
        const clearBtn = document.getElementById('clearSearchBtn');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.toLowerCase().trim();
                if (clearBtn) clearBtn.style.display = searchQuery ? 'block' : 'none';
                filterAndRenderStoreCards();
            });
        }
        if (clearBtn && searchInput) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                searchQuery = '';
                clearBtn.style.display = 'none';
                filterAndRenderStoreCards();
                searchInput.focus();
            });
        }

        // Category Navigation (Desktop Rail & Mobile Chips)
        const catButtons = document.querySelectorAll('#desktopCatNav .rail-btn, #mobileCatRail .b-cat-chip, #productFilterBar .filter-btn');
        catButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetCat = btn.getAttribute('data-filter') || 'all';
                activeCategory = targetCat;

                // Sync all button active states
                document.querySelectorAll('#desktopCatNav .rail-btn, #mobileCatRail .b-cat-chip, #productFilterBar .filter-btn').forEach(b => {
                    if (b.getAttribute('data-filter') === targetCat) {
                        b.classList.add('active');
                    } else {
                        b.classList.remove('active');
                    }
                });

                filterAndRenderStoreCards();
            });
        });

        // Subfilter Chips
        const subChips = document.querySelectorAll('#subfilterChips .chip-tag');
        subChips.forEach(chip => {
            chip.addEventListener('click', () => {
                subChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                activeSubfilter = chip.getAttribute('data-subfilter') || 'all';
                filterAndRenderStoreCards();
            });
        });

        // Cart Drawer Triggers
        const headerCartBtn = document.getElementById('openCartHeaderBtn');
        if (headerCartBtn) headerCartBtn.addEventListener('click', openRfqDrawer);

        const cartBarTrigger = document.getElementById('cartBarOpenTrigger');
        if (cartBarTrigger) cartBarTrigger.addEventListener('click', openRfqDrawer);

        const cartBarActionBtn = document.getElementById('cartBarActionBtn');
        if (cartBarActionBtn) cartBarActionBtn.addEventListener('click', openRfqDrawer);

        const closeDrawer = document.getElementById('closeDrawerBtn');
        if (closeDrawer) closeDrawer.addEventListener('click', closeRfqDrawer);

        const overlay = document.getElementById('rfqDrawerOverlay');
        if (overlay) overlay.addEventListener('click', closeRfqDrawer);

        // Quick Specs Modal Triggers
        const closeSpecsBtn = document.getElementById('closeSpecsModalBtn');
        if (closeSpecsBtn) closeSpecsBtn.addEventListener('click', closeQuickSpecsModal);

        const specsModal = document.getElementById('quickSpecsModal');
        if (specsModal) {
            specsModal.addEventListener('click', (e) => {
                if (e.target === specsModal) closeQuickSpecsModal();
            });
        }

        // Esc key closes drawer and specs
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeRfqDrawer();
                closeQuickSpecsModal();
            }
        });

        updateCartUI();
    }

    // Dynamic Cloud Products Render (if Supabase / SKS_DB is available)
    async function loadDynamicProducts() {
        if (!productsCatalog) return;
        if (window.SKS_DB && typeof window.SKS_DB.getProducts === 'function') {
            try {
                const cloudProds = await window.SKS_DB.getProducts();
                if (cloudProds && cloudProds.length > 0) {
                    storeProducts = cloudProds;
                    productsCatalog.innerHTML = cloudProds.map((p, idx) => {
                        const delayClass = idx % 3 === 1 ? ' reveal-delay' : (idx % 3 === 2 ? ' reveal-delay-2' : '');
                        return `
                        <div class="b-card reveal${delayClass}" data-category="${escapeHtml(p.category)}" data-product-id="${escapeHtml(p.id)}" data-ip="${escapeHtml((p.ip_rating || '').toLowerCase())}">
                            <div class="b-card-img-box" onclick="window.openQuickSpecsModal('${escapeHtml(p.id)}')">
                                <div class="b-tag-top-left">⚡ 7–10 Days Lead</div>
                                <div class="b-tag-top-right">${escapeHtml(p.ip_rating || 'IP65')}</div>
                                <img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.title)}" width="1200" height="896" loading="lazy" decoding="async">
                                <button type="button" class="b-quick-view-btn" aria-label="Quick specs preview">Specs &bull; View</button>
                            </div>
                            <div class="b-card-details">
                                <div class="b-card-lead-time">⏱️ 7–10 Days &bull; ${escapeHtml(p.category_label || 'Enclosures')}</div>
                                <h4 class="b-card-title">${escapeHtml(p.title)}</h4>
                                <div class="b-card-specs-pill">${escapeHtml(p.material || 'Sheet Metal')}</div>
                                <p class="b-card-desc">${escapeHtml(p.summary || '')}</p>
                                <div class="b-card-footer">
                                    <div class="b-price-stack">
                                        <span class="b-price-tag">Custom CAD Pricing</span>
                                        <span class="b-price-sub">Bespoke H &times; W &times; D</span>
                                    </div>
                                    <div class="b-action-wrap" id="action-${escapeHtml(p.id)}">
                                        <button type="button" class="b-add-btn" onclick="window.addToRfqCart('${escapeHtml(p.id)}')">
                                            ADD <span class="plus-icon">+</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    }).join('');

                    updateCartUI();
                    filterAndRenderStoreCards();
                }
            } catch (err) {
                console.warn('Could not load dynamic products, retaining store cards:', err);
            }
        }
    }

    initBlinkitStore();
    loadDynamicProducts();

    // ==========================================================================
    // 7b. Homepage Dynamic Product Categories Filter & RFQ Pre-fill
    // ==========================================================================
    const homeProductFilters = document.querySelectorAll('#productFilterBar .filter-btn');
    const homeProductCards = document.querySelectorAll('#homeProductsGrid .product-card');

    if (homeProductFilters.length && homeProductCards.length) {
        homeProductFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                homeProductFilters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const targetCat = (btn.getAttribute('data-filter') || 'all').toLowerCase();

                homeProductCards.forEach(card => {
                    const cardCat = (card.getAttribute('data-category') || '').toLowerCase();
                    if (targetCat === 'all' || cardCat === targetCat) {
                        card.style.display = '';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(12px)';
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 20);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Connect Homepage Product RFQ Buttons to the Contact Form
    document.querySelectorAll('#homeProductsGrid .product-card a[href="#contact"]').forEach(link => {
        link.addEventListener('click', () => {
            const card = link.closest('.product-card');
            const title = card ? card.querySelector('h3')?.textContent?.trim() : '';
            if (title) {
                const serviceSelect = document.getElementById('serviceCategory');
                if (serviceSelect) {
                    for (let opt of serviceSelect.options) {
                        if (opt.value && title.toLowerCase().includes(opt.value.toLowerCase().slice(0, 10))) {
                            serviceSelect.value = opt.value;
                            break;
                        }
                    }
                }
            }
        });
    });


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
        const galleryGrids = document.querySelectorAll('.gallery-grid');
        if (!galleryGrids.length || !window.SKS_DB || typeof window.SKS_DB.getGallery !== 'function') return;
        try {
            const gallery = await window.SKS_DB.getGallery();
            if (gallery && gallery.length > 0) {
                galleryGrids.forEach(galleryGrid => {
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
                });
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

    // ==========================================================================
    // 16. Site-Wide SKS AI Engineering Assistant Loader Fallback
    // ==========================================================================
    if (!window.__SKS_CHATBOT_LOADED__ && !document.querySelector('script[src*="sks-chatbot.js"]')) {
        const chatScript = document.createElement('script');
        chatScript.src = 'assets/js/sks-chatbot.js?v=20261009';
        chatScript.async = true;
        document.body.appendChild(chatScript);
    }
});