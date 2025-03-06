import { Chip, Tooltip } from '@mui/material'

const DepositorChip = ({
  depositor,
  truncate = false,
  showTooltip = true,
}: {
  depositor: string
  truncate?: boolean
  showTooltip?: boolean
}) => {
  const chip = (
    <Chip
      label={depositor}
      variant="outlined"
      size="small"
      sx={
        truncate
          ? {
              maxWidth: 150,
              '.MuiChip-label': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
            }
          : {
              maxWidth: 'none',
              height: 'auto',
              '& .MuiChip-label': {
                overflow: 'visible',
                whiteSpace: 'normal',
                lineHeight: 1.4,
                py: 0.5,
                display: 'block',
                wordBreak: 'break-word',
              },
            }
      }
    />
  )

  return showTooltip && truncate ? (
    <Tooltip title={depositor} arrow>
      {chip}
    </Tooltip>
  ) : (
    chip
  )
}

export default DepositorChip
