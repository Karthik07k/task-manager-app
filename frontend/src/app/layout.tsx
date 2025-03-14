'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ToastNotification from '@/components/notification/ToastNotification';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentPath = window.location.pathname;
    
    // Allow access to auth pages without token
    const publicPaths = ['/login', '/register'];
    
    if (!token && !publicPaths.includes(currentPath)) {
      router.push('/login');
    }
  }, []);

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
          <ToastNotification />
        </ThemeProvider>
      </body>
    </html>
  );
}