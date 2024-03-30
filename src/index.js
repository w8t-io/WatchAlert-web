import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN.js';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ConfigProvider componentSize='middle' locale={zhCN}>
            <App />
        </ConfigProvider>
    </BrowserRouter>
);
