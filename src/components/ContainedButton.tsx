import { Button } from '@mui/material';
import React from 'react';

interface Props {
    label: string;
    onClick?: () => void;
    icon?: React.ReactElement;
    alternative?: boolean;
    sx?: object;
    hoverColor?: string;
}
const ContainedButton = ( {onClick, label, alternative, icon, sx, hoverColor} : Props) => {
    return (
        <Button
            variant="contained"
            sx={{
                fontSize:"20px",
                marginRight: "10px",
                backgroundColor: alternative ? 'white' : '#ff6600',
                color: alternative ? '#ff6600' : 'white',
                '&:hover': {
                    backgroundColor: hoverColor ? hoverColor : '#e65c00'
                },
                ...sx
            }}
            onClick={onClick}
        >
            {icon ? icon : label}
        </Button>
    );
};

export default ContainedButton;
