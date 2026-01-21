import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

import { useIsLoggedIn } from '../../common/hooks/useIsLoggedIn'
import { ImportLevel } from '../../common/types'

const ImportDetails = () => {
  useIsLoggedIn()
  const location = useLocation()
  const editImport = location.state.import
  const [showLevels, setShowLevels] = useState<boolean>()

  return (
    editImport && (
      <>
        <Grid item md={10} xs={10}>
          <Box sx={{ marginTop: 3, marginBottom: 2 }}>
            <Link to="/imports">
              <ChevronLeftIcon sx={{ marginTop: '-2px' }} /> Importer
            </Link>
          </Box>

          <Divider sx={{ borderColor: 'red', marginBottom: '20px' }} />
          <Typography variant="h2">Visa import</Typography>
          <Grid
            container
            spacing={4}
            sx={{ marginTop: 0, marginBottom: '40px' }}
          >
            <Grid item md={3} xs={6}>
              <b>Namn</b>
            </Grid>
            <Grid item md={4} xs={6}>
              {editImport.importName}
            </Grid>
            <Grid item md={5} xs={12}>
              Namn på importen (projektnamn, deponent, arkivbildare eller
              liknande)
            </Grid>
            <Grid item md={3} xs={6}>
              <b>Skapad</b>
            </Grid>
            <Grid item md={4} xs={6}>
              {editImport.created as string}
            </Grid>
            <Grid item md={5} xs={12}>
              Tidpunkt då indexeringen skapades
            </Grid>
            <Grid item md={3} xs={6}>
              <b>Slutförd</b>
            </Grid>
            <Grid item md={4} xs={6}>
              {editImport.crawled as string}
            </Grid>
            <Grid item md={5} xs={12}>
              Tidpunkt då indexeringen av alla levels slutfördes
            </Grid>
            <Grid item md={3} xs={6}>
              <b>Indexerade dokument</b>
            </Grid>
            <Grid item md={4} xs={6}>
              {editImport.successful}
            </Grid>
            <Grid item md={5} xs={12}>
              Antal dokument som indexerats
            </Grid>
            <Grid item md={3} xs={6}>
              <b>Fel</b>
            </Grid>
            <Grid item md={4} xs={6}>
              {editImport.error}
            </Grid>
            <Grid item md={5} xs={12}>
              Fel som uppstått vid indexeringen.
            </Grid>
            <Grid item md={12} xs={12}>
              <Button
                onClick={() => {
                  setShowLevels(!showLevels)
                }}
              >
                Detaljerad information om levels
              </Button>
            </Grid>
            {showLevels && (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        Level-id
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        Slutförd
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        Importerade dokument
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>Fel</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {editImport.levels.map((level: ImportLevel) => (
                      <TableRow key={level.level}>
                        <TableCell>{level.level}</TableCell>
                        <TableCell>
                          {level.crawled as unknown as string}
                        </TableCell>
                        <TableCell>{level.successful}</TableCell>
                        <TableCell>{level.error ? JSON.stringify(level.error) : ''}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </Grid>
      </>
    )
  )
}

export default ImportDetails
