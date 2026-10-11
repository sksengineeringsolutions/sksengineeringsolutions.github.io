/**
 * SKS Engineering Solutions - AI Engineering Assistant Engine
 * A Shinde Groups Enterprise • Pune Plant
 * 
 * Features:
 * - Google Gemini AI Integration (Generative Intelligence with Auto-Fallback)
 * - Two-Way Voice: Text-to-Speech (Speaks Responses) & Speech-to-Text (Mic Input)
 * - Official SKS Logo Integration Across Widget
 * - Ultra-Simple, Attractive & Fast User Experience
 * - Direct 1-Click WhatsApp Instant RFQ Connection (+91-8668742659)
 */

'use strict';

(function () {
    if (window.__SKS_CHATBOT_INITIALIZED__) return;
    window.__SKS_CHATBOT_INITIALIZED__ = true;

    // ==========================================================================
    // 1. Official SKS Knowledge Base
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
        isSpeakingNow: false
    };

    // ==========================================================================
    // 2. Google Gemini API Engine
    // ==========================================================================
    function getActiveGeminiKey() {
        // 1. Check local storage
        const local = (localStorage.getItem('sks_gemini_api_key') || '').trim();
        if (local && local.length > 20) return local;

        // 2. Check window config
        const winKey = (window.SKS_GEMINI_API_KEY || '').trim();
        if (winKey && winKey.length > 20) return winKey;

        return '';
    }

    async function queryGeminiAI(userText) {
        const apiKey = getActiveGeminiKey();
        if (!apiKey) return null;

        const systemPrompt = `You are the friendly, professional AI assistant for SKS Engineering Solutions (A Shinde Groups Enterprise) in Pune, Maharashtra.
Specialties: Customized industrial electrical enclosures (modular floor-standing, wall-mount, junction boxes, operator console desks) and precision sheet metal fabrication (CNC laser cutting ±0.1mm, CNC bending, welding, formed PU foam gasketing).
Location: Ramnagar, Khed-Shivapur Kondanpur road, Pune - 412205.
Timings: Friday to Wednesday: 9:30 AM to 6:30 PM (Thursday Closed).
Contact: Phone/WhatsApp: +91-8668742659, Email: sales@sksengineeringsolutions.com.
CRITICAL RULES:
1. Keep your reply VERY SIMPLE, polite, natural, and under 2-3 sentences.
2. Never output long walls of text. Keep it easy to read.
3. Always mention WhatsApp +91-8668742659 for instant quotes or CAD drawing submissions.`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: `${systemPrompt}\n\nCustomer Inquiry: ${userText}\nAssistant Response:` }]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 140
                    }
                })
            });
            clearTimeout(timeoutId);

            if (!response.ok) return null;

            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            return text ? text.trim() : null;
        } catch (e) {
            console.warn('Gemini API call timed out or failed, using local engine:', e);
            return null;
        }
    }

    // ==========================================================================
    // 3. Speech Synthesis (Text-to-Speech Engine)
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
            if (isSpeaking) wave.classList.add('speaking');
            else wave.classList.remove('speaking');
        }
    }

    // ==========================================================================
    // 4. Local SKS Knowledge Engine (Fast & Direct Fallback)
    // ==========================================================================
    function getLocalResponse(userText) {
        const query = (userText || '').toLowerCase().trim();

        // 1. Quote / Price
        if (query.match(/\b(quote|quotation|rfq|price|cost|pricing|rate|rates|estimate|how much)\b/)) {
            const spoken = "I would be happy to help you get a quick quotation! You can connect with our sales engineering team directly on WhatsApp for immediate pricing.";
            const html = `
<p>I'd be glad to help you get an <strong>instant engineering RFQ quote</strong>!</p>
<ul>
  <li><strong>CAD Review:</strong> 24–48 Hours (DXF, DWG, STEP, PDF)</li>
  <li><strong>Fabrication:</strong> 7–15 Working Days</li>
  <li><strong>Custom Sizes:</strong> Built to your exact millimeter dimensions</li>
</ul>
<div class="sks-card-actions">
  <a href="https://wa.me/${SKS_INFO.phoneRaw}?text=Hello%20SKS%20Engineering%2C%20I%20would%20like%20a%20quotation%20for%20customized%20enclosures." target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">
    💬 Instant WhatsApp Quote
  </a>
  <a href="tel:${SKS_INFO.phoneRaw}" class="sks-action-btn orange">
    📞 Call: ${SKS_INFO.phone}
  </a>
</div>`;
            return { spoken, html };
        }

        // 2. Enclosures & Products
        if (query.match(/\b(product|products|cabinet|cabinets|enclosure|enclosures|box|boxes|modular|floor standing|wall mount|junction|console)\b/)) {
            const spoken = "We manufacture modular floor-standing cabinets, IP65 wall-mount enclosures, custom junction boxes, and operator console desks in Pune.";
            const html = `
<p><strong>SKS Industrial Enclosure Lineup:</strong></p>
<ul>
  <li><strong>Modular Floor-Standing:</strong> 9-Fold profile, 2.0mm/1.6mm CRCA, RAL 7035, IP55/IP65.</li>
  <li><strong>Wall-Mount Enclosures:</strong> IP65/IP66 weather-resistant boxes with mounting plates.</li>
  <li><strong>Stainless Steel (SS304/SS316):</strong> Pharma, food & chemical washdown grade.</li>
  <li><strong>Operator Consoles & Junction Boxes:</strong> Built to CAD specs.</li>
</ul>
<div class="sks-card-actions">
  <a href="products.html" class="sks-action-btn primary">📦 View Products Catalog</a>
  <a href="https://wa.me/${SKS_INFO.phoneRaw}?text=Hello%20SKS%20Engineering%2C%20inquiry%20regarding%20enclosures." target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">💬 Inquire on WhatsApp</a>
</div>`;
            return { spoken, html };
        }

        // 3. Capabilities / Laser / Bending
        if (query.match(/\b(capability|capabilities|laser|cutting|bend|bending|punch|punching|weld|welding|tolerance|cnc)\b/)) {
            const spoken = "Our plant features high precision CNC laser cutting with plus minus 0.1 millimeter tolerance, CNC press brakes, welding, and in-house PU foam gasketing.";
            const html = `
<p><strong>Manufacturing Capabilities at SKS Pune:</strong></p>
<ul>
  <li><strong>CNC Laser Cutting:</strong> High precision ±0.1mm tolerance on CRCA, SS304 & Aluminium.</li>
  <li><strong>CNC Press Brake Bending:</strong> Multi-axis bending for rigid profiles.</li>
  <li><strong>Formed PU Foam Gasket:</strong> Continuous robotic seal ensuring IP55/IP65/IP66.</li>
  <li><strong>Powder Coating & Welding:</strong> 9-tank pretreatment & durable RAL finish.</li>
</ul>
<div class="sks-card-actions">
  <a href="capabilities.html" class="sks-action-btn primary">⚙️ View Capabilities</a>
  <a href="https://wa.me/${SKS_INFO.phoneRaw}?text=Hello%20SKS%20Engineering%2C%20laser%20cutting%20inquiry." target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">💬 Job Work Inquiry</a>
</div>`;
            return { spoken, html };
        }

        // 4. Plant Location & Timings
        if (query.match(/\b(address|location|where|plant|factory|place|pune|map|maps|visit|time|timing|hours|open|close)\b/)) {
            const spoken = "Our factory is in Ramnagar, Khed-Shivapur Kondanpur Road, Pune. Open Friday to Wednesday from 9:30 AM to 6:30 PM. Thursdays are closed.";
            const html = `
<p><strong>Factory Location & Timings:</strong></p>
<p>📍 <strong>${SKS_INFO.location}</strong></p>
<ul>
  <li><strong>Hours:</strong> Friday – Wednesday: 9:30 AM – 6:30 PM</li>
  <li><strong>Weekly Off:</strong> Thursday (Closed)</li>
  <li><strong>Phone:</strong> <a href="tel:${SKS_INFO.phoneRaw}" style="color:#60A5FA;">${SKS_INFO.phone}</a></li>
</ul>
<div class="sks-card-actions">
  <a href="${SKS_INFO.mapsUrl}" target="_blank" rel="noopener noreferrer" class="sks-action-btn primary">📍 Open in Google Maps</a>
  <a href="https://wa.me/${SKS_INFO.phoneRaw}?text=Hello%20SKS%20Engineering%2C%20factory%20visit." target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">💬 WhatsApp Us</a>
</div>`;
            return { spoken, html };
        }

        // 5. Default Fallback
        const spoken = "SKS Engineering Solutions specializes in precision sheet metal fabrication and customized electrical enclosures in Pune. Would you like a quote or to chat on WhatsApp?";
        const html = `
<p>Welcome to <strong>SKS Engineering Solutions</strong> (A Shinde Groups Enterprise). We specialize in precision sheet metal and custom industrial enclosures in Pune.</p>
<p>How can I help you today?</p>
<div class="sks-card-actions">
  <a href="https://wa.me/${SKS_INFO.phoneRaw}?text=Hello%20SKS%20Engineering%2C%20inquiry%3A%20${encodeURIComponent(userText.slice(0, 80))}" target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">
    💬 Talk on WhatsApp (+91-8668742659)
  </a>
  <a href="tel:${SKS_INFO.phoneRaw}" class="sks-action-btn orange">
    📞 Call: ${SKS_INFO.phone}
  </a>
</div>`;
        return { spoken, html };
    }

    // ==========================================================================
    // 5. DOM Initialization & SKS Logo
    // ==========================================================================
    function initChatbotDOM() {
        if (!document.querySelector('link[href*="sks-chatbot.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'assets/css/sks-chatbot.css?v=20261011_gemini';
            document.head.appendChild(link);
        }

        // 1. Teaser Greeting Pill
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

        // 2. Dock Launcher Integration
        const floatingDock = document.getElementById('floatingRightDock') || document.querySelector('.floating-right-dock');
        if (floatingDock) {
            let dockItem = document.querySelector('.dock-item.dock-chatbot');
            if (!dockItem) {
                dockItem = document.createElement('div');
                dockItem.className = 'dock-item dock-chatbot';
                floatingDock.insertBefore(dockItem, floatingDock.firstChild);
            }
            dockItem.innerHTML = `
                <button type="button" class="dock-btn dock-btn-chatbot" id="sksChatbotDockBtn" aria-label="Open SKS AI Assistant" title="SKS AI Assistant (Voice & Chat)">
                    <img src="assets/images/logo.png" alt="SKS Engineering Logo" class="dock-sks-logo-img">
                    <span class="dock-badge-pulse green" title="AI Assistant Online 24/7"></span>
                    <span class="dock-tooltip">Ask SKS AI Assistant (24/7)</span>
                </button>
            `;
        }

        // 3. Main Chat Widget Window (Simple, Attractive, Official SKS Logo)
        let widget = document.getElementById('sksChatWidget');
        if (!widget) {
            widget = document.createElement('div');
            widget.className = 'sks-chat-widget';
            widget.id = 'sksChatWidget';
            widget.setAttribute('role', 'dialog');
            widget.setAttribute('aria-label', 'SKS AI Assistant Chat Window');
            widget.innerHTML = `
                <!-- Header with SKS Logo -->
                <div class="sks-chat-header">
                    <div class="sks-chat-brand">
                        <div class="sks-bot-avatar">
                            <img src="assets/images/logo.png" alt="SKS Engineering Solutions" class="sks-bot-avatar-img">
                            <span class="sks-avatar-status"></span>
                        </div>
                        <div class="sks-brand-info">
                            <div class="sks-brand-title">
                                SKS AI Assistant
                                <span class="sks-brand-badge">Gemini AI</span>
                            </div>
                            <div class="sks-brand-status">
                                <span class="sks-status-dot"></span>
                                <span>Voice &amp; Chat &bull; Pune Plant</span>
                            </div>
                        </div>
                    </div>
                    <div class="sks-chat-controls">
                        <!-- Voice Toggle Button -->
                        <button type="button" class="sks-ctrl-btn ${state.voiceSpeakingEnabled ? 'voice-active' : ''}" id="sksVoiceToggle" title="Toggle Voice Speaking Aloud">
                            <span id="sksVoiceIcon">${state.voiceSpeakingEnabled ? '🔊' : '🔇'}</span>
                            <div class="sks-sound-wave" id="sksSoundWave" title="Speaking aloud...">
                                <span></span><span></span><span></span>
                            </div>
                        </button>
                        <!-- Close Window -->
                        <button type="button" class="sks-ctrl-btn" id="sksCloseBtn" title="Close Chat">
                            ✕
                        </button>
                    </div>
                </div>

                <!-- Messages Body -->
                <div class="sks-chat-body" id="sksChatBody"></div>

                <!-- 3 Simple Quick Buttons -->
                <div class="sks-chat-chips-container" id="sksChipsContainer">
                    <button type="button" class="sks-chip-btn highlight" data-query="quote">💬 WhatsApp Quote</button>
                    <button type="button" class="sks-chip-btn" data-query="products">📦 Enclosure Products</button>
                    <button type="button" class="sks-chip-btn" data-query="location">📍 Plant Location</button>
                </div>

                <!-- Input Footer with Microphone (Voice Input) -->
                <form class="sks-chat-footer" id="sksChatForm" onsubmit="return false;">
                    <div class="sks-input-wrap">
                        <input type="text" class="sks-chat-input" id="sksChatInput" placeholder="Ask anything or click 🎙️ to speak..." autocomplete="off">
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
                        <button type="button" class="sks-speak-msg-btn" onclick="window.sksSpeakMessage('${safeSpeak}')" title="Listen to this response">
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

        if (sender === 'bot' && spokenText) {
            speakText(spokenText);
        }
    }

    function showTypingIndicator() {
        const body = document.getElementById('sksChatBody');
        if (!body) return;
        removeTypingIndicator();

        const indicator = document.createElement('div');
        indicator.className = 'sks-typing-indicator';
        indicator.id = 'sksTypingIndicator';
        indicator.innerHTML = `
            <div class="sks-typing-dots"><span></span><span></span><span></span></div>
            <span>SKS AI is thinking...</span>
        `;
        body.appendChild(indicator);
        body.scrollTop = body.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('sksTypingIndicator');
        if (indicator) indicator.remove();
    }

    function renderInitialGreeting() {
        const body = document.getElementById('sksChatBody');
        if (!body || body.children.length > 0) return;

        const greetingHtml = `
<p>Hello! 👋 Welcome to <strong>SKS Engineering Solutions</strong>.</p>
<p>How can I help you today? You can ask anything about our <strong>customized enclosures</strong>, <strong>laser cutting &amp; bending</strong>, or tap below!</p>`;

        const spoken = "Hello! Welcome to SKS Engineering Solutions. How can I help you with enclosures or sheet metal fabrication today?";
        appendMessage('bot', greetingHtml, spoken);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatGeminiText(text) {
        return escapeHtml(text)
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
    }

    // ==========================================================================
    // 7. Interactive Event Bindings & Speech Recognition
    // ==========================================================================
    function bindEvents() {
        const widget = document.getElementById('sksChatWidget');
        const teaser = document.getElementById('sksChatTeaser');
        const dockBtn = document.getElementById('sksChatbotDockBtn');
        const closeBtn = document.getElementById('sksCloseBtn');
        const voiceToggle = document.getElementById('sksVoiceToggle');
        const voiceIcon = document.getElementById('sksVoiceIcon');
        const form = document.getElementById('sksChatForm');
        const input = document.getElementById('sksChatInput');
        const micBtn = document.getElementById('sksMicBtn');

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

        // Submit message (Gemini AI -> Local Fallback)
        async function handleSend() {
            if (!input) return;
            const text = input.value.trim();
            if (!text) return;

            appendMessage('user', text);
            input.value = '';
            showTypingIndicator();

            try {
                // 1. Try Gemini Generative AI
                const geminiReply = await queryGeminiAI(text);
                removeTypingIndicator();

                if (geminiReply) {
                    const html = `
<p>${formatGeminiText(geminiReply)}</p>
<div class="sks-card-actions">
  <a href="https://wa.me/${SKS_INFO.phoneRaw}?text=Hello%20SKS%20Engineering%2C%20inquiry%3A%20${encodeURIComponent(text.slice(0, 60))}" target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">
    💬 Instant WhatsApp (+91-8668742659)
  </a>
</div>`;
                    appendMessage('bot', html, geminiReply);
                    return;
                }
            } catch (err) {
                console.warn(err);
                removeTypingIndicator();
            }

            // 2. Fast Local Fallback if Gemini unavailable
            removeTypingIndicator();
            const fallback = getLocalResponse(text);
            appendMessage('bot', fallback.html, fallback.spoken);
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
                    showTypingIndicator();
                    setTimeout(() => {
                        removeTypingIndicator();
                        const response = getLocalResponse(query);
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
                if (input) input.placeholder = "🎙️ Listening... please speak now!";
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
                if (input) input.placeholder = "Ask anything or click 🎙️ to speak...";
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
            openChat();
        }
        window.addEventListener('hashchange', () => {
            if (window.location.hash === '#chat') openChat();
        });

        // Show teaser after 4 seconds
        setTimeout(() => {
            if (!state.isOpen && teaser) {
                teaser.classList.add('visible');
            }
        }, 4000);
    }

    // Global audio helper
    window.sksSpeakMessage = function (encodedText) {
        try {
            const decoded = decodeURIComponent(encodedText);
            speakText(decoded);
        } catch (e) {
            console.warn(e);
        }
    };

    // Auto initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbotDOM);
    } else {
        initChatbotDOM();
    }
})();
