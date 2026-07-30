/**
 * ============================================================
 * МОДУЛЬ: BONUSES SLIDER (постраничная прокрутка)
 * Отвечает за: вертикальную прокрутку карточек бонусов.
 * Прокручивает по одной "странице" за раз, пока не достигнет
 * конца, затем меняет кнопку на "Скрыть".
 * ============================================================
 */

export function initBonusesSlider() {
  const sliders = document.querySelectorAll("[data-bonuses-slider]");

  sliders.forEach((slider) => {
    const sliderId = slider.getAttribute("data-bonuses-slider");
    const viewport = slider.querySelector(".bonuses-slider__viewport");
    const track = slider.querySelector(".bonuses-slider__track");
    const btn = document.querySelector(`[data-bonuses-btn="${sliderId}"]`);
    const btnText = btn ? btn.querySelector(".btn__text") : null;

    if (!track || !btn || !btnText) return;

    let currentPage = 0;
    let totalPages = 0;

    // Вычисляем количество страниц
    function calculatePages() {
      const cards = track.querySelectorAll(".bonus-card");
      const viewportHeight = viewport.offsetHeight;

      // Определяем количество карточек в видимой области
      // Для десктопа: 2x2 = 4 карточки
      // Для мобильных: 2x1 = 2 карточки
      const cardHeight = cards[0] ? cards[0].offsetHeight : 0;
      const gap = 20; // gap из CSS
      const rowHeight = cardHeight + gap;
      const rowsPerPage = Math.floor(viewportHeight / rowHeight);

      // Определяем количество колонок
      const trackWidth = track.offsetWidth;
      const cardWidth = cards[0] ? cards[0].offsetWidth : 0;
      const colsPerPage = Math.floor((trackWidth + gap) / (cardWidth + gap));

      const cardsPerPage = rowsPerPage * colsPerPage;
      totalPages = Math.ceil(cards.length / cardsPerPage);

      return { cardsPerPage, rowHeight, rowsPerPage };
    }

    // Обновляем позицию трека
    function updatePosition() {
      const { rowHeight, rowsPerPage } = calculatePages();
      const offset = currentPage * rowsPerPage * rowHeight;
      track.style.transform = `translateY(-${offset}px)`;

      // Обновляем текст кнопки
      if (currentPage === 0) {
        btnText.textContent = "Показать еще";
        btn.classList.remove("is-active");
      } else if (currentPage >= totalPages - 1) {
        btnText.textContent = "Скрыть";
        btn.classList.add("is-active");
      } else {
        btnText.textContent = "Показать еще";
        btn.classList.remove("is-active");
      }
    }

    // Обработчик клика на кнопку
    btn.addEventListener("click", () => {
      if (currentPage < totalPages - 1) {
        // Прокрутка вниз
        currentPage++;
      } else {
        // Возврат в начало
        currentPage = 0;
      }
      updatePosition();
    });

    // Инициализация при загрузке
    calculatePages();
    updatePosition();

    // Обновляем при изменении размера окна
    window.addEventListener("resize", () => {
      calculatePages();
      if (currentPage >= totalPages) {
        currentPage = totalPages - 1;
      }
      updatePosition();
    });
  });
}
