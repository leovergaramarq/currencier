// 1
// import rates from "./rates.json" assert { type: "json" };

// console.log(
//   Object.keys(rates).find((rate) => !codes.find((code) => code.code === rate))
// );

// 2
// import codes from "./codes.json" assert { type: "json" };
// import flags from "./flags.json" assert { type: "json" };

// const newCodes = codes.map(({ code, country, name }) => {
//   const flag = Object.keys(flags).find((flag) => flags[flag] === name);
//   if (!flag) {
//     console.log("not found for:", name);
//   }
//   return {
//     code,
//     country,
//     name,
//     flag,
//   };
// });
// console.log(newCodes);

// 3
// import codes from "./codes.json" assert { type: "json" };
// import countryCurrencyMap from "./countryCurrencyMap.json" assert { type: "json" };

// console.log(
//   codes.map(({ code, name, country }) => {
//     const countryCodeMap = countryCurrencyMap.find(({ Code }) => Code === code);
//     return {
//       currency: {
//         code,
//         name,
//       },
//       country: {
//         code: countryCodeMap?.CountryCode,
//         name: country,
//       },
//     };
//   })
// );

export default 1;
