'use client';

import { showToast } from '@/components/notification/ToastNotification';
import TaskForm from '@/components/tasks/TaskForm';
import {
  Add as AddIcon,
  DateRange as CalendarIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Search as SearchIcon,
  Assignment as TaskIcon,
} from '@mui/icons-material';
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../(auth)/baseURL';

export default function Dashboard() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    } else {
      showToast('Please login to continue', 'warning');
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (user?.userId && token) {
      fetchTasks();
    }
  }, [user, token]);
    
  const [tasks, setTasks] = useState<any>([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    upcomingTasks: 0,
  });

const filteredTasks = Array.isArray(tasks)
  ? tasks.filter((task: any) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];

  // Function to check if a date is today
  const isToday = (dateString:any) => {
    const today = new Date();
    const taskDate = new Date(dateString);
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  };

  // Function to check for due tasks and show notifications
  const checkDueTasks = (tasks:any) => {
    // Get today's tasks that are not completed
    const todayTasks = tasks.filter(
      (task:any) => isToday(task.dueDate) && task.status !== 'COMPLETED'
    );
    
    // First notify about high priority tasks
    const highPriorityTasks = todayTasks.filter((task:any) => task.priority === 'HIGH');
    if (highPriorityTasks.length > 0) {
      highPriorityTasks.forEach((task:any) => {
        showToast(
          `URGENT: "${task.title}" is due today!`, 
          'error', 
          `high-priority-${task.id}`
        );
      });
    }
    
    // Then notify about medium priority tasks
    const mediumPriorityTasks = todayTasks.filter((task:any) => task.priority === 'MEDIUM');
    if (mediumPriorityTasks.length > 0) {
      mediumPriorityTasks.forEach((task:any) => {
        showToast(
          `"${task.title}" is due today`, 
          'warning', 
          `medium-priority-${task.id}`
        );
      });
    }
    
    // Finally notify about low priority tasks
    const lowPriorityTasks = todayTasks.filter((task:any) => task.priority === 'LOW');
    if (lowPriorityTasks.length > 0) {
      showToast(
        `You have ${lowPriorityTasks.length} low priority task(s) due today`, 
        'info', 
        'low-priority-tasks'
      );
    }
  };

  const fetchTasks = async () => {
    if (!user?.userId || !token) return;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/tasks/getTasksByUserId/${user?.userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

     if (Array.isArray(response.data)) {
      setTasks(response.data);
      updateStats(response.data);
      checkDueTasks(response.data);
    } else {
      console.log('Unexpected API response format:', response.data);
      setTasks([]);
      updateStats([]);
    }

    showToast('Tasks loaded successfully', 'success', 'task-load-success');
      
    } catch (error) {
      console.log('Error fetching tasks:', error);
      showToast('Failed to load tasks. Please try again.', 'error', 'task-load-error');
    }
  };

  const updateStats = (tasks: any) => {
  if (!Array.isArray(tasks)) {
    console.error('updateStats received a non-array value:', tasks);
    return;
  }

  const tasksToUse = searchQuery ? filteredTasks : tasks;

  setStats({
    totalTasks: tasksToUse.length,
    completedTasks: Array.isArray(tasksToUse) ? tasksToUse.filter((task: any) => task.status === 'COMPLETED').length : 0,
    pendingTasks: Array.isArray(tasksToUse) ? tasksToUse.filter((task: any) => task.status === 'PENDING').length : 0,
    upcomingTasks: Array.isArray(tasksToUse)
      ? tasksToUse.filter((task: any) => new Date(task.dueDate) > new Date() && task.status !== 'COMPLETED').length
      : 0,
  });
};


  const handleCardClick = (status?: string) => {
    router.push(`/tasks?status=${status || 'all'}`);
  };

  // Updated to include category in recent tasks
  const recentTasks = filteredTasks.slice(0, 5).map((task:any) => ({
    id: task.id,
    title: task.title,
    status: task.status.toLowerCase(),
    dueDate: new Date(task.dueDate).toLocaleDateString(),
    category: task.category || 'Uncategorized'
  }));

  const handleOpenTaskForm = () => setIsTaskFormOpen(true);
  
  const handleCloseTaskForm = (taskCreated?: boolean) => {
    setIsTaskFormOpen(false);
    if (taskCreated) {
      fetchTasks();
      showToast('Task created successfully!', 'success', 'task-create-success');
    }
  };

  // Update the TaskForm component integration
  const handleTaskCreated = () => {
    fetchTasks();
  };

  const formatStatus = (status: string) => {
    return status
      .toLowerCase()
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2 
            }}>
              {/* Header and Create Task Button */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    Welcome back, {user?.username}!
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Here's what's happening with your tasks today.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenTaskForm}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  Create Task
                </Button>
              </Box>

              {/* Search Bar */}
              <TextField
                fullWidth
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  // When search is updated, update stats with filtered results
                  if (tasks.length > 0) {
                    updateStats(tasks);
                  }
                }}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Paper>
        </Grid>
        
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              bgcolor: 'primary.light',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: 3
              }
            }}
            onClick={() => handleCardClick('all')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TaskIcon color="primary" />
                <Typography variant="h6" sx={{ ml: 1 }}>Total Tasks</Typography>
              </Box>
              <Typography variant="h3">{stats.totalTasks}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              bgcolor: 'success.light',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: 3
              }
            }}
            onClick={() => handleCardClick('completed')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CompletedIcon color="success" />
                <Typography variant="h6" sx={{ ml: 1 }}>Completed</Typography>
              </Box>
              <Typography variant="h3">{stats.completedTasks}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              bgcolor: 'warning.light',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: 3
              }
            }}
            onClick={() => handleCardClick('pending')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PendingIcon color="warning" />
                <Typography variant="h6" sx={{ ml: 1 }}>Pending</Typography>
              </Box>
              <Typography variant="h3">{stats.pendingTasks}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              bgcolor: 'info.light',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: 3
              }
            }}
            onClick={() => handleCardClick('upcoming')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon color="info" />
                <Typography variant="h6" sx={{ ml: 1 }}>Upcoming</Typography>
              </Box>
              <Typography variant="h3">{stats.upcomingTasks}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Tasks */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, paddingRight: '20px' }}>
              <Typography variant="h6">Recent Tasks</Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={handleOpenTaskForm}
              >
                Quick Add
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            <List>
              {recentTasks.length > 0 ? (
                recentTasks.map((task:any) => (
                  <ListItem
                    key={task.id}
                   sx={{
                      bgcolor: 'background.paper',
                      mb: 1,
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      '&:hover': { bgcolor: 'action.hover' },
                      paddingRight: 2, // Add consistent padding
                    }}
                  >
                    <ListItemText
                      primary={
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="body1" sx={{ mr: 1 }}>{task.title}</Typography>
                          <Chip 
                            label={task.category}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              height: '20px', 
                              fontSize: '0.7rem',
                              backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }}
                          />
                        </Box>
                      }
                      secondary={`Due: ${task.dueDate}`}
                      sx={{ flexGrow: 1, marginRight: 2 }}
                    />
                    <Badge
                      color={task.status === 'completed' ? 'success' : 'warning'}
                      badgeContent={formatStatus(task.status)}
                      sx={{
                        '& .MuiBadge-badge': {
                          minWidth: '80px',
                          padding: '5px 10px',
                          whiteSpace: 'nowrap', // Fixed typo from 'now' to 'nowrap'
                          fontSize: '12px',
                          height: 'auto' // Allow badge to expand as needed
                        },
                        alignSelf: 'center', // Center the badge vertically
                        flexShrink: 0, // Prevent the badge from shrinking
                        mr:4
                      }}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  {searchQuery ? 'No tasks match your search criteria.' : 'No tasks yet. Create your first task!'}
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={isTaskFormOpen}
        onClose={() => handleCloseTaskForm()}
        maxWidth="sm"
        fullWidth
      >
        <TaskForm onClose={() => handleCloseTaskForm()} onTaskCreated={handleTaskCreated} />
      </Dialog>
    </Container>
  );
}