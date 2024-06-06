import React, {useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import ContainedButton from "../components/ContainedButton";
import CustomTable from "../components/CustomTable";
import axios from "axios";
import {GridCellParams, GridColDef} from "@mui/x-data-grid";
import AddDestinationModal from "./AddDestinationModal";
import Swal from "sweetalert2";

export interface Destination {
    id: number;
    name: string;
    address: string;
    target: string;
    empty: boolean;
}
const DestinationsPanel = () => {

    const [destinations, setDestinations] = useState<Destination[]>([])
    const [openModal, setOpenModal] = useState(false);
    const [result, setResult] = useState<string>("")

    function loadDestinations(){
        axios.get("/gui2wmphs/getDestinations")
            .then(response =>{
                console.log(response)
                if (response?.data)
                    setDestinations(response.data)
            })
            .catch(error => console.error('Error fetching destinations:', error));
    }
    useEffect(() => {
        loadDestinations()
        const intervalId = setInterval(loadDestinations, 2000);
        return () => clearInterval(intervalId);
    }, []);

    const columns : GridColDef[] = [
        {field: 'id', headerName: "Id", flex: 2, headerClassName: 'header-cell'},
        {field: 'name', headerName: "Nazwa", flex: 4, headerClassName: 'header-cell'},
        {field: 'address', headerName: "Adres", flex: 6, headerClassName: 'header-cell',},
        {field: 'target', headerName: "Zjazd", flex: 2, headerClassName: 'header-cell'},
        {field: 'empty', headerName: "Usuń", flex: 2, headerClassName: 'header-cell',
            renderCell: (params: GridCellParams) => {
                const id = params.row.id as number;
                const name = params.row.name as string;
                return (
                    <ContainedButton sx={{fontSize: "15px"}} label="Usuń"
                                     onClick={() => {
                                         deleteDestination(id, name)
                                     }}
                    />
                )
            }
        }
    ];

    function deleteDestination(id :number, name: string) {
        Swal.fire({
            title: 'Potwierdzenie',
            text: 'Czy na pewno chcesz usunąć destynację ' + name + '? Element nie zostanie usunięty jeśli istnieją z nim powiązania.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Tak',
            cancelButtonText: 'Nie',
        }).then(() => {

            axios.delete(`/gui2wmphs/deleteDestination/${id}`)
                .then((response)=>{
                    console.log(response)
                    if (response?.data.success) {
                        setResult("Destynacja została usunięta!")
                        loadDestinations()
                    } else {
                        setResult("Błąd podczas usuwania, sprawdź czy nie istnieją obiekty powiązane z tą destynacją.")
                    }
                }).catch((error) => {
                console.error('Error:', error);
            });
        });
    }

    return (
        <Grid container justifyContent="center" alignItems="center">
            <Grid container sx={{width: "65%", backgroundColor:"#E8E8E8", padding: "30px", borderRadius: 5}}>
                <ContainedButton label="Stwórz destynację" onClick={()=>{setOpenModal(true)}}></ContainedButton>
                <Grid container>
                    <Grid item xs={12} sx={{padding: "5px", height: "60vh", fontSize:"25px"}}>
                        <Grid container>
                            Produkty:   {result}
                        </Grid>
                        <CustomTable rows={destinations} columns={columns}/>

                    </Grid>
                </Grid>
                <AddDestinationModal reloadData={loadDestinations} show={openModal} handleClose={()=>{setOpenModal(!openModal)}}/>
            </Grid>
        </Grid>
    );
};

export default DestinationsPanel;
