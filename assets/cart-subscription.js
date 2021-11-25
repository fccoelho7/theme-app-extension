const api = function (url, method, data) {
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
};

const Cart = {
  update: (body) => {
    return api("/cart/update.json", "POST", body);
  },
  get: () => {
    return api("/cart.js", "GET");
  },
};

(() => {
  const block = document.querySelector("#rcsms-subscription");
  const checkbox = block.querySelector(
    'input[name="rcsms-subscription-opt-in"]'
  );
  const NP = {
    accepted: "accepted",
    declined: "declined",
  };

  function optIn(status) {
    return Cart.update({
      attributes: {
        notification_preferences: {
          sms: {
            transactional: {
              status,
              last_opt_in_source: "script",
            },
          },
        },
      },
    });
  }

  function displayWidget() {
    return new Promise((resolve) => {
      if (Shopify.designMode) {
        return resolve(true);
      }

      const cart = Cart.get();

      return cart.then((data) => {
        if (data.item_count === 0) {
          return;
        }

        const hasSubscriptions = data.items.some(
          (item) => !!item.selling_plan_allocation
        );

        if (hasSubscriptions) {
          block.style.display = "block";
          return resolve(true);
        } else {
          block.style.display = "none";
          return resolve(false);
        }
      });
    });
  }

  displayWidget().then((isVisible) =>
    optIn(isVisible ? NP.accepted : NP.declined)
  );

  setInterval(displayWidget, 2000);

  checkbox.addEventListener("click", (e) => {
    optIn(e.target.checked ? NP.accepted : NP.declined);
  });
})();
