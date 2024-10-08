import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#556cd6',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: '#ff0000',
        },
    },
    typography: {
        fontFamily: 'Playwrite HU, cursive',
    },
});

export default theme;
