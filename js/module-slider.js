export function initModuleSlider() {
  document.querySelectorAll(".module-slider").forEach((slider) => {
    const sliderId = slider.getAttribute("data-slider");
    const viewport = slider.querySelector(".module-slider__viewport");
    const list = viewport?.querySelector(".info-row__module-list");
    const btn = slider.parentElement.querySelector(
      '[data-slider-btn="' + sliderId + '"]',
    );
    const btnText = btn?.querySelector(".btn__text");

    if (!viewport || !list || !btn || !btnText) return;

    let currentPage = 0;
    let pageOffsets = [0];

    function calculatePages() {
      const items = Array.from(list.querySelectorAll(".info-row__module-item"));
      const viewportHeight = viewport.clientHeight;
      const firstItemTop = items[0]?.offsetTop ?? 0;
      const itemOffsets = items.map((item) => item.offsetTop - firstItemTop);

      pageOffsets = [0];
      let startIndex = 0;
      while (startIndex < items.length) {
        const pageEnd = itemOffsets[startIndex] + viewportHeight;
        let nextStart = startIndex + 1;
        while (
          nextStart < items.length &&
          itemOffsets[nextStart] + items[nextStart].offsetHeight <= pageEnd
        ) {
          nextStart++;
        }
        if (nextStart >= items.length) break;
        pageOffsets.push(itemOffsets[nextStart]);
        startIndex = nextStart;
      }

      if (currentPage >= pageOffsets.length) {
        currentPage = pageOffsets.length - 1;
      }
    }

    function updatePosition() {
      calculatePages();
      list.style.transform = "translateY(-" + pageOffsets[currentPage] + "px)";

      const items = Array.from(list.querySelectorAll(".info-row__module-item"));
      const firstItemTop = items[0]?.offsetTop ?? 0;
      const pageStart = pageOffsets[currentPage] ?? 0;
      const pageEnd = pageStart + viewport.clientHeight;

      items.forEach((item) => {
        const itemTop = item.offsetTop - firstItemTop;
        const fullyVisible =
          itemTop >= pageStart &&
          itemTop + item.offsetHeight <= pageEnd;
        item.style.visibility = fullyVisible ? "" : "hidden";
      });

      const isExpanded = currentPage > 0;
      btnText.textContent =
        currentPage === pageOffsets.length - 1 && isExpanded
          ? "Скрыть"
          : "Показать еще";
      btn.classList.toggle("is-active", isExpanded);
      btn.setAttribute("aria-expanded", String(isExpanded));
    }

    btn.addEventListener("click", () => {
      currentPage =
        currentPage < pageOffsets.length - 1 ? currentPage + 1 : 0;
      updatePosition();
    });

    updatePosition();

    window.addEventListener("resize", updatePosition);

    if (document.fonts?.ready) {
      document.fonts.ready.then(updatePosition);
    }
  });
}
