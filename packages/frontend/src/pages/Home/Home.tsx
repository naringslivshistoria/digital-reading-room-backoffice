import { Grid, Typography } from '@mui/material'
import { useProfile, Account } from '../../common/hooks/useProfile'

const HomePage = () => {
  const { data: profile, isLoading: isProfileLoading } = useProfile()

  const account = profile?.account as Account

  return (
    <>
      <Typography variant="body2">
        Välkommen {isProfileLoading ? '' : account?.name}!
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
