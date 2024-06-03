import React from 'react';
import CustomTable from "../components/CustomTable";
import {GridCellParams, GridColDef} from "@mui/x-data-grid";
import {Grid} from "@mui/material";

const OrderPanel = () => {

    const columns : GridColDef[] = [
        {field: 'wmsId', headerName: "Zlecenie", flex: 2, headerClassName: 'header-cell'},
        {field: 'palletPosition', headerName: "Na palecie", flex: 2, headerClassName: 'header-cell'},
        {field: 'barcode', headerName: "Kod Pojemnika", flex: 4, headerClassName: 'header-cell',},
        {field: 'state', headerName: "Status", flex: 3, headerClassName: 'header-cell'},
        {field: 'priority', headerName: "Priorytet", flex: 3, headerClassName: 'header-cell'},
        {field: 'buffer', headerName: "Bufor", flex: 1, headerClassName: 'header-cell'},
        {field: 'lastLocation', headerName: "Ostatnia Lokacja", flex: 3, headerClassName: 'header-cell'},
        {field: 'timestamp', headerName: "Czas Skanu", flex: 4, headerClassName: 'header-cell'}
    ];

    const data = [
        {id: 1,wmsId: '92921921', palletPosition: 2, barcode: "D1-10000000001", state: "Spaletyzowany", priority:1 , buffer: "43", lastLocation: "R2-1-PAL",
            timestamp:"2024-04-24 14:27:21", progress: 55},
        {id: 2,wmsId: '92921922', palletPosition: 1, barcode: "D1-10000000002", state: "W kompletacji", priority:1 , buffer: "43", lastLocation: "BA_OUT",
            timestamp:"2024-04-24 14:27:21", progress: 77},
        {id: 3,wmsId: '92921923', palletPosition: 1, barcode: "D1-10000000003", state: "Kontrola jakości", priority:1122121 , buffer: "", lastLocation: "checking_in",
            timestamp:"2024-04-24 14:27:21", progress: 100},
        {id: 4,wmsId: '92921924', palletPosition: 1, barcode: "D1-10000000013", state: "Kontrola jakości", priority:1122121 , buffer: "", lastLocation: "checking_in",
            timestamp:"2024-04-24 14:27:21", progress: 100},
        {id: 5,wmsId: '92921925', palletPosition: 1, barcode: "D1-10000000023", state: "Kontrola jakości", priority:1122121 , buffer: "", lastLocation: "checking_in",
            timestamp:"2024-04-24 14:27:21", progress: 100},
        {id: 6,wmsId: '92921926', palletPosition: 1, barcode: "D1-10000000033", state: "Kontrola jakości", priority:2 , buffer: "", lastLocation: "checking_in",
            timestamp:"2024-04-24 14:27:21", progress: 100},
        {id: 7,wmsId: '92921927', palletPosition: 1, barcode: "D1-10000000043", state: "Kontrola jakości", priority:1122121 , buffer: "", lastLocation: "checking_in",
            timestamp:"2024-04-24 14:27:21", progress: 100},
        {id: 8,wmsId: '92921928', palletPosition: 1, barcode: "D1-10000000053", state: "Kontrola jakości", priority:1122121 , buffer: "", lastLocation: "",
            timestamp:"2024-04-24 14:27:21", progress: 0},
        {id: 9,wmsId: '92921929', palletPosition: 1, barcode: "D1-10000000063", state: "Kontrola jakości", priority:1122121 , buffer: "", lastLocation: "",
            timestamp:"2024-04-24 14:27:21", progress: 0},
        {id: 10,wmsId: '92921930', palletPosition: 1, barcode: "D1-10000000073", state: "Kontrola jakości", priority:1122121 , buffer: "", lastLocation: "",
            timestamp:"2024-04-24 14:27:21", progress: 0},
        {id: 11,wmsId: '92921931', palletPosition: 1, barcode: "D1-10000000083", state: "Kontrola jakości", priority:1122121 , buffer: "", lastLocation: "",
            timestamp:"2024-04-24 14:27:21", progress: 0}
    ]
    return (
        <Grid container>
            <Grid item xs={6} sx={{padding: "5px", height: "70vh"}}>
                <CustomTable rows={data} columns={columns}/>

            </Grid>
            <Grid item xs={6} sx={{padding: "5px", height: "70vh"}}>
                <CustomTable rows={data} columns={columns}/>

            </Grid>
        </Grid>
    );
};

export default OrderPanel;
