import React, {useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import ContainedButton from "../components/ContainedButton";
import CustomTable from "../components/CustomTable";
import axios from "axios";
import {GridCellParams, GridColDef} from "@mui/x-data-grid";
import AddStockModal from "./AddStockModal";
import Swal from "sweetalert2";
import { differenceInDays, parseISO } from 'date-fns';


interface Stock {
    id: number;
    quantity: number;
    allocatedQuantity: number;
    notAllocatedQuantity: number;
    productId: number;
    expDate: string;
    productName: string;
    empty: boolean;
}
export interface CompressedStock {
    id: number;
    quantity: number;
    allocatedQuantity: number;
    notAllocatedQuantity: number;
    productId: number;
    productName: string;
    productVolume: number;
    empty: boolean;
}
const StocksPanel = () => {
    const [openModal, setOpenModal] = useState(false);
    const [stocks, setStocks] = useState<Stock[]>([])
    const [compressedStocks, setCompressedStocks] = useState<Stock[]>([])
    const [result, setResult] = useState<string>("")
    function loadStocks(){
        axios.get("/gui2wmphs/getStocks")
            .then(response =>{
                console.log(response)
                if (response?.data)
                    setStocks(response.data)
            })
            .catch(error => console.error('Error fetching stocks:', error));
    }
    function loadSCompressedStocks(){
        axios.get("/gui2wmphs/getCompressedStocks")
            .then(response =>{
                console.log(response)
                if (response?.data)
                    setCompressedStocks(response.data)
            })
            .catch(error => console.error('Error fetching compressedStocks:', error));
    }
    function reloadData(){
        loadStocks()
        loadSCompressedStocks()
    }

    useEffect(() => {
        reloadData()
        const intervalId = setInterval(reloadData, 2000);
        return () => clearInterval(intervalId);
    }, []);

    const getDaysToExpiry = (expDate: string) => {
        const today = new Date();
        const expiryDate = parseISO(expDate);
        return differenceInDays(expiryDate, today);
    };

    const columns : GridColDef[] = [
        {field: 'id', headerName: "Id", flex: 2, headerClassName: 'header-cell'},
        {field: 'productName', headerName: "Produkt", flex: 4, headerClassName: 'header-cell',},
        {field: 'quantity', headerName: "Ilość", flex: 2, headerClassName: 'header-cell'},
        {field: 'allocatedQuantity', headerName: "Zaalokowana ilość", flex: 3, headerClassName: 'header-cell'},
        {field: 'notAllocatedQuantity', headerName: "Niezaalokowana ilość", flex: 3, headerClassName: 'header-cell'},
        {
            field: 'expDate', headerName: "Data ważności", flex: 4, headerClassName: 'header-cell',
            renderCell: (params: GridCellParams) => {
                const expDate = params.value as string;
                const daysToExpiry = getDaysToExpiry(expDate);

                let color = 'black'; // Default color
                if (daysToExpiry < 0) {
                    color = 'red';
                } else if (daysToExpiry <= 10) {
                    color = 'orange';
                }

                return (
                    <span style={{ color }}>
                    {expDate}
                </span>
                );
            }
        },
        {field: 'empty', headerName: "Usuń", flex: 3, headerClassName: 'header-cell',
            renderCell: (params: GridCellParams) => {
                const id = params.row.id as number;
                const name = params.row.name as string;
            return (
                <ContainedButton sx={{fontSize: "15px"}} label="Usuń"
                                 onClick={() => {
                                     deleteStock(id, name)
                                 }}
                />
            )
            }
        }
    ];
    const columnsCompressedStocks : GridColDef[] = [
        {field: 'id', headerName: "Id", flex: 2, headerClassName: 'header-cell'},
        {field: 'productName', headerName: "Produkt", flex: 4, headerClassName: 'header-cell',},
        {
            field: 'quantity',
            headerName: "Ilość",
            flex: 2,
            headerClassName: 'header-cell',
            renderCell: (params) => {
                const quantity = params.value as number;
                let color = 'black';
                if (quantity < 5) {
                    color = 'red';
                } else if (quantity < 15) {
                    color = '#F6BE00';
                }
                return (
                    <div style={{ color: color}}>
                        {quantity}
                    </div>
                );
            }
        },
        {field: 'allocatedQuantity', headerName: "Zaalokowana ilość", flex: 4, headerClassName: 'header-cell',},
        {field: 'notAllocatedQuantity', headerName: "Niezaalokowana ilość", flex: 3, headerClassName: 'header-cell'},

    ];

    function deleteStock(id :number, name: string) {
        Swal.fire({
            title: 'Potwierdzenie',
            text: 'Czy na pewno chcesz usunąć stock ' + name + '? Element nie zostanie usunięty jeśli istnieją z nim powiązania.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Tak',
            cancelButtonText: 'Nie',
        }).then(() => {

            axios.delete(`/gui2wmphs/deleteStock/${id}`)
                .then((response)=>{
                    console.log(response)
                    if (response?.data.success) {
                        setResult("Stock został usunięty!")
                        reloadData()
                    } else {
                        setResult("Błąd podczas usuwania, sprawdź czy nie istnieją obiekty powiązane z tym stockiem.")
                    }
                }).catch((error) => {
                console.error('Error:', error);
            });
        });
    }
    return (
        <Grid container justifyContent="center" alignItems="center">
            <Grid container sx={{width: "95%", backgroundColor:"#E8E8E8", padding: "30px", borderRadius: 5}}>
                <ContainedButton label="Dodaj stock" onClick={()=>{setOpenModal(true)}}></ContainedButton>
                <Grid container>
                    <Grid item xs={6} sx={{padding: "5px", height: "60vh", fontSize:"15px"}}>
                        <Grid container>
                            Stock:{result}
                        </Grid>
                        <CustomTable rows={stocks} columns={columns}/>
                    </Grid>
                    <Grid item xs={6} sx={{padding: "5px", height: "60vh", fontSize:"15px"}}>
                        <Grid container>
                            Pogrupowany Stock:
                        </Grid>
                        <CustomTable rows={compressedStocks} columns={columnsCompressedStocks}/>
                    </Grid>
                </Grid>
                <AddStockModal reloadData={reloadData} show={openModal} handleClose={()=>{setOpenModal(!openModal)}}/>
            </Grid>

        </Grid>
    );
};

export default StocksPanel;
