/**
    * PhantomFrame UI Components
        * Reusable DOM builders and UI helpers
            */

class UIComponents {
    /**
     * Create alert element
     * @param {string} message 
     * @param {string} type - 'success' | 'error' | 'info'
     * @returns {HTMLElement}
     */
    static createAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `pf-alert pf-alert-${type}`;
        alert.textContent = message;

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        }, 5000);

        return alert;
    }

    /**
     * Create drop zone element
     * @param {string} id 
     * @param {string} icon 
     * @param {string} title 
     * @param {string} subtitle 
     * @returns {HTMLElement}
     */
    static createDropZone(id, icon = '📁', title = 'Drop file here', subtitle = 'or click to browse') {
        const zone = document.createElement('div');
        zone.className = 'pf-drop-zone';
        zone.id = id;
        zone.innerHTML = `
            <div class="pf-drop-icon">${icon}</div>
            <div class="pf-drop-title">${title}</div>
            <div class="pf-drop-subtitle">${subtitle}</div>
        `;
        return zone;
    }

    /**
     * Create preview box
     * @param {string} title 
     * @param {string} imgId 
     * @returns {HTMLElement}
     */
    static createPreviewBox(title, imgId) {
        const box = document.createElement('div');
        box.className = 'pf-preview-box';
        box.innerHTML = `
            <h4 class="pf-preview-title">${title}</h4>
            <img id="${imgId}" class="pf-preview-img" alt="${title}">
        `;
        return box;
    }

    /**
     * Create stat card
     * @param {string} value 
     * @param {string} label 
     * @param {string} id 
     * @returns {HTMLElement}
     */
    static createStatCard(value, label, id) {
        const card = document.createElement('div');
        card.className = 'pf-stat-card';
        card.innerHTML = `
            <div class="pf-stat-value" id="${id}">${value}</div>
            <div class="pf-stat-label">${label}</div>
        `;
        return card;
    }

    /**
     * Create progress bar
     * @param {number} percentage 0-100
     * @param {string} id 
     * @returns {HTMLElement}
     */
    static createProgressBar(percentage = 0, id = '') {
        const container = document.createElement('div');
        container.className = 'pf-progress-container';
        container.innerHTML = `
            <div class="pf-progress-bar" id="${id}" style="width: ${percentage}%">
                <div class="pf-progress-glow"></div>
            </div>
        `;
        return container;
    }

    /**
     * Create mode tabs
     * @param {Array} tabs - [{id, label, active}]
     * @param {Function} onSwitch 
     * @returns {HTMLElement}
     */
    static createModeTabs(tabs, onSwitch) {
        const container = document.createElement('div');
        container.className = 'pf-mode-tabs';

        tabs.forEach(tab => {
            const btn = document.createElement('button');
            btn.className = `pf-mode-tab ${tab.active ? 'active' : ''}`;
            btn.textContent = tab.label;
            btn.dataset.mode = tab.id;
            btn.onclick = () => {
                container.querySelectorAll('.pf-mode-tab').forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
                onSwitch(tab.id);
            };
            container.appendChild(btn);
        });

        return container;
    }

    /**
     * Create button with loading state
     * @param {string} text 
     * @param {string} id 
     * @param {Function} onClick 
     * @returns {HTMLElement}
     */
    static createButton(text, id, onClick, variant = 'primary') {
        const btn = document.createElement('button');
        btn.className = `pf-btn pf-btn-${variant}`;
        btn.id = id;
        btn.textContent = text;
        btn.onclick = onClick;
        return btn;
    }

    /**
     * Set button loading state
     * @param {HTMLElement} btn 
     * @param {boolean} loading 
     * @param {string} originalText 
     */
    static setButtonLoading(btn, loading, originalText) {
        if (loading) {
            btn.disabled = true;
            btn.innerHTML = `<span class="pf-spinner"></span> Processing...`;
        } else {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    }

    /**
     * Show/hide element
     * @param {HTMLElement} el 
     * @param {boolean} show 
     */
    static toggle(el, show) {
        el.classList.toggle('hidden', !show);
    }
}
