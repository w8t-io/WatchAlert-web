import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { Divider, List, message, Spin } from 'antd';
import { Line } from '@pansy/react-charts';
import backendIP from './utils/config'
import axios from 'axios'

const Home = () => {
  const [dashboardInfo, setDashboardInfo] = useState(null);

  useEffect(() => {
    axios.get(`http://${backendIP}/api/system/getDashboardInfo`)
      .then((res) => {
        if (res.status === 200) {
          setDashboardInfo(res.data.data);
        } else {
          message.error("数据获取失败");
        }
      })
      .catch(() => {
        message.error("数据获取失败");
      });
  }, []);

  // 所有规则数
  const allAlertRulesOption = {
    series: [
      {
        type: 'gauge',
        progress: {
          show: true,
          width: 10,
          stroke: '#48b'
        },
        axisTick: {
          show: false
        },
        splitLine: {
          length: 10,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        axisLabel: {
          distance: 25,
          color: '#999',
          fontSize: 1,
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 25,
          itemStyle: {
            borderWidth: 10
          }
        },
        title: {
          show: false
        },
        detail: {
          // 增加垂直偏移量，将数值往下调整
          offsetCenter: [0, '70%'],
          valueAnimation: true,
          fontSize: 20,
        },
        data: [
          {
            value: dashboardInfo?.countAlertRules ?? 0,
          }
        ]
      }
    ]
  };

  // 当前告警数
  const curAlertsOption = {
    series: [
      {
        type: 'gauge',
        progress: {
          show: true,
          width: 10,
          stroke: '#48b'
        },
        axisTick: {
          show: false
        },
        splitLine: {
          length: 10,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        axisLabel: {
          distance: 25,
          color: '#999',
          fontSize: 1,
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 25,
          itemStyle: {
            borderWidth: 10
          }
        },
        title: {
          show: false
        },
        detail: {
          // 增加垂直偏移量，将数值往下调整
          offsetCenter: [0, '70%'],
          valueAnimation: true,
          fontSize: 20,
        },
        data: [
          {
            value: dashboardInfo?.curAlerts ?? 0,
          }
        ]
      }
    ]
  };

  // 告警分布
  const alarmDistributionOption = {
    xAxis: {
      type: 'category',
      data: ['P0', 'P1', 'P2']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [dashboardInfo?.alarmDistribution?.P0 ?? undefined, dashboardInfo?.alarmDistribution?.P1 ?? undefined, dashboardInfo?.alarmDistribution?.P2 ?? undefined],
        type: 'bar'
      }
    ]
  };

  const data = dashboardInfo?.serviceResource ?? []

  const config = {
    data,
    xField: 'time',
    yField: 'value',
    seriesField: 'label',
    xAxis: {
      type: 'time',
      labels: {
        formatter: function () {
          const date = new Date(this.value);
          return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        },
      },
    },
    tooltip: {
      dateTimeLabelFormats: {
        // 定义鼠标悬停时显示的时间格式
        minute: '%H:%M:%S',
        hour: '%H:%M:%S',
        day: '%H:%M:%S',
        week: '%H:%M:%S',
        month: '%H:%M:%S',
        year: '%H:%M:%S'
      }
    },
    interval: 1 * 60
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '450px', height: '250px', marginRight: '10px' }}>
          <Divider>规则总数</Divider>
          <ReactECharts
            option={allAlertRulesOption}
            style={{ marginTop: '-20px', height: '100%', width: '100%' }}
            className="chart"
          />
        </div>

        <div style={{ width: '450px', height: '250px', marginRight: '10px' }}>
          <Divider>当前告警总数</Divider>
          <ReactECharts
            option={curAlertsOption}
            style={{ marginTop: '-20px', height: '100%', width: '100%' }}
            className="chart"
          />
        </div>

        <div style={{ marginRight: '-20px', width: '600px', height: '200px' }}>
          <Divider>服务资源使用率</Divider>
          <Line {...config} />
        </div>
      </div >

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '700px', height: '300px', overflowY: 'auto' }}>
          <Divider>最近告警列表</Divider>
          <List
            bordered
            dataSource={dashboardInfo?.curAlertList ?? undefined}
            style={{
              borderRadius: 0,
              height: '30vh'
            }}
            renderItem={(item) => (
              <List.Item>
                {/* 包裹文本内容的容器，设置为可滚动 */}
                <div style={{ borderRadius: 0, overflowX: 'auto', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', maxWidth: '100%' }}>
                  {item}
                </div>
              </List.Item>
            )}
          />
        </div>

        <div style={{ width: '450px', height: '350px', overflowY: 'auto' }} >
          <Divider>告警分布</Divider>
          <ReactECharts
            option={alarmDistributionOption}
            style={{ marginTop: '-50px', height: '100%', width: '110%' }}
            className="chart"
          />
        </div>
      </div>

    </>
  );
}

export default Home;