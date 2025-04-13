export const lightTheme = {
  mode: "light",
  colors: {
    primary: "blue",
    secondary: "green",
    background: "#fff",
    text: "#000",
  },
  fonts: {
    fontSize: "14px",
    font: "'Inter',sans-serif",
  },
};

export const darkTheme = {
  mode: "dark",
  colors: {
    primary: "blue",
    secondary: "green",
    background: "#000",
    text: "#fff",
  },
  fonts: {
    fontSize: "14px",
    font: "'Inter', sans-serif",
  },
};

export type ThemeType = typeof lightTheme;
