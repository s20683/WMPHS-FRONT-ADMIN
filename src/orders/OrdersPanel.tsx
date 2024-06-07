import React, {useEffect, useState} from 'react';
import CustomTable from "../components/CustomTable";
import {GridCellParams, GridColDef, GridRowParams} from "@mui/x-data-grid";
import {Grid} from "@mui/material";
import ContainedButton from "../components/ContainedButton";
import AddOrderModal from "./AddOrderModal";
import axios from "axios";
import Swal from "sweetalert2";

interface Order {
    id: number;
    carrierVolume: number;
    state: number;
    destinationId: number;
    destinationName: string;
    userId: number;
    userName: string;
}
interface Carrier {
    id: number;
    barcode: string;
    volume: number;
    orderId: number;
}
export interface Line{
    id: number;
    quantity: number;
    quantityCompleted:number;
    productId: number;
    productName: number;
    carrierId: number;
}
const OrderPanel = () => {
    const [openModal, setOpenModal] = useState(false);
    const [result, setResult] = useState<string>("")
    const [orders, setOrders] = useState<Order[]>([])
    const [lines, setLines] = useState<Line[]>([])
    const [carriers, setCarriers] = useState<Carrier[]>([])

    const [selectedCarrier, setSelectedCarrier] = useState<number>(-1)
    const [selectedOrder, setSelectedOrder] = useState<number>(-1)

    function loadOrders(){
        axios.get("/gui2wmphs/getOrders")
            .then(response =>{
                console.log(response)
                if (response?.data)
                    setOrders(response.data)
            })
            .catch(error => console.error('Error fetching orders:', error));
    }
    function loadCarriers(){
        if (selectedOrder === -1)
            return;
        axios.get(`/gui2wmphs/getCarriers/${selectedOrder}`)
            .then(response =>{
                console.log(response)
                if (response?.data)
                    setCarriers(response.data)
            })
            .catch(error => console.error('Error fetching carriers:', error));
    }
    function releaseOrderToCompletation(id: number){
        axios.post(`/gui2wmphs/releaseOrder/${id}`)
            .then(response =>{
                console.log(response)
                if (!response?.data.success)
                    setResult(response.data.errorMessage)
                else {
                    setResult("Uwolniono zlecenie " + id + "!")
                    loadOrders()
                }
            })
            .catch(error => console.error('Error while releasing order:', error));
    }
    function loadLines(){
        if (selectedCarrier === -1)
            return;
        axios.get(`/gui2wmphs/getLines/${selectedCarrier}`)
            .then(response =>{
                console.log(response)
                if (response?.data)
                    setLines(response.data)
            })
            .catch(error => console.error('Error fetching lines:', error));
    }
    useEffect(() => {
        loadOrders()
        const intervalId = setInterval(loadOrders, 2000);
        const intervalId2 = setInterval(loadCarriers, 2000);
        const intervalId3 = setInterval(loadLines, 2000);
        return () => {
            clearInterval(intervalId)
            clearInterval(intervalId2)
            clearInterval(intervalId3)
        };
    }, []);

    function deleteOrder(id :number, name: string) {
        Swal.fire({
            title: 'Potwierdzenie',
            text: 'Czy na pewno chcesz usunąć zlecenie ' + name + '? Element nie zostanie usunięty jeśli istnieją z nim powiązania.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Tak',
            cancelButtonText: 'Nie',
        }).then(() => {

            axios.delete(`/gui2wmphs/deleteOrder/${id}`)
                .then((response)=>{
                    console.log(response)
                    if (response?.data.success) {
                        setResult("Zlecenie zostało usunięte!")
                        loadOrders()
                    } else {
                        setResult(response?.data.errorMessage)
                    }
                }).catch((error) => {
                console.error('Error:', error);
            });
        });
    }


    const carrierColumns : GridColDef[] = [
        {field: 'id', headerName: "Id", flex: 2, headerClassName: 'header-cell'},
        {field: 'barcode', headerName: "Kod Pojemnika", flex: 4, headerClassName: 'header-cell'},
        {field: 'volume', headerName: "Pojemność", flex: 4, headerClassName: 'header-cell'},
        {field: 'empty', headerName: "Usuń", flex: 2, headerClassName: 'header-cell',
            renderCell: (params: GridCellParams) => {
                const id = params.row.id as number;
                const name = params.row.barcode as string;
                const selectedOrderObject = orders.find(order => order.id === selectedOrder);
                return (
                    <ContainedButton sx={{fontSize: "15px"}} label="Usuń"
                                     disabled={selectedOrderObject?.state !== 0}
                                     onClick={() => {
                                         deleteCarrier(id, name)
                                     }}
                    />
                )
            }
        }
    ];
    function deleteCarrier(id: number, name: string){
        Swal.fire({
            title: 'Potwierdzenie',
            text: 'Czy na pewno chcesz usunąć pojemnik ' + name + '? Element nie zostanie usunięty jeśli istnieją z nim powiązania.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Tak',
            cancelButtonText: 'Nie',
        }).then(() => {

            axios.delete(`/gui2wmphs/deleteCarrier/${id}`)
                .then((response)=>{
                    console.log(response)
                    if (response?.data.success) {
                        setResult("Pojemnik został usunięty!")
                        loadCarriers()
                    } else {
                        setResult(response?.data.errorMessage)
                    }
                }).catch((error) => {
                console.error('Error:', error);
            });
        });
    }

    function deleteLine(id : number, name: string) {
        Swal.fire({
            title: 'Potwierdzenie',
            text: 'Czy na pewno chcesz usunąć linię ' + name + '? Element nie zostanie usunięty jeśli istnieją z nim powiązania.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Tak',
            cancelButtonText: 'Nie',
        }).then(() => {

            axios.delete(`/gui2wmphs/deleteLine/${id}`)
                .then((response)=>{
                    console.log(response)
                    if (response?.data.success) {
                        setResult("Linie została usunięta!")
                        loadLines()
                    } else {
                        setResult(response?.data.errorMessage)
                    }
                }).catch((error) => {
                console.error('Error:', error);
            });
        });
    }
    const lineColumns : GridColDef[] = [
        {field: 'id', headerName: "Id", flex: 2, headerClassName: 'header-cell'},
        {field: 'productName', headerName: "Produkt", flex: 4, headerClassName: 'header-cell'},
        {field: 'quantity', headerName: "Ilość", flex: 4, headerClassName: 'header-cell'},
        {field: 'quantityCompleted', headerName: "Skompletowano", flex: 2, headerClassName: 'header-cell'},
        {field: 'empty', headerName: "Usuń", flex: 2, headerClassName: 'header-cell',
            renderCell: (params: GridCellParams) => {
                const id = params.row.id as number;
                const name = params.row.productName as string;
                const selectedOrderObject = orders.find(order => order.id === selectedOrder);
                return (
                    <ContainedButton sx={{fontSize: "15px"}} label="Usuń"
                                     disabled={selectedOrderObject?.state !== 0}
                                     onClick={() => {
                                         deleteLine(id, name)
                                     }}
                    />
                )
            }
        }
    ];
    const orderColumns : GridColDef[] = [
        {field: 'id', headerName: "Id", flex: 2, headerClassName: 'header-cell'},
        {field: 'carrierVolume', headerName: "Pojemność", flex: 4, headerClassName: 'header-cell'},
        { field: 'state', headerName: "Status", flex: 4, headerClassName: 'header-cell',
            renderCell: (params: GridCellParams) => {
                const stateMapping: { [key: number]: string } = {
                    0: "Stworzone",
                    1: "Uwolnione",
                    2: "W kompletacji",
                    3: "Skompletowane",
                    4: "Rozsortowane"
                };
                return stateMapping[params.value as number] || "Unknown";
            }
        },
        {field: 'destinationName', headerName: "Destynacja", flex: 4, headerClassName: 'header-cell'},
        {field: 'userName', headerName: "Użytkownik", flex: 4, headerClassName: 'header-cell'},
        {field: 'release', headerName: "Uwolnij", flex: 3, headerClassName: 'header-cell',
            renderCell: (params: GridCellParams) => {
                const id = params.row.id as number;
                const state = params.row.state as number;
                return (
                    <ContainedButton sx={{fontSize: "15px"}} label="Uwolnij"
                                     disabled={state !== 0}
                                     onClick={() => {
                                         releaseOrderToCompletation(id)
                                     }}
                    />
                )
            }
        },
        {field: 'empty', headerName: "Usuń", flex: 2, headerClassName: 'header-cell',
            renderCell: (params: GridCellParams) => {
                const id = params.row.id as number;
                const name = params.row.name as string;
                const state = params.row.state as number;
                return (
                    <ContainedButton sx={{fontSize: "15px"}} label="Usuń"
                                     disabled={state !== 0}
                                     onClick={() => {
                                         deleteOrder(id, name)
                                     }}
                    />
                )
            }
        }
    ];
    const handleOrdersRowClick = (params: GridRowParams) => {
        setSelectedOrder(params.row.id as number)
        setSelectedCarrier(-1)
    };
    const handleCarriersRowClick = (params: GridRowParams) => {
        setSelectedCarrier(params.row.id as number)
    };
    useEffect(() => {
        if (selectedOrder !== -1) {
            loadCarriers()
        } else {
            setCarriers([])
        }
    }, [selectedOrder]);
    useEffect(() => {
        if (selectedCarrier !== -1) {
            loadLines()
        } else {
            setLines([])
        }
    }, [selectedCarrier]);

    return (
        <Grid container sx={{width: "100%", backgroundColor:"#E8E8E8", padding: "10px", borderRadius: 5}}>
            <ContainedButton sx={{fontSize: "15px"}} label="Stwórz zlecenie" onClick={()=>{setOpenModal(true)}}></ContainedButton>
            {result}
            <Grid container>
                <Grid item xs={6} sx={{padding: "5px", height: "70vh", fontSize:"25px"}}>
                    <CustomTable rows={orders} columns={orderColumns}
                                 onRowClick={handleOrdersRowClick}
                    />
                </Grid>
                <Grid item xs={6} sx={{padding: "5px", height: "35vh", fontSize:"25px"}}>
                    <CustomTable toolbar={false} rows={carriers} columns={carrierColumns}
                                 onRowClick={handleCarriersRowClick}
                    />
                    <CustomTable toolbar={false} rows={lines} columns={lineColumns}/>

                </Grid>
            </Grid>
            <AddOrderModal reloadData={loadOrders} show={openModal} handleClose={()=>{setOpenModal(!openModal)}}/>
        </Grid>

    );
};

export default OrderPanel;
