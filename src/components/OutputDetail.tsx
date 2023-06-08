import { Text, Paper } from '@mantine/core'

const OutputDetails = ({ outputDetails }: any) => {
  return (
    <Paper style={{ width: '100%' }}>
      <Text>
        Status: <Text>{outputDetails?.status?.description}</Text>
      </Text>
      <Text>
        Memory: <Text>{outputDetails?.memory}</Text>
      </Text>
      <Text>
        Time: <Text>{outputDetails?.time}</Text>
      </Text>
    </Paper>
  )
}

export default OutputDetails
