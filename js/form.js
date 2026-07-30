export function initForm() {
  const modalForm = document.getElementById("signupForm");
  if (!modalForm) return;

  modalForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const inputs = modalForm.querySelectorAll(".modal__input");
    let isValid = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = "#e74c3c";
      } else {
        input.style.borderColor = "rgba(255,255,255,0.12)";
      }
    });

    if (isValid) {
      const submitBtn = modalForm.querySelector(".modal__submit");
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML =
        '<span class="btn__text">✓ Заявка отправлена!</span>';
      submitBtn.style.background = "#27ae60";
      submitBtn.style.color = "#fff";

      setTimeout(function () {
        submitBtn.innerHTML = originalHTML;
        submitBtn.style.background = "";
        submitBtn.style.color = "";
        modalForm.reset();
        document.getElementById("modal").classList.remove("modal--active");
        document.body.style.overflow = "";
      }, 2000);
    }
  });
}
