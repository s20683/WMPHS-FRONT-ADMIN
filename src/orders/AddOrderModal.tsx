import React, {useEffect, useState} from 'react';
import {
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    MenuItem,
    Modal,
    Select,
    TextField
} from "@mui/material";
import ContainedButton from "../components/ContainedButton";
import {style} from "../products/AddProductModal";
import axios from "axios";
import {User} from "../users/UsersPanel";
import {Destination} from "../destinations/DestinationsPanel";
import CustomTable from "../components/CustomTable";
import {GridCellParams, GridColDef} from "@mui/x-data-grid";
import {CompressedStock} from "../stocks/StocksPanel";

interface Props {
    show: boolean;
    handleClose: () => void;
    reloadData: () => void;
}

interface LineToPrepare {
    id: number;
    productName: string;
    productId: number;
    quantity: number;
    empty: boolean;
}

const AddOrderModal = ({show, handleClose, reloadData} : Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [msg, setMsg] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const [users, setUsers] = useState<User[]>([])
    const [destinations, setDestinations] = useState<Destination[]>([])
    const [stocks, setStocks] = useState<CompressedStock[]>([])
    const [lines, setLines] = useState<LineToPrepare[]>([])


    const [carrierVolume, setCarrierVolume] = useState<number>(0);
    const [id, setId] = useState<number>(-1);
    const [selectedProduct, setSelectedProduct] = useState<number>(-1);
    const [selectedProductName, setSelectedProductName] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<number>(-1);
    const [selectedDestination, setSelectedDestination] = useState<number>(-1);

    const [lineQty, setLineQty] = useState<number>(0);
    const [openDialog, setOpenDialog] = useState(false);

    function loadUsers(){
        axios.get("/gui2wmphs/getUsers")
            .then(response =>{
                console.log(response)
                if (response?.data)
                    setUsers(response.data)
            })
            .catch(error => console.error('Error fetching users:', error));
    }
    function loadDestinations(){
        axios.get("/gui2wmphs/getDestinations")
            .then(response =>{
                console.log(response)
                if (response?.data)
                    setDestinations(response.data)
            })
            .catch(error => console.error('Error fetching destinations:', error));
    }
    function loadStocks(){
        axios.get("/gui2wmphs/getCompressedStocks")
            .then(response =>{
                console.log(response)
                if (response?.data)
                    setStocks(response.data)
            })
            .catch(error => console.error('Error fetching stocks:', error));
    }
    useEffect(() => {
        loadUsers()
        loadDestinations()
        loadStocks()
    }, []);



    function onClose(){
        handleClose()
        clearForm()
        setMsg('')
    }
    function clearForm(){
        setCarrierVolume(0)
        setSelectedProduct(-1)
        setSelectedUser(-1)
        setSelectedDestination(-1)
        setLineQty(0)
        setLines([])
        setId(-1)
    }
    function sendAddOrder() {
        setIsLoading(true)
        axios.post('/gui2wmphs/createOrder',
            {
                carrierVolume: carrierVolume,
                destinationId: selectedDestination,
                userId: selectedUser,
                lines: lines

            })
            .then(response =>{
                setIsLoading(false)
                clearForm()
                console.log(response)
                if (!response?.data.success) {
                    setSuccess(false);
                    setMsg(response?.data.errorMessage);
                } else {
                    setSuccess(true);
                    setMsg('Zlecenie zostało dodane!');
                    reloadData();
                }
            })
    }
    function validate():boolean {
        if (carrierVolume !== 0 && selectedDestination !== -1 && selectedUser !== -1 && lines.length > 0)
            return true
        return false;
    }
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setCarrierVolume(0);
            return;
        }
        const value = parseInt(e.target.value, 10);
        if (value <= 50000 && value >= 0) {
            setCarrierVolume(value);
        }
    };
    const handleLineQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setLineQty(0);
            return;
        }
        const value = parseInt(e.target.value, 10);
        if (value <= getMaxQuantityForProduct() && value >= 0) {
            setLineQty(value);
        }
    };

    const columns : GridColDef[] = [
        {field: 'id', headerName: "Id", flex: 2, headerClassName: 'header-cell'},
        {field: 'productName', headerName: "Nazwa", flex: 4, headerClassName: 'header-cell'},
        {field: 'quantity', headerName: "Ilość", flex: 2, headerClassName: 'header-cell'},
        {field: 'empty', headerName: "Usuń", flex: 2, headerClassName: 'header-cell',
            renderCell: (params: GridCellParams) => {
                const id = params.row.id as number;
                return (
                    <ContainedButton sx={{fontSize: "15px"}} label="Usuń"
                                     onClick={() => {
                                         setLines(currentLines => currentLines.filter(line => line.id !== id));
                                     }}
                    />
                )
            }
        }
    ];
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    function addLine() {
        setLines(currentLines => {
            const productExists = currentLines.some(line => line.productName === selectedProductName);

            if (productExists) {
                setOpenDialog(true)
                return currentLines;
            }

            return [...currentLines, {
                id: currentLines.length + 1,
                productName: selectedProductName,
                productId: selectedProduct,
                quantity: lineQty,
                empty: false
            }];
        });
    }

    const getMaxQuantityForProduct = () => {
        if (selectedProduct === -1) {
            return 0;
        }
        const stockItem = stocks.find(stock => stock.productId === selectedProduct);
        return stockItem ? (stockItem.quantity - stockItem.allocatedQuantity) : 0;
    };
    return (
        <Modal
            open={show}
            onClose={handleClose}
        >
            <Box sx={{ ...style, width: 800, height: "50vh" }}>
                <Grid container>
                    <Grid item sx={{fontSize: "25px"}}>
                        Dodaj Zlecenie
                    </Grid>
                    <Grid container sx={{height: "47vh"}}>
                        <Grid item xs={3} direction="column">

                            <Grid item sx={{ marginTop: "15px"}}>
                                <TextField
                                    id="outlined-number"
                                    sx={{width: "100%"}}
                                    label="Pojemność pojemnika (ml.)"
                                    type="number"
                                    value={carrierVolume}
                                    onChange={handleVolumeChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{ max: 50000 }}
                                />
                            </Grid>
                            <Grid item sx={{ marginTop: "15px"}}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedDestination}
                                    sx={{ width: "100%" }}
                                    label="Destynacja"
                                    onChange={(event) => {
                                        const selectedId = Number(event.target.value);
                                        if (selectedId) {
                                            setSelectedDestination(selectedId)
                                        }
                                    }}
                                >
                                    {destinations.map((destination, index) => {
                                        return (
                                            <MenuItem key={destination.id} value={destination.id}>{destination.name}</MenuItem>
                                        );
                                    })}
                                </Select>
                            </Grid>
                            <Grid item sx={{ marginTop: "15px"}}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedUser}
                                    sx={{ width: "100%" }}
                                    label="User"
                                    onChange={(event) => {
                                        const selectedId = Number(event.target.value);
                                        if (selectedId) {
                                            setSelectedUser(selectedId)
                                        }
                                    }}
                                >
                                    {users.map((user, index) => {
                                        return (
                                            <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                                        );
                                    })}
                                </Select>
                            </Grid>
                            <Grid item sx={{color: success ? "green" : "red"}}>
                                {(msg && msg.length > 0) && msg}
                            </Grid>
                        </Grid>
                        <Grid item xs={3} direction="column">
                            <Grid item sx={{ marginTop: "15px"}}>
                                <TextField
                                    disabled={selectedProduct === -1}
                                    id="outlined-number"
                                    sx={{width: "100%"}}
                                    label="Sztuki"
                                    type="number"
                                    value={lineQty}
                                    onChange={handleLineQtyChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{ min: 0, max: getMaxQuantityForProduct() }}
                                />
                            </Grid>
                            <Grid item sx={{ marginTop: "15px"}}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedProduct}
                                    disabled={carrierVolume === 0}
                                    sx={{ width: "100%" }}
                                    label="Produkt"
                                    onChange={(event) => {
                                        const selectedId = Number(event.target.value);
                                        const selectedProductObject = stocks.find(stock => stock.productId === selectedId);
                                        if (selectedProductObject) {
                                            setSelectedProduct(selectedProductObject.productId);
                                            setSelectedProductName(selectedProductObject.productName);
                                        }
                                    }}
                                >
                                    {stocks.map((stock, index) => {
                                        return (
                                            <MenuItem
                                                key={stock.id}
                                                value={stock.productId}
                                                disabled={stock.productVolume > carrierVolume}>
                                                {stock.productName} [{stock.quantity - stock.allocatedQuantity}(szt.) {stock.productVolume}(ml.)]
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </Grid>
                            <Grid item sx={{ marginTop: "15px", display: 'flex', justifyContent: 'center' }}>
                                <ContainedButton
                                    sx={{fontSize:"15px",marginRight:"0px", marginTop: "10px", width:"70%"}}
                                    label="+"
                                    onClick={()=>{
                                        addLine()
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={6} direction="column" sx={{height: "40vh"}}>
                            <CustomTable toolbar={false} columns={columns} rows={lines}/>
                        </Grid>
                        <Grid container>
                            <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, width: '100%' }}>
                                <ContainedButton sx={{fontSize:"15px",marginRight:"0px", marginTop: "10px", width:"46%"}} label="Zamknij" onClick={onClose}/>
                                <ContainedButton
                                    disabled={isLoading || !validate()}
                                    sx={{fontSize:"15px",marginRight:"0px", marginTop: "10px", width:"46%"}}
                                    label="Stwórz"
                                    onClick={sendAddOrder}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                >
                    <DialogTitle>{"Błąd!"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Produkt o nazwie {selectedProductName} już istnieje w zamówieniu.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary" autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Modal>
    );
};

export default AddOrderModal;
