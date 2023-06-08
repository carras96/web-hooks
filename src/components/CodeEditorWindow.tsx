import { useState } from 'react'
import { Paper } from '@mantine/core'

import Editor from '@monaco-editor/react'

const CodeEditorWindow = ({ onChange, language, code, theme }: any) => {
  const [value, setValue] = useState(code || '')

  const handleEditorChange = (value: any) => {
    setValue(value)
    onChange('code', value)
  }

  return (
    <Paper>
      <Editor
        height='85vh'
        width={`100%`}
        language={language || 'javascript'}
        value={value}
        theme={theme}
        defaultValue='// some comment'
        onChange={handleEditorChange}
      />
    </Paper>
  )
}
export default CodeEditorWindow
