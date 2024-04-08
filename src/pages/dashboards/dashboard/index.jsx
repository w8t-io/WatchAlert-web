import React, { useEffect, useState } from 'react';
import { getDashboardData } from '../../../api/dashboard';
import { useParams } from 'react-router-dom'

export const GrafanaDashboardComponent = () => {
    const { id } = useParams()
    const [iframeSrc, setIframeSrc] = useState('')

    useEffect(() => {
        run();
    }, []);

    const run = async () => {
        try {
            const params = {
                id: id,
            }
            const res = await getDashboardData(params)
            setIframeSrc(res.data.url)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <div >Loading...</div>
            <div style={{ marginLeft: '-24px', marginTop: '-25px' }}>
                <iframe
                    src={iframeSrc}
                    frameborder="0"
                    style={{
                        borderRadius: '10px',
                        margin: '0',
                        width: 'calc(100% + 24px)',
                        height: 'calc(92.2vh - 60px - 90px)',
                        overflow: 'auto',
                    }}
                />
            </div >
        </>
    );
};