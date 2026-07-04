document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // THEME CONTROLLER (Dark / Light Mode)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    const applyTheme = (theme) => {
        body.classList.toggle('light-theme', theme === 'light');
        body.classList.toggle('dark-theme', theme === 'dark');
        localStorage.setItem('theme', theme);
    };

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    applyTheme(initialTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const nextTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
            applyTheme(nextTheme);
        });
    }

    // ==========================================================================
    // STICKY HEADER & ACTIVE NAV LINKS ON SCROLL
    // ==========================================================================
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // MOBILE NAVIGATION DRAWER
    // ==========================================================================
    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const mobileToggleIcon = mobileToggleBtn.querySelector('i');

    mobileToggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        if (navMenu.classList.contains('active')) {
            mobileToggleIcon.classList.remove('fa-bars');
            mobileToggleIcon.classList.add('fa-xmark');
        } else {
            mobileToggleIcon.classList.remove('fa-xmark');
            mobileToggleIcon.classList.add('fa-bars');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggleIcon.classList.remove('fa-xmark');
            mobileToggleIcon.classList.add('fa-bars');
        });
    });

    // ==========================================================================
    // TYPING ANIMATION (Hero Section)
    // ==========================================================================
    const typingTextSpan = document.getElementById('typing-text');
    const rolesList = ['AI & ML Graduate', 'Full Stack Developer', 'Frontend Developer', 'Python Programmer'];
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const newWordDelay = 2000;
    let roleIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < rolesList[roleIndex].length) {
            typingTextSpan.textContent += rolesList[roleIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newWordDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typingTextSpan.textContent = rolesList[roleIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            roleIndex = (roleIndex + 1) % rolesList.length;
            setTimeout(type, typingSpeed + 50);
        }
    }

    if (rolesList.length) setTimeout(type, newWordDelay);

    // ==========================================================================
    // SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const skillProgressFills = document.querySelectorAll('.progress-fill');
    const skillSection = document.getElementById('skills');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillProgressFills.forEach(fill => {
                    const targetWidth = fill.style.width;
                    fill.style.width = '0';
                    setTimeout(() => {
                        fill.style.width = targetWidth;
                    }, 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    if (skillSection) skillObserver.observe(skillSection);

    // ==========================================================================
    // PROJECT FILTERING
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');

            const filterValue = e.currentTarget.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue || (filterValue === 'aiml' && category === 'aiml')) {
                        card.classList.remove('hide');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.classList.add('hide');
                    }
                }, 200);
            });
        });
    });

    // ==========================================================================
    // PROJECT MODALS DATA & BEHAVIOR
    // ==========================================================================
    const projectsData = {
        parcel: {
            title: 'Automated Parcel Damage Detection',
            category: 'AI / ML & Full Stack',
            tech: 'Python • TensorFlow • ResNet • Django • OpenCV',
            desc: 'A computer-vision powered sorting damage classifier using convolution, residual blocks and Django integrations designed to automate quality assessment in shipment loops.',
            features: [
                'Developed CNN and ResNet models for image classification (identifying damaged and intact packages).',
                'Implemented image preprocessing, crop filtering, and feature extraction via OpenCV library.',
                'Integrated the trained computer vision model with a Django web application for real-time file upload and prediction alerts.',
                'Applied advanced convolution layers, pooling, residual learning, and softmax classifiers for accurate model weights.',
                'Generated prediction reports returning statistical confidence scores to optimize parcel flow.'
            ],
            graphicClass: 'p-grad-1',
            iconClass: 'fa-box-open',
            codeLink: 'https://github.com/Lokitha10'
        },
        sentiment: {
            title: 'Sentiment Analysis of Restaurant Reviews',
            category: 'AI / ML',
            tech: 'Python • NLTK • Bag of Words • Multinomial Naive Bayes',
            desc: 'A natural language processing system that parses review text, processes raw sentences, and classifies whether customer feedback is positive or negative.',
            features: [
                'Built an NLP classification engine designed to clean and tokenize customer food feedback.',
                'Executed raw text preprocessing (stemming, lowercasing, stop-words exclusion) using the NLTK library.',
                'Constructed feature mapping using Bag of Words and fit models on Multinomial Naive Bayes algorithms.',
                'Evaluated precision metrics and logged insights outlining clear customer sentiment trends.'
            ],
            graphicClass: 'p-grad-2',
            iconClass: 'fa-comments',
            codeLink: 'https://github.com/Lokitha10'
        },
        shopez: {
            title: 'Shopez E-commerce Portal',
            category: 'Full Stack',
            tech: 'React.js • Node.js • Express • MongoDB',
            desc: 'A full-featured digital storefront developed during a Full Stack MERN Internship. Implemented core interface routes, backend service logic, and database schemas.',
            features: [
                'Worked on client-facing and server-side components using MERN stack technologies.',
                'Built custom API routes, database collections, and integrated core shopping carts schema operations.',
                'Assisted team leads in debugging features, refactoring component layouts, and optimizing system workflows.'
            ],
            graphicClass: 'p-grad-3',
            iconClass: 'fa-cart-flatbed-suitcases',
            codeLink: 'https://github.com/Lokitha10'
        },
        plagiarism: {
            title: 'Text Plagiarism Detection',
            category: 'AI / ML',
            tech: 'Python • TF-IDF • Cosine Similarity',
            desc: 'An AI-powered comparison utility engineered to cross-check file matches, index plagiarism percentages, and generate similarity scores.',
            features: [
                'Engineered text-matching logic by translating problem requirements and drafting parsing code.',
                'Calculated term frequencies (TF-IDF vectorizer) and calculated Cosine Similarity models to score overlap.',
                'Assisted in checking, debugging, validation, and performance tweaking of math modules.',
                'Created detailed flow charts and plain explanations of code workflows for clients.'
            ],
            graphicClass: 'p-grad-4',
            iconClass: 'fa-file-shield',
            codeLink: 'https://github.com/Lokitha10'
        }
    };

    const modal = document.getElementById('project-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close');
    const projectCardsList = document.querySelectorAll('.project-card');

    const modalTitle = document.getElementById('modal-project-title');
    const modalCategory = document.getElementById('modal-project-category');
    const modalTech = document.getElementById('modal-project-tech');
    const modalDescFull = document.getElementById('modal-project-desc-full');
    const modalFeaturesList = document.getElementById('modal-project-features');
    const modalGraphic = document.getElementById('modal-project-graphic');
    const modalLinkCode = document.getElementById('modal-link-code');

    function openModal(projectId) {
        const data = projectsData[projectId];
        if (!data) return;

        modalTitle.textContent = data.title;
        modalCategory.textContent = data.category;
        modalTech.textContent = data.tech;
        modalDescFull.textContent = data.desc;
        // Only provide the source link in the modal (opens repository or fallback to live link)
        modalLinkCode.href = data.codeLink || data.liveLink || '#';

        modalFeaturesList.innerHTML = '';
        data.features.forEach(feat => {
            const li = document.createElement('li');
            li.textContent = feat;
            modalFeaturesList.appendChild(li);
        });

        modalGraphic.className = `modal-graphic ${data.graphicClass}`;
        modalGraphic.innerHTML = `<i class="fa-solid ${data.iconClass}"></i>`;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    projectCardsList.forEach(card => {
        const btn = card.querySelector('.open-modal-btn');
        const projectId = card.getAttribute('data-project-id');
        if (btn && projectId) {
            btn.addEventListener('click', () => openModal(projectId));
        }
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ==========================================================================
    // CONTACT FORM CLIENT-SIDE VALIDATION
    // ==========================================================================
    const form = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');
    const errorMsg = document.getElementById('form-error');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }

    function validateField(inputEl) {
        const val = inputEl.value.trim();
        const parent = inputEl.parentElement;

        if (!val) {
            parent.classList.add('invalid');
            return false;
        }

        if (inputEl.type === 'email' && !validateEmail(val)) {
            parent.classList.add('invalid');
            return false;
        }

        parent.classList.remove('invalid');
        return true;
    }

    const formFields = form.querySelectorAll('input, textarea');
    formFields.forEach(field => {
        field.addEventListener('input', () => {
            if (field.parentElement.classList.contains('invalid')) {
                validateField(field);
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        formFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        successMsg.style.display = 'none';
        errorMsg.style.display = 'none';

        if (isValid) {
            const submitBtn = form.querySelector('.btn-submit');
            const originalBtnContent = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                
                successMsg.style.display = 'flex';
                form.reset();
                
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 5000);
            }, 1500);

        } else {
            errorMsg.style.display = 'flex';
            setTimeout(() => {
                errorMsg.style.display = 'none';
            }, 5000);
        }
    });

});
