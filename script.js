document.addEventListener('DOMContentLoaded', function() {

    // GSAP & ScrollTrigger setup
    gsap.registerPlugin(ScrollTrigger);

    // --- Custom Cursor --- 
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'cursor-outline';
    document.body.appendChild(cursorOutline);

    let cursorX = 0;
    let cursorY = 0;
    let outlineX = 0;
    let outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        
        // Update cursor dot position immediately
        cursorDot.style.left = cursorX - 2 + 'px';
        cursorDot.style.top = cursorY - 2 + 'px';
        
        // Update main cursor position
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
    });

    // Smooth trailing effect for outline
    function updateOutline() {
        const speed = 0.15;
        outlineX += (cursorX - outlineX) * speed;
        outlineY += (cursorY - outlineY) * speed;
        
        cursorOutline.style.left = outlineX - 20 + 'px';
        cursorOutline.style.top = outlineY - 20 + 'px';
        
        requestAnimationFrame(updateOutline);
    }
    updateOutline();

    // Add hover effects to interactive elements
    const links = document.querySelectorAll('a, .nav-link, .scroll-down-btn');
    const otherInteractiveElements = document.querySelectorAll('button, .btn, .project-card');
    
    // Special hover effect for links
    links.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('cursor-hover-link');
            cursor.style.transform = 'scale(0.5)';
            cursor.style.opacity = '0.7';
        });
        
        element.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('cursor-hover-link');
            cursor.style.transform = 'scale(1)';
            cursor.style.opacity = '1';
        });
    });
    
    // Regular hover effect for other interactive elements
    otherInteractiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('cursor-hover');
            cursor.style.transform = 'scale(1.2)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('cursor-hover');
            cursor.style.transform = 'scale(1)';
        });
    });

    // Add click effects
    document.addEventListener('mousedown', () => {
        cursor.classList.add('cursor-click');
        cursorOutline.style.transform = 'scale(0.9)';
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('cursor-click');
        cursorOutline.style.transform = 'scale(1)';
    });

    // --- Interactive 3D Background (Three.js) ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#three-canvas'), alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const particlesGeometry = new THREE.BufferGeometry;
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x00f7ff,
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 2;

    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    const clock = new THREE.Clock();
    const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        particlesMesh.rotation.y = elapsedTime * 0.1;
        particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00008);
        
        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });


    // --- GSAP Scroll Animations ---
    const sections = gsap.utils.toArray('section');
    sections.forEach((section, i) => {
        const title = section.querySelector('.section-title');
        if(title) {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                },
                y: 50,
                opacity: 0,
                duration: 1,
            });
        }
        
        const content = section.querySelectorAll('.about-content, .timeline-item, .project-card, .skills-category, .contact-text, .btn');
         gsap.from(content, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                },
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
            });
    });

    // --- Skills Section Animations ---
    const skillCards = document.querySelectorAll('.skill-card');
    
    // Add hover effects to skill cards
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('cursor-hover');
            cursor.style.transform = 'scale(1.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('cursor-hover');
            cursor.style.transform = 'scale(1)';
        });
    });



    // Animate skill categories with staggered entrance
    const skillCategories = document.querySelectorAll('.skills-category');
    
    skillCategories.forEach((category, index) => {
        gsap.from(category, {
            scrollTrigger: {
                trigger: category,
                start: 'top 85%',
            },
            y: 100,
            opacity: 0,
            duration: 1.2,
            delay: index * 0.2,
            ease: 'power2.out',
        });
    });

    // Animate individual skill cards
    const skillCardsForAnimation = document.querySelectorAll('.skill-card');
    
    skillCardsForAnimation.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
            },
            x: index % 2 === 0 ? -100 : 100,
            opacity: 0,
            duration: 1,
            delay: (index % 4) * 0.1,
            ease: 'power2.out',
        });
    });

    // Add particle effect to skill icons
    skillCards.forEach(card => {
        const icon = card.querySelector('.skill-icon');
        
        card.addEventListener('mouseenter', () => {
            // Create floating particles
            for (let i = 0; i < 5; i++) {
                const particle = document.createElement('div');
                particle.style.position = 'absolute';
                particle.style.width = '4px';
                particle.style.height = '4px';
                particle.style.background = 'var(--primary-color)';
                particle.style.borderRadius = '50%';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '1000';
                particle.style.boxShadow = '0 0 6px var(--primary-color)';
                
                document.body.appendChild(particle);
                
                const rect = icon.getBoundingClientRect();
                const startX = rect.left + rect.width / 2;
                const startY = rect.top + rect.height / 2;
                
                particle.style.left = startX + 'px';
                particle.style.top = startY + 'px';
                
                gsap.to(particle, {
                    x: (Math.random() - 0.5) * 100,
                    y: (Math.random() - 0.5) * 100,
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.out',
                    onComplete: () => {
                        particle.remove();
                    }
                });
            }
        });
    });
});