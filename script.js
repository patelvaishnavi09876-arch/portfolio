document.addEventListener('DOMContentLoaded', () => {

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for animations
    const animatedElements = document.querySelectorAll('.animate__animated');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animation = entry.target.dataset.animation;
                if(animation) {
                    entry.target.classList.add(...animation.split(' '));
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Typed.js
    const options = {
        strings: ['Cyber Security Enthusiast', 'Cybersecurity Analyst', 'Ethical Hacker'],
        typeSpeed: 50,
        backSpeed: 25,
        loop: true
    };

    const typed = new Typed('#typed-text', options);

    // Fetch GitHub Projects
    const fetchGitHubProjects = async () => {
        const username = 'patelvaishnavi09876-arch';
        const projectGrid = document.getElementById('project-grid');

        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos`);
            const repos = await response.json();

            repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            repos.forEach(repo => {
                const projectCard = document.createElement('div');
                projectCard.classList.add('project-card', 'animate__animated');
                projectCard.dataset.animation = 'animate__fadeInUp';

                const projectInfo = document.createElement('div');
                projectInfo.classList.add('project-info');
                projectInfo.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available.'}</p>
                    <a href="${repo.html_url}" class="btn" target="_blank" rel="noopener noreferrer">View on GitHub</a>
                `;

                const img = document.createElement('img');
                img.alt = `${repo.name} preview`;
                
                // Smart Image Loading
                img.src = `projects/${repo.name}/preview.png`;
                img.onerror = function() {
                    if (this.src.endsWith('.png')) {
                        this.src = `projects/${repo.name}/preview.jpg`;
                    } else {
                        this.src = 'https://media.istockphoto.com/id/1310463937/photo/cyber-security-data-protection-business-technology-privacy-concept.jpg?s=612x612&w=0&k=20&c=Ar8i_7rQ_5Wgw_D2qgL79Eil7OF9g4Opj8FkQ8_s9co=';
                    }
                };

                projectCard.appendChild(img);
                projectCard.appendChild(projectInfo);
                projectGrid.appendChild(projectCard);
                observer.observe(projectCard);
            });
        } catch (error) {
            console.error('Error fetching GitHub projects:', error);
            projectGrid.innerHTML = '<p>Could not fetch projects. Please try again later.</p>';
        }
    };

    fetchGitHubProjects();

    // --- WIRELESS DATA STREAM ANIMATION --- //
    const canvas = document.getElementById('cyber-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const particles = [];
        const numParticles = 120; 
        const colors = ['#00a8ff', '#00ffc3', '#ffffff']; 
        const mouse = { x: undefined, y: undefined };

        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.depth = Math.random() * 1 + 0.5;
                this.speed = (Math.random() * 3 + 1) * this.depth;
                this.size = (Math.random() * 2 + 0.5) * this.depth;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.speed;
                if (mouse.x && mouse.y) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 150 && this.depth > 0.8) {
                        this.y += dy * 0.02; 
                    }
                }
                if (this.x > width) {
                    this.x = -10;
                    this.y = Math.random() * height;
                    this.depth = Math.random() * 1 + 0.5;
                    this.speed = (Math.random() * 3 + 1) * this.depth;
                    this.size = (Math.random() * 2 + 0.5) * this.depth;
                }
            }

            draw() {
                ctx.beginPath();
                const length = this.size * 4 * this.speed; 
                const gradient = ctx.createLinearGradient(this.x, this.y, this.x - length, this.y);
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(this.x - length, this.y, length, this.size);
                ctx.beginPath();
                ctx.arc(this.x, this.y + this.size/2, this.size, 0, Math.PI*2);
                ctx.fillStyle = this.color;
                if(this.depth > 1.0) ctx.shadowBlur = 10;
                else ctx.shadowBlur = 0;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        function init() {
            particles.length = 0;
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }

        init();
        animate();

        window.addEventListener('resize', () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            init();
        });
    }
});
