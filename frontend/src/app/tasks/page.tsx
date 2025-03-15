"use client"

import TaskList from '@/components/tasks/TaskList';
import { Box, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function TasksPageContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  const getPageTitle = () => {
    switch(status) {
      case 'completed': return 'Completed Tasks';
      case 'pending': return 'Pending Tasks';
      case 'upcoming': return 'Upcoming Tasks';
      default: return 'All Tasks';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        mt: isMobile ? 3 : 4, 
        mb: isMobile ? 2 : 3,
        px: isMobile ? 2 : 0 
      }}>
         <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2
        }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom
          sx={{
            fontWeight: 600,
            color: theme.palette.primary.main,
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            pb: 1
          }}
        >
          {getPageTitle()}
        </Typography>
        </Box>
      </Box>
      <TaskList filterStatus={status} />
    </Container>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<div>Loading tasks...</div>}>
      <TasksPageContent />
    </Suspense>
  );
}