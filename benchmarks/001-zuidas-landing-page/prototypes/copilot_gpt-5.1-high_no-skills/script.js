document.addEventListener('DOMContentLoaded', function () {
  var forms = document.querySelectorAll('.newsletter-form');

  forms.forEach(function (form) {
    var messageEl = form.querySelector('.form-message');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!messageEl) {
        return;
      }

      var emailInput = form.querySelector("input[name='email']");
      var consentInput = form.querySelector("input[name='consent']");

      messageEl.textContent = '';
      messageEl.classList.remove('success', 'error');

      if (!emailInput) {
        messageEl.textContent = 'Er is een technisch probleem met dit formulier. Probeer het later opnieuw.';
        messageEl.classList.add('error');
        return;
      }

      var email = (emailInput.value || '').trim();
      var hasConsent = consentInput ? consentInput.checked : false;

      if (!email) {
        messageEl.textContent = 'Vul uw e-mailadres in om u aan te melden.';
        messageEl.classList.add('error');
        emailInput.focus();
        return;
      }

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        messageEl.textContent = 'Controleer uw e-mailadres. Het lijkt niet geldig.';
        messageEl.classList.add('error');
        emailInput.focus();
        return;
      }

      if (!hasConsent) {
        messageEl.textContent = 'Geef toestemming om per e-mail informatie te ontvangen.';
        messageEl.classList.add('error');
        if (consentInput) {
          consentInput.focus();
        }
        return;
      }

      try {
        var storageKey = 'zuidas-newsletter-interests';
        var formData = {
          email: email,
          interest: (form.querySelector("select[name='interest']") || {}).value || 'algemeen',
          page: window.location.pathname || 'onbekend',
          timestamp: new Date().toISOString()
        };
        var existing = [];
        try {
          var raw = window.localStorage.getItem(storageKey);
          if (raw) {
            existing = JSON.parse(raw);
            if (!Array.isArray(existing)) existing = [];
          }
        } catch (e) {
          existing = [];
        }
        existing.push(formData);
        window.localStorage.setItem(storageKey, JSON.stringify(existing));
      } catch (e) {
        // Als localStorage niet beschikbaar is, gaat de aanmelding gewoon door zonder opslag.
      }

      form.reset();
      messageEl.textContent = 'Bedankt voor uw aanmelding. U ontvangt binnenkort een bevestiging in uw mailbox.';
      messageEl.classList.add('success');
    });
  });
});
