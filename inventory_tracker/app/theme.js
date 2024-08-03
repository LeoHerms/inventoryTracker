// theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FFF9C4', // Lighter yellow
    },
    secondary: {
      main: '#81D4FA', // Light blue
    },
    background: {
      default: '#F3F4F6', // Light grey background
    },
  },
  typography: {
    h1: {
      fontSize: '2rem',
      fontWeight: 700, // Bolder
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700, // Bolder
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 700, // Bolder
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 700, // Bolder
    },
    button: {
      fontSize: '1rem',
      fontWeight: 700, // Bolder
    },
  },
});
