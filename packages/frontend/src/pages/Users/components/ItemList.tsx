import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface ItemListProps {
  items: string[]
  onDelete: (item: string) => void
}

export const ItemList = ({ items, onDelete }: ItemListProps) => {
  return (
    <Box sx={{ flex: 1, marginTop: '16px' }}>
      <Table size="small">
        <TableBody>
          {items.map((item) => (
            <TableRow key={item}>
              <TableCell>{item}</TableCell>
              <TableCell align="right" sx={{ width: 50 }}>
                <IconButton
                  onClick={() => onDelete(item)}
                  size="small"
                  color="error"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
