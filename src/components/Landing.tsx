import { Container, Grid, Flex, Button } from '@mantine/core'
import CodeEditorWindow from './CodeEditorWindow'
import OutputWindow from './OutputWindow'
import OutputDetails from './OutputDetail'
import { useState, useEffect } from 'react'
import { languageOptions } from '../constants/languageOptions'
import useKeyPress from '../hooks/useKeyPress'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'
import { defineTheme } from '../lib/defineTheme'

const REACT_APP_RAPID_API_HOST = 'https://judge0-ce.p.rapidapi.com'
const REACT_APP_RAPID_API_KEY = '52cbea632amsh4c77e81f6ef27d0p1bbf3fjsn7fab1bd652a5'
const REACT_APP_RAPID_API_URL = 'https://judge0-ce.p.rapidapi.com/submissions'

const javascriptDefault = `/**
* Problem: Binary Search: Search a sorted array for a target value.
*/

// Time: O(log n)
const binarySearch = (arr, target) => {
 return binarySearchHelper(arr, target, 0, arr.length - 1);
};

const binarySearchHelper = (arr, target, start, end) => {
 if (start > end) {
   return false;
 }
 let mid = Math.floor((start + end) / 2);
 if (arr[mid] === target) {
   return mid;
 }
 if (arr[mid] < target) {
   return binarySearchHelper(arr, target, mid + 1, end);
 }
 if (arr[mid] > target) {
   return binarySearchHelper(arr, target, start, mid - 1);
 }
};

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const target = 5;
console.log(binarySearch(arr, target));
`

const Landing = () => {
  const [code, setCode] = useState(javascriptDefault)
  const [outputDetails, setOutputDetails] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [theme, setTheme] = useState({ value: 'cobalt', label: 'Cobalt' })
  const [language, setLanguage] = useState(languageOptions[0])

  console.log(REACT_APP_RAPID_API_HOST, '++++++++++++++++++++')

  const enterPress = useKeyPress('Enter')
  const ctrlPress = useKeyPress('Control')

  const onSelectChange = (sl: any) => {
    console.log('selected Option...', sl)
    setLanguage(sl)
  }

  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log('enterPress', enterPress)
      console.log('ctrlPress', ctrlPress)
      handleCompile()
    }
  }, [ctrlPress, enterPress])
  const onChange = (action: string, data: string) => {
    switch (action) {
      case 'code': {
        setCode(data)
        break
      }
      default: {
        console.warn('case not handled!', action, data)
      }
    }
  }
  const handleCompile = () => {
    setProcessing(true)
    const formData = {
      language_id: language.id,
      // encode source code in base64
      source_code: btoa(code),
      // stdin: btoa(customInput)
      stdin: ''
    }
    const options = {
      method: 'POST',
      url: REACT_APP_RAPID_API_URL,
      params: { base64_encoded: 'true', fields: '*' },
      headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Host': REACT_APP_RAPID_API_HOST,
        'X-RapidAPI-Key': REACT_APP_RAPID_API_KEY,
        // 'x-rapidapi-ua': 'RapidAPI-Playground'
      },
      data: formData
    }

    axios
      .request(options)
      .then(function (response) {
        console.log('res.data', response.data)
        const token = response.data.token
        checkStatus(token)
      })
      .catch((err) => {
        const error = err.response ? err.response.data : err
        // get error status
        const status = err.response.status
        console.log('status', status)
        if (status === 429) {
          console.log('too many requests', status)

          showErrorToast(
            `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!`,
            10000
          )
        }
        setProcessing(false)
        console.log('catch block...', error)
      })
  }

  const checkStatus = async (token: string) => {
    const options = {
      method: 'GET',
      url: REACT_APP_RAPID_API_URL + '/' + token,
      params: { base64_encoded: 'true', fields: '*' },
      headers: {
        'X-RapidAPI-Host': REACT_APP_RAPID_API_HOST,
        'X-RapidAPI-Key': REACT_APP_RAPID_API_KEY,
        // 'x-rapidapi-ua': 'RapidAPI-Playground'
      }
    }
    try {
      const response = await axios.request(options)
      const statusId = response.data.status?.id

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token)
        }, 2000)
        return
      } else {
        setProcessing(false)
        setOutputDetails(response.data)
        showSuccessToast(`Compiled Successfully!`)
        console.log('response.data', response.data)
        return
      }
    } catch (err) {
      console.log('err', err)
      setProcessing(false)
      showErrorToast()
    }
  }

  function handleThemeChange(th: { value: string; label: string }) {
    const theme = th
    console.log('theme...', theme)

    if (['light', 'vs-dark'].includes(theme.value)) {
      setTheme(theme)
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme))
    }
  }
  useEffect(() => {
    defineTheme('oceanic-next').then((_) => setTheme({ value: 'oceanic-next', label: 'Oceanic Next' }))
  }, [])

  const showSuccessToast = (msg: string) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    })
  }
  const showErrorToast = (msg?: string, timer?: number) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: 'top-right',
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    })
  }
  return (
    <Container fluid>
      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Grid>
        <Grid.Col span={6}>
          <CodeEditorWindow code={code} onChange={onChange} language={language?.value} theme={theme.value} />
        </Grid.Col>
        <Grid.Col span={6}>
          <Flex mih={50} bg='rgba(0, 0, 0, .3)' gap='md' justify='center' align='center' direction='column' wrap='wrap'>
            <OutputWindow outputDetails={outputDetails} />
            {outputDetails && <OutputDetails outputDetails={outputDetails} />}
          </Flex>
          <Button onClick={handleCompile} disabled={!code}>
            Execute
          </Button>
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default Landing
