document.addEventListener('DOMContentLoaded', (event) => {
    // Theme switching functionality
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = themeToggleBtn?.querySelector('i');
    let isThemeChanging = false; // Flag to prevent multiple animations

    // Mobile theme toggle
    const mobileThemeToggleBtn = document.getElementById('mobileThemeToggle');
    const mobileThemeIcon = mobileThemeToggleBtn?.querySelector('i');

    // Language toggle functionality
    const langToggleBtn = document.getElementById('langToggle');
    const langIndicator = langToggleBtn?.querySelector('.lang-indicator');
    const langIcon = langToggleBtn?.querySelector('i');
    let isLangChanging = false;

    // Mobile language toggle
    const mobileLangToggleBtn = document.getElementById('mobileLangToggle');
    const mobileLangIndicator = mobileLangToggleBtn?.querySelector('.lang-indicator');
    const mobileLangIcon = mobileLangToggleBtn?.querySelector('i');

    // Mobile navigation toggle
    const navToggle = document.getElementById('navToggle');
    const navContent = document.getElementById('navContent');
    const navToggleIcon = navToggle?.querySelector('i');

    // Mobile navigation functionality
    function toggleMobileNav() {
        const isOpen = navContent.classList.contains('open');
        const currentLang = localStorage.getItem('language') || 'fr';
        
        if (isOpen) {
            navContent.classList.remove('open');
            navToggle.classList.remove('active');
            document.body.classList.remove('nav-open');
            navToggleIcon.className = 'fas fa-bars';
        } else {
            navContent.classList.add('open');
            navToggle.classList.add('active');
            document.body.classList.add('nav-open');
            navToggleIcon.className = 'fas fa-times';
        }
        
        // Update the text based on current language and state
        updateNavToggleText();
    }

    // Function to update nav toggle text based on language and state
    function updateNavToggleText() {
        if (!navToggle) return;
        
        const isOpen = navContent.classList.contains('open');
        const currentLang = localStorage.getItem('language') || 'fr';
        
        // Remove existing pseudo content by using CSS classes
        navToggle.classList.remove('menu-closed', 'menu-open');
        navToggle.classList.add(isOpen ? 'menu-open' : 'menu-closed');
        navToggle.setAttribute('data-lang', currentLang);
    }

    // Close mobile nav when clicking on nav links
    function closeMobileNavOnLinkClick() {
        if (window.innerWidth <= 768) {
            navContent.classList.remove('open');
            navToggle.classList.remove('active');
            document.body.classList.remove('nav-open');
            navToggleIcon.className = 'fas fa-bars';
            // Update the nav toggle text
            updateNavToggleText();
        }
    }

    // Add event listener for mobile nav toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileNav);
    }

    // Add event listeners to nav links to close mobile nav
    const mobileNavLinks = document.querySelectorAll('nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileNavOnLinkClick);
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            navContent.classList.contains('open') && 
            !navContent.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navContent.classList.remove('open');
            navToggle.classList.remove('active');
            document.body.classList.remove('nav-open');
            navToggleIcon.className = 'fas fa-bars';
            // Update the nav toggle text
            updateNavToggleText();
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // Reset mobile nav state when switching to desktop
            navContent.classList.remove('open');
            navToggle.classList.remove('active');
            document.body.classList.remove('nav-open');
            if (navToggleIcon) {
                navToggleIcon.className = 'fas fa-bars';
            }
            // Update the nav toggle text
            updateNavToggleText();
        }
    });

    function setLanguage(langCode) {
        console.log("Setting language to:", langCode); // Debugging log

        // Set HTML lang attribute
        document.documentElement.setAttribute('lang', langCode);

        // Store in localStorage
        localStorage.setItem('language', langCode);

        // Update indicator text on both buttons
        if (langIndicator) {
            langIndicator.textContent = langCode.toUpperCase();
        }
        if (mobileLangIndicator) {
            mobileLangIndicator.textContent = langCode.toUpperCase();
        }

        // Translate page content
        translatePageContent(langCode);
        
        // Update nav toggle text if on mobile
        if (typeof updateNavToggleText === 'function') {
            updateNavToggleText();
        }

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
        if (langIcon) {
            langIcon.classList.add('rotate');
        }
        if (mobileLangIcon) {
            mobileLangIcon.classList.add('rotate');
        }

        // Set the new language with a slight delay to ensure animation plays
        setTimeout(() => {
            setLanguage(newLang);
        }, 50);

        // Listen for animation end to clean up
        const handleAnimationEnd = function () {
            // Remove the rotate class after animation completes
            if (langIcon) {
                langIcon.classList.remove('rotate');
            }
            if (mobileLangIcon) {
                mobileLangIcon.classList.remove('rotate');
            }

            // Reset the flag
            isLangChanging = false;

            // Clean up the event listeners
            if (langIcon) {
                langIcon.removeEventListener('animationend', handleAnimationEnd);
            }
            if (mobileLangIcon) {
                mobileLangIcon.removeEventListener('animationend', handleAnimationEnd);
            }
        };

        if (langIcon) {
            langIcon.addEventListener('animationend', handleAnimationEnd);
        }
        if (mobileLangIcon) {
            mobileLangIcon.addEventListener('animationend', handleAnimationEnd);
        }
    }

    // Connect both language toggle buttons
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', toggleLanguage);
    }
    if (mobileLangToggleBtn) {
        mobileLangToggleBtn.addEventListener('click', toggleLanguage);
    }

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

    // Initialize nav toggle text
    if (typeof updateNavToggleText === 'function') {
        updateNavToggleText();
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

        // Change the icon immediately on both buttons
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        if (mobileThemeIcon) {
            mobileThemeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }

        // Then add the rotate class to trigger animation
        requestAnimationFrame(() => {
            if (themeIcon) {
                themeIcon.classList.add('rotate');
            }
            if (mobileThemeIcon) {
                mobileThemeIcon.classList.add('rotate');
            }
        });

        // Set the new theme
        setTheme(newTheme);

        // Listen for animation end to clean up
        const handleAnimationEnd = function() {
            // Remove the rotate class after animation completes
            if (themeIcon) {
                themeIcon.classList.remove('rotate');
                themeIcon.removeEventListener('animationend', handleAnimationEnd);
            }
            if (mobileThemeIcon) {
                mobileThemeIcon.classList.remove('rotate');
                mobileThemeIcon.removeEventListener('animationend', handleAnimationEnd);
            }

            // Reset the flag
            isThemeChanging = false;
        };

        if (themeIcon) {
            themeIcon.addEventListener('animationend', handleAnimationEnd, { once: true });
        }
        if (mobileThemeIcon) {
            mobileThemeIcon.addEventListener('animationend', handleAnimationEnd, { once: true });
        }
    }

    // Connect both theme toggle buttons
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    if (mobileThemeToggleBtn) {
        mobileThemeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Set initial icon without animation
    if (savedTheme) {
        setTheme(savedTheme);
        const iconClass = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        if (themeIcon) {
            themeIcon.className = iconClass;
        }
        if (mobileThemeIcon) {
            mobileThemeIcon.className = iconClass;
        }
    } else if (prefersDarkScheme.matches) {
        setTheme('dark');
        if (themeIcon) {
            themeIcon.className = 'fas fa-sun';
        }
        if (mobileThemeIcon) {
            mobileThemeIcon.className = 'fas fa-sun';
        }
    } else {
        setTheme('light');
        if (themeIcon) {
            themeIcon.className = 'fas fa-moon';
        }
        if (mobileThemeIcon) {
            mobileThemeIcon.className = 'fas fa-moon';
        }
    }

    prefersDarkScheme.addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        const iconClass = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        if (themeIcon) {
            themeIcon.className = iconClass;
        }
        if (mobileThemeIcon) {
            mobileThemeIcon.className = iconClass;
        }
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

        // Default to Projects if no stored selection
        const projectsLink = document.querySelector('nav a[href="#projets"]');
        if (projectsLink) projectsLink.classList.add('active');
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

    // Fetch OpenNotification count via WebSocket
    fetchOpenNotificationCount();

    // Fetch Litematic Downloader mod download count
    fetchLitematicDownloads();

    // Fetch Choculaterie user and schematic stats
    fetchChoculaterieStats();

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
    
    // Add cleanup for WebSocket when page unloads
    window.addEventListener('beforeunload', () => {
        closeNotificationWebSocket();
    });
});

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
            'etudes': 'Études',
            'autres': 'Autres',
            'contact': 'Contact',
            'nav-menu': 'Menu',
            'nav-close': 'Fermer',

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
            'opennotification-title': 'OpenNotification',
            'opennotification-desc': 'Service gratuit de notifications instantanées permettant d\'envoyer des messages en temps réel vers des sites web, applications ou tout appareil connecté',
            'view-github': 'Voir sur GitHub',
            'litematic-title': 'Litematic Downloader Mod',
            'litematic-desc': 'Extension pour Litematica permettant de parcourir, prévisualiser et télécharger des schématiques directement depuis choculaterie.com sans quitter Minecraft. Gestionnaire de fichiers intégré avec fonctionnalité de partage rapide',
            'view-modrinth': 'Voir sur Modrinth',
            'judo-title': 'Judo Boucherville',
            'judo-desc': 'Site web complet pour un club de judo avec gestion des athlètes, événements, compétitions, inscriptions, boutique et diffusion en direct',
            'downloads': 'téléchargements',
            'users': 'utilisateurs',
            'creations': 'créations',
            'notifications': 'notifications',
            'medium': 'Moyen',
            'technologies': 'Technologies:',

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
            'show-phone': 'Afficher le téléphone'
        },
        'en': {
            // Add page title
            'page-title': 'Portfolio - Henri Saumure',

            // Navigation
            'projets': 'Projects',
            'etudes': 'Education',
            'autres': 'Others',
            'contact': 'Contact',
            'nav-menu': 'Menu',
            'nav-close': 'Close',

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
            'opennotification-title': 'OpenNotification',
            'opennotification-desc': 'Free instant notification service that lets you send real-time messages to websites, apps, or any connected device',
            'view-github': 'View on GitHub',
            'litematic-title': 'Litematic Downloader Mod',
            'litematic-desc': 'Extension for Litematica that allows browsing, previewing, and downloading schematics directly from choculaterie.com without leaving Minecraft. Includes integrated file manager with quick-share functionality',
            'view-modrinth': 'View on Modrinth',
            'judo-title': 'Judo Boucherville',
            'judo-desc': 'Complete website for a judo club with athlete management, events, competitions, registrations, shop and live streaming',
            'downloads': 'downloads',
            'users': 'users',
            'creations': 'creations',
            'notifications': 'notifications',
            'medium': 'Medium',
            'technologies': 'Technologies:',

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
            'show-phone': 'Show phone'
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

// Simplified contact information display
function initContactProtection() {
    console.log('Initializing direct contact display');

    // Email details
    const emailBtn = document.getElementById('show-email-btn');
    const emailDisplay = document.getElementById('email-display');

    // Phone details
    const phoneBtn = document.getElementById('show-phone-btn');
    const phoneDisplay = document.getElementById('phone-display');

    // Log element availability for debugging
    console.log('Elements found:', {
        emailBtn: !!emailBtn,
        emailDisplay: !!emailDisplay,
        phoneBtn: !!phoneBtn,
        phoneDisplay: !!phoneDisplay
    });

    // Function to show email directly
    function showEmail() {
        // Email components
        const emailParts = ['henri', 'saumure.com'];
        
        // Show email
        if (emailBtn && emailDisplay) {
            emailBtn.style.display = 'none';
            emailDisplay.style.display = 'inline';
            emailDisplay.innerHTML = `<a href="mailto:${emailParts[0]}@${emailParts[1]}" class="contact-info">${emailParts[0]}@${emailParts[1]}</a>`;
            console.log('Email displayed successfully');
        }
    }

    // Function to show phone directly
    function showPhone() {
        // Phone components
        const phoneParts = ['514', '234', '9707'];
        
        // Show phone
        if (phoneBtn && phoneDisplay) {
            phoneBtn.style.display = 'none';
            phoneDisplay.style.display = 'inline';
            const formattedPhone = `(${phoneParts[0]}) ${phoneParts[1]}-${phoneParts[2]}`;
            phoneDisplay.innerHTML = `<a href="tel:+1${phoneParts[0]}${phoneParts[1]}${phoneParts[2]}" class="contact-info">${formattedPhone}</a>`;
            console.log('Phone displayed successfully');
        }
    }

    // Add event listeners to show contact info directly
    if (emailBtn) {
        emailBtn.addEventListener('click', () => {
            console.log('Email button clicked'); // Debug log
            showEmail();
        });
    }

    if (phoneBtn) {
        phoneBtn.addEventListener('click', () => {
            console.log('Phone button clicked'); // Debug log
            showPhone();
        });
    }

    console.log('Direct contact display initialized'); // Debug log
}

// Global variable to store the WebSocket connection
let notificationWebSocket = null;

// Function to connect to OpenNotification WebSocket and get live notification count
async function fetchOpenNotificationCount() {
    console.log('Attempting to connect to OpenNotification WebSocket...');
    
    // Close existing connection if any
    if (notificationWebSocket && notificationWebSocket.readyState === WebSocket.OPEN) {
        notificationWebSocket.close();
    }
    
    try {
        // Create WebSocket connection to the notification count endpoint
        notificationWebSocket = new WebSocket('wss://api.opennotification.org/ws/count');
        
        // Connection opened
        notificationWebSocket.onopen = function(event) {
            console.log('WebSocket connection opened to OpenNotification - Live updates enabled');
        };
        
        // Listen for messages (live updates)
        notificationWebSocket.onmessage = function(event) {
            try {
                const data = JSON.parse(event.data);
                console.log('Received live notification count update:', data);
                
                // Extract the count from the response
                const notificationCount = data.count || data.totalNotifications || data.notifications || 0;
                
                // Format the number with commas for better readability
                const formattedCount = notificationCount.toLocaleString();
                
                // Update the notification count in the DOM
                const countElement = document.getElementById('opennotification-count');
                if (countElement) {
                    countElement.textContent = formattedCount;
                    console.log('Live updated notification count to:', formattedCount);
                }
                
                // Keep the connection open for future updates - don't close!
                
            } catch (parseError) {
                console.error('Error parsing WebSocket message:', parseError);
                // Try to use the raw data if it's a simple number
                const rawData = event.data;
                if (!isNaN(rawData)) {
                    const formattedCount = parseInt(rawData).toLocaleString();
                    const countElement = document.getElementById('opennotification-count');
                    if (countElement) {
                        countElement.textContent = formattedCount;
                        console.log('Live updated notification count to:', formattedCount);
                    }
                }
                // Keep the connection open even if parsing fails
            }
        };
        
        // Handle connection errors
        notificationWebSocket.onerror = function(error) {
            console.error('WebSocket error:', error);
            // Fallback to show a dash if WebSocket fails
            const countElement = document.getElementById('opennotification-count');
            if (countElement) {
                countElement.textContent = '-';
            }
        };
        
        // Handle connection close
        notificationWebSocket.onclose = function(event) {
            if (event.wasClean) {
                console.log('WebSocket connection closed cleanly');
            } else {
                console.log('WebSocket connection closed unexpectedly - attempting to reconnect in 5 seconds');
                // Attempt to reconnect after 5 seconds if connection closed unexpectedly
                setTimeout(() => {
                    console.log('Attempting to reconnect WebSocket...');
                    fetchOpenNotificationCount();
                }, 5000);
            }
        };
        
        // Remove the timeout that was closing the connection - we want it to stay open!
        
    } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        // Fallback to show a dash if WebSocket creation fails
        const countElement = document.getElementById('opennotification-count');
        if (countElement) {
            countElement.textContent = '-';
        }
        
        // Retry connection after 10 seconds
        setTimeout(() => {
            console.log('Retrying WebSocket connection...');
            fetchOpenNotificationCount();
        }, 10000);
    }
}

// Function to close the WebSocket connection when page unloads
function closeNotificationWebSocket() {
    if (notificationWebSocket && notificationWebSocket.readyState === WebSocket.OPEN) {
        console.log('Closing WebSocket connection');
        notificationWebSocket.close();
    }
}

// Function to fetch and display Litematic Downloader mod download count
async function fetchLitematicDownloads() {
    try {
        const response = await fetch('https://api.modrinth.com/v2/project/litematicdownloader');
        const data = await response.json();
        const downloads = data.downloads;
        
        // Format the number with commas for better readability
        const formattedDownloads = downloads.toLocaleString();
        
        // Update the download count in the DOM
        const downloadElement = document.getElementById('litematic-downloads');
        if (downloadElement) {
            downloadElement.textContent = formattedDownloads;
        }
    } catch (error) {
        console.error('Error fetching Litematic Downloader download count:', error);
        // Fallback to show a dash if API call fails
        const downloadElement = document.getElementById('litematic-downloads');
        if (downloadElement) {
            downloadElement.textContent = '-';
        }
    }
}

// Function to fetch and display Choculaterie user and schematic counts
async function fetchChoculaterieStats() {
    console.log('Attempting to fetch Choculaterie stats...');
    
    try {
        const response = await fetch('https://choculaterie.com/api/user-schematic-stats', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        const { userCount, schematicCount } = data;
        
        // Format the numbers with commas for better readability
        const formattedUserCount = userCount.toLocaleString();
        const formattedSchematicCount = schematicCount.toLocaleString();
        
        console.log('Formatted counts:', { users: formattedUserCount, schematics: formattedSchematicCount });
        
        // Update the counts in the DOM
        const userElement = document.getElementById('choculaterie-users');
        const schematicElement = document.getElementById('choculaterie-schematics');
        
        console.log('Found elements:', { userElement: !!userElement, schematicElement: !!schematicElement });
        
        if (userElement) {
            userElement.textContent = formattedUserCount;
            console.log('Updated user count to:', formattedUserCount);
        }
        if (schematicElement) {
            schematicElement.textContent = formattedSchematicCount;
            console.log('Updated schematic count to:', formattedSchematicCount);
        }
    } catch (error) {
        console.error('Error fetching Choculaterie stats:', error);
        
        // Fallback to show dashes if API call fails
        const userElement = document.getElementById('choculaterie-users');
        const schematicElement = document.getElementById('choculaterie-schematics');
        
        if (userElement) {
            userElement.textContent = '-';
        }
        if (schematicElement) {
            schematicElement.textContent = '-';
        }
    }
}
