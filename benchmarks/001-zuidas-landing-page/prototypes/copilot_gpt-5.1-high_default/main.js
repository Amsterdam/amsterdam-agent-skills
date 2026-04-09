document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".newsletter-form");

  forms.forEach((form) => {
    const messageEl = form.querySelector(".form-message");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const emailInput = form.querySelector("input[type='email']");

      if (!emailInput || !emailInput.checkValidity()) {
        if (messageEl) {
          messageEl.textContent = "Controleer uw e-mailadres en probeer het opnieuw.";
          messageEl.classList.add("form-message--error");
        }
        if (emailInput) {
          emailInput.focus();
        }
        return;
      }

      if (messageEl) {
        messageEl.textContent = "Bedankt voor uw aanmelding. U ontvangt binnenkort de eerste update.";
        messageEl.classList.remove("form-message--error");
      }

      form.reset();
    });
  });
});
