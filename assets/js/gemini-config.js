/**
 * SKS Engineering Solutions - Google Gemini AI Engine Configuration
 * A Shinde Groups Enterprise • Pune Plant
 * 
 * Provides live generative AI intelligence for the SKS AI Engineering Assistant.
 */

'use strict';

window.SKS_GEMINI_API_KEY = (function() {
    try {
        // Priority 1: User-saved local key if provided
        const saved = (localStorage.getItem('sks_gemini_api_key') || '').trim();
        if (saved && saved.length > 15) return saved;

        // Priority 2: Configured Gemini API key
        return atob("QVEuQWI4Uk42SWdRT0lzLTFHSE40NFJKSk1rTHJvU3Fjd3VXbTZacUxNNTY5cnJzRl8xcmc=");
    } catch (e) {
        return "";
    }
})();
