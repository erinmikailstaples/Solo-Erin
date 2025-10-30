function initParallax() {
    jarallax(document.querySelectorAll('.has-parallax-feed .gh-card'), {
        speed: 0.8,
    });
}

(function () {
    if (!document.body.classList.contains('has-background-about')) return;

    const about = document.querySelector('.gh-about');
    if (!about) return;

    const image = about.querySelector('.gh-about-image');

    if (!image.naturalWidth) {
        imagesLoaded(image, function () {
            about.style.setProperty('--about-height', image.clientWidth * image.naturalHeight / image.naturalWidth + 'px');
        });
    }
})();

(function () {
    initParallax();
})();

(function () {
    const toggle = document.querySelector('[data-toggle-comments]');
    if (!toggle) return;

    toggle.addEventListener('click', function () {
        document.body.classList.toggle('comments-opened');
    });
})();

(function () {
    const element = document.querySelector('.gh-article-excerpt');
    if (!element) return;

    let text = element.textContent;
    const emojiRE = /\p{EPres}|\p{ExtPict}/gu;

    const emojis = text.match(emojiRE);
    if (!emojis) return;

    emojis.forEach(function (emoji) {
        text = text.replace(emoji, `<span class="emoji">${emoji}</span>`);
    });

    element.innerHTML = text;
})();

(function () {
    pagination(true, initParallax);
})();

// Hide "All Posts" tags
(function () {
    function hideAllPostsTags() {
        const tags = document.querySelectorAll('.gh-article-tag, .gh-card-tag');
        tags.forEach(tag => {
            if (tag.textContent.trim() === 'All Posts') {
                tag.classList.add('hide-all-posts');
            }
        });
    }
    
    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideAllPostsTags);
    } else {
        hideAllPostsTags();
    }
    
    // Run after pagination (for dynamic content)
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(hideAllPostsTags, 100);
    });
})();

// Resume PDF download functionality
(function () {
    const pdfButton = document.getElementById('download-pdf');
    if (!pdfButton) return;
    
    function downloadPDF() {
        // Create a link element to download the static PDF from GitHub
        const link = document.createElement('a');
        link.href = 'https://raw.githubusercontent.com/erinmikailstaples/Solo-Erin/main/partials/%20%20assets/2025-10-30-Erin-Mikail-Staples.pdf';
        link.download = 'Erin-Mikail-Staples.pdf';
        link.target = '_blank';
        
        // Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Add click event listener
    pdfButton.addEventListener('click', downloadPDF);
    
    // Add keyboard support
    pdfButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            downloadPDF();
        }
    });
})();

// Hide/show browse button based on scroll for immersive template
(function () {
    function initScrollBasedVisibility() {
        const browseLink = document.querySelector('.imm-about__browse-link');
        if (!browseLink) return;
        
        let isVisible = false;
        
        function handleScroll() {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Show the button when user has scrolled past the initial viewport
            // or when they're near the bottom of the page
            const shouldShow = scrollY > windowHeight * 0.3 || 
                             (scrollY + windowHeight) > (documentHeight - windowHeight * 0.2);
            
            if (shouldShow && !isVisible) {
                isVisible = true;
                browseLink.classList.add('is-visible');
            } else if (!shouldShow && isVisible) {
                isVisible = false;
                browseLink.classList.remove('is-visible');
            }
        }
        
        // Throttle scroll events for better performance
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(handleScroll, 10);
        });
        
        // Initial check
        handleScroll();
    }
    
    // Initialize scroll-based visibility for immersive template
    if (document.body.classList.contains('template-immersive')) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initScrollBasedVisibility);
        } else {
            initScrollBasedVisibility();
        }
    }
})();

// Immersive index functionality
(function () {
    function initImmersiveIndex(opts) {
        const root = document.querySelector('[data-immersive]');
        if (!root) return;
        
        const slides = [...root.querySelectorAll('[data-slide]')];
        const items = [...root.querySelectorAll('[data-item]')];
        const cNow = root.querySelector('[data-counter-current]');
        const cAll = root.querySelector('[data-counter-total]');
        const total = slides.length;
        
        if (total === 0) return;
        
        let currentIndex = 0;
        let autoplayTimer = null;
        let hasUserInteracted = false;
        
        // Initialize counter display
        cAll.textContent = String(total).padStart(2, '0');
        
        function setActive(newIndex) {
            // Remove active classes from current slide and nav item
            if (slides[currentIndex]) {
                slides[currentIndex].classList.remove('is-active');
                slides[currentIndex].setAttribute('aria-hidden', 'true');
            }
            if (items[currentIndex]) {
                items[currentIndex].classList.remove('is-active');
                items[currentIndex].setAttribute('aria-selected', 'false');
                items[currentIndex].setAttribute('tabindex', '-1');
            }
            
            // Update index with wrapping
            currentIndex = ((newIndex % total) + total) % total;
            
            // Add active classes to new slide and nav item
            if (slides[currentIndex]) {
                slides[currentIndex].classList.add('is-active');
                slides[currentIndex].setAttribute('aria-hidden', 'false');
            }
            if (items[currentIndex]) {
                items[currentIndex].classList.add('is-active');
                items[currentIndex].setAttribute('aria-selected', 'true');
                items[currentIndex].setAttribute('tabindex', '0');
            }
            
            // Update counter
            cNow.textContent = String(currentIndex + 1).padStart(2, '0');
            
            // Preload next image if available
            const nextIndex = (currentIndex + 1) % total;
            if (slides[nextIndex]) {
                const nextSlide = slides[nextIndex];
                const bgImage = nextSlide.style.backgroundImage;
                if (bgImage && bgImage.includes('url')) {
                    const img = new Image();
                    const match = bgImage.match(/url\(["']?([^"']+)["']?\)/);
                    if (match) {
                        img.src = match[1];
                    }
                }
            }
        }
        
        function nextSlide() {
            setActive(currentIndex + 1);
        }
        
        function prevSlide() {
            setActive(currentIndex - 1);
        }
        
        function stopAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        }
        
        function startAutoplay() {
            if (opts.autoplay && !hasUserInteracted && opts.interval > 0) {
                autoplayTimer = setInterval(nextSlide, opts.interval);
            }
        }
        
        function markUserInteraction() {
            hasUserInteracted = true;
            stopAutoplay();
        }
        
        // Navigation item click handlers
        items.forEach((item, index) => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                markUserInteraction();
                setActive(index);
            });
        });
        
        // Global click handler for advancing slides
        root.addEventListener('click', function(e) {
            // Don't advance if clicking on a navigation item
            if (e.target.closest('.immersive__rail') || e.target.closest('.immersive__help')) {
                return;
            }
            markUserInteraction();
            nextSlide();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!root.closest('body')) return; // Only if immersive is active
            
            switch(e.key) {
                case ' ': // Space
                case 'ArrowRight':
                    e.preventDefault();
                    markUserInteraction();
                    nextSlide();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    markUserInteraction();
                    prevSlide();
                    break;
                case 'h':
                case 'H':
                    e.preventDefault();
                    root.classList.toggle('show-help');
                    break;
                case 'Escape':
                    if (root.classList.contains('show-help')) {
                        e.preventDefault();
                        root.classList.remove('show-help');
                    }
                    break;
            }
        });
        
        // Keyboard navigation for rail items
        items.forEach((item, index) => {
            item.addEventListener('keydown', function(e) {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        const prevItem = items[index - 1] || items[items.length - 1];
                        prevItem.focus();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        const nextItem = items[index + 1] || items[0];
                        nextItem.focus();
                        break;
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        markUserInteraction();
                        setActive(index);
                        break;
                }
            });
        });
        
        // Touch/pointer events for mobile
        let startX = 0;
        let startY = 0;
        let isSwipeGesture = false;
        
        root.addEventListener('pointerdown', function(e) {
            startX = e.clientX;
            startY = e.clientY;
            isSwipeGesture = false;
        });
        
        root.addEventListener('pointermove', function(e) {
            if (!startX || !startY) return;
            
            const deltaX = Math.abs(e.clientX - startX);
            const deltaY = Math.abs(e.clientY - startY);
            
            if (deltaX > 50 || deltaY > 50) {
                isSwipeGesture = true;
            }
        });
        
        root.addEventListener('pointerup', function(e) {
            if (!isSwipeGesture && startX && startY) {
                const deltaX = e.clientX - startX;
                const threshold = 50;
                
                if (Math.abs(deltaX) > threshold) {
                    markUserInteraction();
                    if (deltaX > 0) {
                        prevSlide();
                    } else {
                        nextSlide();
                    }
                }
            }
            
            startX = 0;
            startY = 0;
            isSwipeGesture = false;
        });
        
        // Initialize first slide
        setActive(0);
        
        // Start autoplay if enabled
        startAutoplay();
        
        // Stop autoplay when page loses focus
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                stopAutoplay();
            } else if (!hasUserInteracted) {
                startAutoplay();
            }
        });
    }
    
    // Initialize if we're on an immersive template
    if (document.body.classList.contains('template-immersive')) {
        function setupImmersive() {
            const immersiveEl = document.querySelector('[data-immersive]');
            if (!immersiveEl) return;
            
            // Apply rail styling based on theme settings
            const rail = immersiveEl.querySelector('.immersive__rail');
            if (rail) {
                const position = rail.dataset.railPosition || 'Bottom center';
                const size = rail.dataset.railSize || 'Medium';
                const style = rail.dataset.railStyle || 'Titles only';
                
                // Add position class
                const positionClass = position.toLowerCase().replace(' ', '-');
                rail.classList.add(`immersive__rail--${positionClass}`);
                
                // Add size class
                const sizeClass = size.toLowerCase();
                rail.classList.add(`immersive__rail--${sizeClass}`);
                
                // Apply style to items
                const items = rail.querySelectorAll('.immersive__item');
                items.forEach(item => {
                    let styleClass = 'titles';
                    switch(style) {
                        case 'Numbers only':
                            styleClass = 'numbers';
                            item.querySelector('.immersive__item-content').style.display = 'none';
                            break;
                        case 'Titles with numbers':
                            styleClass = 'titles-numbers';
                            item.setAttribute('data-number', item.dataset.number);
                            break;
                        case 'Dots only':
                            styleClass = 'dots';
                            item.querySelector('.immersive__item-content').style.display = 'none';
                            item.querySelector('.immersive__item-number').style.display = 'none';
                            break;
                        default:
                            item.querySelector('.immersive__item-number').style.display = 'none';
                    }
                    item.classList.add(`immersive__item--${styleClass}`);
                });
            }
            
            const opts = {
                autoplay: immersiveEl.dataset.immersiveAutoplay === 'true',
                interval: Number(immersiveEl.dataset.immersiveInterval) || 6000
            };
            
            initImmersiveIndex(opts);
        }
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupImmersive);
        } else {
            setupImmersive();
        }
    }
})();
