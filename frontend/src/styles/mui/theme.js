const { createTheme } = require("@mui/material");

const backgroundColour = "#FF6B35";
const primaryColour = "#757780";
const textColour = "#EEE5E5";
const secondaryColour = "#311E10";
const highlightColour = "#E6EBE0";

//Color variable
const backgroundColourDark = "#3a3a3aff";
const primaryColourDark = "#FF6B35";
const textColourDark = "#EEE5E5";
const secondaryColourDark = "#757780";
const highlightColourDark = "#311E10";

// theme
let lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: backgroundColour,
    },
    primary: {
      main: primaryColour,
    },
    secondary: {
      main: secondaryColour,
    },
    tertiary: {
      main: highlightColour,
    },
    icon: {
      main: textColour,
    },
    error: {
      main: "#D80027",
    },
  },
});


// Dark theme
let darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: backgroundColourDark,
    },
    primary: {
      main: primaryColourDark,
    },
    secondary: {
      main: secondaryColourDark,
    },
    tertiary: {
      main: highlightColourDark,
    },
    icon: {
      main: textColourDark,
    },
    error: {
      main: "#D80027",
    },
  },
});

export { lightTheme, darkTheme };
