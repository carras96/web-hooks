import { get } from 'lodash'
import { Box, Text, Paper } from '@mantine/core'

const OutputWindow = ({ outputDetails }: any) => {
  const getOutput = () => {
    // const statusId = outputDetails?.status?.id
    const statusId = get(outputDetails, 'status.id', 0)

    if (statusId === 6) {
      // compilation error
      return <pre className='px-2 py-1 font-normal text-xs text-red-500'>{atob(outputDetails?.compile_output)}</pre>
    } else if (statusId === 3) {
      return (
        <pre className='px-2 py-1 font-normal text-xs text-green-500'>
          {atob(outputDetails.stdout) !== null ? `${atob(outputDetails.stdout)}` : null}
        </pre>
      )
    } else if (statusId === 5) {
      return <pre className='px-2 py-1 font-normal text-xs text-red-500'>{`Time Limit Exceeded`}</pre>
    } else {
      return <pre className='px-2 py-1 font-normal text-xs text-red-500'>{atob(outputDetails?.stderr)}</pre>
    }
  }
  return (
    <Paper style={{ width: '100%' }}>
      <Text>Output</Text>
      <Box>{outputDetails ? <>{getOutput()}</> : null}</Box>
    </Paper>
  )
}

export default OutputWindow
