/* ============================================
   ACCURATE RADAR - Interactive JavaScript
   Mobile-Optimized
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initRadarBlips();
    initLiveFeed();
    initCounters();
    initHelixAnimation();
    initScrollAnimations();
    initSmoothScroll();
    initFormHandler();
    initMonthsAnimation();
});

/* ============================================
   Mobile Menu
   ============================================ */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuLinks = mobileMenu?.querySelectorAll('a');

    if (! menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    menuLinks?.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ============================================
   Radar Blips Animation
   ============================================ */
function initRadarBlips() {
    const container = document.getElementById('radarBlips');
    if (!container) return;

    const blips = [
        { x: 25, y: 30, delay: 0 },
        { x: 70, y: 45, delay: 0.5 },
        { x: 40, y: 70, delay: 1 },
        { x: 60, y: 25, delay: 1.5 },
        { x: 35, y: 55, delay: 2 },
    ];

    blips.forEach(blip => {
        const el = document.createElement('div');
        el.className = 'radar-blip';
        el.style.left = blip.x + '%';
        el.style.top = blip.y + '%';
        el.style.animationDelay = blip.delay + 's';
        container.appendChild(el);
    });

    // Add new blips periodically
    setInterval(() => {
        if (container.children.length > 8) {
            container.removeChild(container.firstChild);
        }

        const newBlip = document.createElement('div');
        newBlip.className = 'radar-blip';
        newBlip.style.left = (20 + Math.random() * 60) + '%';
        newBlip.style.top = (20 + Math.random() * 60) + '%';
        container.appendChild(newBlip);
    }, 3000);
}

/* ============================================
   Live Feed
   ============================================ */
function initLiveFeed() {
    const feedItems = document.getElementById('feedItems');
    const feedTime = document.getElementById('feedTime');

    if (!feedItems) return;

    const companies = [
        { name: 'TechCorp', signal: 'Hiring ML engineers', level: 'high', icon: '🔴' },
        { name: 'FinanceHub', signal: 'New blockchain patent filed', level: 'high', icon: '🔴' },
        { name: 'DataFlow', signal: 'CTO change detected', level: 'medium', icon: '🟠' },
        { name: 'CloudBase', signal: 'AWS partnership announced', level: 'low', icon: '🟢' },
        { name: 'AIStartup', signal: 'Product team rebranding', level: 'medium', icon: '🟠' },
        { name: 'SaaSGiant', signal: 'Mobile dev job postings', level: 'high', icon: '🔴' },
        { name: 'RetailX', signal: 'Stripe integration detected', level: 'low', icon: '🟢' },
        { name: 'MediaCorp', signal: 'Series B round closed', level: 'medium', icon: '🟠' },
        { name: 'HealthTech', signal: 'FDA filing detected', level: 'high', icon: '🔴' },
        { name: 'EduPlatform', signal: 'B2C pivot signals', level: 'high', icon: '🔴' },
    ];

    let currentIndex = 0;

    function addFeedItem() {
        const company = companies[currentIndex % companies.length];

        const item = document.createElement('div');
        item.className = 'feed-item';
        item.innerHTML = `
            <div class="feed-icon">${company.icon}</div>
            <div class="feed-content">
                <span class="feed-company">${company.name}</span>
                <span class="feed-signal">${company.signal}</span>
            </div>
            <span class="feed-badge ${company.level}">${company.level === 'high' ? 'HIGH' : company.level === 'medium' ?  'MED' : 'LOW'}</span>
        `;

        feedItems.insertBefore(item, feedItems.firstChild);

        // Remove old items
        while (feedItems.children.length > 3) {
            feedItems.removeChild(feedItems.lastChild);
        }

        currentIndex++;
    }

    // Initial items
    for (let i = 0; i < 3; i++) {
        addFeedItem();
    }

    // Add new items periodically
    setInterval(addFeedItem, 4000);

    // Update time
    if (feedTime) {
        let seconds = 0;
        setInterval(() => {
            seconds++;
            const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
            const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
            const s = (seconds % 60).toString().padStart(2, '0');
            feedTime.textContent = `${h}:${m}:${s}`;
        }, 1000);
    }
}

/* ============================================
   Counter Animation
   ============================================ */
function initCounters() {
    const counters = document.querySelectorAll('[data-target]');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = target * easeOut;

        element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = isDecimal ? target.toFixed(1) : target;
        }
    }

    requestAnimationFrame(update);
}

/* ============================================
   Months Counter Animation
   ============================================ */
function initMonthsAnimation() {
    const monthsCounter = document.getElementById('monthsCounter');
    if (!monthsCounter) return;

    const values = [6, 5, 4, 3, 4, 5, 6];
    let index = 0;

    setInterval(() => {
        index = (index + 1) % values.length;
        monthsCounter.style.transform = 'translateY(-10px)';
        monthsCounter.style.opacity = '0';

        setTimeout(() => {
            monthsCounter.textContent = values[index];
            monthsCounter.style.transform = 'translateY(10px)';

            setTimeout(() => {
                monthsCounter.style.transition = 'all 0.3s ease';
                monthsCounter.style.transform = 'translateY(0)';
                monthsCounter.style.opacity = '1';
            }, 50);
        }, 200);
    }, 3000);
}

/* ============================================
   DNA Helix Animation
   ============================================ */
function initHelixAnimation() {
    const container = document.getElementById('helixContainer');
    if (!container) return;

    const nodeCount = 10;

    for (let i = 0; i < nodeCount; i++) {
        const node = document.createElement('div');
        node.className = 'helix-node';
        node.style.top = (i * (100 / nodeCount) + 5) + '%';
        node.style.animationDelay = (i * 0.2) + 's';
        container.appendChild(node);
    }
}

/* ============================================
   Scroll Animations
   ============================================ */
function initScrollAnimations() {
    const elements = document.querySelectorAll(
        '.feature-card, .signal-card, .section-header, .price-card, .case-card, .dna-feature'
    );

    elements.forEach(el => el.classList.add('fade-in'));

    // Use IntersectionObserver for performance
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    elements.forEach(el => observer.observe(el));
}

/* ============================================
   Smooth Scroll
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   Form Handler
   ============================================ */
function initFormHandler() {
    const form = document.getElementById('ctaForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const input = form.querySelector('input');
        const button = form.querySelector('button');
        const originalText = button.innerHTML;

        // Simulate loading
        button.innerHTML = '<span>Сканируем...</span>';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = '<span>✓ Запрос отправлен! </span>';
            button.style.background = 'var(--accent-green)';

            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.background = '';
                input.value = '';
            }, 2000);
        }, 1500);
    });
}

/* ============================================
   Navbar Scroll Effect
   ============================================ */
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.style.background = 'rgba(10, 10, 18, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 18, 0.9)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
}, { passive: true });

/* ============================================
   Touch Feedback for Mobile
   ============================================ */
if ('ontouchstart' in window) {
    document.querySelectorAll('. btn-primary, .btn-secondary, .btn-outline, .feature-card, .signal-card').forEach(el => {
        el.addEventListener('touchstart', function () {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });

        el.addEventListener('touchend', function () {
            this.style.transform = '';
        }, { passive: true });
    });
}

/* ============================================
   Performance:  Pause animations when not visible
   ============================================ */
document.addEventListener('visibilitychange', () => {
    const radar = document.querySelector('.radar-sweep');
    const blips = document.querySelectorAll('.radar-blip');

    if (document.hidden) {
        if (radar) radar.style.animationPlayState = 'paused';
        blips.forEach(b => b.style.animationPlayState = 'paused');
    } else {
        if (radar) radar.style.animationPlayState = 'running';
        blips.forEach(b => b.style.animationPlayState = 'running');
    }
});

/* ============================================
   Console Easter Egg
   ============================================ */
console.log('%c📡 ACCURATE RADAR', 'font-size: 24px; font-weight: bold; color: #00ff88;');
console.log('%cДетектор скрытых пивотов конкурентов', 'font-size: 14px; color:  #9898a8;');
console.log('%c→ Мы видим то, что скрыто', 'font-size: 12px; color: #a855f7;');