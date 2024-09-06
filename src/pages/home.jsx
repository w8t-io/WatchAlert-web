import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { Divider, List } from 'antd';
import { Line } from '@pansy/react-charts';
import { getDashboardInfo } from '../api/other';

export const Home = () => {
    const [dashboardInfo, setDashboardInfo] = useState([]);

    const fetchDashboardInfo = async () => {
        try {
            const res = await getDashboardInfo();
            setDashboardInfo(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDashboardInfo();
    }, []);

    const gaugeChartConfig = (value) => ({
        series: [
            {
                type: 'gauge',
                progress: { show: true, width: 10, stroke: '#48b' },
                axisTick: { show: false },
                splitLine: { length: 10, lineStyle: { width: 2, color: '#999' } },
                axisLabel: { distance: 25, color: '#999', fontSize: 12 },
                anchor: { show: true, size: 25, itemStyle: { borderWidth: 10 } },
                detail: { offsetCenter: [0, '70%'], valueAnimation: true, fontSize: 18 },
                data: [{ value: value || 0 }],
            },
        ],
    });

    const alarmDistributionOption = {
        xAxis: { type: 'category', data: ['P0', 'P1', 'P2'] },
        yAxis: { type: 'value' },
        series: [
            {
                data: [
                    dashboardInfo?.alarmDistribution?.P0 ?? 0,
                    dashboardInfo?.alarmDistribution?.P1 ?? 0,
                    dashboardInfo?.alarmDistribution?.P2 ?? 0,
                ],
                type: 'bar',
            },
        ],
    };

    const lineChartConfig = {
        data: dashboardInfo?.serviceResource ?? [],
        xField: 'time',
        yField: 'value',
        seriesField: 'label',
        xAxis: {
            type: 'time',
            labels: {
                formatter: (value) => {
                    const date = new Date(value);
                    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
                },
            },
        },
        tooltip: {
            dateTimeLabelFormats: {
                minute: '%H:%M:%S',
                hour: '%H:%M:%S',
                day: '%H:%M:%S',
            },
        },
        interval: 60,
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', height: '35vh', marginTop: '-20px' }}>
                <div style={{ width: '25%', minWidth: '200px', height: '80%' }}>
                    <Divider>规则总数</Divider>
                    <ReactECharts
                        option={gaugeChartConfig(dashboardInfo?.countAlertRules)}
                        style={{ height: '100%', width: '100%' }}
                    />
                </div>

                <div style={{ width: '25%', minWidth: '200px', height: '80%' }}>
                    <Divider>当前告警总数</Divider>
                    <ReactECharts
                        option={gaugeChartConfig(dashboardInfo?.curAlerts)}
                        style={{ height: '100%', width: '100%' }}
                    />
                </div>

                <div style={{ width: '45%', minWidth: '200px', height: '80%' }}>
                    <Divider>服务资源使用率</Divider>
                    <Line
                        style={{ height: '100%', width: '100%' }}
                        {...lineChartConfig}
                    />
                </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px'}}>
                <div style={{width: '50%', minWidth: '300px', height: '40vh'}}>
                    <Divider>最近告警列表</Divider>
                    <List
                        bordered
                        dataSource={dashboardInfo?.curAlertList ?? []}
                        style={{height: '30vh', overflow: 'auto'}}
                        renderItem={(item) => (
                            <List.Item>
                                <div style={{overflowX: 'auto', whiteSpace: 'nowrap'}}>{item}</div>
                            </List.Item>
                        )}
                    />
                </div>

                <div style={{width: '48%', minWidth: '200px', height: '80%'}}>
                    <Divider>告警分布</Divider>
                    <ReactECharts
                        option={alarmDistributionOption}
                        style={{height: '45vh', overflow: 'auto', marginTop: '-50px'}}
                    />
                </div>
            </div>
        </>
    );
};
