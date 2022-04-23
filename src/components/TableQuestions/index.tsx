import {
  TableContainer,
  TableHead,
  Table as MaterialTable,
  TableRow,
  TableCell,
  TableBody,
  Skeleton,
} from '@mui/material';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// TODO: tipagem global
type Question = {
  name: string;
  rating: number;
  url: string;
};

const TableQuestions = ({
  columns,
  questions,
  showRatings,
}: {
  columns: any;
  questions: Question[];
  showRatings: boolean;
}) => {
  return (
    <TableContainer sx={{ height: 373 }}>
      <MaterialTable stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {columns.map((column: any) => (
              <TableCell key={column.id} align={column.align}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {questions.map((row, index: number) => (
            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
              <TableCell align="left">
                <ContentCopyIcon
                  sx={{ fontSize: 20, marginBottom: '-5px', cursor: 'pointer' }}
                  fontSize="small"
                  onClick={() => navigator.clipboard.writeText(row.name)}
                />
                <a
                  style={{
                    textDecoration: 'none',
                    color: 'black',
                    paddingLeft: '10px',
                  }}
                  href={row.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {row.name}
                </a>
              </TableCell>
              <TableCell align="right" sx={{ display: 'flex' }}>
                {showRatings ? (
                  row.rating
                ) : (
                  <Skeleton animation={false} style={{ width: '30px' }} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </MaterialTable>
    </TableContainer>
  );
};

export default TableQuestions;
