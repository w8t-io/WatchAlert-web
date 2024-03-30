import React from 'react';
import { Helmet } from 'react-helmet';
import routes from './routes';
import { useRoutes } from 'react-router-dom';

export default function App() {
    const element = useRoutes(routes);
    const title = "WatchAlert";

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            {element}
        </>
    );
}