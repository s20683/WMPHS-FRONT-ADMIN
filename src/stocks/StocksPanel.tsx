import React, {useEffect, useState} from 'react';
import {Button, Grid} from "@mui/material";
import ContainedButton from "../components/ContainedButton";
import CustomTable from "../components/CustomTable";
import AddProductModal from "../products/AddProductModal";
import axios from "axios";
import {GridCellParams, GridColDef} from "@mui/x-data-grid";
import AddStockModal from "./AddStockModal";
import Swal from "sweetalert2";

interface Stock {
    id: number;
    quantity: number;
    productId: number;
    expDate: string;
    productName: string;
    empty: boolean;
}
const StocksPanel = () => {
    const [openModal, setOpenModal] = useState(false);
    const [stocks, setStocks] = useState<Stock[]>([])
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

    useEffect(() => {
        loadStocks()
        const intervalId = setInterval(loadStocks, 2000);
        return () => clearInterval(intervalId);
    }, []);

    const columns : GridColDef[] = [
        {field: 'id', headerName: "Id", flex: 2, headerClassName: 'header-cell'},
        {field: 'productName', headerName: "Produkt", flex: 4, headerClassName: 'header-cell',},
        {field: 'quantity', headerName: "Ilość", flex: 2, headerClassName: 'header-cell'},
        {field: 'expDate', headerName: "Data ważności", flex: 4, headerClassName: 'header-cell'},
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
                        loadStocks()
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
            <Grid container sx={{width: "65%", backgroundColor:"#E8E8E8", padding: "30px", borderRadius: 5}}>
                <ContainedButton label="Dodaj stock" onClick={()=>{setOpenModal(true)}}></ContainedButton>
                <Grid container>
                    <Grid item xs={12} sx={{padding: "5px", height: "70vh", fontSize:"25px"}}>
                        <Grid container>
                            Stock:{result}
                        </Grid>
                        <CustomTable rows={stocks} columns={columns}/>

                    </Grid>
                </Grid>
                <AddStockModal reloadData={loadStocks} show={openModal} handleClose={()=>{setOpenModal(!openModal)}}/>
            </Grid>

        </Grid>
    );
};

export default StocksPanel;
