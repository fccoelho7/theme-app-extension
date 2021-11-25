(() => {
  const initialVariantId = window.currentProductVariantId;
  const block = document.querySelector("#rcsms-replenishment");
  const checkbox = block.querySelector('input[type="checkbox"]');

  function getCurrentVariantId() {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("variant");
  }

  checkbox.addEventListener("click", (e) => {
    if (!e.target.checked) {
      return;
    }

    const currentVariantId = getCurrentVariantId();
    const variantId =
      !!currentVariantId && initialVariantId !== currentVariantId
        ? currentVariantId
        : initialVariantId;
    const url = `https://rsms-sci-dev.myshopify.com/cart/${variantId}:1?attributes[notification_preferences]=accepted&discount=SPIKE`;

    window.open(url, "_blank");
  });
})();
