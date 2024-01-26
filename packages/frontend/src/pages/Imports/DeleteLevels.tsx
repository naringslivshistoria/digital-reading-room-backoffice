import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

import { useIsLoggedIn } from '../../common/hooks/useIsLoggedIn'
import { useDeleteLevels } from './hooks/useLevels'

export const DeleteLevels = () => {
  useIsLoggedIn()
  const [levels, setLevels] = useState<string>('')
  const [error, setError] = useState<string | null>()
  const [response, setResponse] = useState<string | null>()
  const deleteLevelsMutation = useDeleteLevels()

  const deleteLevels = async () => {
    try {
      const result = await deleteLevelsMutation.mutateAsync({
        levelIds: levels,
      })

      setResponse(`${result.data.deleted} dokument raderade.`)
    } catch (axiosError: any) {
      setError(axiosError.response.data.error)
    }
  }

  return (
    <Grid item md={10} xs={10}>
      <Box sx={{ marginTop: 3, marginBottom: 2 }}>
        <Link to="/">
          <ChevronLeftIcon sx={{ marginTop: '-2px' }} /> Tillbaka
        </Link>
      </Box>
      <Divider sx={{ borderColor: 'red', marginBottom: '20px' }} />
      <Typography variant="h2">Radera levels</Typography>
      <Grid item md={12} xs={12}>
        Radera alla dokument som indexerats i läsesalen som hör till en eller
        flera level ids.
      </Grid>
      <Grid container spacing={4} sx={{ marginTop: 0, marginBottom: '40px' }}>
        <Grid item md={7} xs={12}>
          <TextField
            id="levels"
            label="Level ids"
            variant="outlined"
            multiline
            rows={4}
            value={levels}
            onChange={(event) => {
              setLevels(event.target.value)
            }}
            fullWidth
          />
        </Grid>
        <Grid item md={5} xs={12}>
          <p>
            Ange id:n för de levels vars dokument ska raderas från läsesalen.
            Att radera dokument kan inte ångras (de kan dock indexeras på nytt
            från Copmrima).
            <br />
          </p>
          <p>Exempel: 221, 21443, 51135</p>
        </Grid>
        <Grid item md={12} xs={12}>
          {error && <Alert severity="error">{error}</Alert>}
        </Grid>
        <Grid item md={12} xs={12}>
          {response && <Alert severity="info">{response}</Alert>}
        </Grid>
        <Grid item md={12} xs={12}>
          <Button onClick={deleteLevels} variant="contained">
            Radera
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
