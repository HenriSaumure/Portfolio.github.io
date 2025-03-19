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
        const handleAnimationEnd = function() {
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
        // We no longer change the icon here - it's handled in toggleTheme
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
        }, {once: true}); // Use {once: true} to automatically remove the listener after it fires
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
        link.addEventListener('click', function(e) {
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
                    }, 200); // Reduced from 500ms to 200ms
                    
                }, 600); // Reduced from 1000ms to 600ms
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

    // Remove old dropdown functionality that's no longer needed
    document.addEventListener('click', function(event) {
        // Empty handler, kept for compatibility in case you decide to add dropdowns again
    });
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
            'page-title': 'Mon Portfolio',
            
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
            'profile-photo': 'Photo de profil'
        },
        'en': {
            // Add page title
            'page-title': 'My Portfolio',
            
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
            'profile-photo': 'Profile photo'
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
