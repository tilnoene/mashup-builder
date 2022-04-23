import { TableContainer, TableHead, Table as MaterialTable, TableRow, TableCell, TableBody } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';

const Table = ({
  columns,
  rows,
  handleDelete,
}: {
  columns: any,
  rows: any,
  handleDelete: any,
}) => {
  return (
    <TableContainer sx={{ height: 373 }}>
      <MaterialTable stickyHeader aria-label='sticky table'>
        <TableHead>
          <TableRow>
            {columns.map((column: any) => (
              <TableCell
                key={column.id}
                align={column.align}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows
            .map((row: string, index: number) => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                  <TableCell align='left'>{row}</TableCell>
                  <TableCell align='right' style={{ cursor: 'pointer' }}><DeleteIcon onClick={() => handleDelete(index)} /></TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </MaterialTable>
    </TableContainer>
  );
}

export default Table;