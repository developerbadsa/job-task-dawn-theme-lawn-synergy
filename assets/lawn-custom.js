(function () {
  function bindOnce(el, handler, key) {
    if (!el || el.dataset[key]) return false;
    el.dataset[key] = "1";
    return true;
  }

  function initHero(hero) {
    var quantityValue = hero.querySelector("#quantityValue");
    var quantityInput = hero.querySelector("[data-product-quantity-input]");
    var qtyButtons = hero.querySelectorAll("[data-qty]");
    var sizeCards = hero.querySelectorAll(".size-card");
    var variantInput = hero.querySelector("[data-product-variant-input]");
    var priceEl = hero.querySelector("[data-product-price]");
    var compareEl = hero.querySelector("[data-product-compare-price]");
    var addToCartBtn = hero.querySelector("[data-add-to-cart]");
    var addToCartLabel = addToCartBtn
      ? addToCartBtn.getAttribute("data-add-label") || addToCartBtn.textContent.trim() || "Add To Cart"
      : "Add To Cart";
    var thumbs = hero.querySelectorAll(".thumb[data-thumb-image]");
    var mainImg = hero.querySelector("[data-lawn-main-image] img");

    qtyButtons.forEach(function (button) {
      if (!bindOnce(button, null, "lawnBound")) return;
      button.addEventListener("click", function () {
        if (!quantityValue) return;
        var current = Number(quantityValue.textContent) || 1;
        var next = button.dataset.qty === "plus" ? current + 1 : Math.max(1, current - 1);
        quantityValue.textContent = next;
        if (quantityInput) quantityInput.value = next;
      });
    });

    sizeCards.forEach(function (card) {
      if (!bindOnce(card, null, "lawnBound")) return;
      card.addEventListener("click", function () {
        if (card.getAttribute("data-variant-available") === "false") return;

        sizeCards.forEach(function (item) {
          item.classList.remove("is-selected");
          item.setAttribute("aria-pressed", "false");
        });
        card.classList.add("is-selected");
        card.setAttribute("aria-pressed", "true");

        var variantId = card.getAttribute("data-variant-id");
        if (variantId && variantInput) variantInput.value = variantId;

        var price = card.getAttribute("data-variant-price");
        if (price && priceEl) priceEl.textContent = price;

        var compare = card.getAttribute("data-variant-compare-price");
        if (compareEl) {
          if (compare) {
            compareEl.textContent = compare;
            compareEl.removeAttribute("hidden");
          } else {
            compareEl.textContent = "";
            compareEl.setAttribute("hidden", "");
          }
        }

        if (addToCartBtn) {
          var available = card.getAttribute("data-variant-available") !== "false";
          addToCartBtn.disabled = !available;
          addToCartBtn.textContent = available
            ? addToCartLabel
            : (window.variantStrings && window.variantStrings.soldOut) || "Sold Out";
        }
      });
    });

    thumbs.forEach(function (thumb) {
      if (!bindOnce(thumb, null, "lawnBound")) return;
      thumb.addEventListener("click", function () {
        thumbs.forEach(function (t) { t.classList.remove("is-active"); });
        thumb.classList.add("is-active");
        if (mainImg) {
          var src = thumb.getAttribute("data-thumb-image");
          if (src) {
            mainImg.src = src;
            mainImg.removeAttribute("srcset");
            mainImg.removeAttribute("sizes");
            var alt = thumb.getAttribute("data-thumb-alt");
            if (alt) mainImg.alt = alt;
          }
        }
      });
    });
  }

  function initFaq(root) {
    var faqItems = root.querySelectorAll(".faq-item");
    faqItems.forEach(function (item) {
      var button = item.querySelector("button");
      if (!button || !bindOnce(button, null, "lawnBound")) return;
      button.addEventListener("click", function () {
        faqItems.forEach(function (entry) {
          if (entry !== item) entry.classList.remove("is-open");
        });
        item.classList.toggle("is-open");
      });
    });
  }

  function init(root) {
    root = root || document;

    var heroes = root.querySelectorAll("[data-lawn-hero]");
    if (heroes.length) {
      heroes.forEach(initHero);
    } else if (root.matches && root.matches("[data-lawn-hero]")) {
      initHero(root);
    }

    initFaq(root);
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
