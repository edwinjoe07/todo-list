import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Typography,
  Fade,
  Slide,
  Divider,
  useTheme,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getAllTodos, createTodo, updateTodo, deleteTodo } from '../api/api';

const Todo = () => {
  const theme = useTheme();
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await getAllTodos();
      console.log('Fetched todos:', data);
      setTodos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      showAlert('Failed to fetch todos', 'error');
      setTodos([]);
    }
  };

  const handleAddTodo = async () => {
    if (input.trim() !== '') {
      try {
        const newTodo = await createTodo(input);
        console.log('Created todo:', newTodo);
        if (newTodo && newTodo._id) {
          setTodos([newTodo, ...todos]);
          setInput('');
          showAlert('Todo added successfully', 'success');
        } else {
          throw new Error('Invalid todo response');
        }
      } catch (error) {
        console.error('Error adding todo:', error);
        showAlert('Failed to add todo', 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('Deleting todo:', id);
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo._id !== id));
      showAlert('Todo deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting todo:', error);
      showAlert('Failed to delete todo', 'error');
    }
  };

  const handleEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  const handleSaveEdit = async (id) => {
    try {
      console.log('Updating todo:', id, editText);
      const updatedTodo = await updateTodo(id, { text: editText });
      if (updatedTodo && updatedTodo._id) {
        setTodos(
          todos.map((todo) =>
            todo._id === id ? updatedTodo : todo
          )
        );
        setEditingId(null);
        showAlert('Todo updated successfully', 'success');
      } else {
        throw new Error('Invalid todo response');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      showAlert('Failed to update todo', 'error');
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      if (!todo) return;
      
      console.log('Toggling todo:', id, !todo.completed);
      const updatedTodo = await updateTodo(id, {
        completed: !todo.completed
      });
      
      if (updatedTodo && updatedTodo._id) {
        setTodos(
          todos.map((t) =>
            t._id === id ? updatedTodo : t
          )
        );
        showAlert('Todo status updated', 'success');
      } else {
        throw new Error('Invalid todo response');
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
      showAlert('Failed to update todo status', 'error');
    }
  };

  const showAlert = (message, severity) => {
    setAlert({ show: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, show: false });
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        p: 2,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Fade in timeout={1000}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{
              mb: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 'bold',
            }}
          >
            Todo List
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mb: 3,
              '& .MuiTextField-root': {
                flex: 1,
              },
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Add a new todo"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTodo}
              sx={{
                minWidth: '100px',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                },
              }}
            >
              <AddIcon sx={{ mr: 1 }} />
              Add
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <List>
            {todos.map((todo, index) => (
              <Slide
                direction="right"
                in
                timeout={300}
                style={{ transitionDelay: `${index * 50}ms` }}
                key={todo._id}
              >
                <ListItem
                  sx={{
                    bgcolor: 'background.paper',
                    mb: 1,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      transform: 'translateX(4px)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  {editingId === todo._id ? (
                    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        autoFocus
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                      <IconButton
                        color="primary"
                        onClick={() => handleSaveEdit(todo._id)}
                        sx={{
                          color: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: theme.palette.primary.light + '20',
                          },
                        }}
                      >
                        <CheckIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => setEditingId(null)}
                        sx={{
                          '&:hover': {
                            backgroundColor: theme.palette.error.light + '20',
                          },
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <ListItemText
                          primary={todo.text}
                          sx={{
                            textDecoration: todo.completed ? 'line-through' : 'none',
                            color: todo.completed ? 'text.secondary' : 'text.primary',
                            '& .MuiListItemText-primary': {
                              fontSize: '1.1rem',
                            },
                          }}
                          onClick={() => handleToggleComplete(todo._id)}
                          style={{ cursor: 'pointer' }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: 'text.secondary',
                            mt: 0.5
                          }}
                        >
                          <AccessTimeIcon sx={{ fontSize: 16 }} />
                          {formatDate(todo.createdAt)}
                        </Typography>
                      </Box>
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          color="primary"
                          onClick={() => handleEdit(todo)}
                          sx={{
                            mr: 1,
                            '&:hover': {
                              backgroundColor: theme.palette.primary.light + '20',
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleDelete(todo._id)}
                          sx={{
                            '&:hover': {
                              backgroundColor: theme.palette.error.light + '20',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </>
                  )}
                </ListItem>
              </Slide>
            ))}
          </List>
        </Paper>
      </Fade>

      <Snackbar
        open={alert.show}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Todo; 