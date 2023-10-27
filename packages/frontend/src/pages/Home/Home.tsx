import { Grid, Typography, Link, MenuItem } from '@mui/material'
import { useIsLoggedIn } from '../../common/hooks/useIsLoggedIn'

const HomePage = () => {
  useIsLoggedIn()

  return (
    <>
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
    </>
  )
}

export default HomePage
