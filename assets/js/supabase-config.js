/**
 * SKS Engineering Solutions - Supabase Dynamic CMS & Database Client
 * Handles real-time products, plant gallery, and RFQ inquiries
 */

'use strict';

const SKS_DB = (() => {
    // Default Storage Keys
    const STORAGE_URL_KEY = 'sks_supabase_url';
    const STORAGE_KEY_KEY = 'sks_supabase_anon_key';
    const STORAGE_PRODUCTS_KEY = 'sks_local_products';
    const STORAGE_GALLERY_KEY = 'sks_local_gallery';
    const STORAGE_INQUIRIES_KEY = 'sks_local_inquiries';

    // Default Seed Products (Used when database is new or offline)
    const DEFAULT_PRODUCTS = [
        {
            id: 'prod-01',
            title: 'Modular Floor-Standing Cabinets',
            category: 'modular',
            category_label: 'Electrical Enclosures • Panel Enclosures',
            image_url: 'assets/images/product-modular-enclosure.jpg',
            ip_rating: 'IP55 / IP65',
            summary: 'Heavy-gauge sheet metal modular cabinets with 9-fold profile corners, removable gland plates, and full plinth bases. Engineered for LT/HT switchgear and MCC panels.',
            material: 'Prime CRCA Sheet (2.0mm frame / 1.6mm covers)',
            features: [
                'Modular multi-bay interlockable frame system',
                'Continuous formed polyurethane (PU) foamed gasket',
                'Depth-adjustable passivated galvanized mounting plate',
                'Standard 100mm / 200mm cable entry plinth base'
            ],
            display_order: 1
        },
        {
            id: 'prod-02',
            title: 'Wall-Mounted Enclosures',
            category: 'wallmount',
            category_label: 'Customized Electrical Enclosures',
            image_url: 'assets/images/product-wall-mount-enclosure.jpg',
            ip_rating: 'IP65 Standard',
            summary: 'Compact, rigid sheet metal boxes designed for field instrumentation, lighting distribution, and PLC remote I/O nodes. Equipped with concealed hinges and quarter-turn cam latches.',
            material: '1.6mm CRCA / GI Sheet Metal',
            features: [
                'IP65 continuous polyurethane foam seal',
                '120° reversible door opening with earthing studs',
                'Removable bottom cable entry gland plate',
                'External wall-mounting heavy brackets included'
            ],
            display_order: 2
        },
        {
            id: 'prod-03',
            title: 'Stainless Steel (SS304/SS316) Boxes',
            category: 'stainless',
            category_label: 'Industrial Enclosures • Fabricated Metal',
            image_url: 'assets/images/product-stainless-steel.jpg',
            ip_rating: 'IP66 / SS304',
            summary: 'Corrosion-resistant stainless steel enclosures designed for food processing, pharmaceutical cleanrooms, chemical plants, and marine coastal environments. Non-reactive and easy to sanitize.',
            material: 'AISI 304 or AISI 316 Stainless Steel (1.6mm / 2.0mm)',
            features: [
                'Scotch-Brite brushed satin linishing (grain 240)',
                'IP66 washdown water-tight protection',
                'Heavy-duty stainless steel hinges and locks',
                'Food-grade silicone or PU door seal'
            ],
            display_order: 3
        },
        {
            id: 'prod-04',
            title: 'Outdoor Feeder Pillars',
            category: 'outdoor',
            category_label: 'Electrical Enclosures • Distribution Pillars',
            image_url: 'assets/images/product-feeder-pillar.jpg',
            ip_rating: 'IP55 Weatherproof',
            summary: 'Robust outdoor power distribution pillars designed with rain canopy roofs, insect-screened ventilation louvers, and reinforced 3-point locking systems.',
            material: '2.0mm Galvanized Iron (GI) / CRCA with 7-Tank Powder Coating',
            features: [
                'Sloped rain canopy overhang roof design',
                'Natural convection cross-ventilation louvers',
                'Padlockable 3-point espagnolette latch mechanism',
                'Ground-burial root plinth or flange mounting base'
            ],
            display_order: 4
        },
        {
            id: 'prod-05',
            title: 'Operator Console Desks',
            category: 'console',
            category_label: 'Client-Specific Enclosures • HMI Workstations',
            image_url: 'assets/images/product-console-desk.jpg',
            ip_rating: 'IP54 / Ergonomic',
            summary: 'Ergonomic sheet metal control desks engineered for factory control rooms, automated machinery cells, and process observation stations.',
            material: '1.6mm / 2.0mm CRCA Sheet',
            features: [
                'Sloped desk top with pneumatic gas struts for easy lifting',
                'Laser cutouts for HMI screens, pushbuttons & meters',
                'Rear & bottom cable management access doors',
                'Dual-tone powder coat finish for high aesthetics'
            ],
            display_order: 5
        },
        {
            id: 'prod-06',
            title: 'Custom Junction Boxes',
            category: 'junction',
            category_label: 'Customized Enclosures • Terminal Boxes',
            image_url: 'assets/images/product-junction-boxes.jpg',
            ip_rating: 'IP65 Ingress',
            summary: 'Precision-punched terminal and junction enclosures designed for cable marshalling, solar string combiner boxes, and instrumentation junctions.',
            material: '1.2mm - 1.6mm CRCA / GI / SS304 Sheet',
            features: [
                'Screw-cover or hinged door configurations',
                'DIN-rail mounting brackets & internal earthing studs',
                'Custom punch array for multi-cable glands',
                'Oil-resistant continuous PU foam gasketing'
            ],
            display_order: 6
        }
    ];

    // Default Seed Gallery Items
    const DEFAULT_GALLERY = [
        {
            id: 'gal-01',
            title: '3-Bay Modular Panel Suite',
            description: 'Precision CNC-cut compartments, door hinges, and cable entry cutouts.',
            image_url: 'assets/images/panels/panel-modular-suite.jpg',
            category: 'modular',
            display_order: 1
        },
        {
            id: 'gal-02',
            title: '4-Bay Interconnected Panel Frame',
            description: 'Continuous multi-bay frame with internal segregation & top ventilation openings.',
            image_url: 'assets/images/panels/panel-modular-4bay.jpg',
            category: 'modular',
            display_order: 2
        },
        {
            id: 'gal-03',
            title: 'Modular Suite Production Lineup',
            description: 'Factory floor assembly of multi-bay structural enclosures for OEM clients.',
            image_url: 'assets/images/panels/panel-modular-lineup.jpg',
            category: 'production',
            display_order: 3
        },
        {
            id: 'gal-04',
            title: 'Single-Bay Floor-Standing Cabinet',
            description: 'Heavy-duty channel plinth, depth-adjustable rails, and lifting eye bolts.',
            image_url: 'assets/images/panels/panel-single-bay-frame.jpg',
            category: 'cabinet',
            display_order: 4
        },
        {
            id: 'gal-05',
            title: 'Dispatch-Ready Protected Enclosure',
            description: 'Powder-coated double-door cabinet with meter cutouts, palletized & stretch wrapped.',
            image_url: 'assets/images/panels/panel-doubledoor-wrapped.jpg',
            category: 'dispatch',
            display_order: 5
        },
        {
            id: 'gal-06',
            title: 'Double Door Rear Access Enclosure',
            description: 'Full-height rear access doors with 3-point espagnolette locking.',
            image_url: 'assets/images/panels/panel-double-door-rear.jpg',
            category: 'doubledoor',
            display_order: 6
        }
    ];

    let supabaseClient = null;

    /**
     * Get configured Supabase Credentials
     */
    function getCredentials() {
        const url = localStorage.getItem(STORAGE_URL_KEY) || window.SKS_SUPABASE_URL || '';
        const key = localStorage.getItem(STORAGE_KEY_KEY) || window.SKS_SUPABASE_ANON_KEY || '';
        return { url, key };
    }

    /**
     * Save Supabase credentials
     */
    function setCredentials(url, key) {
        if (url) localStorage.setItem(STORAGE_URL_KEY, url.trim());
        if (key) localStorage.setItem(STORAGE_KEY_KEY, key.trim());
        initClient();
    }

    /**
     * Initialize the Supabase Client
     */
    function initClient() {
        const { url, key } = getCredentials();
        if (url && key && window.supabase && typeof window.supabase.createClient === 'function') {
            try {
                supabaseClient = window.supabase.createClient(url, key);
                console.log('✅ SKS Supabase Client successfully initialized');
                return true;
            } catch (err) {
                console.warn('⚠️ Could not initialize Supabase Client:', err);
                supabaseClient = null;
            }
        }
        return false;
    }

    // Try initializing on load
    if (typeof window !== 'undefined') {
        window.addEventListener('DOMContentLoaded', () => {
            initClient();
        });
    }

    /**
     * Test connection to Supabase
     */
    async function testConnection() {
        if (!supabaseClient) {
            initClient();
        }
        if (!supabaseClient) {
            return { success: false, message: 'Supabase URL and Anon Key are not configured.' };
        }
        try {
            const { data, error } = await supabaseClient.from('products').select('count', { count: 'exact', head: true });
            if (error) throw error;
            return { success: true, message: 'Connected to Supabase successfully!' };
        } catch (err) {
            return { success: false, message: err.message || 'Connection failed.' };
        }
    }

    // =========================================================================
    // Local / Fallback Storage Handlers
    // =========================================================================
    function getLocalProducts() {
        try {
            const stored = localStorage.getItem(STORAGE_PRODUCTS_KEY);
            if (stored) return JSON.parse(stored);
        } catch (e) {
            console.error('Error reading local products', e);
        }
        return DEFAULT_PRODUCTS;
    }

    function saveLocalProducts(products) {
        localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
    }

    function getLocalGallery() {
        try {
            const stored = localStorage.getItem(STORAGE_GALLERY_KEY);
            if (stored) return JSON.parse(stored);
        } catch (e) {
            console.error('Error reading local gallery', e);
        }
        return DEFAULT_GALLERY;
    }

    function saveLocalGallery(gallery) {
        localStorage.setItem(STORAGE_GALLERY_KEY, JSON.stringify(gallery));
    }

    function getLocalInquiries() {
        try {
            const stored = localStorage.getItem(STORAGE_INQUIRIES_KEY);
            if (stored) return JSON.parse(stored);
        } catch (e) {
            console.error('Error reading local inquiries', e);
        }
        return [];
    }

    function saveLocalInquiries(inquiries) {
        localStorage.setItem(STORAGE_INQUIRIES_KEY, JSON.stringify(inquiries));
    }

    // =========================================================================
    // Product Operations (CRUD)
    // =========================================================================
    async function getProducts() {
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('products')
                    .select('*')
                    .order('display_order', { ascending: true });
                if (!error && data && data.length > 0) {
                    return data;
                }
            } catch (err) {
                console.warn('Falling back to local products:', err.message);
            }
        }
        return getLocalProducts();
    }

    async function addProduct(product) {
        const newProduct = {
            id: product.id || 'prod-' + Date.now(),
            title: product.title,
            category: product.category,
            category_label: product.category_label || (product.category.toUpperCase() + ' ENCLOSURE'),
            image_url: product.image_url || 'assets/images/product-modular-enclosure.jpg',
            ip_rating: product.ip_rating || 'IP55 / IP65',
            summary: product.summary || '',
            material: product.material || 'CRCA / GI Sheet Metal',
            features: Array.isArray(product.features) ? product.features : (product.features ? product.features.split('\n').filter(Boolean) : []),
            display_order: parseInt(product.display_order, 10) || 99,
            created_at: new Date().toISOString()
        };

        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.from('products').insert([newProduct]).select();
                if (error) throw error;
                return { success: true, data: data[0] };
            } catch (err) {
                console.error('Supabase insert product error:', err);
            }
        }

        // Local fallback
        const local = getLocalProducts();
        local.push(newProduct);
        saveLocalProducts(local);
        return { success: true, data: newProduct };
    }

    async function updateProduct(id, updates) {
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('products')
                    .update(updates)
                    .eq('id', id)
                    .select();
                if (error) throw error;
                return { success: true, data: data[0] };
            } catch (err) {
                console.error('Supabase update product error:', err);
            }
        }

        // Local fallback
        const local = getLocalProducts();
        const idx = local.findIndex(p => p.id === id);
        if (idx !== -1) {
            local[idx] = { ...local[idx], ...updates };
            saveLocalProducts(local);
            return { success: true, data: local[idx] };
        }
        return { success: false, message: 'Product not found' };
    }

    async function deleteProduct(id) {
        if (supabaseClient) {
            try {
                const { error } = await supabaseClient.from('products').delete().eq('id', id);
                if (error) throw error;
                return { success: true };
            } catch (err) {
                console.error('Supabase delete product error:', err);
            }
        }

        const local = getLocalProducts();
        const filtered = local.filter(p => p.id !== id);
        saveLocalProducts(filtered);
        return { success: true };
    }

    // =========================================================================
    // Gallery Operations (CRUD)
    // =========================================================================
    async function getGallery() {
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('gallery')
                    .select('*')
                    .order('display_order', { ascending: true });
                if (!error && data && data.length > 0) {
                    return data;
                }
            } catch (err) {
                console.warn('Falling back to local gallery:', err.message);
            }
        }
        return getLocalGallery();
    }

    async function addGalleryItem(item) {
        const newItem = {
            id: item.id || 'gal-' + Date.now(),
            title: item.title,
            description: item.description || '',
            image_url: item.image_url,
            category: item.category || 'enclosure',
            display_order: parseInt(item.display_order, 10) || 99,
            created_at: new Date().toISOString()
        };

        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.from('gallery').insert([newItem]).select();
                if (error) throw error;
                return { success: true, data: data[0] };
            } catch (err) {
                console.error('Supabase insert gallery error:', err);
            }
        }

        const local = getLocalGallery();
        local.push(newItem);
        saveLocalGallery(local);
        return { success: true, data: newItem };
    }

    async function deleteGalleryItem(id) {
        if (supabaseClient) {
            try {
                const { error } = await supabaseClient.from('gallery').delete().eq('id', id);
                if (error) throw error;
                return { success: true };
            } catch (err) {
                console.error('Supabase delete gallery error:', err);
            }
        }

        const local = getLocalGallery();
        const filtered = local.filter(g => g.id !== id);
        saveLocalGallery(filtered);
        return { success: true };
    }

    // =========================================================================
    // Inquiry / RFQ Lead Operations
    // =========================================================================
    async function submitInquiry(inquiry) {
        const record = {
            id: 'inq-' + Date.now(),
            name: inquiry.name || 'Anonymous',
            email: inquiry.email || '',
            phone: inquiry.phone || '',
            company: inquiry.company || '',
            industry: inquiry.industry || 'General Engineering',
            product_interest: inquiry.product_interest || inquiry.product || 'Custom Enclosure',
            message: inquiry.message || '',
            status: 'new', // new, contacted, quoted, closed
            created_at: new Date().toISOString()
        };

        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.from('inquiries').insert([record]).select();
                if (!error) {
                    return { success: true, data: data[0], remote: true };
                }
                console.error('Supabase inquiry insert error:', error);
            } catch (err) {
                console.error('Inquiry submission error:', err);
            }
        }

        // Store locally
        const local = getLocalInquiries();
        local.unshift(record);
        saveLocalInquiries(local);
        return { success: true, data: record, remote: false };
    }

    async function getInquiries() {
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('inquiries')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (!error && data) {
                    return data;
                }
            } catch (err) {
                console.error('Supabase fetch inquiries error:', err);
            }
        }
        return getLocalInquiries();
    }

    async function updateInquiryStatus(id, newStatus) {
        if (supabaseClient) {
            try {
                const { error } = await supabaseClient
                    .from('inquiries')
                    .update({ status: newStatus })
                    .eq('id', id);
                if (error) throw error;
                return { success: true };
            } catch (err) {
                console.error('Supabase update status error:', err);
            }
        }

        const local = getLocalInquiries();
        const idx = local.findIndex(i => i.id === id);
        if (idx !== -1) {
            local[idx].status = newStatus;
            saveLocalInquiries(local);
            return { success: true };
        }
        return { success: false, message: 'Inquiry not found' };
    }

    // Public API
    return {
        getCredentials,
        setCredentials,
        initClient,
        testConnection,
        getProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        getGallery,
        addGalleryItem,
        deleteGalleryItem,
        submitInquiry,
        getInquiries,
        updateInquiryStatus,
        DEFAULT_PRODUCTS,
        DEFAULT_GALLERY
    };
})();

// Attach to window
window.SKS_DB = SKS_DB;
