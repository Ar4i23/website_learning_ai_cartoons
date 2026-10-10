export function initBonusesSlider() {
  document.querySelectorAll("[data-bonuses-slider]").forEach((slider) => {
    const sliderId = slider.getAttribute("data-bonuses-slider");
    const viewport = slider.querySelector(".bonuses-slider__viewport");
    const track = slider.querySelector(".bonuses-slider__track");
    const btn = slider.parentElement.querySelector(
      '[data-bonuses-btn="' + sliderId + '"]',
    );
    const btnText = btn?.querySelector(".btn__text");

    if (!viewport || !track || !btn || !btnText) return;

    let currentPage = 0;
    let pageOffsets = [0];

    function calculatePages() {
      const cards = Array.from(track.querySelectorAll(".bonus-card"));
      const firstCardTop = cards[0]?.offsetTop ?? 0;
      const rows = [];
      const style = window.getComputedStyle(viewport);
      const verticalPadding =
        parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      const visibleHeight = Math.max(1, viewport.clientHeight - verticalPadding);

      cards.forEach((card) => {
        const rowOffset = card.offsetTop - firstCardTop;
        const currentRow = rows[rows.length - 1];
        if (!currentRow || rowOffset !== currentRow.offset) {
          rows.push({ offset: rowOffset, height: card.offsetHeight });
        } else {
          currentRow.height = Math.max(currentRow.height, card.offsetHeight);
        }
      });

      pageOffsets = [0];
      let rowIndex = 0;
      while (rowIndex < rows.length) {
        const pageEnd = rows[rowIndex].offset + visibleHeight;
        let nextRow = rowIndex + 1;
        while (
          nextRow < rows.length &&
          rows[nextRow].offset + rows[nextRow].height <= pageEnd
        ) {
          nextRow++;
        }
        if (nextRow >= rows.length) break;
        pageOffsets.push(rows[nextRow].offset);
        rowIndex = nextRow;
      }

      if (currentPage >= pageOffsets.length) {
        currentPage = pageOffsets.length - 1;
      }
    }

    function updatePosition() {
      calculatePages();
      track.style.transform = "translateY(-" + pageOffsets[currentPage] + "px)";

      const cards = Array.from(track.querySelectorAll(".bonus-card"));
      const firstCardTop = cards[0]?.offsetTop ?? 0;
      const viewportStyle = window.getComputedStyle(viewport);
      const verticalPadding =
        parseFloat(viewportStyle.paddingTop) +
        parseFloat(viewportStyle.paddingBottom);
      const visibleHeight = Math.max(1, viewport.clientHeight - verticalPadding);
      const pageStart = pageOffsets[currentPage] ?? 0;

      cards.forEach((card) => {
        const cardTop = card.offsetTop - firstCardTop;
        const fullyVisible =
          cardTop >= pageStart &&
          cardTop + card.offsetHeight <= pageStart + visibleHeight;
        card.style.visibility = fullyVisible ? "" : "hidden";
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

    // Recalculate after web fonts settle, since text wrapping changes card heights.
    if (document.fonts?.ready) {
      document.fonts.ready.then(updatePosition);
    }
  });
}
