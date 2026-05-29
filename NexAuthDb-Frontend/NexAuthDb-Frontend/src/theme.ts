import { createTheme } from '@mui/material/styles';

export const getCustomTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#0095f6', // Instagram Blue
      },
      background: {
        default: mode === 'dark' ? '#0d0e12' : '#ffffff', // GetIllustrations dark base
        paper: mode === 'dark' ? '#161820' : '#f8f9fa',
      },
      text: {
        primary: mode === 'dark' ? '#f5f6f9' : '#1e2229',
        secondary: mode === 'dark' ? '#8a94a6' : '#687588',
      },
      divider: mode === 'dark' ? '#222634' : '#edf0f5',
    },
    typography: {
      fontFamily: '"Inter", "-apple-system", BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h5: {
        fontWeight: 800,
        letterSpacing: '-0.5px',
      },
      subtitle2: {
        fontWeight: 600,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            backgroundColor: 'transparent',
            transition: 'all 0.3s ease',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
          },
        },
      },
    },
  });