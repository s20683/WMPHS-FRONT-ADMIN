import React, {useState} from 'react';
import {Box, Grid, Modal, TextField} from "@mui/material";
import ContainedButton from "../components/ContainedButton";
import axios from "axios";


interface Props {
    show: boolean;
    handleClose: () => void;
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
const AddProductModal = ({show, handleClose} : Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [msg, setMsg] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);


    const [volume, setVolume] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [id, setId] = useState<number>(-1);

    function onClose(){
        handleClose()
        clearForm()
        setMsg('')
    }
    function clearForm(){
        setVolume(0)
        setName('')
        setLocation('')
        setId(-1)
    }
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setVolume(0);
            return;
        }
        const value = parseInt(e.target.value, 10);
        if (value <= 50000) {
            setVolume(value);
        }
    };

    function sendAddProduct() {
        setIsLoading(true)
        axios.post('/gui2wmphs/addProduct',
            {
                id: id,
                name: name,
                location: location,
                volume: volume
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
                    setMsg('Product został dodany!');
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
                        Dodaj produkt
                    </Grid>
                    <Grid item sx={{ marginTop: "15px"}}>
                        <TextField
                            label="Nazwa"
                            value={name}
                            sx={{width: "100%"}}
                            onChange={(event)=>{setName(event.target.value as string)}}
                            inputProps={{ minLength:3, maxLength: 15 }}
                        />
                    </Grid>
                    <Grid item sx={{ marginTop: "15px"}}>
                        <TextField
                            label="Lokacja"
                            value={location}
                            sx={{width: "100%"}}
                            onChange={(event)=>{setLocation(event.target.value as string)}}
                            inputProps={{ minLength:3, maxLength: 10 }}
                        />
                    </Grid>
                    <Grid item sx={{ marginTop: "15px"}}>
                        <TextField
                            id="outlined-number"
                            sx={{width: "100%"}}
                            label="Objętość (ml.)"
                            type="number"
                            value={volume}
                            onChange={handleVolumeChange}
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
                            onClick={sendAddProduct}
                        />
                    </Grid>
                </Grid>


            </Box>
        </Modal>
    );
};

export default AddProductModal;
