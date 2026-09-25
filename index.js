
document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#' || href === '') {
                return;
            }
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                        toggle: false
                    });
                    bsCollapse.hide();
                }
            }
        });
    });
    
    // Update active nav link on scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('.section, .hero-section');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        let currentSection = '';
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards for animation
    document.querySelectorAll('.project-card, .skill-category, .coding-profile-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const submitButton = document.getElementById('sendMessageBtn') || contactForm.querySelector('button[type="submit"]');
        const formStatus = document.getElementById('formStatus');
        const originalButtonHtml = submitButton.innerHTML;
        const contactEmail = 'sahilpawarsp045@gmail.com';

        function setFormStatus(message, type) {
            if (!formStatus) {
                return;
            }
            formStatus.textContent = message;
            formStatus.className = `form-status mb-3 ${type || ''}`.trim();
        }

        function openMailClient(name, email, subject, message) {
            const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
            window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = (contactForm.querySelector('[name="name"]') || {}).value.trim();
            const email = (contactForm.querySelector('[name="email"]') || {}).value.trim();
            const subject = (contactForm.querySelector('[name="subject"]') || {}).value.trim();
            const message = (contactForm.querySelector('[name="message"]') || {}).value.trim();

            if (!name || !email || !subject || !message) {
                setFormStatus('Please fill in all fields.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setFormStatus('Please enter a valid email address.', 'error');
                return;
            }

            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            setFormStatus('Sending your message...', '');

            try {
                const response = await fetch(`https://formsubmit.co/ajax/${contactEmail}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        subject,
                        message,
                        _captcha: 'false',
                        _template: 'table'
                    })
                });

                const data = await response.json().catch(function() {
                    return {};
                });

                if (!response.ok || data.success === 'false' || data.success === false) {
                    throw new Error(data.message || 'Unable to send message');
                }

                submitButton.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!';
                submitButton.style.background = 'linear-gradient(135deg, #22d3ee, #34a853)';
                setFormStatus('Message sent. I will get back to you soon.', 'success');
                contactForm.reset();
            } catch (error) {
                openMailClient(name, email, subject, message);
                submitButton.innerHTML = '<i class="fas fa-envelope me-2"></i>Open Email App';
                setFormStatus('Could not send from the website. Your email app should open with the message ready to send.', 'error');
            } finally {
                setTimeout(function() {
                    submitButton.innerHTML = originalButtonHtml;
                    submitButton.disabled = false;
                    submitButton.style.background = '';
                }, 4000);
            }
        });
    }
});
