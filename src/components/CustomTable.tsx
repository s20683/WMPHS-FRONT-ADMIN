import React from 'react';
import { styled } from "@mui/material/styles";
import {DataGrid, GridColDef, GridDensity, GridRowParams} from "@mui/x-data-grid";
import TableToolbar from "./TableToolbar";
export const TableBaseStyle = styled(DataGrid)(() => ({
    disableSelectionOnClick: true,
    disableColumnFilter: true,
    disableColumnSelector: true,
    disableDensitySelector: true,
    cursor: "pointer",
    density: "compact",
    '& .MuiDataGrid-cell:focus-within': {
        outline: 'none'
    },
    '& .MuiDataGrid-row:hover': {
        backgroundColor: '#fff2e9',
    },
    '& .MuiDataGrid-row.Mui-selected': {
        backgroundColor: '#ffeee2',
        borderColor: 'black'
    },
    '& .MuiDataGrid-row.Mui-selected:hover': {
        backgroundColor: '#ffe0cc',
    }
}));

interface Props {
    tableLabel?: string;
    columns: GridColDef[],
    rows: any[]
    density?: GridDensity;
    loading?: boolean;
    toolbar?: boolean;
    checkboxSelection?: boolean;
    customToolbarButton?: React.ReactNode;
    columnsFilter?: boolean;
    onRowClick?: (params: GridRowParams) => void;
}
const CustomTable = ({tableLabel = "", columns, rows, density = "compact", loading = false, toolbar = true, columnsFilter=true,checkboxSelection = false, customToolbarButton, onRowClick} : Props) => {
    const handleRowClick = (params: GridRowParams) => {
        if (onRowClick) {
            onRowClick(params);
        }
    };
    return (
        <TableBaseStyle
            columns={columns}
            rows={rows}
            density={density}
            checkboxSelection={checkboxSelection}
            loading={loading}
            onRowClick={handleRowClick}
            slots={{
                toolbar: toolbar ? () => <TableToolbar/> : undefined,
            }}
        />
    );
};

export default CustomTable;
