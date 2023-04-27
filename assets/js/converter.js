import { API_KEY } from "./config.js";
import countryCurrencies from "../json/countryCurrencies.json" assert { type: "json" };
import mock from "../json/conversions/usd.json" assert { type: "json" };

window.addEventListener("DOMContentLoaded", () => {
  // dom
  const $converter = document.querySelector(".converter");
  const $sides = [...$converter.querySelectorAll(".converter-side")];
  const $dropdowns = $sides.map(($side) => $side.querySelector(".dropdown"));
  const $swapBtn = $converter.querySelector(".swap-btn");

  selectCurrency(0, "USD");
  selectCurrency(1, "COP");

  $dropdowns.forEach(($dropdown) => {
    const fragment = document.createDocumentFragment();
    countryCurrencies.forEach(
      ({
        country: { name: countryName, code: countryCode },
        currency: { code: currencyCode, name: currencyName },
      }) => {
        const content = `
          <img src="${getFlagLink(
            countryCode
          )}" class="w-12" alt="South Africa" />
          <div class="flex gap-2 text-sm">
            <div class="font-semibold">${currencyCode}</div>
            <div>-</div>
            <div>${currencyName}</div>
          </div>    
        `;
        const $option = document.createElement("li");
        $option.classList =
          "hover:bg-white cursor-pointer px-5 py-2 flex gap-2 items-center";
        $option.innerHTML = content;
        fragment.appendChild($option);
      }
    );
    $dropdown.querySelector(".dropdown-content").appendChild(fragment);
  });

  document.addEventListener("click", (e) => {
    const $element = e.target;
    for (let i = 0; i < $sides.length; i++) {
      const $side = $sides[i];
      if (someParentEquals($element, $side)) {
        const $dropdown = $side.querySelector(".dropdown");
        const $dropdownContent = $dropdown.querySelector(".dropdown-content");
        const $dropdownToggle = $dropdown.querySelector(".dropdown-toggle");
        if (someParentEquals($element, $dropdownToggle)) {
          $dropdownContent.classList.toggle("hidden");
          // closeDropdowns();
          // $dropdownContent.classList.remove("hidden");
        } else if (someParentEquals($element, $dropdownContent)) {
          const $options = [...$dropdownContent.querySelectorAll("li")];
          for (let j = 0; j < $options.length; j++) {
            const $option = $options[j];
            if (someParentEquals($element, $option)) {
              selectCurrency(
                i,
                $option.querySelector(".curency-code").textContent
              );

              closeDropdowns();
              return;
            }
          }
        } else {
          closeDropdowns();
        }
        return;
      }
    }
    if (someParentEquals($element, $swapBtn)) {
      swapCurrencies();
    }
    closeDropdowns();
  });

  function swapCurrencies() {
    const temp = currencies[0];
    // currencies[0].code = currencies[1].code;
    // currencies[1].code = temp;
    currencies[0] = currencies[1];
    currencies[1] = temp;
    renderConverterSides();
    syncCurrenciesValues();
  }

  function selectCurrency(indexSide, currencyCode) {
    // const $side = $sides[indexSide];
    const currency = countryCurrencies.find(
      ({ currency: { code } }) => code === currencyCode
    );
    if (!currency) {
      console.log("Not found", currencyCode);
    }
    currencies[indexSide].code = currency?.currency.code || currencyCode;
    renderConverterSide(indexSide);
    syncCurrenciesValues();
  }

  function renderConverterSides() {
    $sides.forEach((_, i) => renderConverterSide(i));
  }

  function renderConverterSide(indexSide) {
    const $side = $sides[indexSide];
    const currency = countryCurrencies.find(
      ({ currency: { code } }) => code === currencies[indexSide].code
    );
    $side.querySelector(".currency-code").textContent = currency.currency.code;
    $side.querySelector(".currency-name").textContent = currency.currency.name;
    $side.querySelector(".flag").src = getFlagLink(currency.country.code);
  }

  async function syncCurrenciesValues() {
    try {
      const rates = await fetchCurrencies();
      $sides.forEach(($side, i) => {
        currencies[i].value = rates[currencies[i].code];
        const $currencyValue = $side.querySelector(".currency-value");
        $currencyValue.value = currencies[i].value;
      });
    } catch (err) {}
  }

  async function fetchCurrencies() {
    // try {
    //   const response = await fetch(
    //     `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`
    //   );
    //   const data = await response.json();
    //   if (data.result === "success") {
    //     return data.conversion_rates;
    //   }
    //   throw new Error("Unable to fetch exchange rates");
    // } catch (err) {
    //   console.log("Error", err);
    //   return mock.conversion_rates;
    // }

    return mock.conversion_rates;
  }

  function closeDropdowns() {
    $dropdowns.forEach(($dropdown) => {
      const $dropdownContent = $dropdown.querySelector(".dropdown-content");
      closeDropdown($dropdownContent);
    });
  }

  function closeDropdown($dropdownContent) {
    if (!$dropdownContent.classList.contains("hidden")) {
      $dropdownContent.classList.add("hidden");
    }
  }
});

function someParentEquals(element, toCompare) {
  while (element && element !== document.body) {
    if (element === toCompare) return true;
    element = element.parentElement;
  }
  return false;
}

function getFlagLink(countryCode) {
  return `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;
}

// variables
const currencies = [
  {
    code: "USD",
    value: mock.conversion_rates.USD,
  },
  {
    code: "COP",
    value: mock.conversion_rates.COP,
  },
];
let history = [];

export {};
