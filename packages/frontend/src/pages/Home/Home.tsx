import { Grid, Typography, Link } from '@mui/material'

import { useIsLoggedIn } from '../../common/hooks/useIsLoggedIn'

const HomePage = () => {
  useIsLoggedIn()

  return (
    <>
      <Grid item md={6} xs={10} sx={{ paddingTop: 10 }}>
        <Typography variant="h2">Användare</Typography>
        <p>
          <Link href="/users" title="Användare">
            <b>Administrera användare</b>
          </Link>
        </p>
        <Typography variant="h2" sx={{ marginTop: '10px' }}>
          Indexerat innehåll
        </Typography>
        <p>
          <Link href="/imports" title="Importer">
            <b>Administrera importer</b>
          </Link>
        </p>
        <p>
          <Link href="/deletelevels" title="Ta bort levels">
            <b>Ta bort levels</b>
          </Link>
        </p>
      </Grid>
    </>
  )
}

export default HomePage
