import { css } from "@emotion/react";
import { ThemeType } from "./theme";

const GlobalStyles = (theme: ThemeType) => css`
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body {
    width: "100%";
    height: "100%";
    font-family: ${theme.fonts.font};
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    transition:
      background-color 0.3s,
      color 0.3s;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul,
  ol {
    list-style: none;
  }
`;

export default GlobalStyles;
