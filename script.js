const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");

// Mobile navigation
menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", isOpen);

    menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
});

// Close mobile menu after clicking a link
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");

        menuToggle?.setAttribute("aria-expanded", "false");

        if (menuToggle) {
            menuToggle.innerHTML =
                '<i class="fa-solid fa-bars"></i>';
        }
    });
});

// Reveal elements while scrolling
const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
    element.style.transitionDelay =
        `${Math.min(index * 45, 300)}ms`;

    revealObserver.observe(element);
});

// Highlight active navigation section
const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll(".nav-links a");

const activeObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {

                navItems.forEach(item => {
                    item.classList.remove("active");
                });

                const currentLink = document.querySelector(
                    `.nav-links a[href="#${entry.target.id}"]`
                );

                currentLink?.classList.add("active");
            }
        });
    },
    {
        rootMargin: "-35% 0px -55% 0px"
    }
);

sections.forEach(section => {
    activeObserver.observe(section);
});

// Dark mode
if (localStorage.getItem("dileep-theme") === "dark") {
    document.body.classList.add("dark");
}

function updateThemeIcon() {

    if (!themeToggle) return;

    themeToggle.innerHTML =
        document.body.classList.contains("dark")
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';
}

updateThemeIcon();

themeToggle?.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "dileep-theme",
        document.body.classList.contains("dark")
            ? "dark"
            : "light"
    );

    updateThemeIcon();
});

// Subtle mouse movement on hero image
const heroVisual = document.querySelector(".hero-visual");

window.addEventListener("mousemove", event => {

    if (!heroVisual || window.innerWidth < 900) {
        return;
    }

    const x =
        (event.clientX / window.innerWidth - 0.5) * 8;

    const y =
        (event.clientY / window.innerHeight - 0.5) * 8;

    heroVisual.style.transform =
        `translate(${x * 0.45}px, ${y * 0.45}px)`;
});
