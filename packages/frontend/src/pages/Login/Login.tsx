import {
  Alert,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { useState } from 'react'

const backendUrl = import.meta.env.VITE_BACKEND_URL || '/api'

const Login = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<boolean>(false)

  const doLogin = async () => {
    try {
      const result = await axios(`${backendUrl}/auth/login`, {
        method: 'post',
        data: {
          username,
          password,
        },
      })

      if (result.status === 200) {
        location.href = '/'
      } else {
        setError(true)
      }
    } catch (error) {
      setError(true)
    }
  }

  return (
    <>
      <Grid item md={4} xs={10} sx={{ paddingTop: 10 }}>
        <Stack rowGap={4} justifyContent="flex-start">
          <Typography variant="h2">Logga in</Typography>
          <TextField
            id="username"
            onChange={(e) => {
              setUsername(e.target.value)
            }}
            value={username}
            label="Användarnamn"
            variant="standard"
          />
          <TextField
            id="password"
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            value={password}
            label="Lösenord"
            variant="standard"
            type="password"
          />
          <Button
            variant="text"
            onClick={doLogin}
            sx={{
              marginTop: 2,
              borderRadius: 0,
              bgcolor: '#53565a',
              color: 'white',
              '&:hover': { backgroundColor: 'secondary.main', color: 'white' },
            }}
          >
            Logga in
          </Button>
          {error && <Alert severity="error">Inloggning misslyckades!</Alert>}
        </Stack>
      </Grid>
      <Grid item md={6} xs={0} sx={{ paddingTop: 10 }} />
    </>
  )
}

export default Login
