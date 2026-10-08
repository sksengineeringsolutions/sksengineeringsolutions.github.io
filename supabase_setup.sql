-- ==============================================================================
-- SKS Engineering Solutions - Supabase Database Schema & Setup Script
-- Tables: products, gallery, inquiries
-- ==============================================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- modular, wallmount, stainless, outdoor, console, junction
    category_label TEXT,
    image_url TEXT NOT NULL,
    ip_rating TEXT DEFAULT 'IP55 / IP65',
    summary TEXT,
    material TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 1
);

-- 2. Create Gallery / Plant Showcase Table
CREATE TABLE IF NOT EXISTS public.gallery (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'enclosure',
    display_order INTEGER DEFAULT 1
);

-- 3. Create RFQ Inquiries & Contact Leads Table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    company TEXT,
    industry TEXT,
    product_interest TEXT,
    message TEXT,
    status TEXT DEFAULT 'new' -- new, contacted, quoted, closed
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can view products" ON public.products;
DROP POLICY IF EXISTS "Public can view gallery" ON public.gallery;
DROP POLICY IF EXISTS "Public can insert inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admin full access products" ON public.products;
DROP POLICY IF EXISTS "Admin full access gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admin full access inquiries" ON public.inquiries;

-- Allow Public READ for products and gallery (Visitors see catalog)
CREATE POLICY "Public can view products" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Public can view gallery" ON public.gallery
    FOR SELECT USING (true);

-- Allow Public INSERT for inquiries (Visitors submit RFQ requests)
CREATE POLICY "Public can insert inquiries" ON public.inquiries
    FOR INSERT WITH CHECK (true);

-- Allow Full Access for Authenticated Backend / Service Role
CREATE POLICY "Admin full access products" ON public.products
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access gallery" ON public.gallery
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access inquiries" ON public.inquiries
    FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- Initial Seed Data: Populate current standard products & showcase photos
-- ==============================================================================
INSERT INTO public.products (id, title, category, category_label, image_url, ip_rating, summary, material, features, display_order)
VALUES
(
    'prod-01',
    'Modular Floor-Standing Cabinets',
    'modular',
    'Electrical Enclosures • Panel Enclosures',
    'assets/images/product-modular-enclosure.jpg',
    'IP55 / IP65',
    'Heavy-gauge sheet metal modular cabinets with 9-fold profile corners, removable gland plates, and full plinth bases. Engineered for LT/HT switchgear and MCC panels.',
    'Prime CRCA Sheet (2.0mm frame / 1.6mm covers)',
    '["Modular multi-bay interlockable frame system", "Continuous formed polyurethane (PU) foamed gasket", "Depth-adjustable passivated galvanized mounting plate", "Standard 100mm / 200mm cable entry plinth base"]'::jsonb,
    1
),
(
    'prod-02',
    'Wall-Mounted Enclosures',
    'wallmount',
    'Customized Electrical Enclosures',
    'assets/images/product-wall-mount-enclosure.jpg',
    'IP65 Standard',
    'Compact, rigid sheet metal boxes designed for field instrumentation, lighting distribution, and PLC remote I/O nodes. Equipped with concealed hinges and quarter-turn cam latches.',
    '1.6mm CRCA / GI Sheet Metal',
    '["IP65 continuous polyurethane foam seal", "120° reversible door opening with earthing studs", "Removable bottom cable entry gland plate", "External wall-mounting heavy brackets included"]'::jsonb,
    2
),
(
    'prod-03',
    'Stainless Steel (SS304/SS316) Boxes',
    'stainless',
    'Industrial Enclosures • Fabricated Metal',
    'assets/images/product-stainless-steel.jpg',
    'IP66 / SS304',
    'Corrosion-resistant stainless steel enclosures designed for food processing, pharmaceutical cleanrooms, chemical plants, and marine coastal environments. Non-reactive and easy to sanitize.',
    'AISI 304 or AISI 316 Stainless Steel (1.6mm / 2.0mm)',
    '["Scotch-Brite brushed satin linishing (grain 240)", "IP66 washdown water-tight protection", "Heavy-duty stainless steel hinges and locks", "Food-grade silicone or PU door seal"]'::jsonb,
    3
),
(
    'prod-04',
    'Outdoor Feeder Pillars',
    'outdoor',
    'Electrical Enclosures • Distribution Pillars',
    'assets/images/product-feeder-pillar.jpg',
    'IP55 Weatherproof',
    'Robust outdoor power distribution pillars designed with rain canopy roofs, insect-screened ventilation louvers, and reinforced 3-point locking systems.',
    '2.0mm Galvanized Iron (GI) / CRCA with 7-Tank Powder Coating',
    '["Sloped rain canopy overhang roof design", "Natural convection cross-ventilation louvers", "Padlockable 3-point espagnolette latch mechanism", "Ground-burial root plinth or flange mounting base"]'::jsonb,
    4
),
(
    'prod-05',
    'Operator Console Desks',
    'console',
    'Client-Specific Enclosures • HMI Workstations',
    'assets/images/product-console-desk.jpg',
    'IP54 / Ergonomic',
    'Ergonomic sheet metal control desks engineered for factory control rooms, automated machinery cells, and process observation stations.',
    '1.6mm / 2.0mm CRCA Sheet',
    '["Sloped desk top with pneumatic gas struts for easy lifting", "Laser cutouts for HMI screens, pushbuttons & meters", "Rear & bottom cable management access doors", "Dual-tone powder coat finish for high aesthetics"]'::jsonb,
    5
),
(
    'prod-06',
    'Custom Junction Boxes',
    'junction',
    'Customized Enclosures • Terminal Boxes',
    'assets/images/product-junction-boxes.jpg',
    'IP65 Ingress',
    'Precision-punched terminal and junction enclosures designed for cable marshalling, solar string combiner boxes, and instrumentation junctions.',
    '1.2mm - 1.6mm CRCA / GI / SS304 Sheet',
    '["Screw-cover or hinged door configurations", "DIN-rail mounting brackets & internal earthing studs", "Custom punch array for multi-cable glands", "Oil-resistant continuous PU foam gasketing"]'::jsonb,
    6
)
ON CONFLICT (id) DO NOTHING;

-- Seed Gallery
INSERT INTO public.gallery (id, title, description, image_url, category, display_order)
VALUES
('gal-01', '3-Bay Modular Panel Suite', 'Precision CNC-cut compartments, door hinges, and cable entry cutouts.', 'assets/images/panels/panel-modular-suite.jpg', 'modular', 1),
('gal-02', '4-Bay Interconnected Panel Frame', 'Continuous multi-bay frame with internal segregation & top ventilation openings.', 'assets/images/panels/panel-modular-4bay.jpg', 'modular', 2),
('gal-03', 'Modular Suite Production Lineup', 'Factory floor assembly of multi-bay structural enclosures for OEM clients.', 'assets/images/panels/panel-modular-lineup.jpg', 'production', 3),
('gal-04', 'Single-Bay Floor-Standing Cabinet', 'Heavy-duty channel plinth, depth-adjustable rails, and lifting eye bolts.', 'assets/images/panels/panel-single-bay-frame.jpg', 'cabinet', 4),
('gal-05', 'Dispatch-Ready Protected Enclosure', 'Powder-coated double-door cabinet with meter cutouts, palletized & stretch wrapped.', 'assets/images/panels/panel-doubledoor-wrapped.jpg', 'dispatch', 5),
('gal-06', 'Double Door Rear Access Enclosure', 'Full-height rear access doors with 3-point espagnolette locking.', 'assets/images/panels/panel-double-door-rear.jpg', 'doubledoor', 6)
ON CONFLICT (id) DO NOTHING;
