/**
 * ============================================================
 * СКРИПТ САЙТА «ОБУЧЕНИЕ ИИ-МУЛЬТИКАМ»
 * ============================================================
 * Отвечает за:
 * 1. Открытие/закрытие модального окна записи
 * 2. Валидацию и отправку формы
 * 3. Плавную прокрутку к якорным ссылкам
 * 4. Подсветку активного пункта меню при скролле
 * 5. Анимацию появления элементов при скролле
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", function () {
  // ===== МОДАЛЬНОЕ ОКНО =====
  const modal = document.getElementById("modal");
  const modalClose = modal.querySelector(".modal__close");
  const modalOverlay = modal.querySelector(".modal__overlay");
  const modalForm = document.getElementById("signupForm");

  /**
   * Функция открытия модального окна
   * Добавляет класс active и блокирует прокрутку body
   */
  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add("modal--active");
    document.body.style.overflow = "hidden";
  }

  /**
   * Функция закрытия модального окна
   * Убирает класс active и разблокирует прокрутку
   */
  function closeModal() {
    modal.classList.remove("modal--active");
    document.body.style.overflow = "";
  }

  // Находим все кнопки, открывающие модальное окно
  const openModalBtns = document.querySelectorAll(
    '.hero-wrap__header-btn, .hero-wrap__action-btn[href="#signup"], .bottom-row__cta-btn',
  );

  // Навешиваем обработчик на каждую кнопку
  openModalBtns.forEach(function (btn) {
    btn.addEventListener("click", openModal);
  });

  // Закрытие по клику на крестик
  modalClose.addEventListener("click", closeModal);

  // Закрытие по клику на затемнённый фон
  modalOverlay.addEventListener("click", closeModal);

  // Закрытие по клавише Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  // ===== ОБРАБОТКА ФОРМЫ =====
  modalForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const inputs = modalForm.querySelectorAll(".modal__input");
    let isValid = true;

    // Проверяем каждое поле
    inputs.forEach(function (input) {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = "#e74c3c";
      } else {
        input.style.borderColor = "rgba(255,255,255,0.12)";
      }
    });

    // Если все поля заполнены — имитируем отправку
    if (isValid) {
      const submitBtn = modalForm.querySelector(".modal__submit");
      const originalHTML = submitBtn.innerHTML;

      // Показываем сообщение об успехе
      submitBtn.innerHTML =
        '<span class="btn__text">✓ Заявка отправлена!</span>';
      submitBtn.style.background = "#27ae60";
      submitBtn.style.color = "#fff";

      // Через 2 секунды сбрасываем форму и закрываем модалку
      setTimeout(function () {
        submitBtn.innerHTML = originalHTML;
        submitBtn.style.background = "";
        submitBtn.style.color = "";
        modalForm.reset();
        closeModal();
      }, 2000);
    }
  });

  // ===== ПЛАВНАЯ ПРОКРУТКА К ЯКОРНЫМ ССЫЛКАМ =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || targetId === "#signup") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = 80;
        const targetPosition =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight -
          20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ===== ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ ПРИ СКРОЛЛЕ =====
  const sections = document.querySelectorAll("section[id], div[id]");
  const navLinks = document.querySelectorAll(".hero-wrap__nav-link");

  function updateActiveNav() {
    const scrollPos = window.scrollY + 200;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove("hero-wrap__nav-link--active");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("hero-wrap__nav-link--active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav);

  // ===== АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ =====
  const animateElements = document.querySelectorAll(
    ".info-row__card, .info-row__module-item, .bottom-row__block",
  );

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  // Инициализация анимации для каждого элемента
  animateElements.forEach(function (el, index) {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition =
      "opacity 0.5s ease " +
      index * 0.08 +
      "s, transform 0.5s ease " +
      index * 0.08 +
      "s";
    observer.observe(el);
  });
});
// ===== BURGER MENU =====
const burgerBtn = document.getElementById("burgerBtn");
const nav = document.querySelector(".hero-wrap__nav");
const header = document.querySelector(".hero-wrap__header");

// Создаём overlay (затемнённый фон)
const overlay = document.createElement("div");
overlay.className = "hero-wrap__overlay";
header.parentNode.insertBefore(overlay, header.nextSibling);

/**
 * Открытие мобильного меню
 */
function openMenu() {
  nav.classList.add("hero-wrap__nav--active");
  burgerBtn.classList.add("burger--active");
  overlay.classList.add("hero-wrap__overlay--active");
  burgerBtn.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden"; // Блокируем прокрутку
}

/**
 * Закрытие мобильного меню
 */
function closeMenu() {
  nav.classList.remove("hero-wrap__nav--active");
  burgerBtn.classList.remove("burger--active");
  overlay.classList.remove("hero-wrap__overlay--active");
  burgerBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = ""; // Разблокируем прокрутку
}

// Открытие/закрытие по клику на бургер
burgerBtn.addEventListener("click", function () {
  if (nav.classList.contains("hero-wrap__nav--active")) {
    closeMenu();
  } else {
    openMenu();
  }
});

// Закрытие по клику на overlay
overlay.addEventListener("click", closeMenu);

// Закрытие по клику на ссылку меню
const navLinks = document.querySelectorAll(".hero-wrap__nav-link");
navLinks.forEach(function (link) {
  link.addEventListener("click", closeMenu);
});

// Закрытие по клавише Escape
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && nav.classList.contains("hero-wrap__nav--active")) {
    closeMenu();
  }
});
