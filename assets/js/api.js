import { API_KEY } from "./config.js";
import mock from "../json/conversions/usd.json" assert { type: "json" };

export async function fetchApi() {
  // return mock.conversion_rates;
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`
    );
    const data = await response.json();
    if (data.result === "success") {
      return data.conversion_rates;
    }
    throw new Error("Unable to fetch exchange rates");
  } catch (err) {
    console.log("Error", err);
    return mock.conversion_rates;
  }
}
