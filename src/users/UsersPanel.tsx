import React, {useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import ContainedButton from "../components/ContainedButton";
import CustomTable from "../components/CustomTable";
import axios from "axios";
import {GridCellParams, GridColDef} from "@mui/x-data-grid";
import Swal from "sweetalert2";
import AddUserModal from "./AddUserModal";

export interface User{
    id: number;
    name: string;
}
const UsersPanel = () => {
    const [users, setUsers] = useState<User[]>([])
    const [openModal, setOpenModal] = useState(false);
    const [result, setResult] = useState<string>("")

    function loadUsers(){
        axios.get("/gui2wmphs/getUsers")
            .then(response =>{
                console.log(response)
                if (response?.data)
                    setUsers(response.data)
            })
            .catch(error => console.error('Error fetching users:', error));
    }
    useEffect(() => {
        loadUsers()
        const intervalId = setInterval(loadUsers, 2000);
        return () => clearInterval(intervalId);
    }, []);

    const columns : GridColDef[] = [
        {field: 'id', headerName: "Id", flex: 2, headerClassName: 'header-cell'},
        {field: 'name', headerName: "Nazwa", flex: 4, headerClassName: 'header-cell'},
        {field: 'empty', headerName: "Usuń", flex: 2, headerClassName: 'header-cell',
            renderCell: (params: GridCellParams) => {
                const id = params.row.id as number;
                const name = params.row.name as string;
                return (
                    <ContainedButton sx={{fontSize: "15px"}} label="Usuń"
                                     onClick={() => {
                                         deleteUser(id, name)
                                     }}
                    />
                )
            }
        }
    ];

    function deleteUser(id :number, name: string) {
        Swal.fire({
            title: 'Potwierdzenie',
            text: 'Czy na pewno chcesz usunąć użytkownika ' + name + '? Element nie zostanie usunięty jeśli istnieją z nim powiązania.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Tak',
            cancelButtonText: 'Nie',
        }).then(() => {

            axios.delete(`/gui2wmphs/deleteUser/${id}`)
                .then((response)=>{
                    console.log(response)
                    if (response?.data.success) {
                        setResult("Użytkownik został usunięty!")
                        loadUsers()
                    } else {
                        setResult("Błąd podczas usuwania, sprawdź czy nie istnieją obiekty powiązane z tym użytkownikiem.")
                    }
                }).catch((error) => {
                console.error('Error:', error);
            });
        });
    }
    return (
        <Grid container justifyContent="center" alignItems="center">
            <Grid container sx={{width: "65%", backgroundColor:"#E8E8E8", padding: "30px", borderRadius: 5}}>
                <ContainedButton label="Stwórz użytkownika" onClick={()=>{setOpenModal(true)}}></ContainedButton>
                <Grid container>
                    <Grid item xs={12} sx={{padding: "5px", height: "60vh", fontSize:"25px"}}>
                        <Grid container>
                            Produkty:   {result}
                        </Grid>
                        <CustomTable rows={users} columns={columns}/>

                    </Grid>
                </Grid>
                <AddUserModal reloadData={loadUsers} show={openModal} handleClose={()=>{setOpenModal(!openModal)}}/>
            </Grid>
        </Grid>
    );
};

export default UsersPanel;
