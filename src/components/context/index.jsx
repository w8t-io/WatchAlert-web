import React, { createContext, useState, useContext } from 'react';

// 创建一个 Context
const DataContext = createContext();

// 创建一个提供者组件
export const DataProvider = ({ children }) => {
    const [data, setData] = useState('');

    return (
        <DataContext.Provider value={{ data, setData }}>
            {children}
        </DataContext.Provider>
    );
};

// 自定义 hook，方便使用 Context
export const useData = () => {
    return useContext(DataContext);
};
