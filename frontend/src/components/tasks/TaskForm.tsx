'use client';

import { API_BASE_URL } from '@/app/(auth)/baseURL';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast'; // Import toast

interface TaskFormProps {
  onClose: () => void;
  onTaskCreated?: () => void;
  editTask?: any;
  isEditing?: boolean;
}

export default function TaskForm({ onClose, onTaskCreated, editTask, isEditing }: TaskFormProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const token = localStorage.getItem('token');
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state

  const [taskData, setTaskData] = useState({
    title: editTask?.title || '',
    description: editTask?.description || '',
    priority: editTask?.priority || 'MEDIUM',
    status: editTask?.status || 'PENDING',
    dueDate: editTask?.dueDate ? new Date(editTask.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    category: editTask?.category || 'Work' // Add default category
  });

  const updateTask = async (taskData: any, taskId: number) => {
    const response = await axios.put(
      API_BASE_URL+`/tasks/updateTask/${taskId}`,
      taskData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  };

  const createTask = async (taskData: any, username: string) => {
    const response = await axios.post(
      API_BASE_URL+`/tasks/createTask/${username}`,
      taskData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    setIsSubmitting(true); // Start loading

    try {
      if (isEditing) {
        await updateTask(taskData, editTask.id);
        toast.success('Task updated successfully!'); // Success toast for update
      } else {
        await createTask(taskData, user.username);
        toast.success('Task created successfully!'); // Success toast for create
      }
      onTaskCreated?.();
      onClose();
    } catch (error) {
      console.error('Failed to handle task:', error);
      toast.error(isEditing 
        ? 'Failed to update task. Please try again.' 
        : 'Failed to create task. Please try again.'); // Error toast
    } finally {
      setIsSubmitting(false); // Stop loading regardless of outcome
    }
  };

  const categories = [
    'Work',
    'Personal',
    'Shopping',
    'Health',
    'Education',
    'Finance',
    'Home'
  ];

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle sx={{ 
        px: isMobile ? 2 : 3,
        py: 2,
        fontSize: isMobile ? '1.25rem' : '1.5rem' 
      }}>
        {isEditing ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>
      <DialogContent>
        <Stack 
          spacing={3} 
          sx={{ 
            mt: 2,
            width: '100%',
            minWidth: isMobile ? '100%' : '400px',
            px: isMobile ? 1 : 0
          }}
        >
          <TextField
            label="Title"
            fullWidth
            required
            value={taskData.title}
            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
            size={isMobile ? "small" : "medium"}
            disabled={isSubmitting}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={isMobile ? 3 : 4}
            value={taskData.description}
            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
            size={isMobile ? "small" : "medium"}
            disabled={isSubmitting}
          />

          <FormControl fullWidth size={isMobile ? "small" : "medium"} disabled={isSubmitting}>
            <InputLabel>Category</InputLabel>
            <Select
              value={taskData.category}
              onChange={(e) => setTaskData({...taskData, category: e.target.value})}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size={isMobile ? "small" : "medium"} disabled={isSubmitting}>
            <InputLabel>Status</InputLabel>
            <Select
              value={taskData.status}
              label="Status"
              onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size={isMobile ? "small" : "medium"} disabled={isSubmitting}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={taskData.priority}
              label="Priority"
              onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Due Date"
            type="date"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            value={taskData.dueDate}
            onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
            size={isMobile ? "small" : "medium"}
            disabled={isSubmitting}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ 
        p: isMobile ? 2 : 3,
        gap: 1
      }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          size={isMobile ? "small" : "medium"}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained"
          color="primary"
          size={isMobile ? "small" : "medium"}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting 
            ? (isEditing ? 'Updating...' : 'Creating...') 
            : (isEditing ? 'Update Task' : 'Create Task')}
        </Button>
      </DialogActions>
    </form>
  );
}