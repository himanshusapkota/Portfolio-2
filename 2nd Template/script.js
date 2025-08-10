document.addEventListener('DOMContentLoaded', function() {
    
    const loader = document.getElementById('loader');
    
    setTimeout(() => {
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
                startTypewriterEffect();
            }, 500);
        } else {
            startTypewriterEffect();
        }
    }, 2500);

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    function startTypewriterEffect() {
        const titleElement = document.querySelector('.hero-title');
        const subtitleElement = document.querySelector('.hero-subtitle');
        
        if (!titleElement || !subtitleElement) {
            console.log('Typewriter elements not found');
            return;
        }

        titleElement.innerHTML = '';
        subtitleElement.innerHTML = '';

        const titleText = "Hello, I am Himanshu";
        const subtitleTexts = [
            "A DEV",
            "A Student", 
            "A Tech Enthusiast"
        ];

        let titleIndex = 0;
        let subtitleIndex = 0;
        let currentSubtitleText = 0;
        let isDeleting = false;
        let isPaused = false;

        function typeTitle() {
            if (titleIndex < titleText.length) {
                titleElement.innerHTML += titleText.charAt(titleIndex);
                titleIndex++;
                setTimeout(typeTitle, 100);
            } else {
                setTimeout(typeSubtitle, 500);
            }
        }

        function typeSubtitle() {
            const currentText = subtitleTexts[currentSubtitleText];
            
            if (!isDeleting && subtitleIndex < currentText.length) {
                subtitleElement.innerHTML += currentText.charAt(subtitleIndex);
                subtitleIndex++;
                setTimeout(typeSubtitle, 150);
            } else if (!isDeleting && subtitleIndex === currentText.length) {
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    isDeleting = true;
                    typeSubtitle();
                }, 2000);
            } else if (isDeleting && subtitleIndex > 0) {
                subtitleElement.innerHTML = currentText.substring(0, subtitleIndex - 1);
                subtitleIndex--;
                setTimeout(typeSubtitle, 100);
            } else if (isDeleting && subtitleIndex === 0) {
                isDeleting = false;
                currentSubtitleText = (currentSubtitleText + 1) % subtitleTexts.length;
                setTimeout(typeSubtitle, 500);
            }
        }

        typeTitle();
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                if (entry.target.classList.contains('skills')) {
                    animateSkillBars();
                }
                
                if (entry.target.classList.contains('about-stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    function initializeScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
        animatedElements.forEach(el => observer.observe(el));

        const sections = document.querySelectorAll('section');
        sections.forEach(section => observer.observe(section));

        document.querySelectorAll('.section-header').forEach(el => el.classList.add('fade-in'));
        document.querySelectorAll('.tech-icon').forEach((el, index) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${index * 0.1}s`;
        });
        document.querySelectorAll('.skill-item').forEach((el, index) => {
            el.classList.add('slide-in-left');
            el.style.transitionDelay = `${index * 0.1}s`;
        });
    }

    initializeScrollAnimations();

    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            }, index * 200);
        });
    }

    function animateCounters() {
        const counters = document.querySelectorAll('.stat h4');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const suffix = counter.textContent.replace(/\d/g, '');
            let current = 0;
            const increment = target / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.ceil(current) + suffix;
                }
            }, 50);
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.background = '#22c55e';
                
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
                
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            }, 2000);
        });
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#22c55e' : '#667eea'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: 10px;
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active {
            color: #667eea !important;
        }
        .nav-link.active::after {
            width: 100% !important;
        }
        .hero-title::after {
            content: '|';
            color: #667eea;
            animation: blink 1s infinite;
        }
        .hero-subtitle::after {
            content: '|';
            color: #667eea;
            animation: blink 1s infinite;
        }
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    console.log('🚀 Portfolio website loaded successfully!');
    console.log('👨‍💻 Developed by Himanshu Sapkota');
    console.log('📧 Contact: contact@himanshusapkota.me');
});
























