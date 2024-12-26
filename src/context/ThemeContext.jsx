import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { DARK_THEME, LIGHT_THEME } from "../constants/themeConstants";

export const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    window.localStorage.getItem("themeMode") || DARK_THEME
  );

  useEffect(() => {
    // Ensure localStorage is updated whenever the theme changes
    window.localStorage.setItem("themeMode", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
