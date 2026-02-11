$(document).ready(function () {

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }

        // scroll spy
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
    });

    // <!-- emailjs to mail contact form data -->
    $("#contact-form").submit(function (event) {
        emailjs.init("user_TTDmetQLYgWCLzHTDgqxm");

        emailjs.sendForm('contact_service', 'template_contact', '#contact-form')
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                document.getElementById("contact-form").reset();
                alert("Form Submitted Successfully");
            }, function (error) {
                console.log('FAILED...', error);
                alert("Form Submission Failed! Try Again");
            });
        event.preventDefault();
    });
    // <!-- emailjs to mail contact form data -->

});

document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Portfolio | Kidus Befekadu";
            $("#favicon").attr("href", "assets/images/favicon.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "assets/images/favhand.png");
        }
    });


// <!-- typed js effect starts -->
var typed = new Typed(".typing-text", {
    strings: ["backend development", "microservices architecture", "cloud engineering", "full-stack development", "AI/ML integration", "DevOps automation"],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
});
// <!-- typed js effect ends -->

async function fetchData(type = "skills") {
    let response
    type === "skills" ?
        response = await fetch("skills.json")
        :
        response = await fetch("./projects/projects.json")
    const data = await response.json();
    return data;
}

function showSkills(skillsData) {
    let skillsContainer = document.getElementById("skillsContainer");
    const fallbackSkillIcon = "https://img.icons8.com/fluency/48/000000/code.png";
    
    if (!skillsContainer) {
        console.error("Skills container not found!");
        return;
    }
    
    if (!skillsData || typeof skillsData !== 'object') {
        console.error("Invalid skills data:", skillsData);
        skillsContainer.innerHTML = '<p style="color: white; text-align: center; font-size: 1.8rem;">No skills data available.</p>';
        return;
    }
    
    let skillHTML = "";
    
    // Icon mapping for each category
    const categoryIcons = {
        "Programming Languages": "fas fa-code",
        "Frontend Development": "fas fa-palette",
        "Backend Development": "fas fa-server",
        "Databases": "fas fa-database",
        "Cloud & DevOps": "fas fa-cloud",
        "AI & Machine Learning": "fas fa-brain",
        "Version Control": "fas fa-code-branch"
    };
    
    try {
        // Iterate through each category
        Object.keys(skillsData).forEach(category => {
            const icon = categoryIcons[category] || "fas fa-code";
            skillHTML += `
            <div class="skills-category">
                <h3 class="category-title">
                    <i class="${icon}"></i> ${category}
                </h3>
                <div class="category-skills">`;
            
            // Add skills for this category
            if (Array.isArray(skillsData[category])) {
                skillsData[category].forEach(skill => {
                    const iconUrl = (skill && typeof skill.icon === "string" && skill.icon.trim().length > 0)
                        ? skill.icon
                        : fallbackSkillIcon;
                    const skillName = (skill && typeof skill.name === "string" && skill.name.trim().length > 0)
                        ? skill.name
                        : "Skill";
                    skillHTML += `
                        <div class="bar">
                            <div class="info">
                                <img src="${iconUrl}" alt="${skillName}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${fallbackSkillIcon}';" />
                                <span>${skillName}</span>
                            </div>
                        </div>`;
                });
            }
            
            skillHTML += `
                </div>
            </div>`;
        });
        
        skillsContainer.innerHTML = skillHTML;
        console.log("Skills displayed successfully!");
    } catch (error) {
        console.error("Error displaying skills:", error);
        skillsContainer.innerHTML = '<p style="color: white; text-align: center; font-size: 1.8rem;">Error displaying skills.</p>';
    }
}

// Modal and Carousel functionality
let currentSlide = 0;
let currentProject = null;

function openModal(project) {
    currentProject = project;
    currentSlide = 0;
    
    const modal = document.getElementById('projectModal');
    const modalName = document.getElementById('modalProjectName');
    const modalDesc = document.getElementById('modalProjectDesc');
    const modalViewLink = document.getElementById('modalViewLink');
    const carouselImages = document.getElementById('modalCarouselImages');
    const carouselIndicators = document.getElementById('carouselIndicators');
    
    // Set project details
    modalName.textContent = project.name;
    modalDesc.textContent = project.desc;
    modalViewLink.href = project.links.view;
    
    // Build carousel images
    let imagesHTML = '';
    project.images.forEach(image => {
        imagesHTML += `<img src="/assets/images/projects/${image}" alt="${project.name}" onerror="this.src='https://via.placeholder.com/600x400/6c5ce7/ffffff?text=Project+Image'" />`;
    });
    carouselImages.innerHTML = imagesHTML;
    
    // Build carousel indicators
    let indicatorsHTML = '';
    project.images.forEach((_, index) => {
        indicatorsHTML += `<span class="indicator ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></span>`;
    });
    carouselIndicators.innerHTML = indicatorsHTML;
    
    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Update carousel
    updateCarousel();
}

function closeModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function updateCarousel() {
    const carouselImages = document.getElementById('modalCarouselImages');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    
    carouselImages.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function nextSlide() {
    if (currentProject && currentSlide < currentProject.images.length - 1) {
        currentSlide++;
        updateCarousel();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateCarousel();
    }
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// Make functions globally accessible
window.openModal = openModal;
window.closeModal = closeModal;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.goToSlide = goToSlide;

function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    let projectHTML = "";
    
    // Show only first 6 projects on homepage
    projects.slice(0, 6).forEach(project => {
        // Get first image from images array
        const firstImage = project.images && project.images.length > 0 ? project.images[0] : '';
        const imageUrl = firstImage ? `/assets/images/projects/${firstImage}` : 'https://via.placeholder.com/600x400/6c5ce7/ffffff?text=Project+Image';
        
        projectHTML += `
        <div class="grid-item">
            <div class="box" style="width: 380px; margin: 1rem">
                <img draggable="false" src="${imageUrl}" alt="${project.name}" onerror="this.src='https://via.placeholder.com/600x400/6c5ce7/ffffff?text=Project+Image'" />
                <div class="view-more-overlay">
                    <button class="view-more-btn" onclick="openModal(${JSON.stringify(project).replace(/"/g, '&quot;')})">
                        <i class="fas fa-eye"></i> View More
                    </button>
                </div>
                <div class="content">
                    <div class="tag">
                        <h3>${project.name}</h3>
                    </div>
                </div>
            </div>
        </div>`
    });
    projectsContainer.innerHTML = projectHTML;

    // Event listeners for modal
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
        if (modal && modal.classList.contains('show')) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        }
    });

    /* ===== SCROLL REVEAL ANIMATION ===== */
    const srtop = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 1000,
        reset: false
    });

    /* SCROLL PROJECTS */
    srtop.reveal('.work .box', { interval: 200 });

}

// Backup skills data in case fetch fails
const backupSkillsData = {
    "Programming Languages": [
        {"name": "JavaScript", "icon": "https://img.icons8.com/color/48/000000/javascript--v1.png"},
        {"name": "TypeScript", "icon": "https://img.icons8.com/color/48/000000/typescript.png"},
        {"name": "Python", "icon": "https://img.icons8.com/color/48/000000/python--v1.png"},
        {"name": "C++", "icon": "https://img.icons8.com/color/48/000000/c-plus-plus-logo.png"}
    ],
    "Frontend Development": [
        {"name": "React", "icon": "https://img.icons8.com/external-tal-revivo-color-tal-revivo/48/000000/external-react-a-javascript-library-for-building-user-interfaces-logo-color-tal-revivo.png"},
        {"name": "React Native", "icon": "https://img.icons8.com/external-tal-revivo-color-tal-revivo/48/000000/external-react-a-javascript-library-for-building-user-interfaces-logo-color-tal-revivo.png"},
        {"name": "Next.js", "icon": "https://img.icons8.com/fluency/48/000000/nextjs.png"},
        {"name": "Angular", "icon": "https://img.icons8.com/color/48/000000/angularjs.png"},
        {"name": "Flutter", "icon": "https://img.icons8.com/color/48/000000/flutter.png"},
        {"name": "TailwindCSS", "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/48px-Tailwind_CSS_Logo.svg.png"},
        {"name": "Bootstrap", "icon": "https://img.icons8.com/color/48/000000/bootstrap.png"},
        {"name": "MaterialUI", "icon": "https://img.icons8.com/color/48/000000/material-ui.png"}
    ],
    "Backend Development": [
        {"name": "Node.js", "icon": "https://img.icons8.com/color/48/000000/nodejs.png"},
        {"name": "Express.js", "icon": "https://img.icons8.com/fluency/48/000000/node-js.png"},
        {"name": "NestJS", "icon": "https://img.icons8.com/color/48/000000/nestjs.png"},
        {"name": "GraphQL", "icon": "https://img.icons8.com/color/48/000000/graphql.png"}
    ],
    "Databases": [
        {"name": "MongoDB", "icon": "https://img.icons8.com/color/48/000000/mongodb.png"},
        {"name": "PostgreSQL", "icon": "https://img.icons8.com/color/48/000000/postgreesql.png"},
        {"name": "MySQL", "icon": "https://img.icons8.com/color/48/000000/mysql-logo.png"},
        {"name": "Redis", "icon": "https://img.icons8.com/color/48/000000/redis.png"}
    ],
    "Cloud & DevOps": [
        {"name": "AWS", "icon": "https://img.icons8.com/color/48/000000/amazon-web-services.png"},
        {"name": "Azure", "icon": "https://img.icons8.com/fluency/48/000000/azure-1.png"},
        {"name": "GCP", "icon": "https://img.icons8.com/color/48/000000/google-cloud.png"},
        {"name": "Docker", "icon": "https://img.icons8.com/color/48/000000/docker.png"},
        {"name": "Kubernetes", "icon": "https://img.icons8.com/color/48/000000/kubernetes.png"},
        {"name": "Terraform", "icon": "https://img.icons8.com/color/48/000000/terraform.png"},
        {"name": "GitHub Actions", "icon": "https://img.icons8.com/color/48/000000/github--v1.png"}
    ],
    "AI & Machine Learning": [
        {"name": "TensorFlow", "icon": "https://img.icons8.com/color/48/000000/tensorflow.png"},
        {"name": "PyTorch", "icon": "https://img.icons8.com/fluency/48/000000/pytorch.png"}
    ],
    "Version Control": [
        {"name": "Git", "icon": "https://img.icons8.com/color/48/000000/git.png"},
        {"name": "GitHub", "icon": "https://img.icons8.com/glyph-neue/48/ffffff/github.png"}
    ]
};

// Load skills with error handling and fallback
fetchData().then(data => {
    console.log("Skills data loaded:", data);
    showSkills(data);
}).catch(error => {
    console.error("Error loading skills from file, using backup data:", error);
    showSkills(backupSkillsData);
});

// Load projects with error handling
fetchData("projects").then(data => {
    console.log("Projects data loaded:", data);
    showProjects(data);
}).catch(error => {
    console.error("Error loading projects:", error);
});

// <!-- tilt js effect starts -->
VanillaTilt.init(document.querySelectorAll(".tilt"), {
    max: 15,
});
// <!-- tilt js effect ends -->


// pre loader start
// function loader() {
//     document.querySelector('.loader-container').classList.add('fade-out');
// }
// function fadeOut() {
//     setInterval(loader, 500);
// }
// window.onload = fadeOut;
// pre loader end

// Developer mode is now enabled
// You can now use F12, right-click, and all developer shortcuts

// Start of Tawk.to Live Chat
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/60df10bf7f4b000ac03ab6a8/1f9jlirg6';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
})();
// End of Tawk.to Live Chat


/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: false
});

/* SCROLL HOME */
srtop.reveal('.home .content h3', { delay: 200 });
srtop.reveal('.home .content p', { delay: 200 });
srtop.reveal('.home .content .btn', { delay: 200 });

srtop.reveal('.home .image', { delay: 400 });
srtop.reveal('.home .linkedin', { interval: 600 });
srtop.reveal('.home .github', { interval: 800 });
srtop.reveal('.home .twitter', { interval: 1000 });
srtop.reveal('.home .telegram', { interval: 600 });
srtop.reveal('.home .instagram', { interval: 600 });
srtop.reveal('.home .dev', { interval: 600 });

/* SCROLL ABOUT */
srtop.reveal('.about .content h3', { delay: 200 });
srtop.reveal('.about .content .tag', { delay: 200 });
srtop.reveal('.about .content p', { delay: 200 });
srtop.reveal('.about .content .box-container', { delay: 200 });
srtop.reveal('.about .content .resumebtn', { delay: 200 });


/* SCROLL EDUCATION */
srtop.reveal('.education .box', { interval: 200 });

/* SCROLL PROJECTS */
srtop.reveal('.work .box', { interval: 200 });

/* SCROLL EXPERIENCE */
srtop.reveal('.experience .timeline', { delay: 400 });
srtop.reveal('.experience .timeline .container', { interval: 400 });

/* SCROLL CONTACT */
srtop.reveal('.contact .container', { delay: 400 });
srtop.reveal('.contact .container .form-group', { delay: 400 });

// View more/less toggle for experience cards
document.addEventListener('DOMContentLoaded', function() {
    const viewMoreButtons = document.querySelectorAll('.view-more-btn');
    
    viewMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const detailsList = this.nextElementSibling;
            
            if (detailsList && detailsList.classList.contains('experience-details')) {
                if (detailsList.style.display === 'none') {
                    detailsList.style.display = 'block';
                    this.textContent = 'View less';
                    this.classList.add('active');
                } else {
                    detailsList.style.display = 'none';
                    this.textContent = 'View more';
                    this.classList.remove('active');
                }
            }
        });
    });
});