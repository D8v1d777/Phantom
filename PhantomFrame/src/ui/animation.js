/**
    * PhantomFrame Animations
        * CSS transitions and visual effects
            */

class Animations {
    /**
     * Fade in element
     * @param {HTMLElement} el 
     * @param {number} duration ms
     */
    static fadeIn(el, duration = 300) {
        el.style.opacity = '0';
        el.style.display = '';
        el.style.transition = `opacity ${duration}ms ease`;
        requestAnimationFrame(() => {
            el.style.opacity = '1';
        });
    }

    /**
     * Fade out element
     * @param {HTMLElement} el 
     * @param {number} duration ms
     */
    static fadeOut(el, duration = 300) {
        el.style.transition = `opacity ${duration}ms ease`;
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.display = 'none';
        }, duration);
    }

    /**
     * Slide up animation
     * @param {HTMLElement} el 
     * @param {number} duration ms
     */
    static slideUp(el, duration = 400) {
        el.style.transform = 'translateY(20px)';
        el.style.opacity = '0';
        el.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        requestAnimationFrame(() => {
            el.style.transform = 'translateY(0)';
            el.style.opacity = '1';
        });
    }

    /**
     * Pulse animation for attention
     * @param {HTMLElement} el 
     */
    static pulse(el) {
        el.style.animation = 'none';
        el.offsetHeight; // Trigger reflow
        el.style.animation = 'pf-pulse 0.6s ease';
    }

    /**
     * Progress bar animation
     * @param {HTMLElement} bar 
     * @param {number} targetPercentage 
     * @param {number} duration ms
     */
    static animateProgress(bar, targetPercentage, duration = 500) {
        const start = parseFloat(bar.style.width) || 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // Ease out cubic
            const current = start + (targetPercentage - start) * ease;

            bar.style.width = `${current}%`;

            // Color shift based on capacity
            if (current > 90) {
                bar.style.background = 'linear-gradient(90deg, #ff4444, #ff8800)';
            } else if (current > 70) {
                bar.style.background = 'linear-gradient(90deg, #ffaa00, #ffdd00)';
            } else {
                bar.style.background = 'linear-gradient(90deg, #00f2ff, #00ff88)';
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Typewriter effect for extracted text
     * @param {HTMLElement} el 
     * @param {string} text 
     * @param {number} speed ms per char
     */
    static typewriter(el, text, speed = 20) {
        el.textContent = '';
        let i = 0;
        const timer = setInterval(() => {
            el.textContent += text.charAt(i);
            i++;
            if (i >= text.length) clearInterval(timer);
        }, speed);
    }

    /**
     * Matrix rain effect for background (optional)
     * @param {HTMLCanvasElement} canvas 
     */
    static matrixRain(canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(15, 12, 41, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00f2ff';
            ctx.font = `${fontSize}px monospace`;

            drops.forEach((drop, i) => {
                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(char, i * fontSize, drop * fontSize);

                if (drop * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            });
        };

        return setInterval(draw, 35);
    }
}
