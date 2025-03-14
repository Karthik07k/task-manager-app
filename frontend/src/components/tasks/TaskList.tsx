'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TablePagination,
  Dialog,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { API_BASE_URL } from '@/app/(auth)/baseURL';
import TaskForm from './TaskForm';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

interface TaskListProps {
  filterStatus?: any;
  searchQuery?: string;
}

export default function TaskList({ filterStatus = 'all', searchQuery = '' }: TaskListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editTask, setEditTask] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteTask, setDeleteTask] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [columnFilter, setColumnFilter] = useState({
    field: 'all',
    value: ''
  });

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (user?.userId && token) {
      fetchTasks();
    }
  }, [user, token]);

  // Fixed the filterStatus effect to avoid referencing undefined task variable
 useEffect(() => {
  if (filterStatus !== 'all') {
    if (filterStatus === 'upcoming') {
      // Special case for upcoming tasks - we don't set a status filter
      // but instead will filter by due date being in the future
      setColumnFilter({
        field: 'upcoming',
        value: 'true'
      });
    } else {
      // For other statuses, convert to the actual status value
      setColumnFilter({
        field: 'status',
        value: filterStatus === 'completed' ? 'COMPLETED' : 
               filterStatus === 'pending' ? 'PENDING' : ''
      });
    }
  } else {
    // Reset filter when 'all' is selected
    setColumnFilter({
      field: 'all',
      value: ''
    });
  }
}, [filterStatus]);

const filteredTasks = tasks.filter((task: any) => {
  let statusMatch = true;
  
  if (filterStatus !== 'all') {
    if (filterStatus === 'upcoming') {
      // For upcoming tasks: due date is in the future AND not completed
      statusMatch = new Date(task.dueDate) > new Date() && task.status !== 'COMPLETED';
    } else if (filterStatus === 'completed') {
      statusMatch = task.status === 'COMPLETED';
    } else if (filterStatus === 'pending') {
      statusMatch = task.status === 'PENDING';
    }
  }

  const searchMatch = searchQuery === '' ? true :
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.category || 'Uncategorized').toLowerCase().includes(searchQuery.toLowerCase());

  return statusMatch && searchMatch;
});

  const getFilteredTasks = () => {
    return tasks.filter((task: any) => {
      if (columnFilter.field === 'all' || !columnFilter.value) return true;

      switch (columnFilter.field) {
        case 'title':
          return task.title.toLowerCase().includes(columnFilter.value.toLowerCase());
        case 'description':
          return task.description.toLowerCase().includes(columnFilter.value.toLowerCase());
        case 'category':
          return (task.category || 'Uncategorized').toLowerCase().includes(columnFilter.value.toLowerCase());
        case 'dueDate':
          return new Date(task.dueDate).toLocaleDateString().includes(columnFilter.value);
        case 'priority':
          return task.priority.toLowerCase().includes(columnFilter.value.toLowerCase());
        case 'status':
          return task.status.toLowerCase().includes(columnFilter.value.toLowerCase());
        case 'upcoming':
          // Special case for upcoming tasks
          return new Date(task.dueDate) > new Date() && task.status !== 'COMPLETED';
        default:
          return true;
      }
    });
  };

  // Key fix: Moved the ColumnFilter component outside of the re-render cycle
  // and created dedicated handler functions that don't cause full component re-renders
  const handleFieldChange = (e: any) => {
    const newField = e.target.value;
    setColumnFilter(prev => ({
      ...prev,
      field: newField
    }));
  };

  const handleValueChange = (e: any) => {
    const newValue = e.target.value;
    setColumnFilter(prev => ({
      ...prev,
      value: newValue
    }));
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
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleEditClick = (task: any) => {
    setEditTask(task);
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setEditTask(null);
  };

  const handleTaskUpdated = () => {
    fetchTasks();
    handleEditClose();
  };

  const handleDeleteClick = (task: any) => {
    setDeleteTask(task);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
    setDeleteTask(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `${API_BASE_URL}/tasks/deleteTask/${deleteTask.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      fetchTasks(); // Refresh the task list
      handleDeleteClose();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const DeleteButton = ({ task }: { task: any }) => (
    <IconButton size="small" color="error" onClick={() => handleDeleteClick(task)}>
      <DeleteIcon />
    </IconButton>
  );

  const formatStatus = (status: string) => {
    return status
      .toLowerCase()
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

  // Mobile Card View
  const MobileView = () => (
    <Grid container spacing={2}>
      {getFilteredTasks()
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((task: any) => (
          <Grid item xs={12} key={task.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>{task.title}</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {task.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip 
                    label={task.category || 'Uncategorized'}
                    color="default"
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </Typography>
                  <Chip 
                    label={task.priority}
                    color={task.priority === 'HIGH' ? 'error' : task.priority === 'MEDIUM' ? 'warning' : 'info'}
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={formatStatus(task.status)}
                    color={task.status === 'COMPLETED' ? 'success' : task.status === 'IN_PROGRESS' ? 'warning' : 'default'}
                    size="small"
                  />
                  <Box>
                    <IconButton size="small" color="primary" onClick={() => handleEditClick(task)}>
                      <EditIcon />
                    </IconButton>
                    <DeleteButton task={task} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
    </Grid>
  );

  // Desktop Table View
  const DesktopView = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>S.No</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getFilteredTasks()
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((task: any, index: number) => (
              <TableRow key={task.id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>
                  <Chip 
                    label={task.category || 'Uncategorized'}
                    color="default"
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={task.priority}
                    color={task.priority === 'HIGH' ? 'error' : task.priority === 'MEDIUM' ? 'warning' : 'info'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={formatStatus(task.status)}
                    color={task.status === 'COMPLETED' ? 'success' : task.status === 'IN_PROGRESS' ? 'warning' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" color="primary" onClick={() => handleEditClick(task)}>
                    <EditIcon />
                  </IconButton>
                  <DeleteButton task={task} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          My Tasks
        </Typography>
        
        {/* Filter component, now with direct handlers that won't cause input to lose focus */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Filter By</InputLabel>
            <Select
              value={columnFilter.field}
              onChange={handleFieldChange}
              label="Filter By"
            >
              <MenuItem value="all">All Columns</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="description">Description</MenuItem>
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="dueDate">Due Date</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            placeholder="Filter value..."
            value={columnFilter.value}
            onChange={handleValueChange}
            fullWidth
            autoComplete="off"
            inputProps={{
              autoComplete: 'off',
              spellCheck: 'false'
            }}
          />
        </Box>
        
        {isMobile ? <MobileView /> : <DesktopView />}

        <TablePagination
          component="div"
          count={getFilteredTasks().length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      <Dialog
        open={isEditDialogOpen}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
      >
        <TaskForm 
          onClose={handleEditClose}
          onTaskCreated={handleTaskUpdated}
          editTask={editTask}
          isEditing={true}
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the task "{deleteTask?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleDeleteClose} color="inherit">
            No, Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            autoFocus
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}