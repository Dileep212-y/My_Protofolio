// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Trigger fade-in animations on page load
window.addEventListener('load', () => {
    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '1'; // Ensure elements are visible after animation
    });
});