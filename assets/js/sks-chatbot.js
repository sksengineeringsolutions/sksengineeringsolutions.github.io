/**
 * SKS Engineering Solutions - AI Engineering Assistant Engine
 * A Shinde Groups Enterprise
 * 
 * Features:
 * - 100% Client-Side Domain Expert NLP Engine (0ms latency, zero API costs/failures)
 * - Optional Google Gemini API integration (bring-your-own key) with auto fallback
 * - Interactive RFQ Wizard with 1-Click WhatsApp quote composer
 * - Accurate operational schedule (Fri-Wed 9:30 AM - 6:30 PM, Thursday Closed Weekly Off)
 * - Web Audio API synthesizer for clean sound feedback (0 external assets)
 * - Web Speech API voice input (speech-to-text)
 * - Session persistence across multi-page site navigation
 * - Responsive glassmorphic UI matching SKS Engineering design system
 */

'use strict';

(function () {
    // Prevent duplicate initialization
    if (window.__SKS_CHATBOT_LOADED__) return;
    window.__SKS_CHATBOT_LOADED__ = true;

    // ==========================================================================
    // 1. Core Domain Knowledge Base
    // ==========================================================================
    const SKS_INFO = {
        name: "SKS Engineering Solutions",
        enterprise: "A Shinde Groups Enterprise",
        phone: "+91-8668742659",
        phoneRaw: "918668742659",
        email: "sales@sksengineeringsolutions.com",
        location: "Gat No. 84, Jyotiba Nagar, Talawade, Pune - 411062, Maharashtra, India",
        mapsUrl: "https://maps.google.com/?q=Gat+No+84+Jyotiba+Nagar+Talawade+Pune+411062",
        hours: "Friday – Wednesday: 9:30 AM – 6:30 PM",
        weeklyOff: "Thursday: Closed (Weekly Off)",
        leadTimeCAD: "24 – 48 Hours for Engineering CAD Review & Preliminary RFQ",
        leadTimeFab: "7 – 15 Working Days for Standard Production",
        cadFormats: "DXF, DWG, STEP, STP, IGES, PDF Engineering Drawings"
    };

    // State management
    const state = {
        isOpen: false,
        isExpanded: false,
        soundEnabled: true,
        isListening: false,
        geminiApiKey: localStorage.getItem('sks_gemini_api_key') || '',
        messages: [],
        wizardStep: 0,
        wizardData: {
            type: '',
            dimensions: '',
            material: 'CRCA 2.0mm / 1.6mm',
            ipRating: 'IP65',
            quantity: '1'
        }
    };

    // Audio synthesizer using Web Audio API (Zero external MP3 files needed)
    let audioCtx = null;
    function playBeep(type = 'receive') {
        if (!state.soundEnabled) return;
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            const now = audioCtx.currentTime;
            if (type === 'send') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(540, now);
                osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
                osc.start(now);
                osc.stop(now + 0.09);
            } else {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(1050, now + 0.1);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
            }
        } catch (e) {
            // Audio context not allowed or unsupported
        }
    }

    // ==========================================================================
    // 2. Operational Hours Intelligence
    // ==========================================================================
    function getOperationalStatus() {
        const now = new Date();
        const day = now.getDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
        const hour = now.getHours();
        const minute = now.getMinutes();
        const totalMinutes = hour * 60 + minute;

        // Thursday (day 4) is weekly off
        if (day === 4) {
            return {
                isOpen: false,
                isThursdayOff: true,
                message: "Thursday: Closed (Weekly Off)",
                bannerNotice: "⚠️ Thursday Weekly Off: Factory closed today. Submit your inquiry below, and our engineering team will respond first thing on Friday morning at 9:30 AM!"
            };
        }

        // Operational: 9:30 AM (570 min) to 6:30 PM (1110 min)
        const openTime = 9 * 60 + 30; // 570
        const closeTime = 18 * 60 + 30; // 1110

        if (totalMinutes >= openTime && totalMinutes <= closeTime) {
            return {
                isOpen: true,
                isThursdayOff: false,
                message: "Open Today: 9:30 AM – 6:30 PM",
                bannerNotice: "🟢 Factory Open Now (9:30 AM – 6:30 PM) • Instant CAD & Enclosure Estimates Active"
            };
        } else {
            return {
                isOpen: false,
                isThursdayOff: false,
                message: "Currently Closed (Opens 9:30 AM)",
                bannerNotice: "🌙 After-Hours: Factory reopens at 9:30 AM. Leave your RFQ specs below, and our team will quote on the next working morning!"
            };
        }
    }

    // ==========================================================================
    // 3. Domain Knowledge Engine & Response Logic
    // ==========================================================================
    function processQueryLocally(userText) {
        const query = userText.toLowerCase().trim();
        const status = getOperationalStatus();

        // 1. Operational hours, office timings & weekly off
        if (query.match(/\b(time|timing|timings|hour|hours|open|close|closed|thursday|weekly off|sunday|working|schedule)\b/)) {
            let note = status.isThursdayOff 
                ? `<div class="sks-card-badge-row"><span class="sks-spec-pill orange">⚠️ Today is Thursday (Weekly Off)</span></div>`
                : (status.isOpen 
                    ? `<div class="sks-card-badge-row"><span class="sks-spec-pill">🟢 Factory Open Now</span></div>` 
                    : `<div class="sks-card-badge-row"><span class="sks-spec-pill blue">🌙 Reopens 9:30 AM</span></div>`);

            return `Here are the operational hours for <strong>SKS Engineering Solutions</strong> (Talawade, Pune):
${note}
<ul>
  <li><strong>Friday – Wednesday:</strong> 9:30 AM – 6:30 PM</li>
  <li><strong>Thursday:</strong> Closed (Weekly Off)</li>
</ul>
Our engineering office and manufacturing lines operate on this schedule. For urgent weekend or after-hours inquiries, our WhatsApp channel remains open for CAD submissions!
<div class="sks-card-actions">
  <a href="https://api.whatsapp.com/send?phone=${SKS_INFO.phoneRaw}&text=Hello%20SKS%20Engineering%2C%20inquiry%20regarding%20factory%20timings%20and%20enclosures" target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">💬 Message on WhatsApp (${SKS_INFO.phone})</a>
</div>`;
        }

        // 2. Factory location, address, directions
        if (query.match(/\b(address|location|where|place|pune|talawade|map|maps|visit|plant|factory|directions|route)\b/)) {
            return `<strong>SKS Engineering Solutions Plant Location:</strong>
<p>📍 <strong>${SKS_INFO.location}</strong><br>
<em>Landmark: Talawade Industrial Area / Chakan Corridor, PCMC, Pune.</em></p>
<ul>
  <li><strong>Factory Hours:</strong> Fri–Wed: 9:30 AM – 6:30 PM (Thu Closed)</li>
  <li><strong>Phone / WhatsApp:</strong> <a href="tel:${SKS_INFO.phoneRaw}" style="color:#38BDF8;">${SKS_INFO.phone}</a></li>
  <li><strong>Direct Email:</strong> <a href="mailto:${SKS_INFO.email}" style="color:#38BDF8;">${SKS_INFO.email}</a></li>
</ul>
Clients and procurement teams are welcome to visit for plant audits, machine inspections, and prototype sign-offs!
<div class="sks-card-actions">
  <a href="${SKS_INFO.mapsUrl}" target="_blank" rel="noopener noreferrer" class="sks-action-btn primary">📍 Open in Google Maps</a>
  <a href="https://api.whatsapp.com/send?phone=${SKS_INFO.phoneRaw}&text=Hello%20SKS%20Engineering%2C%20I%20would%20like%20to%20schedule%20a%20factory%20visit" target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">🗓️ Schedule Factory Visit on WhatsApp</a>
</div>`;
        }

        // 3. RFQ, Quote, Price, Cost, Estimation
        if (query.match(/\b(quote|quotation|rfq|cost|price|pricing|estimate|estimation|rate|rates|inquiry|enquiry)\b/)) {
            return `I can help you get an <strong>instant engineering RFQ quote</strong> for your custom enclosures!
<div class="sks-card-badge-row">
  <span class="sks-spec-pill">⚡ 24–48h CAD Review</span>
  <span class="sks-spec-pill blue">📐 Custom Fabrication</span>
  <span class="sks-spec-pill orange">🛡️ IP55 / IP65 / IP66</span>
</div>
<p>You can either use our <strong>Guided Quote Assistant</strong> right here in this chat, or send your 2D/3D CAD drawings directly to our sales engineering team:</p>
<ul>
  <li><strong>Accepted CAD Formats:</strong> ${SKS_INFO.cadFormats}</li>
  <li><strong>Standard Lead Time:</strong> ${SKS_INFO.leadTimeFab}</li>
</ul>
<div class="sks-card-actions">
  <button type="button" class="sks-action-btn primary" onclick="window.sksStartWizard()">⚡ Launch Guided Quote Calculator</button>
  <a href="https://api.whatsapp.com/send?phone=${SKS_INFO.phoneRaw}&text=Hello%20SKS%20Engineering%2C%20I%20have%20an%20RFQ%20drawing%20ready%20for%20quotation" target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">📱 Send CAD on WhatsApp (+91-8668742659)</a>
</div>`;
        }

        // 4. Modular Enclosure / Floor Standing Cabinet
        if (query.match(/\b(modular|floor standing|cabinet|pcc|mcc|suite|9-fold|nine fold|automation panel|rittal style)\b/)) {
            return `<strong>Modular Floor-Standing Enclosures (CRCA 9-Fold Profile):</strong>
<div class="sks-card-badge-row">
  <span class="sks-spec-pill">IP55 / IP65 Rated</span>
  <span class="sks-spec-pill blue">2.0mm Frame / 1.6mm Doors</span>
  <span class="sks-spec-pill orange">RAL 7035 Textured</span>
</div>
<p>Engineered for high-density power distribution (PCC, MCC) and industrial automation systems:</p>
<ul>
  <li><strong>Structure:</strong> 9-fold roll-formed vertical profiles with multi-point welded base frame for maximum rigidity.</li>
  <li><strong>Standard Heights:</strong> 1800mm, 2000mm, 2200mm</li>
  <li><strong>Standard Widths:</strong> 600mm, 800mm, 1000mm, 1200mm</li>
  <li><strong>Standard Depths:</strong> 400mm, 600mm, 800mm, 1000mm</li>
  <li><strong>Features:</strong> Continuous CNC foam-in-place PU gasketing, 3-point espagnolette locking system, 4-piece split gland plates, internal 25mm pitch mounting pattern.</li>
</ul>
<div class="sks-card-actions">
  <a href="products.html" class="sks-action-btn secondary">📄 View Product Specs in Catalog</a>
  <a href="https://api.whatsapp.com/send?phone=${SKS_INFO.phoneRaw}&text=Hello%20SKS%20Engineering%2C%20inquiry%20regarding%20Modular%20Floor-Standing%20Enclosures" target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">💬 Inquire Modular Enclosures on WhatsApp</a>
</div>`;
        }

        // 5. Stainless Steel Enclosure (SS304 / SS316)
        if (query.match(/\b(stainless|ss304|ss316|ss|inox|pharma|food|dairy|marine|chemical|corrosion|washdown)\b/)) {
            return `<strong>Stainless Steel Enclosures (SS304 & SS316L):</strong>
<div class="sks-card-badge-row">
  <span class="sks-spec-pill">IP66 / IP69K</span>
  <span class="sks-spec-pill blue">SS304 / SS316L</span>
  <span class="sks-spec-pill orange">Scotch-Brite Satin Ra &lt; 0.5µm</span>
</div>
<p>Purpose-built for hygienic, sterile, and aggressively corrosive industrial environments:</p>
<ul>
  <li><strong>Applications:</strong> Pharmaceuticals, Food & Dairy processing, Chemical plants, Offshore Marine & Coastal installations.</li>
  <li><strong>Sheet Thickness:</strong> 1.5mm to 2.5mm Grade 304 or 316L.</li>
  <li><strong>Welding & Finish:</strong> Clean Argon TIG welding with fully passivated and pickling treated seams; Scotch-Brite hairline brushed finish.</li>
  <li><strong>Hygiene Details:</strong> Sloped roof sanitary options, crevice-free seamless gaskets, stainless quarter-turn quarter-turn latches.</li>
</ul>
<div class="sks-card-actions">
  <a href="https://api.whatsapp.com/send?phone=${SKS_INFO.phoneRaw}&text=Hello%20SKS%20Engineering%2C%20inquiry%20for%20Stainless%20Steel%20(SS304%2FSS316)%20Enclosures" target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">💬 Request SS304/SS316 Quote on WhatsApp</a>
</div>`;
        }

        // 6. Wall-Mount Enclosures
        if (query.match(/\b(wall mount|wall-mount|wallmounted|small enclosure|distribution box|lighting box|compact enclosure)\b/)) {
            return `<strong>Precision Wall-Mounted Industrial Enclosures:</strong>
<div class="sks-card-badge-row">
  <span class="sks-spec-pill">IP65 / IP66 Certified</span>
  <span class="sks-spec-pill blue">CRCA 1.2–1.6mm / SS304</span>
  <span class="sks-spec-pill orange">RAL 7035 / RAL 7032</span>
</div>
<p>Compact, rigid, and dust-tight housings for electrical controls and field instrumentation:</p>
<ul>
  <li><strong>Sizes Available:</strong> From 300×200×150 mm up to 1200×800×300 mm (custom sizes fabricated on demand).</li>
  <li><strong>Mounting:</strong> External heavy-duty wall-mounting brackets or direct rear fixings.</li>
  <li><strong>Features:</strong> Top/Bottom removable gland plates with neoprene or PU gaskets, 120° concealed hinges, quarter-turn cam locks, galvanized or orange RAL 2000 chassis plate.</li>
</ul>
<div class="sks-card-actions">
  <a href="https://api.whatsapp.com/send?phone=${SKS_INFO.phoneRaw}&text=Hello%20SKS%20Engineering%2C%20inquiry%20for%20Wall-Mounted%20Enclosures" target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">💬 Inquire Wall-Mount Enclosure Sizes</a>
</div>`;
        }

        // 7. Outdoor Feeder Pillars / Weatherproof Enclosures
        if (query.match(/\b(feeder pillar|feeder|outdoor|canopy|rain|weatherproof|sun roof|street light|solar|double door)\b/)) {
            return `<strong>Outdoor Weatherproof Feeder Pillars:</strong>
<div class="sks-card-badge-row">
  <span class="sks-spec-pill">IP55 / IP65 Weatherproof</span>
  <span class="sks-spec-pill blue">CRCA 2.0mm / GI Sheet</span>
  <span class="sks-spec-pill orange">UV-Resistant Powder Coat</span>
</div>
<p>Engineered to resist direct sun radiation, driving rain, and outdoor environmental hazards:</p>
<ul>
  <li><strong>Canopy Roof:</strong> Sloping overhang canopy with drip channels for rainwater shed.</li>
  <li><strong>Ventilation:</strong> Louvers fitted with internal stainless steel insect mesh wire to allow thermal convection while barring dust & vermin.</li>
  <li><strong>Base / Plinth:</strong> Sturdy 100mm to 200mm detachable plinth with bottom cable entry gland plates.</li>
  <li><strong>Locking:</strong> Padlockable 3-point handle mechanism for outdoor security.</li>
</ul>
<div class="sks-card-actions">
  <a href="https://api.whatsapp.com/send?phone=${SKS_INFO.phoneRaw}&text=Hello%20SKS%20Engineering%2C%20inquiry%20for%20Outdoor%20Feeder%20Pillars" target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">💬 Inquire Feeder Pillars on WhatsApp</a>
</div>`;
        }

        // 8. Console Desks / Operator Stations
        if (query.match(/\b(console|desk|operator|hmi|workstation|control desk|scada|sloping)\b/)) {
            return `<strong>Ergonomic Industrial Control Desks & Operator Consoles:</strong>
<div class="sks-card-badge-row">
  <span class="sks-spec-pill">IP54 / IP55</span>
  <span class="sks-spec-pill blue">CRCA 1.6mm / 2.0mm</span>
  <span class="sks-spec-pill orange">Gas Strut Assisted Lid</span>
</div>
<p>Designed for human-machine interface (HMI) control rooms, automation lines, and SCADA monitoring:</p>
<ul>
  <li><strong>Sloping Top Section:</strong> Precision angled lid fitted with pneumatic gas shock struts for effortless opening and maintenance access.</li>
  <li><strong>Cutouts:</strong> Laser-cut apertures for HMI touchscreens, push buttons, joysticks, and pilot lamps.</li>
  <li><strong>Lower Cabinet:</strong> Front and rear access doors with internal 19-inch rack mounting rails or DIN mounting plates.</li>
</ul>
<div class="sks-card-actions">
  <a href="https://api.whatsapp.com/send?phone=${SKS_INFO.phoneRaw}&text=Hello%20SKS%20Engineering%2C%20inquiry%20for%20Operator%20Control%20Desks" target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">💬 Inquire Control Desks on WhatsApp</a>
</div>`;
        }

        // 9. Junction Boxes & Terminal Boxes
        if (query.match(/\b(junction|junction box|terminal|terminal box|j-box|din rail|knockout)\b/)) {
            return `<strong>Industrial Junction & Terminal Boxes:</strong>
<div class="sks-card-badge-row">
  <span class="sks-spec-pill">IP66 / IP67</span>
  <span class="sks-spec-pill blue">CRCA 1.2–1.6mm / SS304</span>
  <span class="sks-spec-pill orange">High Seal Integrity</span>
</div>
<p>Robust small-footprint enclosures for field cable termination and instrumentation:</p>
<ul>
  <li><strong>Standard Sizes:</strong> 150×150×100mm, 200×200×120mm, 300×300×150mm, 400×300×150mm, up to custom dimensions.</li>
  <li><strong>Internals:</strong> Pre-drilled DIN rail brackets, grounding copper studs, and brass terminal mounting studs.</li>
  <li><strong>Lids:</strong> Screw-down cover with captive stainless screws or hinged door with quick-release latches.</li>
</ul>
<div class="sks-card-actions">
  <a href="https://api.whatsapp.com/send?phone=${SKS_INFO.phoneRaw}&text=Hello%20SKS%20Engineering%2C%20inquiry%20for%20Junction%20Boxes" target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">💬 Inquire Junction Boxes on WhatsApp</a>
</div>`;
        }

        // 10. IP Ratings Explained (IP54, IP55, IP65, IP66, IP67)
        if (query.match(/\b(ip|ip rating|ingress|ip54|ip55|ip65|ip66|ip67|ip68|waterproof|dustproof)\b/)) {
            return `<strong>Ingress Protection (IP) Ratings Guide:</strong>
<p>The IP code defines enclosure sealing effectiveness against solids (1st digit) and liquids (2nd digit):</p>
<ul>
  <li><strong>IP55:</strong> Dust-protected + Low-pressure water jet resistance from any direction. Standard for indoor factory distribution panels and shaded outdoor feeder pillars.</li>
  <li><strong>IP65:</strong> <em>Dust-tight</em> (zero dust ingress) + Protected against water jets. Recommended for industrial automation, wash stations, and open-air panels.</li>
  <li><strong>IP66:</strong> <em>Dust-tight</em> + Protected against powerful high-pressure sea waves & heavy water jets. Best for heavy washdown food/pharma and coastal setups.</li>
  <li><strong>IP67:</strong> <em>Dust-tight</em> + Withstands temporary submersion in water up to 1 meter depth.</li>
</ul>
<p><em>SKS Enclosures achieve high IP ratings using automated continuous polyurethane foam gaskets (FIPFG) and precision CNC bent knife-edge seals.</em></p>
<div class="sks-card-actions">
  <a href="https://api.whatsapp.com/send?phone=${SKS_INFO.phoneRaw}&text=Hello%20SKS%20Engineering%2C%20I%20need%20guidance%20on%20choosing%20the%20right%20IP%20rating%20for%20my%20enclosure" target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">💬 Discuss IP Rating with SKS Engineer</a>
</div>`;
        }

        // 11. Machinery, CNC Laser, Bending, Powder Coating & Factory Capabilities
        if (query.match(/\b(machine|machinery|laser|cnc|bending|press brake|welding|powder coat|powder coating|7-tank|pretreatment|phosphating|gasket|fipfg|capacity|capability|capabilities)\b/)) {
            return `<strong>SKS Engineering Fabrication & Plant Capabilities (Pune):</strong>
<ul>
  <li><strong>CNC Fiber Laser Cutting:</strong> High-precision ±0.05mm tolerance. Cuts MS up to 12mm, SS up to 6mm, Aluminum up to 4mm with burr-free edge finish.</li>
  <li><strong>CNC Multi-Axis Hydraulic Press Brakes:</strong> Multi-bend synchronized folding up to 3.2m bed length.</li>
  <li><strong>Certified Welding:</strong> MIG, TIG, Argon, Stud, and Projection welding with seamless grinding.</li>
  <li><strong>7-Tank Chemical Pre-Treatment:</strong> Hot alkaline degrease, acid derust, zinc phosphating, and passivation for superior paint adhesion.</li>
  <li><strong>Powder Coating Booth:</strong> Pure polyester thermosetting powder (60–80 microns DFT, 500+ hrs salt spray resistance) in RAL 7035, RAL 7032, and custom shades.</li>
  <li><strong>Automated Continuous PU Foam Gasketing:</strong> CNC form-in-place foamed gasket (FIPFG) for IP65/IP66 seal integrity.</li>
</ul>
<div class="sks-card-actions">
  <a href="capabilities.html" class="sks-action-btn secondary">⚙️ View Plant Capabilities Page</a>
</div>`;
        }

        // 12. Materials & Sheet Thickness
        if (query.match(/\b(material|materials|sheet|thickness|gauge|crca|cr|gi|aluminum|galvanized|swg|mm)\b/)) {
            return `<strong>Materials & Gauge Specifications Fabricated at SKS:</strong>
<ul>
  <li><strong>CRCA (IS 513):</strong> Cold Rolled Close Annealed steel in 1.2mm, 1.6mm, 2.0mm, and 2.5mm for indoor & modular panels.</li>
  <li><strong>Stainless Steel (SS304 / SS316L):</strong> 1.5mm to 3.0mm with 240/320 grit Scotch-Brite satin hairline brushed finish.</li>
  <li><strong>Galvanized Iron (GI - IS 277):</strong> 1.6mm and 2.0mm with heavy zinc coating for outdoor feeder pillars.</li>
  <li><strong>Aluminum (6061 / 5052):</strong> 2.0mm to 4.0mm lightweight, corrosion-resistant housings.</li>
  <li><strong>Mounting Plates:</strong> 2.0mm to 3.0mm Galvanized Iron or Orange RAL 2000 for heavy switchgear support.</li>
</ul>
<p>Need custom thickness or material grade? We can customize based on your engineering drawings!</p>`;
        }

        // 13. Turnaround time, delivery, shipping, lead time
        if (query.match(/\b(turnaround|lead time|delivery|deliver|dispatch|shipping|timeline|how long|days|fast)\b/)) {
            return `<strong>SKS Production & Delivery Turnaround:</strong>
<ul>
  <li><strong>CAD Drawing & RFQ Estimate:</strong> Delivered within <strong>24 to 48 Hours</strong> upon receipt of drawings.</li>
  <li><strong>Prototype / Sample Fabrication:</strong> 5 to 7 working days.</li>
  <li><strong>Batch Production:</strong> <strong>7 to 15 Working Days</strong> depending on batch size and coating requirements.</li>
  <li><strong>Dispatch:</strong> Secure bubble-wrapped and palletized freight dispatch across Pune, Maharashtra, Gujarat, and all industrial corridors across India.</li>
</ul>
<div class="sks-card-actions">
  <a href="https://api.whatsapp.com/send?phone=${SKS_INFO.phoneRaw}&text=Hello%20SKS%20Engineering%2C%20inquiry%20regarding%20urgent%20fabrication%20turnaround" target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">⚡ Inquire Urgent Turnaround on WhatsApp</a>
</div>`;
        }

        // 14. Contact numbers, email, phone, WhatsApp
        if (query.match(/\b(contact|phone|call|mobile|number|email|whatsapp|talk|human|sales)\b/)) {
            return `<strong>Connect Directly with SKS Engineering Solutions:</strong>
<ul>
  <li><strong>Direct WhatsApp:</strong> <a href="https://api.whatsapp.com/send?phone=${SKS_INFO.phoneRaw}" target="_blank" style="color:#22C55E; font-weight:600;">+91-8668742659</a></li>
  <li><strong>Phone Line:</strong> <a href="tel:${SKS_INFO.phoneRaw}" style="color:#38BDF8; font-weight:600;">${SKS_INFO.phone}</a></li>
  <li><strong>Sales Email:</strong> <a href="mailto:${SKS_INFO.email}" style="color:#38BDF8; font-weight:600;">${SKS_INFO.email}</a></li>
  <li><strong>Working Hours:</strong> Friday – Wednesday (9:30 AM – 6:30 PM) • Thursday Closed</li>
</ul>
<div class="sks-card-actions">
  <a href="https://api.whatsapp.com/send?phone=${SKS_INFO.phoneRaw}&text=Hello%20SKS%20Engineering%2C%20I%20would%20like%20to%20speak%20with%20a%20sales%20engineer" target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">💬 Open WhatsApp Chat (+91-8668742659)</a>
  <a href="contact-us.html" class="sks-action-btn secondary">📄 Go to Contact Us Page</a>
</div>`;
        }

        // 15. About Shinde Groups / SKS Heritage
        if (query.match(/\b(about|who are you|shinde|shinde groups|heritage|company|experience|history)\b/)) {
            return `<strong>About SKS Engineering Solutions:</strong>
<p>SKS Engineering Solutions is <strong>A Shinde Groups Enterprise</strong> based in Talawade, Pune. With extensive industrial manufacturing heritage, we specialize in high-precision sheet metal fabrication, customized electrical panel enclosures, modular switchgear cabinets, and turnkey OEM engineering solutions.</p>
<ul>
  <li>50,000+ sq.ft plant infrastructure in Pune</li>
  <li>In-house CNC Fiber Laser, CNC Bending, 7-Tank Pretreatment, Powder Coating & Gasketing</li>
  <li>Trusted by panel builders, switchgear OEMs, solar contractors, and automation integrators nationwide.</li>
</ul>
<div class="sks-card-actions">
  <a href="about-us.html" class="sks-action-btn secondary">🏢 Learn More About Us</a>
</div>`;
        }

        // 16. Greetings & Welcome
        if (query.match(/\b(hi|hello|hey|namaste|good morning|good afternoon|good evening|greetings|start|help)\b/)) {
            const timeGreeting = new Date().getHours() < 12 ? 'Good morning' : (new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening');
            return `${timeGreeting}! Welcome to <strong>SKS Engineering Solutions</strong> (A Shinde Groups Enterprise, Pune).
<p>I am your <strong>AI Engineering Assistant</strong>. How can I help you today?</p>
<ul>
  <li>⚡ <strong>Get an Instant Quote / RFQ</strong> for custom enclosures</li>
  <li>📐 <strong>Technical Specs</strong> (Modular, Wall-Mount, SS304, Feeder Pillars, Desks)</li>
  <li>🛡️ <strong>IP Ratings Guide</strong> (IP55, IP65, IP66, IP67)</li>
  <li>🕒 <strong>Plant Timings & Location</strong> (Talawade, Pune)</li>
</ul>
<p>Feel free to select a quick topic below or type your dimensions/specifications directly!</p>
<div class="sks-card-actions">
  <button type="button" class="sks-action-btn primary" onclick="window.sksStartWizard()">⚡ Start Guided Quote Wizard</button>
</div>`;
        }

        // Fallback intelligent answer
        return `I understand you are inquiring about <strong>"${userText}"</strong>.
<p>At SKS Engineering Solutions (Talawade, Pune), we fabricate precision sheet metal enclosures tailored to your custom specifications (Modular cabinets, Wall-mount boxes, SS304/SS316 housings, and Outdoor feeder pillars).</p>
<p>To help you fastest, would you like to:</p>
<div class="sks-card-actions">
  <button type="button" class="sks-action-btn primary" onclick="window.sksStartWizard()">⚡ Calculate an RFQ Quote</button>
  <a href="https://api.whatsapp.com/send?phone=${SKS_INFO.phoneRaw}&text=Hello%20SKS%20Engineering%2C%20inquiry%3A%20${encodeURIComponent(userText)}" target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">💬 Inquire on WhatsApp (${SKS_INFO.phone})</a>
  <a href="products.html" class="sks-action-btn secondary">📂 Explore Products Catalog</a>
</div>`;
    }

    // ==========================================================================
    // 4. Optional Google Gemini API Engine
    // ==========================================================================
    async function queryGeminiApi(userText) {
        if (!state.geminiApiKey) return null;

        const systemPrompt = `You are the Official AI Engineering Assistant for "SKS Engineering Solutions" (A Shinde Groups Enterprise), located in Gat No. 84, Jyotiba Nagar, Talawade, Pune - 411062, Maharashtra, India.
Key details:
- Specialization: Custom sheet metal fabrication, industrial & electrical panel enclosures (Modular Floor-Standing 9-Fold Cabinets, Wall-Mount Enclosures, Stainless Steel SS304/SS316 Enclosures, Outdoor Feeder Pillars, Control Desks, Junction Boxes).
- Operating Hours: Friday – Wednesday: 9:30 AM – 6:30 PM.
- Weekly Off: Thursday is completely CLOSED (Weekly Off).
- Phone/WhatsApp: +91-8668742659.
- Sales Email: sales@sksengineeringsolutions.com.
- Capabilities: CNC Fiber Laser cutting (±0.05mm), CNC Hydraulic Multi-Axis Bending, 7-Tank chemical pre-treatment, Pure polyester powder coating (RAL 7035/7032), automated continuous PU foam gasketing (FIPFG).
- Accepted CAD formats: DXF, DWG, STEP, STP, PDF.
- Quote turnaround: 24-48 hours. Fabrication lead time: 7-15 working days.
Keep answers concise, polite, professional, and engineering-accurate. Always format with HTML bullet points or bold text. If asked about contact or quotation, provide the WhatsApp number +91-8668742659.`;

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${state.geminiApiKey}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${userText}` }] }
                    ],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 600
                    }
                })
            });

            if (!response.ok) {
                console.warn('Gemini API error, falling back to local engine:', response.status);
                return null;
            }

            const data = await response.json();
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) {
                // Convert markdown bullet points to HTML
                return reply
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/^\* (.*$)/gim, '<li>$1</li>')
                    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
                    .replace(/\n\n/g, '<p></p>')
                    .replace(/\n/g, '<br>');
            }
        } catch (err) {
            console.warn('Gemini fetch failed, using local engine:', err);
        }
        return null;
    }

    // ==========================================================================
    // 5. DOM Injection & UI Construction
    // ==========================================================================
    function createWidgetDOM() {
        // 1. Inject or verify CSS
        if (!document.querySelector('link[href*="sks-chatbot.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'assets/css/sks-chatbot.css?v=20261009';
            document.head.appendChild(link);
        }

        // 2. Teaser Greeting Pill
        const teaser = document.createElement('div');
        teaser.className = 'sks-chat-teaser';
        teaser.id = 'sksChatTeaser';
        teaser.setAttribute('role', 'button');
        teaser.setAttribute('aria-label', 'Open SKS AI Assistant');
        teaser.innerHTML = `
            <div class="sks-teaser-avatar">🤖</div>
            <div class="sks-teaser-text">
                Need an <strong>Enclosure Quote</strong>? Ask SKS AI!
            </div>
            <button type="button" class="sks-teaser-close" id="sksTeaserClose" aria-label="Close message">&times;</button>
        `;
        document.body.appendChild(teaser);

        // 3. Floating Dock Integration or Dedicated Trigger
        const floatingDock = document.getElementById('floatingRightDock') || document.querySelector('.floating-right-dock');
        if (floatingDock) {
            // Check if already injected
            if (!document.getElementById('sksChatbotDockBtn')) {
                const dockItem = document.createElement('div');
                dockItem.className = 'dock-item dock-chatbot';
                dockItem.innerHTML = `
                    <button type="button" class="dock-btn dock-btn-chatbot" id="sksChatbotDockBtn" aria-label="Open SKS AI Engineering Assistant" title="AI Engineering Assistant">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
                            <rect x="4" y="8" width="16" height="12" rx="4"/>
                            <circle cx="9" cy="13" r="1.5" fill="currentColor"/>
                            <circle cx="15" cy="13" r="1.5" fill="currentColor"/>
                            <path d="M9 17h6"/>
                            <line x1="2" y1="14" x2="4" y2="14"/>
                            <line x1="20" y1="14" x2="22" y2="14"/>
                        </svg>
                        <span class="dock-badge-pulse green" title="AI Assistant Online 24/7"></span>
                        <span class="dock-tooltip">Ask SKS AI Assistant (24/7)</span>
                    </button>
                `;
                // Place at top of dock
                floatingDock.insertBefore(dockItem, floatingDock.firstChild);
            }
        }

        // 4. Main Chat Widget Window
        const status = getOperationalStatus();
        const widget = document.createElement('div');
        widget.className = 'sks-chat-widget';
        widget.id = 'sksChatWidget';
        widget.setAttribute('role', 'dialog');
        widget.setAttribute('aria-label', 'SKS AI Assistant Chat Window');
        widget.innerHTML = `
            <!-- Header -->
            <div class="sks-chat-header">
                <div class="sks-chat-brand">
                    <div class="sks-bot-avatar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="4" y="8" width="16" height="12" rx="4"/>
                            <circle cx="9" cy="13" r="1.5" fill="currentColor"/>
                            <circle cx="15" cy="13" r="1.5" fill="currentColor"/>
                            <path d="M9 17h6"/>
                            <line x1="12" y1="2" x2="12" y2="8"/>
                        </svg>
                        <span class="sks-avatar-status"></span>
                    </div>
                    <div class="sks-brand-info">
                        <div class="sks-brand-title">
                            SKS AI Assistant
                            <span class="sks-brand-badge">Official</span>
                        </div>
                        <div class="sks-brand-status">
                            <span class="sks-status-dot"></span>
                            <span>Enclosure Specialist &bull; Pune Plant</span>
                        </div>
                    </div>
                </div>
                <div class="sks-chat-controls">
                    <button type="button" class="sks-ctrl-btn active" id="sksSoundToggle" title="Toggle Sound (Mute/Unmute)" aria-label="Toggle Sound">
                        🔊
                    </button>
                    <button type="button" class="sks-ctrl-btn" id="sksSettingsToggle" title="Custom AI Settings (Gemini Key)" aria-label="Settings">
                        ⚙️
                    </button>
                    <button type="button" class="sks-ctrl-btn" id="sksClearChat" title="Reset Conversation" aria-label="Clear Chat">
                        🗑️
                    </button>
                    <button type="button" class="sks-ctrl-btn" id="sksExpandToggle" title="Expand / Contract Window" aria-label="Expand Window">
                        ⤢
                    </button>
                    <button type="button" class="sks-ctrl-btn" id="sksCloseBtn" title="Close Chat" aria-label="Close Chat">
                        ✕
                    </button>
                </div>
            </div>

            <!-- Smart Operational Notice Bar -->
            <div class="sks-chat-notice-bar ${status.isThursdayOff ? 'thursday-off' : ''}" id="sksNoticeBar">
                <span class="sks-notice-text">
                    ${status.bannerNotice}
                </span>
            </div>

            <!-- Messages Scroll Body -->
            <div class="sks-chat-body" id="sksChatBody">
                <!-- Messages populated via JS -->
            </div>

            <!-- Quick Suggestion Chips -->
            <div class="sks-chat-chips-container" id="sksChipsContainer">
                <button type="button" class="sks-chip-btn" data-query="⚡ Start Guided Quote Wizard">⚡ Get Instant Quote</button>
                <button type="button" class="sks-chip-btn" data-query="Tell me about Modular Floor-Standing Cabinets">📐 Modular Cabinets</button>
                <button type="button" class="sks-chip-btn" data-query="What Stainless Steel SS304/SS316 enclosures do you make?">🛡️ Stainless SS304</button>
                <button type="button" class="sks-chip-btn" data-query="Explain IP ratings IP55, IP65, IP66">💧 IP Ratings</button>
                <button type="button" class="sks-chip-btn" data-query="What are your factory hours and weekly off?">🕒 Working Hours</button>
                <button type="button" class="sks-chip-btn" data-query="Where is your plant located in Pune?">📍 Factory Location</button>
                <button type="button" class="sks-chip-btn" data-query="What CAD file formats and lead times do you support?">⚙️ CAD & Turnaround</button>
                <button type="button" class="sks-chip-btn" data-query="Connect me with sales on WhatsApp">💬 Talk on WhatsApp</button>
            </div>

            <!-- Footer / Input Form -->
            <form class="sks-chat-footer" id="sksChatForm" onsubmit="return false;">
                <div class="sks-input-wrap">
                    <input type="text" class="sks-chat-input" id="sksChatInput" placeholder="Ask about enclosures, specs, CAD, or quotes..." autocomplete="off">
                    <button type="button" class="sks-mic-btn" id="sksMicBtn" title="Speak message (Voice Recognition)" aria-label="Voice input">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                            <line x1="12" y1="19" x2="12" y2="23"/>
                            <line x1="8" y1="23" x2="16" y2="23"/>
                        </svg>
                    </button>
                </div>
                <button type="submit" class="sks-send-btn" id="sksSendBtn" aria-label="Send Message">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </form>

            <!-- Optional Gemini API Key Settings Overlay -->
            <div class="sks-settings-overlay" id="sksSettingsOverlay">
                <div class="sks-settings-box">
                    <div class="sks-settings-title">
                        ⚙️ Live AI Settings (Optional)
                    </div>
                    <div class="sks-settings-desc">
                        By default, SKS Assistant runs our offline high-precision sheet metal engineering engine (0ms latency, 100% reliable).<br><br>
                        If you'd like free-form conversational AI, paste your personal <strong>Google Gemini API Key</strong> below:
                    </div>
                    <input type="password" class="sks-settings-input" id="sksGeminiKeyInput" placeholder="AIzaSy..." value="${state.geminiApiKey}">
                    <div class="sks-settings-btns">
                        <button type="button" class="sks-settings-btn cancel" id="sksSettingsCancel">Cancel</button>
                        <button type="button" class="sks-settings-btn save" id="sksSettingsSave">Save Settings</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(widget);

        // Bind interactive event listeners
        bindEvents();

        // Restore past messages from sessionStorage or initialize welcome
        initConversation();

        // Show teaser after 2.5 seconds if not opened
        setTimeout(() => {
            if (!state.isOpen && !sessionStorage.getItem('sks_teaser_dismissed')) {
                teaser.classList.add('visible');
            }
        }, 2500);
    }

    // ==========================================================================
    // 6. Event Listeners & Interactions
    // ==========================================================================
    function bindEvents() {
        const widget = document.getElementById('sksChatWidget');
        const teaser = document.getElementById('sksChatTeaser');
        const teaserClose = document.getElementById('sksTeaserClose');
        const dockBtn = document.getElementById('sksChatbotDockBtn');
        const closeBtn = document.getElementById('sksCloseBtn');
        const expandBtn = document.getElementById('sksExpandToggle');
        const soundBtn = document.getElementById('sksSoundToggle');
        const clearBtn = document.getElementById('sksClearChat');
        const settingsBtn = document.getElementById('sksSettingsToggle');
        const settingsOverlay = document.getElementById('sksSettingsOverlay');
        const settingsSave = document.getElementById('sksSettingsSave');
        const settingsCancel = document.getElementById('sksSettingsCancel');
        const geminiInput = document.getElementById('sksGeminiKeyInput');
        const form = document.getElementById('sksChatForm');
        const input = document.getElementById('sksChatInput');
        const micBtn = document.getElementById('sksMicBtn');
        const chips = document.querySelectorAll('.sks-chip-btn');

        // Toggle open/close
        function openChat() {
            state.isOpen = true;
            widget.classList.add('active');
            teaser.classList.remove('visible');
            sessionStorage.setItem('sks_teaser_dismissed', '1');
            input.focus();
            scrollToBottom();
        }

        function closeChat() {
            state.isOpen = false;
            widget.classList.remove('active');
        }

        if (dockBtn) dockBtn.addEventListener('click', () => {
            state.isOpen ? closeChat() : openChat();
        });

        teaser.addEventListener('click', (e) => {
            if (e.target !== teaserClose) {
                openChat();
            }
        });

        teaserClose.addEventListener('click', (e) => {
            e.stopPropagation();
            teaser.classList.remove('visible');
            sessionStorage.setItem('sks_teaser_dismissed', '1');
        });

        if (closeBtn) closeBtn.addEventListener('click', closeChat);

        // Expand / Contract
        if (expandBtn) {
            expandBtn.addEventListener('click', () => {
                state.isExpanded = !state.isExpanded;
                widget.classList.toggle('expanded', state.isExpanded);
                expandBtn.textContent = state.isExpanded ? '⤡' : '⤢';
            });
        }

        // Sound toggle
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                state.soundEnabled = !state.soundEnabled;
                soundBtn.textContent = state.soundEnabled ? '🔊' : '🔇';
                soundBtn.classList.toggle('active', state.soundEnabled);
            });
        }

        // Clear chat
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Clear chat history and restart conversation?')) {
                    sessionStorage.removeItem('sks_chat_history');
                    state.messages = [];
                    const body = document.getElementById('sksChatBody');
                    if (body) body.innerHTML = '';
                    initConversation();
                }
            });
        }

        // Settings modal
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                settingsOverlay.classList.add('active');
            });
        }
        if (settingsCancel) {
            settingsCancel.addEventListener('click', () => {
                settingsOverlay.classList.remove('active');
            });
        }
        if (settingsSave) {
            settingsSave.addEventListener('click', () => {
                const key = geminiInput.value.trim();
                state.geminiApiKey = key;
                if (key) {
                    localStorage.setItem('sks_gemini_api_key', key);
                    alert('Google Gemini API Key saved successfully!');
                } else {
                    localStorage.removeItem('sks_gemini_api_key');
                    alert('Using built-in local engineering engine.');
                }
                settingsOverlay.classList.remove('active');
            });
        }

        // Form submit
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const text = input.value.trim();
                if (!text) return;
                input.value = '';
                handleUserMessage(text);
            });
        }

        // Chips click
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const query = chip.getAttribute('data-query');
                if (query === '⚡ Start Guided Quote Wizard') {
                    window.sksStartWizard();
                } else {
                    handleUserMessage(query);
                }
            });
        });

        // Speech-to-Text via Web Speech API
        if (micBtn) {
            const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRec) {
                const recognition = new SpeechRec();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-IN';

                recognition.onstart = () => {
                    state.isListening = true;
                    micBtn.classList.add('listening');
                };
                recognition.onend = () => {
                    state.isListening = false;
                    micBtn.classList.remove('listening');
                };
                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    if (transcript) {
                        input.value = transcript;
                        handleUserMessage(transcript);
                    }
                };
                recognition.onerror = () => {
                    micBtn.classList.remove('listening');
                };

                micBtn.addEventListener('click', () => {
                    if (state.isListening) {
                        recognition.stop();
                    } else {
                        recognition.start();
                    }
                });
            } else {
                micBtn.style.display = 'none'; // Not supported on current browser
            }
        }

        // Global triggers: any button with data-open-chatbot or .open-sks-chat
        document.querySelectorAll('[data-open-chatbot], .open-sks-chat').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openChat();
            });
        });
    }

    // ==========================================================================
    // 7. Message Handling & Rendering
    // ==========================================================================
    function appendMessage(sender, text, skipSave = false) {
        const body = document.getElementById('sksChatBody');
        if (!body) return;

        const row = document.createElement('div');
        row.className = `sks-msg-row ${sender}`;

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (sender === 'bot') {
            row.innerHTML = `
                <div class="sks-msg-avatar">🤖</div>
                <div class="sks-msg-bubble">
                    ${text}
                    <span class="sks-msg-time">${timeStr}</span>
                </div>
            `;
        } else {
            row.innerHTML = `
                <div class="sks-msg-bubble">
                    <p>${escapeHTML(text)}</p>
                    <span class="sks-msg-time">${timeStr}</span>
                </div>
            `;
        }

        body.appendChild(row);
        scrollToBottom();

        if (!skipSave) {
            state.messages.push({ sender, text, time: timeStr });
            try {
                sessionStorage.setItem('sks_chat_history', JSON.stringify(state.messages));
            } catch (e) {}
        }
    }

    function showTypingIndicator() {
        const body = document.getElementById('sksChatBody');
        if (!body) return null;

        const row = document.createElement('div');
        row.className = 'sks-msg-row bot';
        row.id = 'sksTypingRow';
        row.innerHTML = `
            <div class="sks-msg-avatar">🤖</div>
            <div class="sks-typing-indicator">
                <span class="sks-typing-dot"></span>
                <span class="sks-typing-dot"></span>
                <span class="sks-typing-dot"></span>
            </div>
        `;
        body.appendChild(row);
        scrollToBottom();
        return row;
    }

    function removeTypingIndicator() {
        const row = document.getElementById('sksTypingRow');
        if (row) row.remove();
    }

    function scrollToBottom() {
        const body = document.getElementById('sksChatBody');
        if (body) {
            body.scrollTop = body.scrollHeight;
        }
    }

    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    async function handleUserMessage(userText) {
        appendMessage('user', userText);
        playBeep('send');

        // Check if currently inside RFQ Wizard
        if (state.wizardStep > 0) {
            handleWizardInput(userText);
            return;
        }

        // Check if user requested wizard via text
        if (userText.toLowerCase().match(/\b(start wizard|rfq wizard|calculate quote|guided quote)\b/)) {
            window.sksStartWizard();
            return;
        }

        const typingIndicator = showTypingIndicator();

        // 1. Try Gemini API if key is configured
        let botReply = null;
        if (state.geminiApiKey) {
            botReply = await queryGeminiApi(userText);
        }

        // 2. If Gemini not configured or failed, use local engine
        if (!botReply) {
            // Simulate brief human-like AI thinking delay (250-450ms)
            await new Promise(r => setTimeout(r, 320));
            botReply = processQueryLocally(userText);
        }

        removeTypingIndicator();
        appendMessage('bot', botReply);
        playBeep('receive');
    }

    // ==========================================================================
    // 8. Interactive RFQ Quote Wizard Engine
    // ==========================================================================
    window.sksStartWizard = function () {
        state.wizardStep = 1;
        state.wizardData = {
            type: '',
            dimensions: '',
            material: 'CRCA 2.0mm Frame / 1.6mm Door',
            ipRating: 'IP65',
            quantity: '1'
        };

        const wizardHTML = `
            <strong>⚡ SKS Enclosure Quote Wizard (Step 1 of 4):</strong>
            <p>Please select the primary <strong>Enclosure Type</strong> for your project:</p>
            <div class="sks-wizard-options-grid">
                <button type="button" class="sks-wizard-option-btn" onclick="window.sksWizardSelectType('Modular Floor-Standing Cabinet')">🏢 Modular Cabinet</button>
                <button type="button" class="sks-wizard-option-btn" onclick="window.sksWizardSelectType('Wall-Mount Enclosure')">🧱 Wall-Mount Box</button>
                <button type="button" class="sks-wizard-option-btn" onclick="window.sksWizardSelectType('Stainless Steel SS304 Enclosure')">🛡️ Stainless SS304/316</button>
                <button type="button" class="sks-wizard-option-btn" onclick="window.sksWizardSelectType('Outdoor Feeder Pillar')">☀️ Feeder Pillar (Canopy)</button>
                <button type="button" class="sks-wizard-option-btn" onclick="window.sksWizardSelectType('Operator Control Desk')">🖥️ Control Desk / Console</button>
                <button type="button" class="sks-wizard-option-btn" onclick="window.sksWizardSelectType('Custom Sheet Metal Enclosure')">⚙️ Custom Enclosure</button>
            </div>
        `;
        appendMessage('bot', wizardHTML);
        playBeep('receive');
    };

    window.sksWizardSelectType = function (typeName) {
        state.wizardData.type = typeName;
        state.wizardStep = 2;

        appendMessage('user', `Selected: ${typeName}`);
        playBeep('send');

        setTimeout(() => {
            const step2HTML = `
                <strong>⚡ Dimensions & Sizing (Step 2 of 4):</strong>
                <p>Selected: <strong>${typeName}</strong>.</p>
                <p>Select a standard dimension or type your custom <em>Height × Width × Depth (mm)</em> below:</p>
                <div class="sks-wizard-options-grid">
                    <button type="button" class="sks-wizard-option-btn" onclick="window.sksWizardSelectDim('2000H x 800W x 600D mm')">2000×800×600 mm</button>
                    <button type="button" class="sks-wizard-option-btn" onclick="window.sksWizardSelectDim('1800H x 600W x 400D mm')">1800×600×400 mm</button>
                    <button type="button" class="sks-wizard-option-btn" onclick="window.sksWizardSelectDim('800H x 600W x 250D mm')">800×600×250 mm</button>
                    <button type="button" class="sks-wizard-option-btn" onclick="window.sksWizardSelectDim('500H x 400W x 200D mm')">500×400×200 mm</button>
                </div>
                <p style="margin-top:6px; font-size:0.75rem; color:#94A3B8;">Or type your custom dimensions in the chat box (e.g., <em>"1200x800x300 mm"</em>):</p>
            `;
            appendMessage('bot', step2HTML);
            playBeep('receive');
        }, 300);
    };

    window.sksWizardSelectDim = function (dimStr) {
        state.wizardData.dimensions = dimStr;
        state.wizardStep = 3;

        appendMessage('user', `Dimensions: ${dimStr}`);
        playBeep('send');

        setTimeout(() => {
            const step3HTML = `
                <strong>⚡ Material & IP Protection (Step 3 of 4):</strong>
                <p>Select your required <strong>Sheet Material & Ingress Rating</strong>:</p>
                <div class="sks-wizard-options-grid">
                    <button type="button" class="sks-wizard-option-btn" onclick="window.sksWizardSelectMat('CRCA 2.0mm', 'IP55')">CRCA + IP55 (Standard)</button>
                    <button type="button" class="sks-wizard-option-btn" onclick="window.sksWizardSelectMat('CRCA 2.0mm', 'IP65')">CRCA + IP65 (Dust/Water Jet)</button>
                    <button type="button" class="sks-wizard-option-btn" onclick="window.sksWizardSelectMat('SS304 Satin', 'IP66')">SS304 + IP66 (Washdown)</button>
                    <button type="button" class="sks-wizard-option-btn" onclick="window.sksWizardSelectMat('GI Sheet 2.0mm', 'IP55')">GI Sheet + IP55 (Outdoor)</button>
                </div>
            `;
            appendMessage('bot', step3HTML);
            playBeep('receive');
        }, 300);
    };

    window.sksWizardSelectMat = function (material, ipRating) {
        state.wizardData.material = material;
        state.wizardData.ipRating = ipRating;
        state.wizardStep = 4;

        appendMessage('user', `Material: ${material} | Ingress: ${ipRating}`);
        playBeep('send');

        setTimeout(() => {
            const step4HTML = `
                <strong>⚡ Quantity (Step 4 of 4):</strong>
                <p>How many units do you need quoted?</p>
                <div class="sks-wizard-options-grid">
                    <button type="button" class="sks-wizard-option-btn" onclick="window.sksWizardFinish('1 Unit (Prototype)')">1 Unit (Prototype)</button>
                    <button type="button" class="sks-wizard-option-btn" onclick="window.sksWizardFinish('2 to 5 Units')">2 – 5 Units</button>
                    <button type="button" class="sks-wizard-option-btn" onclick="window.sksWizardFinish('10 to 25 Units')">10 – 25 Units</button>
                    <button type="button" class="sks-wizard-option-btn" onclick="window.sksWizardFinish('50+ Units (Batch)')">50+ Units (Volume)</button>
                </div>
            `;
            appendMessage('bot', step4HTML);
            playBeep('receive');
        }, 300);
    };

    window.sksWizardFinish = function (quantity) {
        state.wizardData.quantity = quantity;
        state.wizardStep = 0; // complete

        appendMessage('user', `Quantity: ${quantity}`);
        playBeep('send');

        setTimeout(() => {
            const data = state.wizardData;
            const waText = encodeURIComponent(
                `Hello SKS Engineering Solutions,\n` +
                `I would like to request an official RFQ quote:\n` +
                `• Enclosure Type: ${data.type}\n` +
                `• Dimensions: ${data.dimensions}\n` +
                `• Material: ${data.material}\n` +
                `• IP Rating: ${data.ipRating}\n` +
                `• Quantity: ${data.quantity}\n` +
                `Plant Location: Talawade, Pune.\n` +
                `Please review and share the CAD estimate and commercial proposal.`
            );

            const mailSubject = encodeURIComponent(`RFQ Quote Request - ${data.type}`);
            const mailBody = encodeURIComponent(
                `Dear SKS Engineering Sales Team,\n\n` +
                `Please provide a quotation for the following specification:\n` +
                `Enclosure Type: ${data.type}\n` +
                `Dimensions: ${data.dimensions}\n` +
                `Material: ${data.material}\n` +
                `IP Rating: ${data.ipRating}\n` +
                `Quantity: ${data.quantity}\n\n` +
                `Please share your pricing and standard lead time.\n\nThank you!`
            );

            const summaryHTML = `
                <strong>✅ RFQ Specification Summary Compiled!</strong>
                <div class="sks-rfq-wizard-card">
                    <div class="sks-rfq-wizard-title">
                        📐 Custom Enclosure Specification
                    </div>
                    <ul>
                        <li><strong>Type:</strong> ${data.type}</li>
                        <li><strong>Dimensions:</strong> ${data.dimensions}</li>
                        <li><strong>Material:</strong> ${data.material}</li>
                        <li><strong>Protection:</strong> ${data.ipRating}</li>
                        <li><strong>Batch Size:</strong> ${data.quantity}</li>
                        <li><strong>Est. CAD Review:</strong> 24–48 Hours</li>
                    </ul>
                    <div class="sks-card-actions">
                        <a href="https://api.whatsapp.com/send?phone=${SKS_INFO.phoneRaw}&text=${waText}" target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">
                            💬 Send to WhatsApp for Instant Pricing (+91-8668742659)
                        </a>
                        <a href="mailto:${SKS_INFO.email}?subject=${mailSubject}&body=${mailBody}" class="sks-action-btn primary">
                            📧 Email RFQ to sales@sksengineeringsolutions.com
                        </a>
                        <button type="button" class="sks-action-btn secondary" onclick="window.sksStartWizard()">
                            🔄 Recalculate / New Quote
                        </button>
                    </div>
                </div>
            `;
            appendMessage('bot', summaryHTML);
            playBeep('receive');
        }, 350);
    };

    function handleWizardInput(userText) {
        if (state.wizardStep === 2) {
            window.sksWizardSelectDim(userText);
        } else if (state.wizardStep === 3) {
            window.sksWizardSelectMat(userText, 'IP65');
        } else if (state.wizardStep === 4) {
            window.sksWizardFinish(userText);
        } else {
            state.wizardStep = 0;
            handleUserMessage(userText);
        }
    }

    // ==========================================================================
    // 9. Initial Conversation Initialization
    // ==========================================================================
    function initConversation() {
        const body = document.getElementById('sksChatBody');
        if (!body) return;

        try {
            const saved = sessionStorage.getItem('sks_chat_history');
            if (saved) {
                const list = JSON.parse(saved);
                if (Array.isArray(list) && list.length > 0) {
                    state.messages = list;
                    list.forEach(item => appendMessage(item.sender, item.text, true));
                    return;
                }
            }
        } catch (e) {}

        // Default Welcome Message
        const status = getOperationalStatus();
        let noticePill = status.isThursdayOff
            ? `<div class="sks-card-badge-row"><span class="sks-spec-pill orange">⚠️ Thursday Weekly Off (Responses queued for Friday 9:30 AM)</span></div>`
            : (status.isOpen 
                ? `<div class="sks-card-badge-row"><span class="sks-spec-pill">🟢 Factory Open (9:30 AM – 6:30 PM)</span></div>` 
                : `<div class="sks-card-badge-row"><span class="sks-spec-pill blue">🌙 Reopens Friday/Tomorrow at 9:30 AM</span></div>`);

        const welcomeHTML = `
            <strong>Welcome to SKS Engineering Solutions!</strong>
            ${noticePill}
            <p>I am your <strong>AI Engineering Assistant</strong> (A Shinde Groups Enterprise, Pune). I specialize in precision sheet metal fabrication, custom enclosures, and fast RFQ turnaround.</p>
            <p>How can I assist you right now?</p>
            <div class="sks-card-actions">
                <button type="button" class="sks-action-btn primary" onclick="window.sksStartWizard()">⚡ Get Instant Enclosure Quote</button>
                <a href="https://api.whatsapp.com/send?phone=${SKS_INFO.phoneRaw}&text=Hello%20SKS%20Engineering%2C%20inquiry%20via%20website%20AI%20Assistant" target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">💬 Chat with Engineer on WhatsApp</a>
            </div>
        `;
        appendMessage('bot', welcomeHTML);
    }

    // ==========================================================================
    // 10. Bootstrap on Page Load
    // ==========================================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createWidgetDOM);
    } else {
        createWidgetDOM();
    }
})();
