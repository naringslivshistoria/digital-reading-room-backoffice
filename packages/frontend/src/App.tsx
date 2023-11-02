import {
  Box,
  CssBaseline,
  Grid,
  ThemeProvider,
  createTheme,
} from '@mui/material'
import { Routes, Route } from 'react-router-dom'
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query'
import { AxiosError } from 'axios'

import Home from './pages/Home/Home'
import { SiteHeader } from './components/SiteHeader'
import Login from './pages/Login/Login'
import CentraleSansRegular from '../assets/CentraleSans-Regular.woff2'
import PublicoTextItalic from '../assets/PublicoText-Italic.woff2'
import Users from './pages/Users/Users'
import { UserEdit } from './pages/Users/UserEdit'

const publicoTextItalic = {
  fontFamily: 'publicoTextItalic',
  fontStyle: 'italic',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    url(${PublicoTextItalic}) format('woff2')
  `,
}

const centraleSans = {
  fontFamily: 'centraleSans',
  fontStyle: 'regular',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    url(${CentraleSansRegular}) format('woff2')
  `,
}

declare module '@mui/material/styles' {
  interface PaletteOptions {
    neutral?: PaletteOptions['primary']
  }

  interface Palette {
    neutral: Palette['primary']
  }
}

const mdTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#de3831',
    },
    secondary: {
      main: '#53565a',
    },
    background: {
      default: '#fff',
    },
    neutral: {
      main: '#fff',
    },
  },
  typography: {
    h1: {
      fontSize: 40,
      fontFamily: 'publicoTextItalic',
      color: '#fff',
      fontStyle: 'italic',
    },
    h2: {
      fontSize: 24,
      fontFamily: 'publicoTextItalic',
      fontStyle: 'italic',
    },
    h3: {
      fontFamily: 'centraleSans',
      fontSize: 20,
    },
    h4: {
      fontFamily: 'centraleSans',
      fontSize: 14,
      textTransform: 'uppercase',
      color: '#53565a',
      fontWeight: 100,
    },
    body1: {
      fontFamily: 'centraleSans',
      fontSize: 16,
    },
    body2: {
      fontSize: 20,
      fontFamily: 'publicoTextItalic',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: [
          { '@font-face': publicoTextItalic },
          { '@font-face': centraleSans },
        ],
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: 'centraleSans',
          fontSize: 16,
        },
        head: {
          fontWeight: 600,
        },
      },
    },
  },
})

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if ((error as AxiosError).response?.status === 401) {
        if (query && query.queryKey && query.queryKey[0] === 'search') {
          location.replace('/logga-in?query=' + query.queryKey[1])
        } else {
          location.replace('/logga-in')
        }
      } else {
        console.log('An error occurred fetching data', error)
      }
    },
  }),
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={mdTheme}>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
          }}
        >
          <CssBaseline />
          <SiteHeader />
          <Grid container bgcolor="white">
            <Grid item xs={1} />
            <Routes>
              <Route path="/" element={<Home></Home>} />
              <Route path="/users/user" element={<UserEdit></UserEdit>} />
              <Route path="/users" element={<Users></Users>} />
              <Route path="/logga-in" element={<Login></Login>} />
            </Routes>
            <Grid item xs={1} />
          </Grid>
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
