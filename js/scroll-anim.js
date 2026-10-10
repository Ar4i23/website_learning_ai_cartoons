export function initScrollAnim() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const animateElements = document.querySelectorAll(
    ".info-row__card, .info-row__module-item, .bottom-row__block",
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  animateElements.forEach((el) => {
    const siblingIndex = el.parentElement
      ? Array.from(el.parentElement.children).indexOf(el)
      : 0;
    const delay = Math.min(siblingIndex * 0.08, 0.24);

    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`;
    observer.observe(el);
  });
}
