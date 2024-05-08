import React, { createContext, useState, useContext } from 'react';


const ThemeContext = createContext();


export const ThemeProvider = ({ children }) => {
    const [selectedTheme, setSelectedTheme] = useState(null);
    const value = { selectedTheme, setSelectedTheme };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
