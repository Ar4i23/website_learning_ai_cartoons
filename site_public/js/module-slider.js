/**
 * ============================================================
 * МОДУЛЬ: MODULE SLIDER (постраничная прокрутка)
 * Отвечает за: вертикальную прокрутку элементов в секциях
 * "Программа обучения". Прокручивает по одной "странице" за раз,
 * пока не достигнет конца, затем меняет кнопку на "Скрыть".
 * ============================================================
 */

export function initModuleSlider() {
  const sliders = document.querySelectorAll(".module-slider");

  sliders.forEach((slider) => {
    const sliderId = slider.getAttribute("data-slider");
    const viewport = slider.querySelector(".module-slider__viewport");
    const list = viewport.querySelector(".info-row__module-list");
    const btn = document.querySelector(`[data-slider-btn="${sliderId}"]`);
    const btnText = btn ? btn.querySelector(".btn__text") : null;

    if (!list || !btn || !btnText) return;

    let currentPage = 0;
    let totalPages = 0;

    // Вычисляем количество страниц
    function calculatePages() {
      const items = list.querySelectorAll(".info-row__module-item");
      const viewportHeight = viewport.offsetHeight;
      const itemHeight = items[0] ? items[0].offsetHeight : 0;
      const itemsPerPage = Math.floor(viewportHeight / itemHeight);
      totalPages = Math.ceil(items.length / itemsPerPage);
      return { itemsPerPage, itemHeight };
    }

    // Обновляем позицию списка
    function updatePosition() {
      const { itemHeight, itemsPerPage } = calculatePages();
      const offset = currentPage * itemsPerPage * itemHeight;
      list.style.transform = `translateY(-${offset}px)`;

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
