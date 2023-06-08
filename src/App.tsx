import Landing from './components/Landing'
import { MantineProvider, AppShell, Navbar, Header } from '@mantine/core'
import AppShellWrapp from './layout'

function App() {
  return (
    <MantineProvider
      theme={{
        components: {
          Container: {
            defaultProps: {
              sizes: {
                xs: 540,
                sm: 720,
                md: 960,
                lg: 1140,
                xl: 1320
              }
            }
          }
        }
      }}
    >
      <AppShellWrapp />
    </MantineProvider>
  )
}

export default App
