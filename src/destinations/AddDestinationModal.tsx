import React, {useState} from 'react';
import {Box, Grid, Modal, TextField} from "@mui/material";
import ContainedButton from "../components/ContainedButton";
import axios from "axios";
import {style} from "../products/AddProductModal";
interface Props {
    show: boolean;
    handleClose: () => void;
    reloadData: () => void;
}
const AddDestinationModal = ({show, handleClose, reloadData} : Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [msg, setMsg] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);


    const [name, setName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [target, setTarget] = useState<number>(0);
    const [id, setId] = useState<number>(-1);

    function onClose(){
        handleClose()
        clearForm()
        setMsg('')
    }
    function clearForm(){
        setAddress('')
        setName('')
        setTarget(0)
        setId(-1)
    }
    const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setTarget(0);
            return;
        }
        const value = parseInt(e.target.value, 10);
        if (value <= 50000 && value >= 0) {
            setTarget(value);
        }
    };

    function sendAddDestination() {
        setIsLoading(true)
        axios.post('/gui2wmphs/addDestination',
            {
                id: id,
                name: name,
                address: address,
                target: target
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
                    setMsg('Destynacja została dodana!');
                    reloadData();
                }
            })
    }
    function validate():boolean {
        if (name.length > 0 && address.length>0 && target !== 0)
            return true
        return false;
    }
    return (
        <Modal
            open={show}
            onClose={handleClose}
        >
            <Box sx={{ ...style, width: 280 }}>
                <Grid direction="column">
                    <Grid item sx={{fontSize: "25px"}}>
                        Dodaj Destynację
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
                            label="Adres"
                            value={address}
                            sx={{width: "100%"}}
                            onChange={(event)=>{setAddress(event.target.value as string)}}
                            inputProps={{ minLength:3, maxLength: 100 }}
                        />
                    </Grid>
                    <Grid item sx={{ marginTop: "15px"}}>
                        <TextField
                            id="outlined-number"
                            sx={{width: "100%"}}
                            label="Zjazd"
                            type="number"
                            value={target}
                            onChange={handleTargetChange}
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
                            disabled={isLoading || !validate()}
                            sx={{fontSize:"15px",marginRight:"0px", marginTop: "10px", width:"46%"}}
                            label="Stwórz"
                            onClick={sendAddDestination}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default AddDestinationModal;
