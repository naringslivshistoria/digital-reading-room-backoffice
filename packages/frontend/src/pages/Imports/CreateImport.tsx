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
import { Link, useNavigate } from 'react-router-dom'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

import { useIsLoggedIn } from '../../common/hooks/useIsLoggedIn'
import { useCreateImport } from './hooks/useImports'

export const CreateImport = () => {
  useIsLoggedIn()
  const navigate = useNavigate()
  const [importName, setImportName] = useState<string>('')
  const [levels, setLevels] = useState<string>('')
  const [error, setError] = useState<string | null>()
  const createImportMutation = useCreateImport()

  const createImport = async () => {
    try {
      await createImportMutation.mutateAsync({
        name: importName,
        levelIds: levels,
      })
      navigate('/imports')
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
      <Typography variant="h2">Skapa import</Typography>
      <Grid item md={12} xs={12}>
        När en import har skapats läggs den i en kö. Kön hanteras av en
        applikation som startar en gång per timme och arbetar till dessa att kön
        är tom.
      </Grid>
      <Grid container spacing={4} sx={{ marginTop: 0, marginBottom: '40px' }}>
        <Grid item md={7} xs={12}>
          <TextField
            id="name"
            label="Namn"
            variant="outlined"
            value={importName}
            onChange={(event) => {
              setImportName(event.target.value)
            }}
            fullWidth
          />
        </Grid>
        <Grid item md={5} xs={12}>
          Namn på importen. Används endast som information för administratörer.
        </Grid>
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
            Ange id:n för de levels som ska läggas till i läsesalen. Levels som
            redan finns kommer få sina dokument uppdaterade med metadata från
            Comprima (OCR-text kommer inte att ändras).
            <br />
          </p>
          <p>Exempel: 221, 21443, 51135</p>
        </Grid>
        <Grid item md={12} xs={12}>
          {error && <Alert severity="error">{error}</Alert>}
        </Grid>
        <Grid item md={12} xs={12}>
          <Button onClick={createImport} variant="contained">
            Spara
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
