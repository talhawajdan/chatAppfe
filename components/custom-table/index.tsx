"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useTheme } from "@mui/material/styles";
import {
  Grid,
  Pagination,
  TableHead,
  TableContainer,
  TableBody,
  Table,
  Box,
  Typography,
} from "@mui/material";
import PaginationItem from "@mui/material/PaginationItem";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import type { CustomTableProps } from "./custom-table.types";

import { StyledTableCell, StyledTableRow, styles } from "./custom-table.styles";

import {
  TableSkeleton,
  IsFetching,
  NoContentFound,
} from "@components/table-components";

// ----------------------------------------------------------------------
// constant
const EMPTY_ARRAY: [] = [];

const headerFunction = (): JSX.Element => <Box>Sr.</Box>;

export const CustomTable = forwardRef(function CustomTable(
  {
    columns,
    data,
    isFetching = false,
    isLoading = false,
    isError = false,
    isSuccess = false,
    totalPages = 1,
    currentPage = 1,
    onPageChange,
    onSortByChange,
    isPagination = true,
    tableContainerSX = {},
    rootSX = {},
    showSerialNo = false,
    onSelected = () => {
      return null;
    },
    paginationProps,
  }: CustomTableProps,
  ref
): JSX.Element {
  //STATS USE THEMES....

  const [rowSelection, setRowSelection] = useState({});

  const theme = useTheme();

  let columnsData = columns;
  // Handling sort using useRef
  const refSortData = (() => {
    const sortDataMap: any = {};
    for (const colData of columns) {
      if (colData.isSortable) sortDataMap[colData.id] = 0;
    }
    return sortDataMap;
  })();

  const sortRef = useRef(refSortData);

  const handleSortBy: any = (colId: string) => {
    sortRef.current[colId]++;
    if (sortRef.current[colId] % 2 === 1)
      onSortByChange({ id: colId, sortOrder: 1 });
    else onSortByChange({ id: colId, sortOrder: -1 });
  };

  const isSorted: any = (colId: string) => {
    return sortRef.current[colId] % 2 === 1;
  };
  if (showSerialNo) {
    columnsData = [
      ...(columns[0]?.id === "select"
        ? [
            columns[0],
            {
              accessorFn: (row: any) => row,
              id: "srNo",
              cell: ({ row, index }: any): JSX.Element => {
                const recordsPerPage = 10;
                let rowIndex = Number(index + 1);
                if (isNaN(rowIndex)) {
                  rowIndex = Number(row.id);
                }
                if (isNaN(rowIndex) || isNaN(currentPage)) {
                  return <Box>Invalid</Box>;
                }
                const serialNumber =
                  (currentPage - 1) * recordsPerPage + rowIndex + 1;
                return <Box>{serialNumber}</Box>;
              },
              header: () => headerFunction(),
              isSortable: false,
            },
            ...columns.slice(1),
          ]
        : [
            {
              accessorFn: (row: any) => row,
              id: "srNo",
              cell: ({ row, index }: any): JSX.Element => {
                const recordsPerPage = 10;
                let rowIndex = Number(index + 1);
                if (isNaN(rowIndex)) {
                  rowIndex = Number(row.id);
                }
                if (isNaN(rowIndex) || isNaN(currentPage)) {
                  return <Box>Invalid</Box>;
                }
                const serialNumber =
                  (currentPage - 1) * recordsPerPage + rowIndex + 1;
                return <Box>{serialNumber}</Box>;
              },
              header: () => headerFunction(),
              isSortable: false,
            },
            ...columns,
          ]),
    ];
  } else null;

  const table = useReactTable({
    data: data ?? EMPTY_ARRAY,
    columns: columnsData,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });
  onSelected(table.getSelectedRowModel().flatRows);
  //reset on mutations
  useImperativeHandle(
    ref,
    () => ({
      resetRowSelection: () => {
        setRowSelection({});
      },
      onSelectedRow: () => table.getSelectedRowModel().flatRows,
      table,
    }),
    [setRowSelection, table]
  );

  if (isLoading) return <TableSkeleton />;
  return (
    <Grid container sx={{ position: "relative", ...rootSX }}>
      <IsFetching isFetching={isFetching} />
      <Grid xs={12} item>
        {/* Table Container */}
        <Box sx={{ overflowX: "auto" }}>
          <TableContainer sx={styles.tableContainer(tableContainerSX, theme)}>
            <Table stickyHeader>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <StyledTableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header: any) => (
                      <StyledTableCell key={header.id}>
                        <Box
                          onClick={() =>
                            header.column.columnDef.isSortable &&
                            handleSortBy(header?.id)
                          }
                          sx={styles.cell}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {header.column.columnDef.isSortable &&
                            !isSorted(header.id) && <KeyboardArrowDownIcon />}
                          {header.column.columnDef.isSortable &&
                            isSorted(header.id) && <KeyboardArrowUpIcon />}
                        </Box>
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                ))}
              </TableHead>

              {isSuccess && table.getRowModel().rows.length > 0 && (
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <StyledTableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <StyledTableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  ))}
                </TableBody>
              )}
            </Table>
            {(isError || table.getRowModel().rows.length === 0) && (
              <Grid container sx={styles.error(theme)}>
                <Grid item >
                  <NoContentFound />
                </Grid>
              </Grid>
            )}
          </TableContainer>
        </Box>

        {/* Pagination */}
        <Grid container>
          <Grid xs={12} item>
            {isSuccess && Boolean(table?.getRowModel()?.rows?.length) && (
              <Box
                display="flex"
                alignItems="center"
                sx={styles.currentPageBox}
              >
                <Box>
                  {isPagination && (
                    <Typography
                      sx={styles.currentPage(theme)}
                      variant="subtitle1"
                    >
                      Showing {currentPage} of {totalPages}
                    </Typography>
                  )}
                </Box>

                {isPagination && (
                  <Box ml="auto">
                    <Pagination
                      sx={styles.pagination}
                      renderItem={(item) => (
                        <PaginationItem
                          slots={{
                            previous: () => <>Previous</>,
                            next: () => <>Next</>,
                          }}
                          {...item}
                        />
                      )}
                      size="small"
                      variant="outlined"
                      shape="rounded"
                      count={totalPages}
                      page={currentPage}
                      onChange={(e, page) => {
                        onPageChange(page);
                      }}
                      {...paginationProps}
                    />
                  </Box>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
});
