import { Box, useTheme } from '@mui/material'
import DepositorChip from './DepositorChip'

const DepositorTooltip = ({ depositors }: { depositors: string[] }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        maxWidth: 450,
        p: 1.5,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
      <Box
        sx={{
          mb: 1.5,
          fontWeight: 'medium',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
          pb: 0.5,
        }}
      >
        Alla deponenter
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.75,
          maxHeight: '260px',
          overflow: 'auto',
          pr: 0.5,
        }}
      >
        {depositors.map((dep) => (
          <DepositorChip
            key={dep}
            depositor={dep}
            truncate={false}
            showTooltip={false}
          />
        ))}
      </Box>
    </Box>
  )
}

export default DepositorTooltip
