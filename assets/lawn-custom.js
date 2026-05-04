(function () {
  function init(root) {
    root = root || document;

    var quantityValue = root.querySelector("#quantityValue");
    var quantityInput = root.querySelector("[data-product-quantity-input]");
    var qtyButtons = root.querySelectorAll("[data-qty]");
    var sizeCards = root.querySelectorAll(".size-card");
    var variantInput = root.querySelector("[data-product-variant-input]");
    var faqItems = root.querySelectorAll(".faq-item");

    qtyButtons.forEach(function (button) {
      if (button.dataset.lawnBound) return;
      button.dataset.lawnBound = "1";
      button.addEventListener("click", function () {
        if (!quantityValue) return;
        var current = Number(quantityValue.textContent) || 1;
        var next = button.dataset.qty === "plus" ? current + 1 : Math.max(1, current - 1);
        quantityValue.textContent = next;
        if (quantityInput) quantityInput.value = next;
      });
    });

    sizeCards.forEach(function (card) {
      if (card.dataset.lawnBound) return;
      card.dataset.lawnBound = "1";
      card.addEventListener("click", function () {
        sizeCards.forEach(function (item) {
          item.classList.remove("is-selected");
          item.setAttribute("aria-pressed", "false");
        });
        card.classList.add("is-selected");
        card.setAttribute("aria-pressed", "true");
        var variantId = card.getAttribute("data-variant-id");
        if (variantId && variantInput) variantInput.value = variantId;
      });
    });

    faqItems.forEach(function (item) {
      var button = item.querySelector("button");
      if (!button || button.dataset.lawnBound) return;
      button.dataset.lawnBound = "1";
      button.addEventListener("click", function () {
        faqItems.forEach(function (entry) {
          if (entry !== item) entry.classList.remove("is-open");
        });
        item.classList.toggle("is-open");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { init(); });
  } else {
    init();
  }

  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener("shopify:section:load", function (event) {
      init(event.target);
    });
  }
})();
