'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
        },
        success: {
          style: {
            background: '#4caf50',
            color: '#fff',
          },
        },
        error: {
          style: {
            background: '#f44336',
            color: '#fff',
          },
        },
      }}
    />
  );
}