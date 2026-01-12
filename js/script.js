document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const leftWidget = document.getElementById('left-widget');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateToggleButton(savedTheme);
    }

    // Theme Toggle Logic
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleButton(newTheme);
    });

    function updateToggleButton(theme) {
        themeToggle.textContent = theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE';
    }

    // Scroll Effect for Left Widget (Optional dynamic movement)
    // The user asked for "left corner logo will scross up and down with page"
    // Since it's position: fixed in CSS, it stays on screen. 
    // Let's add a subtle parallax or bounce effect based on scroll speed to make it feel "alive".

    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Simple bounce effect on scroll
        const movement = Math.sin(scrollTop * 0.005) * 10; // Bob up and down slightly based on scroll position

        if (leftWidget) {
            leftWidget.style.transform = `translateY(calc(-50% + ${movement}px))`;
        }

        lastScrollTop = scrollTop;
    });

    // CRT Turn On Animation
    htmlElement.classList.add('crt-off');
    setTimeout(() => {
        htmlElement.classList.remove('crt-off');
        htmlElement.classList.add('crt-on');
    }, 100);






    // Glitch Text Effect (Random chars on load)
    const glitchElement = document.querySelector('.glitch');
    if (glitchElement) {
        const originalText = glitchElement.getAttribute('data-text');
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*';

        let iterations = 0;
        const interval = setInterval(() => {
            glitchElement.innerText = originalText
                .split('')
                .map((letter, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iterations >= originalText.length) {
                clearInterval(interval);
            }

            iterations += 1 / 3;
        }, 30);
    }

    // Scroll Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.fade-in-section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Certificate Gallery Logic
    const certificates = [
        // Security & Systems (Priority 1)
        { title: "Cybersecurity Foundations", file: "(GOOGLE) Foundations of Cybersecurity.pdf", category: "Security" },
        { title: "Linux & SQL", file: "(GOOGLE) Linux and SQL.pdf", category: "Systems" },
        { title: "Networks", file: "(GOOGLE) Networks and Network.pdf", category: "Systems" },
        { title: "Microsoft Security", file: "Microsoft Security Essentials.pdf", category: "Security" },
        { title: "Advanced Network", file: "(LEARN QUEST) Advanced Network.pdf", category: "Security" },
        
        // AI & GenAI (Priority 2)
        { title: "Intro to Gen AI", file: "(GOOGLE) Introduction to Generative AI.pdf", category: "AI" },
        { title: "Prompt Engineering", file: "(COLEDGE)Prompt Engineering Basics.pdf", category: "AI" },
        { title: "Intro to LLMs", file: "(GOOGLE) Introduction to Large Language Models.pdf", category: "AI" },
        { title: "Data Visualization", file: "Learning Data Visualization.pdf", category: "DS" },
        { title: "AI Principles", file: "(GOOGLE)  Applying AI Principles with Google.pdf", category: "AI" },
        { title: "Model Context Protocol", file: "(FRACTAL)Model Context Protocol (MCP) Mastery.pdf", category: "Data" },
        { title: "AI Basics", file: "Understanding of AI basics.pdf", category: "AI" },


        // Data & General (Priority 3)
        { title: "Database Specialist", file: "(VANDERVILT) Database Specialist with Prompt Enginerring.pdf", category: "Data" },
        { title: "Power BI", file: "Power BI.pdf", category: "Data" },
        { title: "Systems Thinking", file: "Systems Thinking.pdf", category: "General" }
    ];

    const certCards = document.getElementById('cert-cards');
    const certPrevBtn = document.getElementById('cert-prev');
    const certNextBtn = document.getElementById('cert-next');
    const certDotsContainer = document.getElementById('cert-dots');

    if (certCards) {
        let currentIndex = 0;
        let cardsPerView = 3; // Visible cards
        const totalItems = certificates.length;
        // We want to stop when the last card is fully visible on the right
        // Max index = totalItems - cardsPerView
        let maxIndex = 0;

        // Create certificate cards
        certificates.forEach((cert, index) => {
            const card = document.createElement('div');
            card.className = 'cert-card';

            const pdfUrl = encodeURI(`assets/images/documents/${cert.file}`);

            card.innerHTML = `
                <div class="cert-preview">
                    <canvas id="cert-canvas-${index}" class="cert-canvas"></canvas>
                    <div class="cert-loading"><i class="fas fa-spinner fa-spin"></i></div>
                </div>
                <h3>${cert.title}</h3>
                <button class="cert-pill" type="button" aria-label="Open ${cert.title} certificate">${cert.category}</button>
            `;

            // Card click opens the associated PDF
            card.addEventListener('click', () => {
                window.open(pdfUrl, '_blank');
            });

            certCards.appendChild(card);

            const pillButton = card.querySelector('.cert-pill');
            pillButton.addEventListener('click', (event) => {
                event.stopPropagation();
                window.open(pdfUrl, '_blank');
            });

            // Render PDF Preview
            const canvas = document.getElementById(`cert-canvas-${index}`);
            const ctx = canvas.getContext('2d');
            const loadingSpinner = card.querySelector('.cert-loading');
            const previewDiv = card.querySelector('.cert-preview');

            pdfjsLib.getDocument(pdfUrl).promise
                .then(pdf => pdf.getPage(1))
                .then(page => {
                    const baseViewport = page.getViewport({ scale: 1 });
                    const previewWidth = previewDiv.clientWidth || baseViewport.width;
                    const scale = Math.min(1.5, previewWidth / baseViewport.width);
                    const viewport = page.getViewport({ scale });

                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    const renderContext = {
                        canvasContext: ctx,
                        viewport
                    };
                    return page.render(renderContext).promise;
                })
                .then(() => {
                    canvas.style.width = '100%';
                    canvas.style.height = '100%';
                    loadingSpinner.style.display = 'none';
                })
                .catch(err => {
                    console.warn('PDF Preview Error:', err);
                    loadingSpinner.style.display = 'none';
                    const img = new Image();
                    img.src = 'assets/images/certificate_placeholder.png';
                    previewDiv.innerHTML = '';
                    previewDiv.appendChild(img);
                });
        });

        let cardWidth = 0;
        let gapSize = 0;

        function updateDimensions() {
            const wrapper = document.querySelector('.cert-scroll-wrapper');
            const card = certCards.firstElementChild;
            if (!wrapper || !card) return;

            const cardsStyle = window.getComputedStyle(certCards);
            gapSize = parseFloat(cardsStyle.columnGap || cardsStyle.gap || '0');
            const rect = card.getBoundingClientRect();
            cardWidth = rect.width;

            const available = wrapper.clientWidth + gapSize;
            cardsPerView = Math.max(1, Math.floor(available / (cardWidth + gapSize)));

            maxIndex = Math.max(0, totalItems - cardsPerView);
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }

            renderDots();
            updateGallery();
        }

        function renderDots() {
            const totalPages = Math.ceil(totalItems / cardsPerView);
            certDotsContainer.innerHTML = '';
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('div');
                dot.className = 'cert-dot';
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = Math.min(i * cardsPerView, maxIndex);
                    updateGallery();
                });
                certDotsContainer.appendChild(dot);
            }
        }

        function updateGallery() {
            const card = certCards.firstElementChild;
            if (!card) return;

            currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

            const offset = currentIndex * (cardWidth + gapSize);
            certCards.style.transform = `translateX(-${offset}px)`;

            const activePage = Math.floor(currentIndex / cardsPerView);
            document.querySelectorAll('.cert-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === activePage);
            });

            certPrevBtn.disabled = currentIndex === 0;
            certNextBtn.disabled = currentIndex >= maxIndex;
        }

        certPrevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateGallery();
            }
        });

        certNextBtn.addEventListener('click', () => {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateGallery();
            }
        });

        // Initial update
        // Wait for layout to stabilize for width calculation
        setTimeout(updateDimensions, 100);
        window.addEventListener('resize', updateDimensions);
    }
});
