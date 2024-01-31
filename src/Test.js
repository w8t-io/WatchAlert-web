import React, { useState } from 'react'

const Test = () => {
  const [noticeLabels, setNoticeLabels] = useState([])

  const handleLabelChange = (index, field, value) => {
    setNoticeLabels(prevLabels => {
      const updatedLabels = [...prevLabels]
      updatedLabels[index] = {
        ...updatedLabels[index],
        [field]: value
      }
      return updatedLabels
    })
  }

  const addLabel = () => {
    setNoticeLabels(prevLabels => [
      ...prevLabels,
      { key: '', value: '', noticeId: '' }
    ])
  }

  const removeLabel = (index) => {
    setNoticeLabels(prevLabels => {
      const updatedLabels = [...prevLabels]
      updatedLabels.splice(index, 1)
      return updatedLabels
    })
  }

  const handleSubmit = (e) => {
    console.log(noticeLabels)
    e.preventDefault()
    // 处理表单提交逻辑
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Notice Labels:</label>
      {noticeLabels.map((label, index) => (
        <div key={index}>
          <input
            type="text"
            value={label.key}
            onChange={(e) => handleLabelChange(index, 'key', e.target.value)}
          />
          <input
            type="text"
            value={label.value}
            onChange={(e) => handleLabelChange(index, 'value', e.target.value)}
          />
          <input
            type="text"
            value={label.noticeId}
            onChange={(e) => handleLabelChange(index, 'noticeId', e.target.value)}
          />
          <button type="button" onClick={() => removeLabel(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={addLabel}>Add Label</button>
      <button type="submit">Submit</button>
    </form>
  )
}

export default Test