import { useState } from 'react'
import { JsonSchemaEditor } from '@quiet-front-end/json-schema-editor-antd'

export default () => {
  const [jsonData, setJsonData] = useState({})
  return (
    <JsonSchemaEditor
      mock={true}
      data={jsonData}
      onChange={(data) => {
        setJsonData(data)
      }}
    />
  )
}