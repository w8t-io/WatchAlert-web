import React from 'react'
import { Tag } from 'antd'

class TagList extends React.Component {
  render () {
    const { data } = this.props // 假设传入的对象数据为 data

    return (
      <div>
        {Object.entries(data).map(([key, value]) => (
          <Tag key={key}>{`${key}: ${value}`}</Tag>
        ))}
      </div>
    )
  }
}

export default TagList