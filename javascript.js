document.addEventListener('DOMContentLoaded', (event) => {
    // Theme switching functionality
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    let isThemeChanging = false; // Flag to prevent multiple animations

    // Language toggle functionality
    const langToggleBtn = document.getElementById('langToggle');
    const langIndicator = langToggleBtn.querySelector('.lang-indicator');
    const langIcon = langToggleBtn.querySelector('i');
    let isLangChanging = false;

    function setLanguage(langCode) {
        console.log("Setting language to:", langCode); // Debugging log

        // Set HTML lang attribute
        document.documentElement.setAttribute('lang', langCode);

        // Store in localStorage
        localStorage.setItem('language', langCode);

        // Update indicator text on button
        langIndicator.textContent = langCode.toUpperCase();

        // Translate page content
        translatePageContent(langCode);

        console.log("Language set complete"); // Debugging log
    }

    function toggleLanguage() {
        // Prevent multiple clicks during animation
        if (isLangChanging) return;

        // Get current language with fallback to 'fr'
        const currentLang = localStorage.getItem('language') || 'fr';
        console.log("Current language:", currentLang); // Debugging log

        // Determine new language
        const newLang = currentLang === 'fr' ? 'en' : 'fr';
        console.log("Switching to:", newLang); // Debugging log

        // Set flag to indicate manual language change
        sessionStorage.setItem('isManualChange', 'true');

        // Set flag to prevent additional animations
        isLangChanging = true;

        // Add the rotate class to trigger animation
        langIcon.classList.add('rotate');

        // Set the new language with a slight delay to ensure animation plays
        setTimeout(() => {
            setLanguage(newLang);
        }, 50);

        // Listen for animation end to clean up
        const handleAnimationEnd = function () {
            // Remove the rotate class after animation completes
            langIcon.classList.remove('rotate');

            // Reset the flag
            isLangChanging = false;

            // Clean up the event listener
            langIcon.removeEventListener('animationend', handleAnimationEnd);
        };

        langIcon.addEventListener('animationend', handleAnimationEnd);
    }

    langToggleBtn.addEventListener('click', toggleLanguage);

    // Initialize language with better logging
    const savedLanguage = localStorage.getItem('language');
    const userLang = navigator.language || navigator.userLanguage;
    const prefersFrench = userLang.startsWith('fr');

    console.log('Saved language:', savedLanguage);
    console.log('Browser language:', userLang);
    console.log('Prefers French:', prefersFrench);

    if (savedLanguage) {
        console.log('Using saved language preference:', savedLanguage);
        setLanguage(savedLanguage);
    } else if (prefersFrench) {
        console.log('Using browser preference: French');
        setLanguage('fr');
    } else {
        console.log('Defaulting to English');
        setLanguage('en');
    }


    function setTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('theme', themeName);
    }

    function toggleTheme() {
        // Prevent multiple clicks during animation
        if (isThemeChanging) return;

        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        // Set flag to prevent additional animations
        isThemeChanging = true;

        // Change the icon immediately
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

        // Then add the rotate class to trigger animation
        requestAnimationFrame(() => {
            themeIcon.classList.add('rotate');
        });

        // Set the new theme
        setTheme(newTheme);

        // Listen for animation end to clean up
        themeIcon.addEventListener('animationend', function onAnimationEnd() {
            // Remove the rotate class after animation completes
            themeIcon.classList.remove('rotate');

            // Clean up the event listener
            themeIcon.removeEventListener('animationend', onAnimationEnd);

            // Reset the flag
            isThemeChanging = false;
        }, { once: true });
    }

    themeToggleBtn.addEventListener('click', toggleTheme);

    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Set initial icon without animation
    if (savedTheme) {
        setTheme(savedTheme);
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    } else if (prefersDarkScheme.matches) {
        setTheme('dark');
        themeIcon.className = 'fas fa-sun';
    } else {
        setTheme('light');
        themeIcon.className = 'fas fa-moon';
    }

    prefersDarkScheme.addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });

    // Navigation functionality
    const navLinks = document.querySelectorAll('nav a');
    let isScrolling = false;
    let userInitiatedScroll = false; // New flag to track user-initiated navigation

    // Click event for nav links with improved scroll handling
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor behavior

            // Set flags for user-initiated scroll
            isScrolling = true;
            userInitiatedScroll = true;

            // Remove active class from all links and set this one as active
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Store the user's selection
            sessionStorage.setItem('activeNavLink', this.getAttribute('href'));

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });

                // Keep the userInitiatedScroll flag true for shorter duration
                clearTimeout(window.scrollFlagTimeout);
                window.scrollFlagTimeout = setTimeout(() => {
                    isScrolling = false;

                    // Important: shorter wait time before allowing automatic detection
                    setTimeout(() => {
                        userInitiatedScroll = false;
                    }, 200);

                }, 600);
            }
        });
    });

    // Intersection Observer with improved options
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -50% 0px',
        threshold: [0.3, 0.7]
    };

    const observer = new IntersectionObserver((entries) => {
        // Only update if not currently in a user-initiated scroll
        if (!userInitiatedScroll) {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                    const sectionId = entry.target.getAttribute('id');
                    updateActiveNav(sectionId);
                }
            });
        }
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Helper function to update active navigation
    function updateActiveNav(sectionId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
                sessionStorage.setItem('activeNavLink', link.getAttribute('href'));
            }
        });
    }

    // Manual position check function - only runs when not in user-initiated scroll
    function updateActiveNavBasedOnPosition() {
        if (userInitiatedScroll) return;

        const scrollPosition = window.scrollY + 150;
        let foundActiveSection = false;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                updateActiveNav(section.getAttribute('id'));
                foundActiveSection = true;
            }
        });

        // If no section is currently in view, don't change the active nav
        return foundActiveSection;
    }

    // Debounced scroll listener with protection against changing during user scrolling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!userInitiatedScroll) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateActiveNavBasedOnPosition, 100);
        }
    });

    // Set initial active nav link
    function setInitialActiveNavLink() {
        const storedActiveLink = sessionStorage.getItem('activeNavLink');
        navLinks.forEach(link => link.classList.remove('active'));

        if (storedActiveLink) {
            const linkToActivate = document.querySelector(`nav a[href="${storedActiveLink}"]`);
            if (linkToActivate) {
                linkToActivate.classList.add('active');
                return;
            }
        }

        // Default to Programmation if no stored selection
        const programmationLink = document.querySelector('nav a[href="#programmation"]');
        if (programmationLink) programmationLink.classList.add('active');
    }

    setInitialActiveNavLink();

    // Anti-scraping protection for contact information
    const emailLink = document.getElementById('email-link');
    if (emailLink) {
        emailLink.addEventListener('click', function (e) {
            e.preventDefault();
            const email = 'henri' + '@' + 'saumure.com';
            window.location.href = 'mailto:' + email;
        });
    }

    const phoneLink = document.getElementById('phone-link');
    if (phoneLink) {
        phoneLink.addEventListener('click', function (e) {
            e.preventDefault();
            const phone = '+1' + '514' + '2349707';
            window.location.href = 'tel:' + phone;
        });
    }

    // Initialize contact protection after DOM is loaded
    initContactProtection();

    // Scroll down arrow functionality
    const scrollArrow = document.getElementById('scrollArrow');

    if (scrollArrow) {
        // Variable to track which section is currently in view
        let currentSectionIndex = 0;
        const sections = document.querySelectorAll('section');

        // Function to handle periodic bouncing
        const startBouncingAnimation = () => {
            // Start bouncing after 5 seconds
            setTimeout(() => {
                // Bounce a few times
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        scrollArrow.classList.add('bounce');

                        // Remove the class after the animation completes
                        setTimeout(() => {
                            scrollArrow.classList.remove('bounce');
                        }, 2000); // Animation duration

                    }, i * 2500); // Stagger each bounce
                }

                // Restart the whole process after a longer pause
                setTimeout(startBouncingAnimation, 15000); // 15 second pause before starting again

            }, 5000); // Initial 5 second delay
        };

        // Start the periodic bouncing
        startBouncingAnimation();

        // Click handler to scroll to next section
        scrollArrow.addEventListener('click', () => {
            // Find the next section
            let targetIndex = 0;

            // Get current scroll position
            const scrollPosition = window.scrollY + 100; // Add small offset

            // Find which section we're currently viewing
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSectionIndex = i;
                    break;
                }
            }

            // Target the next section, or loop back to the first if at the end
            targetIndex = (currentSectionIndex + 1) % sections.length;

            // Scroll to the target section
            sections[targetIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });

        // Hide arrow when user has scrolled to the last section
        window.addEventListener('scroll', () => {
            // Get current scroll position
            const scrollPosition = window.scrollY;
            const docHeight = document.body.scrollHeight;
            const windowHeight = window.innerHeight;

            // Determine if we're at or near the bottom of the page
            const isNearBottom = (scrollPosition + windowHeight) >= (docHeight - 100);

            if (isNearBottom) {
                // Hide the arrow at the bottom of the page
                scrollArrow.style.opacity = '0';
                setTimeout(() => {
                    scrollArrow.style.pointerEvents = 'none';
                }, 300);
            } else {
                // Show the arrow otherwise
                scrollArrow.style.opacity = '0.8';
                scrollArrow.style.pointerEvents = 'auto';
            }
        });
    }
});

// Project navigation function (fixed)
function scrollToProject(projectId) {
    const projectElement = document.getElementById(projectId);
    if (projectElement) {
        // Scroll to the element
        projectElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Find the project-box element
        const projectBox = projectElement.querySelector('.project-box');
        if (projectBox) {
            // First, remove any existing highlight classes to ensure clean start
            projectBox.classList.remove('highlight');

            // Force browser to recognize the removal before adding it again
            setTimeout(() => {
                // Add highlight class to trigger animation
                projectBox.classList.add('highlight');

                // Remove the highlight class after animation completes
                setTimeout(() => {
                    projectBox.classList.remove('highlight');
                }, 1500);
            }, 10);
        }
    } else {
        console.error(`Element with ID '${projectId}' not found`);
    }
}

function getRandomChar() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    return chars.charAt(Math.floor(Math.random() * chars.length));
}

// Update the scrambleElement function to return a Promise
function scrambleElement(element, newText) {
    return new Promise((resolve) => {
        // Find the text content span and icon wrapper
        const textSpan = element.querySelector('.text-content') || element;
        const iconWrapper = element.querySelector('.icon-wrapper');

        // Get just the text content
        let originalText = textSpan.textContent;
        let targetArray = newText.split('');
        let scrambledArray = originalText.split('');
        let preservedStructure = originalText.split('');

        let steps = 10;
        let currentStep = 0;

        let interval = setInterval(() => {
            for (let i = 0; i < preservedStructure.length; i++) {
                if (preservedStructure[i] === ' ' || preservedStructure[i] === '\n') {
                    scrambledArray[i] = preservedStructure[i];
                } else if (currentStep < steps) {
                    scrambledArray[i] = Math.random() > currentStep / steps
                        ? getRandomChar()
                        : targetArray[i] || preservedStructure[i];
                } else {
                    scrambledArray[i] = targetArray[i] || preservedStructure[i];
                }
            }

            // Update only the text content
            if (textSpan !== element) {
                textSpan.textContent = scrambledArray.join('');
            } else {
                // If no text-content span exists, create one
                element.innerHTML = `<span class="text-content">${scrambledArray.join('')}</span>`;
                if (iconWrapper) {
                    element.appendChild(iconWrapper);
                }
            }

            if (++currentStep >= steps) {
                clearInterval(interval);
                if (textSpan !== element) {
                    textSpan.textContent = newText;
                } else {
                    element.innerHTML = `<span class="text-content">${newText}</span>`;
                    if (iconWrapper) {
                        element.appendChild(iconWrapper);
                    }
                }
                resolve();
            }
        }, 60);
    });
}

// Update the translatePageContent function
function translatePageContent(langCode) {
    console.log(`===== TRANSLATING TO ${langCode.toUpperCase()} =====`);

    const translations = {
        'fr': {
            // Add page title
            'page-title': 'Henri Saumure – Portfolio',

            // Navigation
            'projets': 'Projets',
            'programmation': 'Langages/Compétence',
            'etudes': 'Études',
            'autres': 'Autres',
            'contact': 'Contact',

            // Header
            'welcome': 'Bienvenue ! Vous trouverez ici tout ce que j\'ai réalisé',
            'portfolio-title': 'Portfolio Henri Saumure',
            'visit-github': 'Visiter mon profil GitHub',

            // Projects section
            'project-section-title': 'Projets',
            'scale': 'Échelle:',
            'large': 'Large',
            'small': 'Petit',
            'choculaterie-title': 'Choculaterie.com',
            'choculaterie-desc': 'Site web de partage de création pour le jeux Minecraft',
            'visit-site': 'Visiter le site',
            'chatapp-title': 'Chat App',
            'chatapp-desc': 'Application de messagerie sécurisée qui utilise le stockage RAM pour ne pas laisser de traces des messages',
            'view-github': 'Voir sur GitHub',
            'technologies': 'Technologies:',

            // Programming section
            'programming-section-title': 'Langages/Compétence',
            'no-projects': 'Aucun Projet Hors Scholaire',

            // Education section
            'education-section-title': 'Études',
            'cegep-title': 'Cégep Édouard-Montpetit',
            'tech-info': 'Techniques de l\'informatique',

            // Others section
            'others-section-title': 'Autres',
            'languages': 'Langues',
            'french': 'Français',
            'native': 'Natif',
            'english': 'Anglais',
            'fluent': 'Courant',
            'certifications': 'Certifications',
            'programming-cert': '420 B.A Programmation',
            'interests': 'Centres d\'intérêt',
            'web-dev': 'Développement Web',
            'open-source': 'Open Source',
            'local-hosting': 'Hébergement Local',
            'home-automation': 'Domotique',
            'robotics': 'Robotique',
            'availability': 'Disponibilité',
            'available-from': 'Disponible pour des projets à partir de juin 2025',
            'open-to': 'Ouvert aux opportunités de stage et emploi',

            // Contact section
            'contact-section-title': 'Contact',
            'email': 'Email',
            'phone': 'Téléphone',
            'show-email': 'Afficher l\'email',
            'show-phone': 'Afficher le téléphone',
            'captcha-title': 'Vérification',
            'captcha-instruction': 'Pour voir les informations de contact, veuillez résoudre ce simple calcul:',
            'captcha-submit': 'Vérifier',
            'captcha-cancel': 'Annuler',
            'captcha-error': 'Réponse incorrecte, veuillez réessayer'
        },
        'en': {
            // Add page title
            'page-title': 'Portfolio - Henri Saumure',

            // Navigation
            'projets': 'Projects',
            'programmation': 'Languages/Skills',
            'etudes': 'Education',
            'autres': 'Others',
            'contact': 'Contact',

            // Header
            'welcome': 'Welcome! Here you\'ll find everything I\'ve accomplished',
            'portfolio-title': 'Henri Saumure\'s Portfolio',
            'visit-github': 'Visit my GitHub profile',

            // Projects section
            'project-section-title': 'Projects',
            'scale': 'Scale:',
            'large': 'Large',
            'small': 'Small',
            'choculaterie-title': 'Choculaterie.com',
            'choculaterie-desc': 'Minecraft creation sharing website',
            'visit-site': 'Visit website',
            'chatapp-title': 'Chat App',
            'chatapp-desc': 'Secure messaging application that uses RAM storage to leave no trace of messages',
            'view-github': 'View on GitHub',
            'technologies': 'Technologies:',

            // Programming section
            'programming-section-title': 'Languages/Skills',
            'no-projects': 'No Non-Academic Projects',

            // Education section
            'education-section-title': 'Studies',
            'cegep-title': 'Cégep Édouard-Montpetit',
            'tech-info': 'Computer Science Technology',

            // Others section
            'others-section-title': 'Others',
            'languages': 'Languages',
            'french': 'French',
            'native': 'Native',
            'english': 'English',
            'fluent': 'Fluent',
            'certifications': 'Certifications',
            'programming-cert': '420 B.A Coding',
            'interests': 'Interests',
            'web-dev': 'Web Development',
            'open-source': 'Open Source',
            'local-hosting': 'Local Hosting',
            'home-automation': 'Home Automation',
            'robotics': 'Robotics',
            'availability': 'Availability',
            'available-from': 'Available for projects from June 2025',
            'open-to': 'Open to internship and job opportunities',

            // Contact section
            'contact-section-title': 'Contact',
            'email': 'Email',
            'phone': 'Phone',
            'show-email': 'Show email',
            'show-phone': 'Show phone',
            'captcha-title': 'Verification',
            'captcha-instruction': 'To view contact information, please solve this simple math problem:',
            'captcha-submit': 'Verify',
            'captcha-cancel': 'Cancel',
            'captcha-error': 'Incorrect answer, please try again'
        }
    };

    // Check if this is a manual language change
    const isManualChange = sessionStorage.getItem('isManualChange') === 'true';

    // Reset the manual change flag
    sessionStorage.setItem('isManualChange', 'false');

    // First, update the title immediately without animation
    const titleElement = document.querySelector('title[data-translate-key]');
    if (titleElement && translations[langCode][titleElement.getAttribute('data-translate-key')]) {
        titleElement.textContent = translations[langCode][titleElement.getAttribute('data-translate-key')];
    }

    // Handle all visible elements with data-translate-key
    document.querySelectorAll('body [data-translate-key]').forEach(el => {
        const key = el.getAttribute('data-translate-key');
        if (translations[langCode][key]) {
            const icon = el.querySelector('i');

            if (!isManualChange) {
                // On first load or reload, just set the text without animation
                if (icon) {
                    icon.remove();
                    el.innerHTML = `<span class="text-content">${translations[langCode][key]}</span>`;
                    el.appendChild(icon);
                } else {
                    el.innerHTML = `<span class="text-content">${translations[langCode][key]}</span>`;
                }
            } else {
                // For manual language changes, use the matrix animation
                if (icon) {
                    icon.remove();
                    scrambleElement(el, translations[langCode][key]).then(() => {
                        el.appendChild(icon);
                    });
                } else {
                    scrambleElement(el, translations[langCode][key]);
                }
            }
        } else {
            console.warn(`Translation key not found: ${key}`);
        }
    });

    // Handle title attributes (no animation needed)
    document.querySelectorAll('[data-translate-key-title]').forEach(el => {
        const key = el.getAttribute('data-translate-key-title');
        if (translations[langCode][key]) {
            el.title = translations[langCode][key];
        }
    });
}

// Anti-scraping protection for contact information
function initContactProtection() {
    console.log('Initializing contact protection');

    // Get the current language using the SAME logic as your main app
    const savedLanguage = localStorage.getItem('language');
    const userLang = navigator.language || navigator.userLanguage;
    const prefersFrench = userLang.startsWith('fr');

    // Determine language in the same way as the main site
    let currentLang;
    if (savedLanguage) {
        console.log('CAPTCHA using saved language preference:', savedLanguage);
        currentLang = savedLanguage;
    } else if (prefersFrench) {
        console.log('CAPTCHA using browser preference: French');
        currentLang = 'fr';
    } else {
        console.log('CAPTCHA defaulting to English');
        currentLang = 'en';
    }

    // Get translation keys based on current language
    const translations = {
        'fr': {
            'captcha-title': 'Vérification',
            'captcha-instruction': 'Pour voir les informations de contact, veuillez résoudre ce simple calcul:',
            'captcha-submit': 'Vérifier',
            'captcha-cancel': 'Annuler',
            'captcha-error': 'Réponse incorrecte, veuillez réessayer'
        },
        'en': {
            'captcha-title': 'Verification',
            'captcha-instruction': 'To view contact information, please solve this simple math problem:',
            'captcha-submit': 'Verify',
            'captcha-cancel': 'Cancel',
            'captcha-error': 'Incorrect answer, please try again'
        }
    };

    const t = translations[currentLang] || translations['en'];

    // Create and inject the CAPTCHA modal into the DOM if it doesn't exist
    if (!document.getElementById('captcha-modal')) {
        const modalHTML = `
            <div id="captcha-modal" class="captcha-modal">
                <div class="captcha-container">
                    <h3 data-translate-key="captcha-title">${t['captcha-title']}</h3>
                    <p data-translate-key="captcha-instruction">${t['captcha-instruction']}</p>
                    <div id="captcha-challenge" class="captcha-challenge"></div>
                    <input type="number" id="captcha-answer" class="captcha-input" placeholder="?" min="0" max="100">
                    <div class="captcha-buttons">
                        <button id="captcha-submit" class="captcha-submit" data-translate-key="captcha-submit">${t['captcha-submit']}</button>
                        <button id="captcha-cancel" class="captcha-cancel" data-translate-key="captcha-cancel">${t['captcha-cancel']}</button>
                    </div>
                    <p id="captcha-error" style="color: var(--accent-color); display: none;" data-translate-key="captcha-error">${t['captcha-error']}</p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        console.log('CAPTCHA modal created with language:', currentLang); // Debug log
    } else {
        console.log('CAPTCHA modal already exists'); // Debug log
    }

    // Get all the elements
    const captchaModal = document.getElementById('captcha-modal');
    const captchaChallenge = document.getElementById('captcha-challenge');
    const captchaAnswer = document.getElementById('captcha-answer');
    const captchaSubmit = document.getElementById('captcha-submit');
    const captchaCancel = document.getElementById('captcha-cancel');
    const captchaError = document.getElementById('captcha-error');

    // Email details
    const emailBtn = document.getElementById('show-email-btn');
    const emailDisplay = document.getElementById('email-display');

    // Phone details
    const phoneBtn = document.getElementById('show-phone-btn');
    const phoneDisplay = document.getElementById('phone-display');

    // Log element availability for debugging
    console.log('Elements found:', {
        captchaModal: !!captchaModal,
        emailBtn: !!emailBtn,
        emailDisplay: !!emailDisplay,
        phoneBtn: !!phoneBtn,
        phoneDisplay: !!phoneDisplay
    });

    // Variables for CAPTCHA
    let currentCaptchaAnswer = 0;
    let contactType = '';

    // Generate a random math problem
    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        currentCaptchaAnswer = num1 + num2;
        captchaChallenge.textContent = `${num1} + ${num2} = ?`;
        captchaAnswer.value = '';
        captchaError.style.display = 'none';
    }

    // Show CAPTCHA modal
    function showCaptcha(type) {
        contactType = type;
        generateCaptcha();
        captchaModal.style.display = 'flex';
        captchaAnswer.focus();
    }

    // Hide CAPTCHA modal
    function hideCaptcha() {
        captchaModal.style.display = 'none';
    }

    // Verify CAPTCHA answer and show contact info if correct
    function verifyCaptcha() {
        const userAnswer = parseInt(captchaAnswer.value, 10);

        if (userAnswer === currentCaptchaAnswer) {
            hideCaptcha();

            if (contactType === 'email') {
                // Email components
                const emailParts = ['henri', 'saumure.com'];
                const emailBtn = document.getElementById('show-email-btn');
                const emailDisplay = document.getElementById('email-display');

                // Show email
                if (emailBtn && emailDisplay) {
                    emailBtn.style.display = 'none';
                    emailDisplay.style.display = 'inline';
                    emailDisplay.innerHTML = `<a href="mailto:${emailParts[0]}@${emailParts[1]}" class="contact-info">${emailParts[0]}@${emailParts[1]}</a>`;
                    console.log('Email displayed successfully');
                }
            } else if (contactType === 'phone') {
                // Phone components
                const phoneParts = ['514', '234', '9707'];
                const phoneBtn = document.getElementById('show-phone-btn');
                const phoneDisplay = document.getElementById('phone-display');

                // Show phone
                if (phoneBtn && phoneDisplay) {
                    phoneBtn.style.display = 'none';
                    phoneDisplay.style.display = 'inline';
                    const formattedPhone = `(${phoneParts[0]}) ${phoneParts[1]}-${phoneParts[2]}`;
                    phoneDisplay.innerHTML = `<a href="tel:+1${phoneParts[0]}${phoneParts[1]}${phoneParts[2]}" class="contact-info">${formattedPhone}</a>`;
                    console.log('Phone displayed successfully');
                }
            }
        } else {
            captchaError.style.display = 'block';
            generateCaptcha();
        }
    }

    // Only add event listeners if elements exist
    if (emailBtn) {
        emailBtn.addEventListener('click', () => {
            console.log('Email button clicked'); // Debug log
            showCaptcha('email');
        });
    }

    if (phoneBtn) {
        phoneBtn.addEventListener('click', () => {
            console.log('Phone button clicked'); // Debug log
            showCaptcha('phone');
        });
    }

    if (captchaSubmit) {
        captchaSubmit.addEventListener('click', verifyCaptcha);
    }

    if (captchaCancel) {
        captchaCancel.addEventListener('click', hideCaptcha);
    }

    if (captchaAnswer) {
        // Allow Enter key to submit
        captchaAnswer.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') verifyCaptcha();
            if (e.key === 'Escape') hideCaptcha();
        });
    }

    if (captchaModal) {
        // Close modal if clicking outside
        captchaModal.addEventListener('click', (e) => {
            if (e.target === captchaModal) hideCaptcha();
        });
    }

    console.log('Contact protection initialized'); // Debug log
}
