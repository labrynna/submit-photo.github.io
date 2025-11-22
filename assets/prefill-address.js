// Read ?address=... on arrival, persist to sessionStorage, create hidden input on upload form,
// and prefill #address on the review page.
(function () {
  const PARAM_KEY = 'address';
  const STORAGE_KEY = 'swd_prefill_address';

  // On page load, check for ?address=... in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const addressParam = urlParams.get(PARAM_KEY);

  if (addressParam) {
    // Store in sessionStorage so it persists across page navigation
    sessionStorage.setItem(STORAGE_KEY, addressParam);

    // Remove the address parameter from the URL for cleanliness
    urlParams.delete(PARAM_KEY);
    const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
    window.history.replaceState({}, '', newUrl);
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrefill);
  } else {
    initPrefill();
  }

  function initPrefill() {
    const storedAddress = sessionStorage.getItem(STORAGE_KEY);
    if (!storedAddress) return;

    // Prefill the address input if it exists (review section)
    const addressInput = document.getElementById('address') || document.querySelector('input[name="address"]');
    if (addressInput && !addressInput.value) {
      addressInput.value = storedAddress;
    }

    // Add hidden input to the data form if it exists
    const dataForm = document.getElementById('data-form');
    if (dataForm) {
      // Check if hidden input already exists
      let hiddenInput = dataForm.querySelector('input[name="prefill_address"]');
      if (!hiddenInput) {
        hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'prefill_address';
        dataForm.appendChild(hiddenInput);
      }
      // Always update the value to ensure it's current
      hiddenInput.value = storedAddress;
    }
  }
})();
