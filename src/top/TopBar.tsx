import { Grid, IconButton, Stack, Toolbar } from '@mui/material';
import React from 'react';
import {navLinkData} from "./navLinkData";
import ContainedButton from "../components/ContainedButton";
import {NavLink} from "react-router-dom";
import logoWhite from '../assets/logo-white.png'

const TopBar = () => {

    const navLinks = navLinkData.map((item, index) => {
        return (
            <Grid item style={{display: "flex", textAlign: "center"}}>
                <NavLink to={`/${item.url}`}
                         style={({ isActive }) => ({
                             display: "flex",
                             alignItems: "center",
                             textDecoration: "none",
                             width: "100%",
                             backgroundColor: isActive ? 'desiredColor' : 'defaultColor'
                         })}
                         key={index}>
                    {({ isActive }) => (
                        <ContainedButton
                            label={item.pageName}
                            hoverColor="rgb(255, 153, 0)"
                            sx={{
                                width: "100%",
                                fontSize: "14px",
                                backgroundColor: isActive ? 'white' : '#2d2d2d',
                                color: isActive ? '#2d2d2d' : 'white',
                                border: "2px solid #616161",
                                '&:hover':{
                                    backgroundColor: isActive ? 'lightgray' : '#414141',
                                }
                            }}
                        />
                    )}
                </NavLink>
            </Grid>
        );
    });

    return (
        <Toolbar variant="dense" sx={{ background: "#2d2d2d"}}>
            <IconButton size="small" edge="start" color="primary" aria-label="logo" sx={{ marginRight: 3 }} href="/">
                <img src={logoWhite} width={180} />
            </IconButton>
            <Stack direction="row" flexGrow={1}>
                {navLinks}
            </Stack>
        </Toolbar>
    );
};

export default TopBar;
