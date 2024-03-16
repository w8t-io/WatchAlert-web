import React, { useState } from 'react'
import ReactECharts from 'echarts-for-react'
import Base from './utils/Base'

const Home = () => {
  const option = {
    title: {
      text: '告警系统拓扑图',
      subtext: '纯属虚构',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['告警规则', '静默规则', '当前告警', '通知对象', '数据源']
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: '80%',
        center: ['50%', '60%'],
        data: [
          { value: 335, name: '告警规则' },
          { value: 310, name: '静默规则' },
          { value: 234, name: '当前告警' },
          { value: 135, name: '通知对象' },
          { value: 1548, name: '数据源' }
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  const [count, setCount] = useState(0)

  const onChartReady = (echarts) => {
  }

  const onChartClick = (param, echarts) => {
    setCount(count + 1)
  }

  const onChartLegendselectchanged = (param, echarts) => {
  }

  return (
    <ReactECharts
      option={option}
      style={{ height: 500 }}
      onChartReady={onChartReady}
      onEvents={{
        'click': onChartClick,
        'legendselectchanged': onChartLegendselectchanged
      }}
    />
  )
}

export default Home