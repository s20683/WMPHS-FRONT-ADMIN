import React from 'react';
import { styled } from "@mui/material/styles";
import {GridToolbarContainer, GridToolbarQuickFilter} from "@mui/x-data-grid";

export const TableToolbarStyle = styled(GridToolbarContainer)(() => ({
    disableRowSelectionOnClick: true,
    density: "compact",
}));

export const CustomQuickFilter = styled(GridToolbarQuickFilter)(({ theme }) => ({
    marginLeft: 'auto',
    '.MuiButton-startIcon': {
        color: 'white !important',
    },
    '.MuiInputBase-input': {
        color: 'white !important',
    },
    '.MuiSvgIcon-root': {
        color: 'white !important',
    },
}));
const TableToolbar = () => {
    return (
        <TableToolbarStyle
            sx={{
                backgroundColor: "#2d2d2d",
                paddingTop: 1,
                paddingBottom: 1,
                color:"white"
            }}>
            <CustomQuickFilter/>
        </TableToolbarStyle>
    );
};

export default TableToolbar;
