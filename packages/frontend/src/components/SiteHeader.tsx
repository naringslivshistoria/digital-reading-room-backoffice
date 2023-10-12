import { Grid, Stack, Typography } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'

import header from '../../assets/header.jpg'
import cfnLogo from '../../assets/cfn-logo.png'

export const SiteHeader = () => (
  <Grid
    container
    direction="row"
    sx={{ height: { xs: '240px', sm: '285px' }, bgcolor: 'primary.main' }}
  >
    <Grid item md={1} xs={1} />
    <Grid item md={6} xs={11} sx={{ paddingTop: '20px' }}>
      <Link to="https://naringslivshistoria.se">
        <Stack direction="row" alignItems="flex-end">
          <img src={cfnLogo} width="50px" alt="CFN logotyp"></img>
          <Typography
            sx={{
              color: 'white',
              fontSize: { xs: '12px', sm: '14px' },
              marginBottom: '-4px',
              marginLeft: '2px',
            }}
          >
            En tjänst från Centrum för Näringslivshistoria
          </Typography>
        </Stack>
      </Link>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ paddingTop: '72px' }}
      >
        <Link to="/">
          <Stack direction="row">
            <Typography
              variant="h1"
              sx={{
                marginBottom: '10px',
                fontSize: { xs: '27px', sm: '40px' },
              }}
            >
              Backoffice - Digital läsesal
            </Typography>
            &nbsp;
            <Typography
              variant="h2"
              sx={{
                marginTop: { xs: '8px', sm: '12px' },
                marginLeft: 1,
                color: 'white',
                fontSize: { xs: '17px', sm: '24px' },
              }}
            >
              (beta)
            </Typography>
          </Stack>
        </Link>
      </Stack>
    </Grid>
    <Grid
      item
      md={5}
      xs={0}
      style={{
        backgroundColor: 'red',
        backgroundImage: `url(${header})`,
        backgroundSize: 'cover',
      }}
      sx={{ height: '100%' }}
    ></Grid>
  </Grid>
)
