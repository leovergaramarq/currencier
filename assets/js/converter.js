import countryCurrencies from "../json/countryCurrencies.json" assert { type: "json" };
import mock from "../json/conversions/usd.json" assert { type: "json" };
import { fetchApi } from "./api.js";

window.addEventListener("DOMContentLoaded", () => {
  // dom
  const $converter = document.querySelector(".converter");
  const $sides = [...$converter.querySelectorAll(".converter-side")];
  const $dropdowns = $sides.map(($side) => $side.querySelector(".dropdown"));
  const $inputs = $sides.map(($side) => $side.querySelector(".currency-value"));
  const $swapBtn = $converter.querySelector(".swap-btn");
  const $table = document.querySelector("table");
  const $history = document.querySelector(".history");

  init();

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
            <div class="curency-code font-semibold">${currencyCode}</div>
            <div>-</div>
            <div class="currency-name">${currencyName}</div>
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
    } else if (
      someParentEquals($element, $history.querySelector(".history-btn"))
    ) {
      historyOpen = !historyOpen;
      if (historyOpen) {
        if (!$history.classList.contains("right-0")) {
          $history.classList.add("right-0");
        }
        if ($history.classList.contains("-right-64")) {
          $history.classList.remove("-right-64");
        }
        $history.querySelector("img").src = "assets/icons/right.svg";
      } else {
        if (!$history.classList.contains("-right-64")) {
          $history.classList.add("-right-64");
        }
        if ($history.classList.contains("right-0")) {
          $history.classList.remove("right-0");
        }
        $history.querySelector("img").src = "assets/icons/history.svg";
      }
    } else if (
      someParentEquals($element, $history.querySelector(".history-clear"))
    ) {
      if (history.length) {
        history = [];
        localStorage.setItem("history", JSON.stringify(history));
        renderHistory();
      }
    }
    closeDropdowns();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDropdowns();
    }
  });

  $converter.addEventListener("input", async (e) => {
    const $element = e.target;
    for (let i = 0; i < $inputs.length; i++) {
      const $input = $inputs[i];
      if (someParentEquals($element, $input)) {
        currencies[i].value = +$input.value;
        // console.log(currencies[i].value);
        const idxOther = (i + 1) % 2;
        const exchangeRate = await getExchangeRate(
          currencies[i].code,
          currencies[idxOther].code
        );
        currencies[idxOther].value = currencies[i].value * exchangeRate;
        $inputs[idxOther].value = currencies[idxOther].value.toFixed(2);
        history.unshift({
          from: currencies[i].code,
          to: currencies[idxOther].code,
          value: currencies[i].value.toFixed(2),
          result: currencies[idxOther].value.toFixed(2),
        });
        if (history.length > 5) {
          history.pop();
        }
        localStorage.setItem("history", JSON.stringify(history));
        renderHistory();
        return;
      }
    }
  });

  function init() {
    selectCurrency(0, "USD", false);
    selectCurrency(1, "EUR", false);
    syncCurrenciesValues();
    genTable();
    updateTable();
    renderHistory();
  }

  function swapCurrencies() {
    const temp = currencies[0];
    currencies[0] = currencies[1];
    currencies[1] = temp;
    renderConverterSides();
  }

  function selectCurrency(indexSide, currencyCode, syncCurrencies = true) {
    const currency = countryCurrencies.find(
      ({ currency: { code } }) => code === currencyCode
    );
    if (!currency) {
      console.log("Not found", currencyCode);
    }
    currencies[indexSide].code = currency?.currency.code || currencyCode;
    renderConverterSide(indexSide);
    if (syncCurrencies) {
      syncCurrenciesValues();
    }
  }

  function renderConverterSides() {
    $sides.forEach((_, i) => renderConverterSide(i));
  }

  function renderConverterSide(indexSide) {
    const $side = $sides[indexSide];
    const currency = countryCurrencies.find(
      ({ currency: { code } }) => code === currencies[indexSide].code
    );
    const $currencyInfo = $side.querySelector(".currency-info");
    $currencyInfo.querySelector(".currency-code").textContent =
      currency.currency.code;
    $currencyInfo.querySelector(".currency-name").textContent =
      currency.currency.name;
    $currencyInfo.querySelector(".flag").src = getFlagLink(
      currency.country.code
    );
    $inputs[indexSide].value = currencies[indexSide].value.toFixed(2);
  }

  async function syncCurrenciesValues() {
    const rates = await loadCurrencies();
    $inputs.forEach(($input, i) => {
      currencies[i].value = +rates[currencies[i].code];
      $input.value = currencies[i].value.toFixed(2);
    });
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

  function updateTable() {}

  function genTable() {
    const $thead = $table.querySelector("thead");
    const $tbody = $table.querySelector("tbody");
    let $fragment = document.createDocumentFragment();

    const keysRates = Object.keys(tempRates);

    $fragment.appendChild(document.createElement("th"));
    keysRates.forEach((currencyCode) => {
      const $th = document.createElement("th");
      const countryCode = countryCurrencies.find(
        ({ currency: { code } }) => code === currencyCode
      )?.country.code;
      if (!countryCode) {
        console.log("Not found", currencyCode);
      }
      $th.innerHTML = `
        <div class="flex w-40 justify-center">
          <img src="${getFlagLink(countryCode)}" alt="" class="h-6"/>
          <div class="ml-2">${currencyCode}</div>
        </div>
      `;
      $fragment.appendChild($th);
    });
    $thead.appendChild($fragment);

    $fragment = document.createDocumentFragment();
    keysRates.forEach((currencyCode1) => {
      const $tr = document.createElement("tr");
      const $th = document.createElement("th");
      const countryCode = countryCurrencies.find(
        ({ currency: { code } }) => code === currencyCode1
      )?.country.code;
      if (!countryCode) {
        console.log("Not found", currencyCode1);
      }
      $th.innerHTML = `
        <div class="flex w-28 justify-between py-1">
          <img src="${getFlagLink(countryCode)}" alt="" class="h-6"/>
          <div class="ml-2">${currencyCode1}</div>
        </div>
      `;
      $tr.appendChild($th);
      keysRates.forEach((currencyCode2) => {
        const $td = document.createElement("td");
        $td.classList = "text-center hover:bg-gray-100";
        $td.textContent = (
          tempRates[currencyCode2] / tempRates[currencyCode1]
        ).toFixed(2);
        $tr.appendChild($td);
      });
      $fragment.appendChild($tr);
    });
    $tbody.appendChild($fragment);
  }

  function renderHistory() {
    const $historyContent = $history.querySelector(".history-content ul");
    if (!history.length) {
      $historyContent.innerHTML = `
        <div class="flex justify-center items-center h-16 text-gray-500">
          <div class="text-center">Empty</div>
        </div>
      `;
      return;
    }
    $historyContent.innerHTML = "";
    history.forEach((item) => {
      const $tr = document.createElement("tr");
      $tr.classList = "text-center hover:bg-gray-100 px-4 ";
      $tr.innerHTML = `
        <div class="flex w-full justify-center py-1 gap-2">
          <div class="text-center grow">${item.from}</div>
          <div class="text-center grow">${item.to}</div>
        </div>
        <div class="flex w-full justify-center py-1 gap-2">
          <div class="overflow-x-auto text-center grow">${item.value}</div>
          <div class="overflow-x-auto text-center grow">${item.result}</div>

        </div>
      `;
      $historyContent.appendChild($tr);
    });
  }

  async function getExchangeRate(currencyCode1, currencyCode2) {
    return tempRates[currencyCode2] / tempRates[currencyCode1];
  }

  async function loadCurrencies() {
    tempRates = await fetchApi();
    updateTable();
    return tempRates;
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
    code: "EUR",
    value: mock.conversion_rates.EUR,
  },
];
let tempRates = mock.conversion_rates;
let history = JSON.parse(localStorage.getItem("history")) || [];
console.log(history);
let historyOpen = false;

export {};
