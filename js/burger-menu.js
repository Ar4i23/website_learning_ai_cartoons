export function initBurgerMenu() {
  const burgerBtn = document.getElementById("burgerBtn");
  const nav = document.querySelector(".hero-wrap__nav");
  const header = document.querySelector(".hero-wrap__header");
  if (!burgerBtn || !nav) return;

  // Создаем оверлей динамически, если его нет
  let overlay = document.querySelector(".hero-wrap__overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "hero-wrap__overlay";
    // Вставляем сразу после header
    header.parentNode.insertBefore(overlay, header.nextSibling);
  }

  function openMenu() {
    nav.classList.add("hero-wrap__nav--active");
    burgerBtn.classList.add("burger--active");
    overlay.classList.add("hero-wrap__overlay--active");
    burgerBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    nav.classList.remove("hero-wrap__nav--active");
    burgerBtn.classList.remove("burger--active");
    overlay.classList.remove("hero-wrap__overlay--active");
    burgerBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  burgerBtn.addEventListener("click", () => {
    nav.classList.contains("hero-wrap__nav--active") ? closeMenu() : openMenu();
  });

  overlay.addEventListener("click", closeMenu);

  // ИСПРАВЛЕНИЕ: Закрытие меню при клике на ссылку, но без отмены перехода
  const navLinks = document.querySelectorAll(".hero-wrap__nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      nav.classList.contains("hero-wrap__nav--active")
    ) {
      closeMenu();
    }
  });
}
