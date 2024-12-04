import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  useTheme,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

import { ItemListProps } from '../../../common/types'

export const ItemList = ({ items, onDelete }: ItemListProps) => {
  const theme = useTheme()

  const getLevelColors = (levels: number) => {
    const baseColors = [300, 500, 700, 900] as const
    return baseColors
      .slice(-levels)
      .map(
        (shade) => theme.palette.grey[shade as keyof typeof theme.palette.grey]
      )
  }

  return (
    <Box sx={{ flex: 1, marginTop: '16px' }}>
      <Table size="small">
        <TableBody>
          {items.map((item) => {
            const parts = item.split('>')

            return (
              <TableRow key={item}>
                <TableCell>
                  {parts.map((part, i, arr) => (
                    <Box
                      key={i}
                      sx={{ display: 'inline-flex', alignItems: 'center' }}
                    >
                      <span
                        style={{
                          color: getLevelColors(parts.length)[i],
                        }}
                      >
                        {part}
                      </span>
                      {i < arr.length - 1 && (
                        <KeyboardArrowRightIcon
                          sx={{
                            mx: 0.5,
                            color: getLevelColors(parts.length)[i + 1],
                          }}
                          fontSize="small"
                        />
                      )}
                    </Box>
                  ))}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => onDelete(item)}
                    size="small"
                    color="error"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Box>
  )
}
