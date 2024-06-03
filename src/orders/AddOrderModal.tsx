import React from 'react';
import {Box, Modal} from "@mui/material";
import ContainedButton from "../components/ContainedButton";

interface ModalContent {
    header: string;
    body: React.ReactElement;
}

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

const AddOrderModal = ({show, handleClose} : Props) => {
    return (
        <Modal
            open={show}
            onClose={handleClose}
        >
            <Box sx={{ ...style, width: 400 }}>


                <ContainedButton sx={{fontSize:"15px"}} label="Zamknij" onClick={handleClose}/>
            </Box>
        </Modal>
    );
};

export default AddOrderModal;
