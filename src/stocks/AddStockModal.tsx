import React, {useEffect, useState} from 'react';
import {Product} from "../products/ProductsPanel";
import {Box, Grid, MenuItem, Modal, Select, TextField} from "@mui/material";
import ContainedButton from "../components/ContainedButton";
import axios from "axios";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from 'dayjs';

interface Props {
    show: boolean;
    handleClose: () => void;
    reloadData: () => void;
}
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};
const AddStockModal = ({show, handleClose, reloadData} : Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [msg, setMsg] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const [id, setId] = useState<number>(-1);
    const [quantity, setQuantity] = useState<number>(0);
    const [productId, setProductId] = useState<number>(0);
    const [productName, setProductName] = useState<string>('');
    const [expDate, setExpDate] = useState<string>('');

    const [products, setProducts] = useState<Product[]>([])

    function loadProducts(){
        axios.get("/gui2wmphs/getProducts")
            .then(response =>{
                console.log(response)
                if (response?.data) {
                    setProducts(response.data)
                    setProductName(response.data[0].name)
                }
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    useEffect(() => {
        loadProducts()
    }, []);

    function onClose(){
        handleClose()
        clearForm()
        setMsg('')
    }

    function clearForm(){
        setQuantity(0)
        setProductId(0)
        setExpDate('')
        setProductName('')
        setId(-1)
    }

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setQuantity(0);
            return;
        }
        const value = parseInt(e.target.value, 10);
        if (value <= 50000) {
            setQuantity(value);
        }
    };

    function sendAddStock() {
        setIsLoading(true)
        axios.post('/gui2wmphs/addStock',
            {
                id: id,
                productId: productId,
                expDate: expDate,
                productName: productName,
                quantity: quantity
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
                    setMsg('Stock został dodany!');
                    reloadData();
                }
            })
    }
    return (
        <Modal
            open={show}
            onClose={handleClose}
        >
            <Box sx={{ ...style, width: 280 }}>
                <Grid direction="column">
                    <Grid item sx={{fontSize: "25px"}}>
                        Dodaj Stock
                    </Grid>
                    <Grid item sx={{ marginTop: "15px"}}>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={productId}
                            sx={{ width: "100%" }}
                            label="Product"
                            onChange={(event) => {
                                const selectedId = Number(event.target.value);
                                const selectedProduct = products.find(product => product.id === selectedId);
                                if (selectedProduct) {
                                    setProductId(selectedProduct.id);
                                    setProductName(selectedProduct.name);
                                }
                            }}
                        >
                            {products.map((product, index) => {
                                return (
                                    <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
                                );
                            })}
                        </Select>
                    </Grid>
                    <Grid item sx={{ marginTop: "15px"}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Data ważności"
                                sx={{width: "100%"}}
                                minDate={dayjs()}
                                disablePast
                                onChange={(newValue) => {
                                    if (newValue) {
                                        setExpDate(dayjs(newValue).format('YYYY-MM-DD'));
                                    } else {
                                        setExpDate('');
                                    }
                                }}
                            />
                        </LocalizationProvider>

                    </Grid>
                    <Grid item sx={{ marginTop: "15px"}}>
                        <TextField
                            id="outlined-number"
                            sx={{width: "100%"}}
                            label="Ilość (szt.)"
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{ max: 50000 }}
                        />
                    </Grid>
                    <Grid item sx={{color: success ? "green" : "red"}}>
                        {(msg && msg.length > 0) && msg}
                    </Grid>
                    <Grid item sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, width: '100%' }}>
                        <ContainedButton sx={{fontSize:"15px",marginRight:"0px", marginTop: "10px", width:"46%"}} label="Zamknij" onClick={onClose}/>
                        <ContainedButton
                            disabled={isLoading}
                            sx={{fontSize:"15px",marginRight:"0px", marginTop: "10px", width:"46%"}}
                            label="Stwórz"
                            onClick={sendAddStock}
                        />
                    </Grid>
                </Grid>


            </Box>
        </Modal>
    );
};

export default AddStockModal;
