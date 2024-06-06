import React, {useState} from 'react';
import {Box, Grid, Modal, TextField} from "@mui/material";
import {style} from "../products/AddProductModal";
import ContainedButton from "../components/ContainedButton";
import axios from "axios";

interface Props {
    show: boolean;
    handleClose: () => void;
    reloadData: () => void;
}
const AddUserModal = ({show, handleClose, reloadData} : Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [msg, setMsg] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);


    const [name, setName] = useState<string>('');
    const [id, setId] = useState<number>(-1);

    function onClose(){
        handleClose()
        clearForm()
        setMsg('')
    }
    function clearForm(){
        setName('')
        setId(-1)
    }

    function sendAddDestination() {
        setIsLoading(true)
        axios.post('/gui2wmphs/addUser',
            {
                id: id,
                name: name,
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
                    setMsg('Użytkownik został dodany!');
                    reloadData();
                }
            })
    }
    function validate():boolean {
        if (name.length > 0)
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

export default AddUserModal;
