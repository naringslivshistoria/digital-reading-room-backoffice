import { Grid, Typography, Link } from '@mui/material'

import { useIsLoggedIn } from '../../common/hooks/useIsLoggedIn'

const HomePage = () => {
  useIsLoggedIn()

  return (
    <>
      <Grid item md={6} xs={10} sx={{ paddingTop: 10 }}>
        <Typography variant="body2">Välkommen!</Typography>
        <br />
        <Typography variant="body1">
          I backoffice för Digital läsesal kan du hantera de användare som har
          tillgång till de olika arkiven samt lägga upp nya användare.
        </Typography>
        <br />
        <Link href="/users" title="Användare">
          <b>Administrera användare</b>
        </Link>
      </Grid>
    </>
  )
}

export default HomePage
