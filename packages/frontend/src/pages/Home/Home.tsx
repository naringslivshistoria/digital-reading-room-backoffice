import { Grid, Typography } from '@mui/material'
import { useUsers } from '../../common/hooks/useUsers'
import { useIsLoggedIn } from '../../common/hooks/useIsLoggedIn'

const HomePage = () => {
  useIsLoggedIn()

  // const { data: users, isLoading: isLoading } = useUsers()
  // const account = profile?.account as Account

  return (
    <>
      <Typography variant="body2">
        Välkommen!
        {/* Välkommen {isProfileLoading ? '' : account?.name}! */}
      </Typography>
      <br />
      <Typography variant="body2">
        I backoffice för Digital läsesal kan du hantera de användare som har
        tillgång till de olika arkiven samt lägga upp nya användare.
      </Typography>
    </>
  )
}

export default HomePage
