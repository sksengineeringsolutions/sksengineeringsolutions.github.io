/**
 * SKS Engineering Solutions - AI Engineering Assistant
 * A Shinde Groups Enterprise • Pune Plant
 * 
 * Powered by Google Gemini Generative AI (Live Intelligence)
 * Clean, Simple, Fast & Attractive. Pure AI - No Voice, No Settings.
 */

'use strict';

(function () {
    if (window.__SKS_CHATBOT_INITIALIZED__) return;
    window.__SKS_CHATBOT_INITIALIZED__ = true;

    // ==========================================================================
    // 1. Company Information & System Prompt
    // ==========================================================================
    const SKS_INFO = {
        name: "SKS Engineering Solutions",
        enterprise: "A Shinde Groups Enterprise",
        phone: "+91-8668742659",
        phoneRaw: "918668742659",
        email: "sales@sksengineeringsolutions.com",
        location: "Right side of Bridge, Beside shlok hospital, Khed-Shivapur Kondanpur road, Opposite Muktangan Hotel, Ramnagar, Pune - 412205, Maharashtra, India",
        mapsUrl: "https://maps.app.goo.gl/mNCYdPJJQLvxL5st7",
        hours: "Friday – Wednesday: 9:30 AM – 6:30 PM (Thursday Closed)"
    };

    const SYSTEM_PROMPT = `You are the official AI Engineering Assistant for SKS Engineering Solutions (A Shinde Groups Enterprise), located in Pune, Maharashtra, India.
Plant Location: Ramnagar, Khed-Shivapur Kondanpur Road, Pune - 412205.
Timings: Friday to Wednesday: 9:30 AM – 6:30 PM (Thursday: Closed / Weekly Off).
Contact: WhatsApp & Phone: +91-8668742659 | Email: sales@sksengineeringsolutions.com.

Our Core Manufacturing Capabilities & Products:
1. Customized Industrial Electrical Enclosures:
   - Modular Floor-Standing Cabinets: 9-fold profile, CRCA up to 2.0mm, IP55 / IP65 / IP66 protection, RAL 7035 powder coating, modular joining.
   - Wall-Mount Enclosures: Weather-resistant IP65/IP66, gland plates, mounting brackets.
   - Stainless Steel Enclosures: SS304 & SS316 food/pharma grade washdown cabinets.
   - Operator Consoles & Junction Boxes: Custom dimensions per CAD specifications.
2. Precision Sheet Metal Fabrication:
   - CNC Laser Cutting: High-precision ±0.1mm tolerance on CRCA (up to 12mm), Stainless Steel (up to 6mm), Aluminium (up to 4mm).
   - CNC Press Brake Multi-Axis Bending: Accurate repeat bending.
   - Robotic Formed-in-Place PU Foam Gasketing: Continuous seamless sealing for IP protection.
   - Surface Finishing: 9-tank chemical pretreatment, automated electrostatic powder coating.
3. Engineering CAD & Lead Times:
   - Formats Accepted: DXF, DWG, STEP, STP, IGES, PDF drawings.
   - CAD Engineering Review: 24 to 48 Hours.
   - Production Lead Time: 7 to 15 Working Days.

IMPORTANT INSTRUCTIONS:
- Answer naturally, politely, and concisely (2 to 4 sentences or a clean bullet list).
- Keep replies easy to read, direct, and helpful.
- Mention WhatsApp +91-8668742659 or CAD submission for instant engineering quotes whenever relevant.`;

    // State
    const state = {
        isOpen: false,
        isThinking: false,
        conversationHistory: [] // [{role: 'user'|'model', text: '...'}]
    };

    // ==========================================================================
    // 2. Google Gemini API Engine (Primary: 3.8-flash, Fallback: 3.5-flash)
    // ==========================================================================
    function getActiveGeminiKey() {
        const local = (localStorage.getItem('sks_gemini_api_key') || '').trim();
        if (local && local.length > 15) return local;

        const winKey = (window.SKS_GEMINI_API_KEY || '').trim();
        if (winKey && winKey.length > 15) return winKey;

        return '';
    }

    async function callGeminiEndpoint(modelName, apiKey, contents) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    contents: contents,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 350
                    }
                })
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                console.warn(`Gemini model ${modelName} returned status ${response.status}:`, errData);
                return null;
            }

            const data = await response.json();
            const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            return replyText ? replyText.trim() : null;
        } catch (err) {
            clearTimeout(timeoutId);
            console.warn(`Gemini call to ${modelName} failed:`, err);
            return null;
        }
    }

    async function queryGeminiAI(userText) {
        const apiKey = getActiveGeminiKey();
        if (!apiKey) {
            return {
                ok: false,
                error: "API key is not configured. Please contact SKS Engineering via WhatsApp (+91-8668742659)."
            };
        }

        // Build messages payload with conversation history
        const contents = [];

        // First message injects the SKS system instruction
        if (state.conversationHistory.length === 0) {
            contents.push({
                role: "user",
                parts: [{ text: `${SYSTEM_PROMPT}\n\nCustomer Inquiry: ${userText}` }]
            });
        } else {
            // Include recent turns (up to last 6 turns)
            const recentHistory = state.conversationHistory.slice(-6);
            recentHistory.forEach((turn, idx) => {
                if (idx === 0) {
                    contents.push({
                        role: turn.role,
                        parts: [{ text: `${SYSTEM_PROMPT}\n\nCustomer Inquiry: ${turn.text}` }]
                    });
                } else {
                    contents.push({
                        role: turn.role,
                        parts: [{ text: turn.text }]
                    });
                }
            });
            contents.push({
                role: "user",
                parts: [{ text: userText }]
            });
        }

        // Try primary model (gemini-3.8-flash)
        let reply = await callGeminiEndpoint('gemini-3.8-flash', apiKey, contents);

        // Fallback to gemini-3.5-flash if needed
        if (!reply) {
            reply = await callGeminiEndpoint('gemini-3.5-flash', apiKey, contents);
        }

        if (reply) {
            // Update history
            state.conversationHistory.push({ role: 'user', text: userText });
            state.conversationHistory.push({ role: 'model', text: reply });
            // Cap history
            if (state.conversationHistory.length > 10) {
                state.conversationHistory = state.conversationHistory.slice(-10);
            }
            return { ok: true, text: reply };
        }

        return {
            ok: false,
            error: "Unable to reach Gemini AI at this moment. Please reach out directly on WhatsApp (+91-8668742659) or call +91-8668742659."
        };
    }

    // ==========================================================================
    // 3. UI Construction & SKS Logo
    // ==========================================================================
    function initChatbotDOM() {
        if (!document.querySelector('link[href*="sks-chatbot.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'assets/css/sks-chatbot.css?v=20261011_pure_gemini';
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

        // 2. Chat Widget Window
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
                                <span>Live AI Engine &bull; Pune Plant</span>
                            </div>
                        </div>
                    </div>
                    <div class="sks-chat-controls">
                        <!-- Single Clean Close Button -->
                        <button type="button" class="sks-ctrl-btn" id="sksCloseBtn" title="Close Chat" aria-label="Close Chat">
                            ✕
                        </button>
                    </div>
                </div>

                <!-- Messages Body -->
                <div class="sks-chat-body" id="sksChatBody"></div>

                <!-- Simple Quick Prompt Chips -->
                <div class="sks-chat-chips-container" id="sksChipsContainer">
                    <button type="button" class="sks-chip-btn highlight" data-prompt="What is your quotation process and lead time for custom electrical enclosures?">⚡ Enclosure Quote</button>
                    <button type="button" class="sks-chip-btn" data-prompt="What are your CNC laser cutting and bending machine tolerances?">📐 CNC Laser Specs</button>
                    <button type="button" class="sks-chip-btn" data-prompt="Where is your Pune factory located and what are your working hours?">📍 Plant Location</button>
                    <button type="button" class="sks-chip-btn" data-prompt="Which CAD file formats do you accept for engineering drawings?">📁 CAD Formats</button>
                </div>

                <!-- Clean Input Footer (No Mic, No Voice, Just AI Chat) -->
                <form class="sks-chat-footer" id="sksChatForm" onsubmit="return false;">
                    <div class="sks-input-wrap">
                        <input type="text" class="sks-chat-input" id="sksChatInput" placeholder="Ask SKS AI anything about enclosures, CAD, specs..." autocomplete="off">
                    </div>
                    <button type="submit" class="sks-send-btn" id="sksSendBtn" aria-label="Send Message" title="Send Message">
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
    // 4. Messaging & Formatting
    // ==========================================================================
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function formatMarkdown(text) {
        if (!text) return '';
        let formatted = escapeHtml(text)
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1);padding:2px 4px;border-radius:4px;">$1</code>');

        // Handle bullet points
        const lines = formatted.split('\n');
        let inList = false;
        let result = [];

        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                if (!inList) {
                    result.push('<ul style="margin:6px 0 8px 18px;padding:0;">');
                    inList = true;
                }
                result.push(`<li style="margin-bottom:4px;">${trimmed.substring(2)}</li>`);
            } else if (trimmed.match(/^\d+\.\s/)) {
                if (!inList) {
                    result.push('<ol style="margin:6px 0 8px 18px;padding:0;">');
                    inList = true;
                }
                result.push(`<li style="margin-bottom:4px;">${trimmed.replace(/^\d+\.\s/, '')}</li>`);
            } else {
                if (inList) {
                    result.push('</ul>');
                    inList = false;
                }
                if (trimmed) {
                    result.push(`<p style="margin-bottom:6px;">${trimmed}</p>`);
                }
            }
        });

        if (inList) result.push('</ul>');
        return result.join('');
    }

    function appendMessage(sender, htmlContent, rawText = '') {
        const body = document.getElementById('sksChatBody');
        if (!body) return;

        const row = document.createElement('div');
        row.className = `sks-msg-row ${sender}`;

        if (sender === 'bot') {
            const whatsAppQuery = encodeURIComponent(rawText ? rawText.slice(0, 70) : "Customer inquiry via SKS AI Assistant");
            row.innerHTML = `
                <div class="sks-msg-avatar">
                    <img src="assets/images/logo.png" alt="SKS" class="sks-msg-logo-img">
                </div>
                <div class="sks-msg-content">
                    ${htmlContent}
                    <div class="sks-card-actions">
                        <a href="https://wa.me/${SKS_INFO.phoneRaw}?text=Hello%20SKS%20Engineering%2C%20inquiry%3A%20${whatsAppQuery}" target="_blank" rel="noopener noreferrer" class="sks-action-btn whatsapp">
                            💬 Chat on WhatsApp (+91-8668742659)
                        </a>
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
<p>I am your <strong>Gemini AI Engineering Assistant</strong>. Ask me anything about our <strong>customized electrical enclosures</strong>, <strong>CNC laser cutting &amp; bending tolerances</strong>, <strong>CAD drawings review</strong>, or plant visit!</p>`;

        appendMessage('bot', greetingHtml, "Welcome to SKS Engineering Solutions Pune");
    }

    // ==========================================================================
    // 5. User Interaction & Event Handlers
    // ==========================================================================
    function bindEvents() {
        const widget = document.getElementById('sksChatWidget');
        const teaser = document.getElementById('sksChatTeaser');
        const dockBtn = document.getElementById('sksChatbotDockBtn');
        const closeBtn = document.getElementById('sksCloseBtn');
        const form = document.getElementById('sksChatForm');
        const input = document.getElementById('sksChatInput');
        const chipsContainer = document.getElementById('sksChipsContainer');

        function openChat() {
            if (widget) widget.classList.add('active');
            if (teaser) teaser.classList.remove('visible');
            state.isOpen = true;
            if (input) setTimeout(() => input.focus(), 250);
        }

        function closeChat() {
            if (widget) widget.classList.remove('active');
            state.isOpen = false;
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

        // Core Send Message Logic via Gemini AI
        async function sendMessage(text) {
            const query = (text || '').trim();
            if (!query || state.isThinking) return;

            appendMessage('user', query);
            if (input) input.value = '';

            state.isThinking = true;
            showTypingIndicator();

            try {
                const response = await queryGeminiAI(query);
                removeTypingIndicator();
                state.isThinking = false;

                if (response.ok) {
                    appendMessage('bot', formatMarkdown(response.text), response.text);
                } else {
                    const errorHtml = `
<p>⚠️ ${escapeHtml(response.error)}</p>
<p>You can also call us directly at <a href="tel:${SKS_INFO.phoneRaw}" style="color:#60A5FA;font-weight:600;">${SKS_INFO.phone}</a> or email <a href="mailto:${SKS_INFO.email}" style="color:#60A5FA;">${SKS_INFO.email}</a>.</p>`;
                    appendMessage('bot', errorHtml, query);
                }
            } catch (err) {
                console.error('Chat error:', err);
                removeTypingIndicator();
                state.isThinking = false;
                appendMessage('bot', `<p>⚠️ Connection interrupted. Please send your inquiry on WhatsApp (+91-8668742659).</p>`, query);
            }
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (input) sendMessage(input.value);
            });
        }

        // Quick Suggestion Chips (Prompt Gemini Directly)
        if (chipsContainer) {
            chipsContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.sks-chip-btn');
                if (!btn) return;
                const prompt = btn.getAttribute('data-prompt');
                if (prompt) {
                    sendMessage(prompt);
                }
            });
        }

        // Auto open if URL has #chat or query
        if (window.location.hash === '#chat' || window.location.search.includes('chat=open')) {
            openChat();
        }
        window.addEventListener('hashchange', () => {
            if (window.location.hash === '#chat') openChat();
        });

        // Show teaser after 4 seconds if not open
        setTimeout(() => {
            if (!state.isOpen && teaser) {
                teaser.classList.add('visible');
            }
        }, 4000);
    }

    // Auto initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbotDOM);
    } else {
        initChatbotDOM();
    }
})();
