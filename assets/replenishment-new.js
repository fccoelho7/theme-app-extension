// Utils
function api(url, method, data) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(xhr.status);
      }
    };
    xhr.send(JSON.stringify(data));
  });
}

// API Clients
// const SmsWidget = SmsWidget || {
//   show: (shopifyDomain) =>
//     api(
//       `http://localhost:3000/api/widgets/show_cart_opt_in_widget?shopify_domain=${shopifyDomain}`,
//       'GET'
//     ),
// };

// Widget
(async () => {
  function renderWidget() {
    const block = document.createElement("div");
    block.style = `
      background-color: rgba(255, 255, 255, 0.5);
      border: 1px solid #000000;
      display: none;
      padding: 2rem;
    `;

    const label = document.createElement("label");
    const labelText = document.createTextNode(
      "Get $10 off going with replenishment"
    );

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "rcsms-replenishment-opt-in";
    checkbox.style.marginRight = "0.4em";

    const legalCopy = document.createElement("small");
    legalCopy.innerHTML = `By submitting, I agree to receive automated text messages from ReCharge Inc. Consent is not a condition of purchase. Msg & data rates apply; View <a target="_blank" href="https://rechargepayments.com/sms-terms-of-service">SMS Terms of Service</a>`;
    legalCopy.style = "display: block; margin-top: 1rem; color: #aaaaaa;";

    const formWrap = document.createElement("div");
    formWrap.style = "display: none; margin-top: 1rem; flex: 1;";

    const form = document.createElement("form");
    form.style = "display: flex; widget: 100%;";

    const phoneNumber = document.createElement("input");
    phoneNumber.id = "rcsms-replenishment-phone-number";
    phoneNumber.type = "tel";
    phoneNumber.name = "rcsms-phone-number";
    phoneNumber.placeholder = "Phone number";
    phoneNumber.style = `
      border-radius: 0;
      border: 1px solid #191D48;
      flex-grow: 3;
      padding-bottom: 0.8rem;
      padding-top: 0.8rem;
    `;

    const submitButton = document.createElement("button");
    submitButton.type = "button";
    submitButton.innerText = "Send";
    submitButton.style = `
      background-color: #191D48;
      border: none;
      flex-grow: 1; color: white;
      padding: 0.6rem;
    `;

    label.appendChild(checkbox);
    label.appendChild(labelText);
    form.appendChild(phoneNumber);
    form.appendChild(submitButton);
    formWrap.appendChild(form);
    formWrap.appendChild(legalCopy);
    block.appendChild(label);
    block.appendChild(formWrap);

    document
      .querySelector("#rcsms-replenishment-product-widget")
      .appendChild(block);

    return { block, label, checkbox, formWrap, submitButton };
  }

  const { block, checkbox, formWrap, submitButton } = renderWidget();

  async function displayWidget() {
    if (window.Shopify.designMode) {
      block.style.display = "block";
      return;
    }

    // const currentProduct = window.currentVariantId;

    // TODO: check if product is available for replenishment

    block.style.display = "block";
  }

  await displayWidget();

  checkbox.addEventListener("click", (e) => {
    formWrap.style.display = e.target.checked ? "block" : "none";
  });

  submitButton.addEventListener("click", () => {
    console.log("Product Variant ID", window.currentVariant);
  });
})();

(() => {
  function includeCss() {
    const head = document.getElementsByTagName("head").item(0);

    const link = document.createElement("link");
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/css/intlTelInput.css";
    link.rel = "stylesheet";
    link.defer = true;
    head.appendChild(link);

    const style = document.createElement("style");

    const cssText = `
      .iti {
        width: 65%;
      }
      .iti input {
        width: 100%;
      }
    `;

    if (style.styleSheet) {
      style.styleSheet.cssText = cssText;
    } else {
      style.appendChild(document.createTextNode(cssText));
    }

    head.appendChild(style);
  }

  includeCss();

  function loadScript(url, callback) {
    const head = document.getElementsByTagName("head")[0];
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;

    script.onreadystatechange = callback;
    script.onload = callback;

    head.appendChild(script);
  }

  function applyIntlTelInput(elementId) {
    return function callback() {
      const phoneInputField = document.getElementById(elementId);

      const phoneInput = window.intlTelInput(phoneInputField, {
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
      });

      function formatIntlTelInput() {
        if (typeof intlTelInputUtils !== "undefined") {
          const currentText = phoneInput.getNumber(
            window.intlTelInputUtils.numberFormat.E164
          );

          if (typeof currentText === "string") {
            const replaced = currentText.replace(/[^0-9.+]/, "");
            phoneInput.setNumber(replaced);
          }
        }
      }

      phoneInputField.addEventListener("keyup", formatIntlTelInput);
      phoneInputField.addEventListener("change", formatIntlTelInput);
    };
  }

  loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/intlTelInput.min.js",
    applyIntlTelInput("rcsms-replenishment-phone-number")
  );
})();
