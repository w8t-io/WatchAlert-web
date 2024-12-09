import React, { createContext, useContext, useState } from 'react';

const RuleContext = createContext();

export const ContextProvider = ({ children }) => {
    const [ruleTemplate, setRuleTemplate] = useState(null);

    return (
        <RuleContext.Provider value={{ ruleTemplate, setRuleTemplate }}>
            {children}
        </RuleContext.Provider>
    );
};

export const useRule = () => useContext(RuleContext); 