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
    });
});

document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Projects | Portfolio Jigar Sable";
            $("#favicon").attr("href", "/assets/images/favicon.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "/assets/images/favhand.png");
        }
    });


// fetch projects start
function getProjects() {
    return fetch("projects.json")
        .then(response => response.json())
        .then(data => {
            return data
        });
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
    console.log("Projects--->", projects)
    let projectsContainer = document.querySelector(".work .box-container");
    let projectsHTML = "";
    
    projects.forEach((project, index) => {
        // Get first image from images array
        const firstImage = project.images && project.images.length > 0 ? project.images[0] : '';
        
        projectsHTML += `
        <div class="grid-item">
            <div class="box" style="width: 380px; margin: 1rem" data-project-index="${index}">
                <img draggable="false" src="/assets/images/projects/${firstImage}" alt="${project.name}" onerror="this.src='https://via.placeholder.com/600x400/6c5ce7/ffffff?text=Project+Image'" />
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
        </div>`;
    });
    
    projectsContainer.innerHTML = projectsHTML;

    // isotope filter products
    var $grid = $('.box-container').isotope({
        itemSelector: '.grid-item',
        layoutMode: 'fitRows',
        masonry: {
            columnWidth: 200
        }
    });

    // filter items on button click
    $('.button-group').on('click', 'button', function () {
        $('.button-group').find('.is-checked').removeClass('is-checked');
        $(this).addClass('is-checked');
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
    });
}

// Event listeners for modal
document.addEventListener('DOMContentLoaded', function() {
    // Close modal on X click
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal on outside click
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Carousel navigation
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Keyboard navigation for carousel
    document.addEventListener('keydown', function(e) {
        if (modal && modal.classList.contains('show')) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        }
    });
});

getProjects().then(data => {
    showProjects(data);
})
// fetch projects end

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

// disable developer mode
document.onkeydown = function (e) {
    if (e.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
}