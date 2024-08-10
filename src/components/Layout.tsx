import React from 'react';
import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';
// import { signOut } from 'next-auth/react';
import { alpha } from '@material-ui/core';
// import { createTheme } from '@mui/material/styles';


import theme from '@/theme';


type Props = {
    children: React.ReactNode | React.ReactNode[] | React.JSX.Element | React.JSX.Element[];
}


const Layout = ({ children }: Props) => {
    // const handleLogout = async () => {
    //     await signOut({ redirect: true });
    //     window.location.href = '/auth/signin';
    // };
    return (
        <div>
            <AppBar position="static">
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            letterSpacing: 1,
                            fontSynthesis: 'contextual',
                            fontStyle: 'italic',
                        }}
                        variant="h4"
                    >Image<span style={{ color: theme.palette.error.main }}>X</span>pert</Typography>
                    {/* <Button variant='text' sx={{
                        color: 'white',
                        marginLeft: 'auto',
                        transition: 'background-color 0.3s',
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                        }
                    }} onClick={handleLogout}>SignOut</Button> */}
                </Toolbar>
            </AppBar>
            <Stack
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: alpha(theme.palette.background.default, 0.3),
                    backgroundImage: `linear-gradient(to bottom right, ${alpha(theme.palette.primary.main, 0.4)}, ${alpha(theme.palette.error.main, 0.4)})`,
                    backdropFilter: 'blur(10px)',
                    '& p, & span, & h4': {
                        // color: theme.palette.primary.contrastText, // Adjust text color for better readability
                    },
                }}
            >
                {children}
            </Stack>
        </div>
    );
};

export default Layout;
