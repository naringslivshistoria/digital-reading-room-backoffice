import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Link } from 'react-router-dom'

import { useIsLoggedIn } from '../../common/hooks/useIsLoggedIn'
import { useImports } from './hooks/useImports'
import { Import } from '../../common/types'
import { formatDate } from '../../common/util/dateFormatter'

const Imports = () => {
  useIsLoggedIn()
  const { data: data, isLoading: isLoading } = useImports()

  const createStatusString = (importInstance: Import) => {
    const unfinishedLevels = importInstance.levels?.filter((level) => {
      return !level.crawled
    })

    if (!unfinishedLevels || unfinishedLevels.length === 0) {
      return formatDate(importInstance.crawled)
    } else {
      return (
        ((importInstance.levels?.length ?? 0) - unfinishedLevels?.length ?? 0) +
        ' av ' +
        (importInstance.levels?.length ?? 0) +
        ' klara'
      )
    }
  }

  return (
    <>
      <Grid item md={10} xs={10} sx={{ paddingTop: 10 }}>
        <Stack
          rowGap={4}
          spacing={4}
          justifyContent="flex-start"
          display={'block'}
          sx={{ marginBottom: '40px' }}
        >
          <Typography variant="h2">Administrera importer</Typography>
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            {data == null && isLoading
              ? 'Importer hämtas...'
              : data == null && !isLoading
              ? 'Inga importer hittades'
              : ''}
          </Typography>
          <Link to="/imports/create">
            <Button variant="contained">Skapa import</Button>
          </Link>

          {data != null && data.length > 0 && (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Import</TableCell>
                    <TableCell align="left">Skapad</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="left">Indexerade</TableCell>
                    <TableCell align="left">Misslyckade</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((indexBatch) => (
                    <TableRow
                      key={indexBatch.importName}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { backgroundColor: 'lightgray' },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Link
                          to={`import?id=${indexBatch.importName}`}
                          state={{ import: indexBatch }}
                        >
                          <VisibilityIcon /> {indexBatch.importName}
                        </Link>
                      </TableCell>
                      <TableCell align="left">
                        <Box
                          sx={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            maxWidth: '350px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatDate(indexBatch.created)}
                        </Box>
                      </TableCell>
                      <TableCell align="left" width={'25%'}>
                        <Box
                          sx={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            maxWidth: '150px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {createStatusString(indexBatch)}
                        </Box>
                      </TableCell>
                      <TableCell align="left">
                        {indexBatch.successful?.toString()}
                      </TableCell>
                      <TableCell align="left">{indexBatch.failed}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </Grid>
    </>
  )
}

export default Imports
