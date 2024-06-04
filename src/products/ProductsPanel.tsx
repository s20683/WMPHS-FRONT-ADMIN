import React, {useEffect, useState} from 'react';
import ContainedButton from "../components/ContainedButton";
import {Grid} from "@mui/material";
import CustomTable from "../components/CustomTable";
import {GridCellParams, GridColDef} from "@mui/x-data-grid";
import AddProductModal from "./AddProductModal";
import axios from "axios";
import Swal from "sweetalert2";

export interface Product {
    id: number;
    name: string;
    location: string;
    volume: number;
    empty: boolean;
}
const ProductsPanel = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [openModal, setOpenModal] = useState(false);
    const [result, setResult] = useState<string>("")

    function loadProducts(){
        axios.get("/gui2wmphs/getProducts")
            .then(response =>{
                console.log(response)
                if (response?.data)
                    setProducts(response.data)
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    useEffect(() => {
        loadProducts()
        const intervalId = setInterval(loadProducts, 2000);
        return () => clearInterval(intervalId);
    }, []);


    const columns : GridColDef[] = [
        {field: 'id', headerName: "Id", flex: 2, headerClassName: 'header-cell'},
        {field: 'name', headerName: "Nazwa", flex: 4, headerClassName: 'header-cell'},
        {field: 'location', headerName: "Lokacja", flex: 4, headerClassName: 'header-cell',},
        {field: 'volume', headerName: "Objętość", flex: 3, headerClassName: 'header-cell'},
        {field: 'empty', headerName: "Usuń", flex: 3, headerClassName: 'header-cell',
            renderCell: (params: GridCellParams) => {
                const id = params.row.id as number;
                const name = params.row.name as string;
                return (
                    <ContainedButton sx={{fontSize: "15px"}} label="Usuń"
                                     onClick={() => {
                                         deleteProduct(id, name)
                                     }}
                    />
                )
            }
        }
    ];
    function deleteProduct(id :number, name: string) {
        Swal.fire({
            title: 'Potwierdzenie',
            text: 'Czy na pewno chcesz usunąć produkt ' + name + '? Element nie zostanie usunięty jeśli istnieją z nim powiązania.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Tak',
            cancelButtonText: 'Nie',
        }).then(() => {

            axios.delete(`/gui2wmphs/deleteProduct/${id}`)
                .then((response)=>{
                    console.log(response)
                    if (response?.data.success) {
                        setResult("Produkt został usunięty!")
                        loadProducts()
                    } else {
                        setResult("Błąd podczas usuwania, sprawdź czy nie istnieją obiekty powiązane z tym produktem.")
                    }
                }).catch((error) => {
                    console.error('Error:', error);
                });
        });
    }

    return (
        <Grid container justifyContent="center" alignItems="center">
            <Grid container sx={{width: "65%", backgroundColor:"#E8E8E8", padding: "30px", borderRadius: 5}}>
                <ContainedButton label="Stwórz produkt" onClick={()=>{setOpenModal(true)}}></ContainedButton>
                <Grid container>
                    <Grid item xs={12} sx={{padding: "5px", height: "70vh", fontSize:"25px"}}>
                        <Grid container>
                            Produkty:   {result}
                        </Grid>
                        <CustomTable rows={products} columns={columns}/>

                    </Grid>
                </Grid>
                <AddProductModal reloadData={loadProducts} show={openModal} handleClose={()=>{setOpenModal(!openModal)}}/>
            </Grid>

        </Grid>
    );
};

export default ProductsPanel;
