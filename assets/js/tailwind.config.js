tailwind.config = {
  // purge: [],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "yellow-primary": "#FDE047",
        "black-primary": "#222222",
        whitish: "#f5f5f5",
        "gray-primary": "#E5E5E5",
        "gray-secondary": "#C4C4C4",
      },
      fontFamily: {
        // sans: ["Roboto", "Helvetica", "Arial", "sans-serif"],
        // serif: ["Merriweather", "Georgia", "serif"],
        // mono: ['"Roboto Mono"', "monospace"],
        poppins: ["Poppins", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      fontSize: {
        // xs: ".75rem",
        // sm: ".875rem",
        // base: "1rem",
        // lg: "1.125rem",
        // xl: "1.25rem",
        // "2xl": "1.5rem",
        // "3xl": "1.875rem",
        // "4xl": "2.25rem",
        // "5xl": "3rem",
        // "6xl": "4rem",
      },
      spacing: {
        // 72: "18rem",
        // 84: "21rem",
        // 96: "24rem",
      },
      container: {
        // center: true,
        // padding: "1rem",
      },
      backgroundImage: {
        exchange: "url('assets/animations/exchange.gif')",
      },
    },
  },
  variants: {},
  plugins: [],
};
