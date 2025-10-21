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

// Resume PDF generation functionality
(function () {
    const pdfButton = document.getElementById('download-pdf');
    if (!pdfButton) return;
    
    let isGenerating = false;
    
    function showLoading() {
        isGenerating = true;
        pdfButton.disabled = true;
        const buttonText = pdfButton.querySelector('.button-text');
        const icon = pdfButton.querySelector('.pdf-icon');
        
        if (buttonText) buttonText.textContent = 'Generating...';
        if (icon) {
            icon.style.display = 'none';
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            pdfButton.insertBefore(spinner, buttonText);
        }
    }
    
    function hideLoading() {
        isGenerating = false;
        pdfButton.disabled = false;
        const buttonText = pdfButton.querySelector('.button-text');
        const icon = pdfButton.querySelector('.pdf-icon');
        const spinner = pdfButton.querySelector('.loading-spinner');
        
        if (buttonText) buttonText.textContent = 'Download PDF';
        if (icon) icon.style.display = 'block';
        if (spinner) spinner.remove();
    }
    
    function showError(message) {
        hideLoading();
        // Simple error handling - could be enhanced with toast notifications
        alert('PDF generation failed: ' + (message || 'Unknown error'));
    }
    
    function generatePDF() {
        if (isGenerating || !window.html2pdf) return;
        
        showLoading();
        
        try {
            const element = document.getElementById('resume-content');
            if (!element) {
                throw new Error('Resume content not found');
            }
            
            // Clone the element to avoid modifying the original
            const clone = element.cloneNode(true);
            
            // Add PDF-specific class for styling
            clone.classList.add('pdf-content');
            
            // Hide elements that shouldn't appear in PDF
            const elementsToHide = clone.querySelectorAll('.resume-nav, .gh-head, .gh-foot, .resume-pdf-button');
            elementsToHide.forEach(el => el.style.display = 'none');
            
            // Expand all details elements for PDF
            const detailsElements = clone.querySelectorAll('details');
            detailsElements.forEach(details => {
                details.open = true;
                // Also hide the summary arrows in PDF
                const summary = details.querySelector('summary');
                if (summary) {
                    summary.style.listStyle = 'none';
                    summary.style.position = 'relative';
                }
            });
            
            // Get the actual dimensions of the content
            const contentRect = element.getBoundingClientRect();
            const contentHeight = element.scrollHeight;
            const contentWidth = element.scrollWidth;
            
            // Configure PDF options
            const opt = {
                margin: [0.4, 0.4, 0.4, 0.4], // top, left, bottom, right in inches
                filename: 'Erin_Mikail_Staples_Resume.pdf',
                image: { type: 'jpeg', quality: 0.90 },
                html2canvas: {
                    scale: 1.2,
                    useCORS: true,
                    allowTaint: true,
                    letterRendering: true,
                    logging: false,
                    width: Math.min(contentWidth, 900),
                    height: Math.min(contentHeight, 2400), // Allow for longer content
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: contentWidth,
                    windowHeight: contentHeight
                },
                jsPDF: {
                    unit: 'in',
                    format: 'letter',
                    orientation: 'portrait',
                    compressPDF: true
                },
                pagebreak: {
                    mode: ['avoid-all', 'css'],
                    before: '.resume-section',
                    avoid: '.resume-role'
                }
            };
            
            // Generate PDF
            html2pdf()
                .set(opt)
                .from(clone)
                .save()
                .then(() => {
                    hideLoading();
                })
                .catch(error => {
                    console.error('PDF generation error:', error);
                    showError(error.message);
                });
                
        } catch (error) {
            console.error('PDF generation error:', error);
            showError(error.message);
        }
    }
    
    // Add click event listener
    pdfButton.addEventListener('click', generatePDF);
    
    // Add keyboard support
    pdfButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            generatePDF();
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
