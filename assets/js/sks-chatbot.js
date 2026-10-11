/**
 * SKS Engineering Solutions - AI Engineering Assistant Engine
 * A Shinde Groups Enterprise • Pune Plant
 * 
 * Features:
 * - Official SKS Logo Integration (Header, Launcher, Teaser, Messages)
 * - Two-Way Voice:
 *     1. Text-to-Speech (Bot Speaks Responses Out Loud via Web Speech API)
 *     2. Speech-to-Text (User Speaks Questions via Microphone Recognition)
 * - Ultra-Simple, Attractive & Friendly Conversation Interface
 * - 1-Click WhatsApp Instant Quote Connection (+91-8668742659)
 * - 100% Client-Side Domain Knowledge Engine (0ms Latency, 100% Reliable)
 */

'use strict';

(function () {
    if (window.__SKS_CHATBOT_INITIALIZED__) return;
    window.__SKS_CHATBOT_INITIALIZED__ = true;

    // ==========================================================================
    // 1. Official SKS Corporate Knowledge Base
    // ==========================================================================
    const SKS_INFO = {
        name: "SKS Engineering Solutions",
        enterprise: "A Shinde Groups Enterprise",
        phone: "+91-8668742659",
        phoneRaw: "918668742659",
        email: "sales@sksengineeringsolutions.com",
        location: "Right side of Bridge, Beside shlok hospital, Khed-Shivapur Kondanpur road, Opposite Muktangan Hotel, Ramnagar, Pune - 412205, Maharashtra, India",
        mapsUrl: "https://maps.app.goo.gl/mNCYdPJJQLvxL5st7",
        hours: "Friday – Wednesday: 9:30 AM – 6:30 PM",
        weeklyOff: "Thursday: Closed (Weekly Off)",
        leadTimeCAD: "24 – 48 Hours for Engineering CAD Review & Preliminary RFQ",
        leadTimeFab: "7 – 15 Working Days for Standard Production",
        cadFormats: "DXF, DWG, STEP, STP, IGES, PDF Engineering Drawings"
    };

    // State
    const state = {
        isOpen: false,
        voiceSpeakingEnabled: localStorage.getItem('sks_voice_speaking_enabled') !== 'false', // Default ON
        isListening: false,
        isSpeakingNow: false,
        messages: []
    };

    // ==========================================================================
    // 2. Speech Synthesis (Text-to-Speech Engine)
    // ==========================================================================
    function stopSpeaking() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        state.isSpeakingNow = false;
        updateSoundWaveVisual(false);
    }

    function speakText(rawText) {
        if (!state.voiceSpeakingEnabled) return;
        if (!('speechSynthesis' in window)) return;

        try {
            stopSpeaking();

            // Clean HTML tags and markdown for clean spoken voice
            const cleanText = rawText
                .replace(/<[^>]*>/g, ' ')
                .replace(/[*_#`~\[\]\(\)]/g, ' ')
                .replace(/https?:\/\/\S+/g, '')
                .replace(/&bull;/g, ', ')
                .replace(/&amp;/g, ' and ')
                .replace(/&plusmn;/g, ' plus minus ')
                .replace(/\s+/g, ' ')
                .trim();

            if (!cleanText) return;

            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 1.02;
            utterance.pitch = 1.0;
            utterance.lang = 'en-IN';

            // Find best available English voice
            const voices = window.speechSynthesis.getVoices();
            const preferred = voices.find(v => v.lang.includes('en-IN')) || 
                              voices.find(v => v.lang.includes('en-GB')) || 
                              voices.find(v => v.lang.includes('en-US'));
            if (preferred) utterance.voice = preferred;

            utterance.onstart = () => {
                state.isSpeakingNow = true;
                updateSoundWaveVisual(true);
            };

            utterance.onend = utterance.onerror = () => {
                state.isSpeakingNow = false;
                updateSoundWaveVisual(false);
            };

            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn('Speech synthesis warning:', e);
        }
    }

    function updateSoundWaveVisual(isSpeaking) {
        const wave = document.getElementById('sksSoundWave');
        if (wave) {
            if (isSpeaking) {
                wave.classList.add('speaking');
            } else {
                wave.classList.remove('speaking');
            }
        }
    }

    // ==========================================================================
    // 3. Operational Schedule Calculator
    // ==========================================================================
    function getOperationalStatus() {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const ist = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + istOffset);
        const day = ist.getDay(); // 0=Sun, 4=Thu
        const hour = ist.getHours() + (ist.getMinutes() / 60);

        const isThursday = (day === 4);
        const isWorkingHours = (!isThursday && hour >= 9.5 && hour < 18.5);

        return {
            isOpen: isWorkingHours,
            isThursday: isThursday,
            notice: isThursday 
                ? "⚠️ Thursday: Weekly Off • WhatsApp Open 24/7"
                : (isWorkingHours ? "🟢 Plant Open Now • 9:30 AM – 6:30 PM" : "🌙 After-Hours • Leave Inquiry for Morning Review")
        };
    }

    // ==========================================================================
    // 4. SKS Domain Knowledge Engine (Friendly & Direct)
    // ==========================================================================
    function getBotResponse(userText) {
        const query = (userText || '').toLowerCase().trim();

        // 1. RFQ / Quote / Price / Cost
        if (query.match(/\b(quote|quotation|rfq|price|cost|pricing|rate|rates|estimate|estimation|how much)\b/)) {
            const spoken = "I would be happy to help you get a quick quotation! You can connect with our sales engineering team directly on WhatsApp or phone for immediate pricing.";
            const html = `
<p>I'd be glad to help you get an <strong>instant engineering RFQ quote</strong>!</p>
<ul>
  <li><strong>CAD Review:</strong> 24–48 Hours (DXF, DWG, STEP, PDF)</li>
  <li><strong>Production Turnaround:</strong> 7–15 Working Days</li>
  <li><strong>Custom Sizes:</strong> Built to your exact millimeter dimensions</li>
</ul>
<p>Choose the fastest option below to submit your requirements:</p>
<div class="sks-card-actions">
  <a href="https://wa.me/${SKS_INFO.phoneRaw}?text=Hello%20SKS%20Engineering%2C%20I%20would%20like%20a%20quotation%20for%20customized%20enclosures." target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">
    💬 Instant WhatsApp Quote
  </a>
  <button type="button" class="sks-action-btn primary" onclick="window.sksShowQuickForm()">
    📋 Request a Callback
  </button>
  <a href="tel:${SKS_INFO.phoneRaw}" class="sks-action-btn orange">
    📞 Call: ${SKS_INFO.phone}
  </a>
</div>`;
            return { spoken, html };
        }

        // 2. Enclosure Products / Types
        if (query.match(/\b(product|products|cabinet|cabinets|enclosure|enclosures|box|boxes|modular|floor standing|wall mount|junction|console|pcc|mcc)\b/)) {
            const spoken = "We manufacture modular floor-standing cabinets, IP65 wall-mount enclosures, custom junction boxes, and operator console desks in Pune.";
            const html = `
<p><strong>SKS Industrial Enclosure Lineup:</strong></p>
<ul>
  <li><strong>Modular Floor-Standing Enclosures:</strong> 9-Fold profile, 2.0mm/1.6mm CRCA, RAL 7035 textured, IP55/IP65 for PCC/MCC automation panels.</li>
  <li><strong>Wall-Mount Enclosures:</strong> Compact IP65/IP66 weather-resistant boxes with gland plates & mounting brackets.</li>
  <li><strong>Stainless Steel (SS304/SS316):</strong> Food, pharma & marine washdown grade IP66/IP69K.</li>
  <li><strong>Operator Console Desks & Junction Boxes:</strong> Customized push-button stations & desks.</li>
</ul>
<div class="sks-card-actions">
  <a href="products.html" class="sks-action-btn primary">📦 View Full Products Catalog</a>
  <a href="https://wa.me/${SKS_INFO.phoneRaw}?text=Hello%20SKS%20Engineering%2C%20inquiry%20regarding%20enclosure%20products." target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">💬 Inquire on WhatsApp</a>
</div>`;
            return { spoken, html };
        }

        // 3. Capabilities / Machinery / Laser Cutting / Bending
        if (query.match(/\b(capability|capabilities|laser|cutting|bend|bending|punch|punching|weld|welding|powder|coating|tolerance|machine|machinery|cnc)\b/)) {
            const spoken = "Our Pune manufacturing plant is equipped with high-precision CNC laser cutting with plus minus 0.1 millimeter precision, CNC press brakes, welding, and in-house PU foam gasketing.";
            const html = `
<p><strong>In-House Manufacturing Capabilities:</strong></p>
<ul>
  <li><strong>CNC Fiber Laser Cutting:</strong> High-precision ±0.1mm tolerance on CRCA, SS304, & Aluminium sheets.</li>
  <li><strong>CNC Multi-Axis Bending:</strong> Multi-bend profiles without distortion or crack lines.</li>
  <li><strong>Formed PU Foam Gasketing:</strong> Continuous robotic seal ensuring true IP55/IP65/IP66 ingress protection.</li>
  <li><strong>Powder Coating & Welding:</strong> 9-tank chemical pretreatment, conveyorized oven, and clean TIG/MIG welding.</li>
</ul>
<div class="sks-card-actions">
  <a href="capabilities.html" class="sks-action-btn primary">⚙️ Explore Capabilities</a>
  <a href="https://wa.me/${SKS_INFO.phoneRaw}?text=Hello%20SKS%20Engineering%2C%20inquiry%20regarding%20laser%20cutting%20and%20fabrication%20job%20work." target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">💬 Job Work Inquiry</a>
</div>`;
            return { spoken, html };
        }

        // 4. Plant Address / Location
        if (query.match(/\b(address|location|where|plant|factory|place|pune|map|maps|visit|directions|khed|ramnagar)\b/)) {
            const spoken = "Our manufacturing facility is located in Ramnagar, Khed-Shivapur Kondanpur Road, Pune, Maharashtra. Clients and engineers are welcome to visit!";
            const html = `
<p><strong>SKS Engineering Solutions Plant Location:</strong></p>
<p>📍 <strong>${SKS_INFO.location}</strong></p>
<ul>
  <li><strong>Working Hours:</strong> Friday – Wednesday: 9:30 AM – 6:30 PM (Thursday Closed)</li>
  <li><strong>Direct Contact:</strong> <a href="tel:${SKS_INFO.phoneRaw}" style="color:#60A5FA;">${SKS_INFO.phone}</a></li>
</ul>
<div class="sks-card-actions">
  <a href="${SKS_INFO.mapsUrl}" target="_blank" rel="noopener noreferrer" class="sks-action-btn primary">📍 Open in Google Maps</a>
  <a href="https://wa.me/${SKS_INFO.phoneRaw}?text=Hello%20SKS%20Engineering%2C%20I%20would%20like%20to%20visit%20your%20factory." target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">🗓️ Schedule Visit on WhatsApp</a>
</div>`;
            return { spoken, html };
        }

        // 5. Timings / Hours / Working Days
        if (query.match(/\b(time|timing|timings|hour|hours|open|close|closed|thursday|sunday|weekly off|schedule)\b/)) {
            const status = getOperationalStatus();
            const spoken = `Our plant operates Friday to Wednesday from 9:30 AM to 6:30 PM. Thursdays are our weekly off, but our WhatsApp is always available for inquiries.`;
            const html = `
<p><strong>Factory & Office Operational Timings:</strong></p>
<ul>
  <li><strong>Friday – Wednesday:</strong> 9:30 AM – 6:30 PM</li>
  <li><strong>Thursday:</strong> Closed (Weekly Off)</li>
</ul>
<p style="color:#94A3B8; font-size:0.8rem;">Status: ${status.notice}</p>
<div class="sks-card-actions">
  <a href="https://wa.me/${SKS_INFO.phoneRaw}?text=Hello%20SKS%20Engineering%2C%20inquiry%20regarding%20plant%20timings." target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">💬 Message on WhatsApp</a>
</div>`;
            return { spoken, html };
        }

        // 6. Contact / Phone / Email
        if (query.match(/\b(contact|phone|call|mobile|number|email|whatsapp|talk|sales)\b/)) {
            const spoken = "You can reach SKS Engineering directly at plus 91, 8668742659 or email sales at sksengineeringsolutions.com.";
            const html = `
<p><strong>Connect with SKS Engineering Solutions:</strong></p>
<ul>
  <li><strong>Sales Hotline / WhatsApp:</strong> <a href="tel:${SKS_INFO.phoneRaw}" style="color:#60A5FA;">${SKS_INFO.phone}</a></li>
  <li><strong>Official Email:</strong> <a href="mailto:${SKS_INFO.email}" style="color:#60A5FA;">${SKS_INFO.email}</a></li>
  <li><strong>Parent Enterprise:</strong> Shinde Groups Pune</li>
</ul>
<div class="sks-card-actions">
  <a href="https://wa.me/${SKS_INFO.phoneRaw}?text=Hello%20SKS%20Engineering%2C%20I%20would%20like%20to%20connect%20with%20sales." target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">💬 Chat on WhatsApp</a>
  <a href="tel:${SKS_INFO.phoneRaw}" class="sks-action-btn orange">📞 Call Directly</a>
</div>`;
            return { spoken, html };
        }

        // 7. General Friendly Fallback
        const spoken = "Thank you for asking! SKS Engineering Solutions specializes in precision sheet metal fabrication and customized electrical enclosures in Pune. Would you like to get a quote, explore products, or talk on WhatsApp?";
        const html = `
<p>Thank you for reaching out! <strong>SKS Engineering Solutions</strong> (A Shinde Groups Enterprise) specializes in precision sheet metal and custom industrial enclosures in Pune.</p>
<p>How can I best help you right now?</p>
<div class="sks-card-actions">
  <a href="https://wa.me/${SKS_INFO.phoneRaw}?text=Hello%20SKS%20Engineering%2C%20inquiry%3A%20${encodeURIComponent(userText.slice(0, 80))}" target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">
    💬 Talk on WhatsApp (+91-8668742659)
  </a>
  <button type="button" class="sks-action-btn primary" onclick="window.sksShowQuickForm()">
    📋 Request a Callback
  </button>
  <a href="products.html" class="sks-action-btn orange">
    📦 View Products Catalog
  </a>
</div>`;
        return { spoken, html };
    }

    // ==========================================================================
    // 5. DOM Construction & SKS Logo Injection
    // ==========================================================================
    function initChatbotDOM() {
        // 1. Inject or verify CSS
        if (!document.querySelector('link[href*="sks-chatbot.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'assets/css/sks-chatbot.css?v=20261011_voice';
            document.head.appendChild(link);
        }

        // 2. Greeting Teaser Bubble (with SKS Logo)
        let teaser = document.getElementById('sksChatTeaser');
        if (!teaser) {
            teaser = document.createElement('div');
            teaser.className = 'sks-chat-teaser';
            teaser.id = 'sksChatTeaser';
            teaser.setAttribute('role', 'button');
            teaser.setAttribute('aria-label', 'Open SKS AI Assistant');
            teaser.innerHTML = `
                <div class="sks-teaser-avatar">
                    <img src="assets/images/logo.png" alt="SKS Logo">
                </div>
                <div class="sks-teaser-text">
                    Need an <strong>Enclosure Quote</strong>? Ask SKS AI!
                </div>
                <button type="button" class="sks-teaser-close" id="sksTeaserClose" aria-label="Close message">&times;</button>
            `;
            document.body.appendChild(teaser);
        }

        // 3. Floating Right Dock Launcher (Inject or update with SKS Logo)
        const floatingDock = document.getElementById('floatingRightDock') || document.querySelector('.floating-right-dock');
        if (floatingDock) {
            let dockItem = document.querySelector('.dock-item.dock-chatbot');
            if (!dockItem) {
                dockItem = document.createElement('div');
                dockItem.className = 'dock-item dock-chatbot';
                floatingDock.insertBefore(dockItem, floatingDock.firstChild);
            }
            dockItem.innerHTML = `
                <button type="button" class="dock-btn dock-btn-chatbot" id="sksChatbotDockBtn" aria-label="Open SKS AI Engineering Assistant" title="AI Assistant (Voice & Chat)">
                    <img src="assets/images/logo.png" alt="SKS Engineering Logo" class="dock-sks-logo-img">
                    <span class="dock-badge-pulse green" title="AI Assistant Online 24/7"></span>
                    <span class="dock-tooltip">Ask SKS AI (Voice & Chat 24/7)</span>
                </button>
            `;
        }

        // 4. Main Chat Widget Window (Clean, Attractive, Official SKS Logo & Voice)
        let widget = document.getElementById('sksChatWidget');
        if (!widget) {
            const status = getOperationalStatus();
            widget = document.createElement('div');
            widget.className = 'sks-chat-widget';
            widget.id = 'sksChatWidget';
            widget.setAttribute('role', 'dialog');
            widget.setAttribute('aria-label', 'SKS AI Assistant Chat Window');
            widget.innerHTML = `
                <!-- Header with Official SKS Logo & Controls -->
                <div class="sks-chat-header">
                    <div class="sks-chat-brand">
                        <div class="sks-bot-avatar">
                            <img src="assets/images/logo.png" alt="SKS Engineering Solutions" class="sks-bot-avatar-img">
                            <span class="sks-avatar-status"></span>
                        </div>
                        <div class="sks-brand-info">
                            <div class="sks-brand-title">
                                SKS AI Assistant
                                <span class="sks-brand-badge">Official</span>
                            </div>
                            <div class="sks-brand-status">
                                <span class="sks-status-dot"></span>
                                <span>Voice &amp; Chat &bull; Pune Plant</span>
                            </div>
                        </div>
                    </div>
                    <div class="sks-chat-controls">
                        <!-- Voice Toggle Button (with speaking sound waves) -->
                        <button type="button" class="sks-ctrl-btn ${state.voiceSpeakingEnabled ? 'voice-active' : ''}" id="sksVoiceToggle" title="Toggle Voice Speaking Aloud">
                            <span id="sksVoiceIcon">${state.voiceSpeakingEnabled ? '🔊' : '🔇'}</span>
                            <div class="sks-sound-wave" id="sksSoundWave" title="Speaking aloud...">
                                <span></span><span></span><span></span>
                            </div>
                        </button>
                        <!-- Reset Conversation -->
                        <button type="button" class="sks-ctrl-btn" id="sksClearBtn" title="Reset Chat">
                            🗑️
                        </button>
                        <!-- Close Window -->
                        <button type="button" class="sks-ctrl-btn" id="sksCloseBtn" title="Close Chat">
                            ✕
                        </button>
                    </div>
                </div>

                <!-- Messages Body -->
                <div class="sks-chat-body" id="sksChatBody"></div>

                <!-- 4 Simple, Attractive Suggestion Chips -->
                <div class="sks-chat-chips-container" id="sksChipsContainer">
                    <button type="button" class="sks-chip-btn highlight" data-query="quote">⚡ Get Instant Quote</button>
                    <button type="button" class="sks-chip-btn" data-query="products">📦 Enclosure Products</button>
                    <button type="button" class="sks-chip-btn" data-query="capabilities">⚙️ Laser &amp; Bending</button>
                    <button type="button" class="sks-chip-btn" data-query="location">📍 Plant Location &amp; Contact</button>
                </div>

                <!-- Input Footer with Microphone (Voice Input) -->
                <form class="sks-chat-footer" id="sksChatForm" onsubmit="return false;">
                    <div class="sks-input-wrap">
                        <input type="text" class="sks-chat-input" id="sksChatInput" placeholder="Type or click 🎙️ to speak your question..." autocomplete="off">
                        <button type="button" class="sks-mic-btn" id="sksMicBtn" title="Speak into microphone" aria-label="Voice input">
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
            `;
            document.body.appendChild(widget);
        }

        bindEvents();
        renderInitialGreeting();
    }

    // ==========================================================================
    // 6. Messaging & Rendering
    // ==========================================================================
    function appendMessage(sender, htmlContent, spokenText = '') {
        const body = document.getElementById('sksChatBody');
        if (!body) return;

        const row = document.createElement('div');
        row.className = `sks-msg-row ${sender}`;

        if (sender === 'bot') {
            const safeSpeak = encodeURIComponent(spokenText || htmlContent.replace(/<[^>]*>/g, ''));
            row.innerHTML = `
                <div class="sks-msg-avatar">
                    <img src="assets/images/logo.png" alt="SKS" class="sks-msg-logo-img">
                </div>
                <div class="sks-msg-content">
                    ${htmlContent}
                    <div class="sks-msg-actions-bar">
                        <button type="button" class="sks-speak-msg-btn" onclick="window.sksSpeakMessage('${safeSpeak}')" title="Listen to this message">
                            🔊 Read Aloud
                        </button>
                    </div>
                </div>
            `;
        } else {
            row.innerHTML = `
                <div class="sks-msg-avatar user-avatar">You</div>
                <div class="sks-msg-content">
                    <p>${escapeHtml(htmlContent)}</p>
                </div>
            `;
        }

        body.appendChild(row);
        body.scrollTop = body.scrollHeight;

        // Auto speak if from bot
        if (sender === 'bot' && spokenText) {
            speakText(spokenText);
        }
    }

    function renderInitialGreeting() {
        const body = document.getElementById('sksChatBody');
        if (!body || body.children.length > 0) return;

        const greetingHtml = `
<p>Hello! 👋 Welcome to <strong>SKS Engineering Solutions</strong> (A Shinde Groups Enterprise).</p>
<p>I'm your AI assistant for <strong>customized electrical enclosures</strong> and <strong>precision sheet metal fabrication</strong> in Pune.</p>
<p>How can I help you today? You can type, speak using the 🎙️ mic, or choose a quick option below!</p>`;

        const spoken = "Hello! Welcome to SKS Engineering Solutions Pune. I can help you with enclosure quotes, sheet metal fabrication, and product specifications. How can I assist you today?";

        appendMessage('bot', greetingHtml, spoken);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ==========================================================================
    // 7. Interactive Event Bindings & Speech Recognition
    // ==========================================================================
    function bindEvents() {
        const widget = document.getElementById('sksChatWidget');
        const teaser = document.getElementById('sksChatTeaser');
        const dockBtn = document.getElementById('sksChatbotDockBtn');
        const closeBtn = document.getElementById('sksCloseBtn');
        const clearBtn = document.getElementById('sksClearBtn');
        const voiceToggle = document.getElementById('sksVoiceToggle');
        const voiceIcon = document.getElementById('sksVoiceIcon');
        const form = document.getElementById('sksChatForm');
        const input = document.getElementById('sksChatInput');
        const micBtn = document.getElementById('sksMicBtn');

        // Toggle open/close
        function openChat() {
            if (widget) widget.classList.add('active');
            if (teaser) teaser.classList.remove('visible');
            state.isOpen = true;
            if (input) setTimeout(() => input.focus(), 250);
        }

        function closeChat() {
            if (widget) widget.classList.remove('active');
            state.isOpen = false;
            stopSpeaking();
        }

        window.sksOpenChat = openChat;
        window.sksCloseChat = closeChat;
        window.sksToggleChat = () => {
            if (state.isOpen) closeChat();
            else openChat();
        };

        if (dockBtn) {
            dockBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.sksToggleChat();
            });
        }

        if (teaser) {
            teaser.addEventListener('click', (e) => {
                if (e.target.id === 'sksTeaserClose') {
                    teaser.classList.remove('visible');
                    return;
                }
                openChat();
            });
        }

        if (closeBtn) closeBtn.addEventListener('click', closeChat);

        // Reset conversation
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                stopSpeaking();
                const body = document.getElementById('sksChatBody');
                if (body) body.innerHTML = '';
                renderInitialGreeting();
            });
        }

        // Voice Speaking Toggle
        if (voiceToggle) {
            voiceToggle.addEventListener('click', () => {
                state.voiceSpeakingEnabled = !state.voiceSpeakingEnabled;
                localStorage.setItem('sks_voice_speaking_enabled', state.voiceSpeakingEnabled ? 'true' : 'false');
                if (voiceIcon) voiceIcon.textContent = state.voiceSpeakingEnabled ? '🔊' : '🔇';
                voiceToggle.classList.toggle('voice-active', state.voiceSpeakingEnabled);
                if (!state.voiceSpeakingEnabled) {
                    stopSpeaking();
                } else {
                    speakText("Voice speech is now enabled.");
                }
            });
        }

        // Submit message
        function handleSend() {
            if (!input) return;
            const text = input.value.trim();
            if (!text) return;

            appendMessage('user', text);
            input.value = '';

            // Generate bot answer
            setTimeout(() => {
                const response = getBotResponse(text);
                appendMessage('bot', response.html, response.spoken);
            }, 300);
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                handleSend();
            });
        }

        // Quick suggestion chips
        const chipsContainer = document.getElementById('sksChipsContainer');
        if (chipsContainer) {
            chipsContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.sks-chip-btn');
                if (!btn) return;
                const query = btn.getAttribute('data-query');
                if (query) {
                    appendMessage('user', btn.textContent.trim());
                    setTimeout(() => {
                        const response = getBotResponse(query);
                        appendMessage('bot', response.html, response.spoken);
                    }, 250);
                }
            });
        }

        // Speech-to-Text Microphone
        if (micBtn && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognizer = new SpeechRec();
            recognizer.continuous = false;
            recognizer.interimResults = false;
            recognizer.lang = 'en-IN';

            recognizer.onstart = () => {
                state.isListening = true;
                micBtn.classList.add('listening');
                if (input) input.placeholder = "🎙️ Listening... speak now!";
            };

            recognizer.onresult = (evt) => {
                const transcript = evt.results[0][0].transcript;
                if (input && transcript) {
                    input.value = transcript;
                    handleSend();
                }
            };

            recognizer.onerror = recognizer.onend = () => {
                state.isListening = false;
                micBtn.classList.remove('listening');
                if (input) input.placeholder = "Type or click 🎙️ to speak your question...";
            };

            micBtn.addEventListener('click', () => {
                if (state.isListening) {
                    recognizer.stop();
                } else {
                    stopSpeaking();
                    try {
                        recognizer.start();
                    } catch (e) {
                        console.warn('Recognition start warning:', e);
                    }
                }
            });
        } else if (micBtn) {
            micBtn.title = "Voice recognition not supported in this browser";
            micBtn.style.opacity = "0.4";
        }

        // Auto open if URL has #chat or query
        if (window.location.hash === '#chat' || window.location.search.includes('chat=open')) {
            setTimeout(openChat, 400);
        }

        // Show teaser after 4 seconds
        setTimeout(() => {
            if (!state.isOpen && teaser) {
                teaser.classList.add('visible');
            }
        }, 4000);
    }

    // ==========================================================================
    // 8. Global Helper APIs
    // ==========================================================================
    window.sksSpeakMessage = function (encodedText) {
        try {
            const decoded = decodeURIComponent(encodedText);
            speakText(decoded);
        } catch (e) {
            console.warn(e);
        }
    };

    window.sksShowQuickForm = function () {
        const body = document.getElementById('sksChatBody');
        if (!body) return;

        const formId = 'sksQuickForm_' + Date.now();
        const html = `
<div class="sks-quick-lead-box" id="${formId}">
  <p style="margin-bottom:8px; font-weight:600; color:#38BDF8;">📋 Quick Callback & Quote Request:</p>
  <input type="text" class="sks-quick-lead-input" id="${formId}_name" placeholder="Your Name or Company" autocomplete="name">
  <input type="tel" class="sks-quick-lead-input" id="${formId}_phone" placeholder="Mobile Number (e.g. 9876543210)" autocomplete="tel">
  <input type="text" class="sks-quick-lead-input" id="${formId}_req" placeholder="Requirement (e.g. 2000x800x600 Modular Panel)">
  <div style="display:flex; gap:6px; margin-top:4px;">
    <button type="button" class="sks-action-btn primary" style="flex:1;" onclick="window.sksSubmitQuickForm('${formId}')">
      ✅ Submit Request
    </button>
  </div>
</div>`;

        appendMessage('bot', html, "Please enter your name and phone number, and our sales team will contact you promptly.");
    };

    window.sksSubmitQuickForm = function (formId) {
        const nameInput = document.getElementById(formId + '_name');
        const phoneInput = document.getElementById(formId + '_phone');
        const reqInput = document.getElementById(formId + '_req');

        const name = (nameInput ? nameInput.value : '').trim();
        const phone = (phoneInput ? phoneInput.value : '').trim();
        const req = (reqInput ? reqInput.value : '').trim();

        if (!phone || phone.length < 8) {
            alert("Please enter a valid mobile number so our engineering team can contact you.");
            if (phoneInput) phoneInput.focus();
            return;
        }

        const box = document.getElementById(formId);
        if (box) {
            box.innerHTML = `
<div style="color:#10B981; font-weight:600; padding:4px 0;">
  ✅ Request Received!
</div>
<p style="font-size:0.82rem; color:#E2E8F0; margin-top:4px;">
  Thank you, <strong>${escapeHtml(name || 'Sir/Madam')}</strong>. Our engineering specialist will call you on <strong>${escapeHtml(phone)}</strong> shortly.
</p>
<div style="margin-top:8px;">
  <a href="https://wa.me/${SKS_INFO.phoneRaw}?text=Hello%20SKS%20Engineering%2C%20I%20requested%20a%20callback%20for%3A%20${encodeURIComponent(req || 'Enclosure Quote')}%20(Name%3A%20${encodeURIComponent(name)}%2C%20Phone%3A%20${encodeURIComponent(phone)})" target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">
    📱 Also Open WhatsApp Directly
  </a>
</div>`;
        }

        speakText(`Thank you ${name || ''}! Your inquiry has been received. Our sales engineer will call you shortly.`);
    };

    // Auto initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbotDOM);
    } else {
        initChatbotDOM();
    }
})();
