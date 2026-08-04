export function initActiveNav() {
  const sections = document.querySelectorAll("section[id], div[id]");
  const navLinks = document.querySelectorAll(".hero-wrap__nav-link");

  function updateActiveNav() {
    const scrollPos = window.scrollY + 200;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("hero-wrap__nav-link--active");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("hero-wrap__nav-link--active");
          }
        });
      }
    });
  }
  window.addEventListener("scroll", updateActiveNav);
}
