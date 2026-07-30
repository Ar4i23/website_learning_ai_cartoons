import { initModal } from "./modal.js";
import { initForm } from "./form.js";
import { initSmoothScroll } from "./smooth-scroll.js";
import { initActiveNav } from "./active-nav.js";
import { initScrollAnim } from "./scroll-anim.js";
import { initBurgerMenu } from "./burger-menu.js";
import { initModuleSlider } from "./module-slider.js";
import { initBonusesSlider } from "./bonuses-slider.js"; // <-- Добавлено

document.addEventListener("DOMContentLoaded", function () {
  initModal();
  initForm();
  initSmoothScroll();
  initActiveNav();
  initScrollAnim();
  initBurgerMenu();
  initModuleSlider();
  initBonusesSlider(); // <-- Добавлено
});
