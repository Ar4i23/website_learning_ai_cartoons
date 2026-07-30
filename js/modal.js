export function initModal() {
  const modal = document.getElementById("modal");
  const modalClose = modal.querySelector(".modal__close");
  const modalOverlay = modal.querySelector(".modal__overlay");

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add("modal--active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("modal--active");
    document.body.style.overflow = "";
  }

  const openModalBtns = document.querySelectorAll(
    '.hero-wrap__header-btn, .hero-wrap__action-btn[href="#signup"], .bottom-row__cta-btn',
  );
  openModalBtns.forEach((btn) => btn.addEventListener("click", openModal));

  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}
