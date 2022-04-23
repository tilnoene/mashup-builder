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
import LinkIcon from '@mui/icons-material/Link';

type Problem = {
  name: string;
  rating: number;
  url: string;
};

const TableProblems = ({
  columns,
  problems,
  showRatings,
}: {
  columns: any;
  problems: Problem[];
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
          {problems.map((row, index: number) => (
            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
              <TableCell align="left">
                <ContentCopyIcon
                  sx={{ fontSize: 20, marginBottom: '-5px', cursor: 'pointer', marginRight: '6px' }}
                  onClick={() => navigator.clipboard.writeText(row.name)}
                />

                <a 
                  href={row.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'none', marginBottom: '-5px', color: 'black' }}
                >
                  <LinkIcon 
                    sx={{ fontSize: 20, marginBottom: '-5px', cursor: 'pointer', marginRight: '6px' }}
                  />
                </a>

                {row.name}
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

export default TableProblems;
